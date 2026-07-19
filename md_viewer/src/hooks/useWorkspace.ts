import { useState, useRef, useCallback, useEffect } from 'react';
import { save, confirm } from '@tauri-apps/plugin-dialog';
import {
	readTextFile,
	writeTextFile,
	rename as fsRename,
	remove,
	watch
} from '@tauri-apps/plugin-fs';
import { dirname, join, basename } from '@tauri-apps/api/path';
import { listen } from '@tauri-apps/api/event';
import { OpenFile } from '../types';

const stripExt = (name: string): string => {
	return name.replace(/\.md$/i, '');
};

function getNextUntitledName(files: OpenFile[]): string {
	const used: Set<string> = new Set(files.map((f: OpenFile) => f.baseName));
	if (!used.has('Untitled')) {
		return 'Untitled';
	}

	let n: number = 2;
	while (used.has(`Untitled ${n}`)) {
		n++;
	}
	return `Untitled ${n}`;
}

function createFile(baseName: string): OpenFile {
	return {
		id: crypto.randomUUID(),
		path: null,
		baseName: baseName,
		content: '',
		status: 'synced'
	};
}

export function useWorkspace(autosave: boolean) {
	const [files, setFiles] = useState<OpenFile[]>(() => {
		return [createFile('Untitled')];
	});

	const [activeId, setActiveId] = useState<string>(() => {
		return files[0].id;
	});

	const filesRef = useRef<OpenFile[]>(files);
	const autosaveRef = useRef<boolean>(autosave);
	const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
	const renamingRef = useRef<string | null>(null);

	const activeFile: OpenFile =
		files.find((f: OpenFile) => f.id === activeId) ?? files[0];

	const reorderFiles = (fromIndex: number, toIndex: number) => {
		setFiles((prev) => {
			const newFiles = [...prev];
			const [removed] = newFiles.splice(fromIndex, 1);
			newFiles.splice(toIndex, 0, removed);
			return newFiles;
		});
	};

	const updateFile = useCallback(
		(id: string, patch: Partial<OpenFile>): void => {
			setFiles((prev: OpenFile[]) => {
				return prev.map((f: OpenFile) => {
					if (f.id === id) {
						return { ...f, ...patch };
					}
					return f;
				});
			});
		},
		[]
	);

	const clearTimer = (id: string): void => {
		if (timers.current[id]) {
			clearTimeout(timers.current[id]);
			delete timers.current[id];
		}
	};

	const writeToDisk = useCallback(
		async (id: string, content: string): Promise<void> => {
			const file: OpenFile | undefined = filesRef.current.find(
				(f: OpenFile) => f.id === id
			);
			if (!file || !file.path) {
				updateFile(id, { status: 'unsaved' });
				return;
			}
			try {
				await writeTextFile(file.path, content);
				updateFile(id, { status: 'synced' });
			} catch (err: unknown) {
				console.error('Autosave failed:', err);
				updateFile(id, { status: 'error' });
			}
		},
		[updateFile]
	);

	const setActiveContent = useCallback(
		(value: string): void => {
			updateFile(activeId, { content: value });

			if (autosaveRef.current) {
				clearTimer(activeId);
				timers.current[activeId] = setTimeout(() => {
					writeToDisk(activeId, value);
				}, 800);
			} else {
				updateFile(activeId, { status: 'unsaved' });
			}
		},
		[activeId, updateFile, writeToDisk]
	);

	const openFileFromDisk = useCallback(async (path: string) => {
		console.log('opening', path);

		try {
			const content = await readTextFile(path);
			console.log('content length', content.length);

			const name = await basename(path);

			const file: OpenFile = {
				id: crypto.randomUUID(),
				path,
				baseName: stripExt(name),
				content,
				status: 'synced'
			};

			setFiles((prev) => [...prev, file]);
			setActiveId(file.id);
		} catch (err) {
			console.error(err);
		}
	}, []);

	const newFile = useCallback((): void => {
		setFiles((prev: OpenFile[]) => {
			const file: OpenFile = createFile(getNextUntitledName(prev));
			setActiveId(file.id);
			return [...prev, file];
		});
	}, []);

	const saveFile = useCallback(
		async (id: string): Promise<void> => {
			const file: OpenFile | undefined = filesRef.current.find(
				(f: OpenFile) => f.id === id
			);
			if (!file) {
				return;
			}

			updateFile(id, { status: 'syncing' });

			try {
				let targetPath: string | null = file.path;

				if (!targetPath) {
					const chosen: string | null = await save({
						defaultPath: `${file.baseName}.md`,
						filters: [{ name: 'Markdown', extensions: ['md'] }]
					});

					if (!chosen) {
						updateFile(id, { status: 'unsaved' });
						return;
					}
					targetPath = chosen;
				}

				await writeTextFile(targetPath, file.content);
				const name: string = await basename(targetPath);
				updateFile(id, {
					path: targetPath,
					baseName: stripExt(name),
					status: 'synced'
				});
			} catch (err: unknown) {
				console.error('Save failed:', err);
				updateFile(id, { status: 'error' });
			}
		},
		[updateFile]
	);

	const renameFile = useCallback(
		async (id: string, newBaseName: string): Promise<void> => {
			const file: OpenFile | undefined = filesRef.current.find(
				(f: OpenFile) => f.id === id
			);
			if (!file) return;

			if (!file.path) {
				updateFile(id, { baseName: newBaseName });
				return;
			}

			renamingRef.current = file.path;

			try {
				updateFile(id, { status: 'syncing' });
				const dir: string = await dirname(file.path);
				const newPath: string = await join(dir, `${newBaseName}.md`);

				await fsRename(file.path, newPath);
				updateFile(id, {
					path: newPath,
					baseName: newBaseName,
					status: 'synced'
				});
			} catch (err: unknown) {
				console.error('Rename failed:', err);
				updateFile(id, { status: 'error' });
			} finally {
				// Delay clearing the ref so the async file watcher
				// catches and ignores the trailing remove/modify events
				setTimeout(() => {
					renamingRef.current = null;
				}, 500);
			}
		},
		[updateFile]
	);

	const closeFile = useCallback((id: string): void => {
		clearTimer(id);
		setFiles((prev: OpenFile[]) => {
			const remaining: OpenFile[] = prev.filter(
				(f: OpenFile) => f.id !== id
			);
			if (remaining.length === 0) {
				const fresh: OpenFile = createFile('Untitled');
				setActiveId(fresh.id);
				return [fresh];
			}
			setActiveId((current: string) => {
				if (current === id) {
					return remaining[remaining.length - 1].id;
				}
				return current;
			});
			return remaining;
		});
	}, []);

	const deleteFile = useCallback(
		async (id: string): Promise<void> => {
			const file: OpenFile | undefined = filesRef.current.find(
				(f: OpenFile) => f.id === id
			);
			if (!file) {
				return;
			}

			const confirmed: boolean = await confirm(
				`Delete "${file.baseName}"? This cannot be undone.`,
				{
					title: 'Delete file',
					kind: 'warning'
				}
			);

			if (!confirmed) {
				return;
			}

			clearTimer(id);
			try {
				if (file.path) {
					await remove(file.path);
				}
				closeFile(id);
			} catch (err: unknown) {
				console.error('Delete failed:', err);
				updateFile(id, { status: 'error' });
			}
		},
		[closeFile, updateFile]
	);

	// Filesystem Watcher
	useEffect(() => {
		// Use filesRef instead of files to prevent the watcher from looping
		const pathsToWatch = filesRef.current
			.filter((f) => f.path)
			.map((f) => f.path!);
		if (pathsToWatch.length === 0) return;

		let unwatch: (() => void) | undefined;

		const startWatching = async () => {
			unwatch = await watch(pathsToWatch, async (event) => {
				if (event.paths.some((p) => p === renamingRef.current)) return;

				const affectedPath = event.paths[0];
				const file = filesRef.current.find(
					(f) => f.path === affectedPath
				);
				if (!file) return;

				const eventType = event.type as any;

				const isRemove =
					typeof eventType === 'string'
						? eventType.toLowerCase().includes('remove')
						: 'remove' in eventType || 'Remove' in eventType;

				const isModify =
					typeof eventType === 'string'
						? eventType.toLowerCase().includes('modify')
						: 'modify' in eventType || 'Modify' in eventType;

				if (isRemove) {
					updateFile(file.id, { status: 'error' });
					console.warn(`File deleted externally: ${file.baseName}`);
				} else if (isModify) {
					try {
						const newContent = await readTextFile(file.path!);
						if (newContent !== file.content) {
							updateFile(file.id, {
								content: newContent,
								status: 'synced'
							});
						}
					} catch (err) {
						console.error(
							'Failed to reload file after external change:',
							err
						);
					}
				}
			});
		};

		startWatching();
		return () => {
			if (unwatch) unwatch();
		};
	}, [updateFile]);

	// Refs Synchronization
	useEffect(() => {
		filesRef.current = files;
	}, [files]);

	// Autosave
	useEffect(() => {
		autosaveRef.current = autosave;
	}, [autosave]);

	// Open With
	useEffect(() => {
		let unlisten: () => void;

		const setupListener = async () => {
			unlisten = await listen<string>('open-file-path', (event) => {
				const path = event.payload;
				if (path) {
					openFileFromDisk(path);
				}
			});
		};

		setupListener();

		return () => {
			if (unlisten) unlisten();
		};
	}, [openFileFromDisk]);

	return {
		files,
		activeFile,
		activeId,
		setActiveId,
		setActiveContent,
		openFileFromDisk,
		newFile,
		saveFile,
		renameFile,
		closeFile,
		deleteFile,
		reorderFiles
	};
}
