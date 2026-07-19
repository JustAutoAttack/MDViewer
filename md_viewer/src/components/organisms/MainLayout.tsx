import { useState, useEffect } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { getVersion } from '@tauri-apps/api/app';
import { invoke } from '@tauri-apps/api/core';

import { EditorView } from '../../types';
import { useWorkspace } from '../../hooks/useWorkspace';
import { Navbar } from './Navbar';
import { TabBar } from '../molecules/TabBar';
import { MarkdownEditor } from './MarkdownEditor';
import { MarkdownPreview } from './MarkdownPreview';
import { ThemePanel } from './ThemePanel';
import { Footer } from '../molecules/Footer';

export const MainLayout = () => {
	const [currentView, setView] = useState<EditorView>(EditorView.SPLIT);
	const [autosave, setAutosave] = useState(false);
	const [isThemePanelOpen, setThemePanelOpen] = useState(false);
	const [version, setVersion] = useState('0.0.0');

	const {
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
	} = useWorkspace(autosave);

	const handleOpenFile = async () => {
		const selected = await open({
			multiple: false,
			filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }]
		});
		if (!selected) return;
		const path = Array.isArray(selected) ? selected[0] : selected;
		await openFileFromDisk(path);
	};

	useEffect(() => {
		invoke<string | null>('startup_file').then(async (path) => {
			console.log('startup_file:', path);

			if (path) {
				await openFileFromDisk(path);
				console.log('opened:', path);
			}
		});
	}, [openFileFromDisk]);

	// Version Context
	useEffect(() => {
		getVersion()
			.then(setVersion)
			.catch((err) => console.error('Failed to read app version:', err));
	}, []);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === 's') {
				e.preventDefault();
				saveFile(activeId);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [activeId, saveFile]);

	return (
		<div className='flex flex-col h-screen w-full bg-bg text-text'>
			<Navbar
				currentView={currentView}
				setView={setView}
				activeFile={activeFile}
				onOpenFile={handleOpenFile}
				onOpenTheme={() => setThemePanelOpen(true)}
				onRename={(name) => renameFile(activeId, name)}
				onDelete={() => deleteFile(activeId)}
			/>

			<TabBar
				files={files}
				activeId={activeId}
				onSelect={setActiveId}
				onClose={closeFile}
				onNew={newFile}
				onReorder={reorderFiles}
			/>

			<main className='flex-1 flex overflow-hidden w-full'>
				{/* Editor Pane */}
				<div
					className={`transition-all duration-300 ease-in-out h-full shrink border-r overflow-hidden min-w-0 ${
						currentView === EditorView.MD
							? 'w-full border-transparent'
							: currentView === EditorView.SPLIT
								? 'w-1/2 border-border'
								: 'w-0 border-transparent'
					}`}
				>
					<div className='w-full h-full min-w-[50vw]'>
						<MarkdownEditor
							content={activeFile.content}
							onChange={setActiveContent}
						/>
					</div>
				</div>

				{/* Preview Pane */}
				<div
					className={`transition-all duration-300 ease-in-out h-full shrink overflow-hidden min-w-0 ${
						currentView === EditorView.FORMATTED
							? 'w-full'
							: currentView === EditorView.SPLIT
								? 'w-1/2'
								: 'w-0'
					}`}
				>
					<div className='w-full h-full min-w-[50vw]'>
						<MarkdownPreview rawContent={activeFile.content} />
					</div>
				</div>
			</main>

			<Footer
				version={version}
				autosave={autosave}
				onAutosaveChange={setAutosave}
			/>
			<ThemePanel
				isOpen={isThemePanelOpen}
				onClose={() => setThemePanelOpen(false)}
			/>
		</div>
	);
};
