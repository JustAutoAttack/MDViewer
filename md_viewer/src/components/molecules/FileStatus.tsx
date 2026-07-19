import { useState, useRef, useEffect } from 'react';
import { SyncStatus } from '../../types';

interface FileStatusProps {
	baseName: string;
	status: SyncStatus;
	onRename: (newBaseName: string) => void;
}

const STATUS_CONFIG: Record<SyncStatus, { color: string; label: string }> = {
	synced: { color: 'bg-emerald-500', label: 'Synced' },
	unsaved: { color: 'bg-amber-500', label: 'Unsaved' },
	syncing: { color: 'bg-blue-500', label: 'Saving' },
	error: { color: 'bg-red-500', label: 'Error' }
};

export const FileStatus = ({ baseName, status, onRename }: FileStatusProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState(baseName);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => setDraft(baseName), [baseName]);
	useEffect(() => {
		if (isEditing) {
			inputRef.current?.focus();
			inputRef.current?.select();
		}
	}, [isEditing]);

	const { color, label } = STATUS_CONFIG[status];

	const commit = () => {
		setIsEditing(false);
		const trimmed = draft.trim().replace(/\.md$/i, '');
		if (!trimmed) {
			setDraft(baseName);
			return;
		}
		if (trimmed !== baseName) onRename(trimmed);
	};

	const cancel = () => {
		setDraft(baseName);
		setIsEditing(false);
	};

	return (
		<div className='flex items-center gap-2'>
			{isEditing ? (
				<input
					ref={inputRef}
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
					onBlur={commit}
					onKeyDown={(e) => {
						if (e.key === 'Enter') commit();
						if (e.key === 'Escape') cancel();
					}}
					className='text-sm font-medium text-text bg-transparent border-b border-accent outline-none px-0.5 -mx-0.5'
					style={{ width: `${Math.max(draft.length, 4)}ch` }}
				/>
			) : (
				<span
					onDoubleClick={() => setIsEditing(true)}
					title='Double-click to rename'
					className='text-sm font-medium text-text border-b border-transparent hover:border-border cursor-text px-0.5 -mx-0.5 transition-colors'
				>
					{baseName}
				</span>
			)}
			<span className='flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-text-secondary'>
				<span
					className={`w-1.5 h-1.5 rounded-full ${color} ${status === 'syncing' ? 'animate-pulse' : ''}`}
				/>
				{label}
			</span>
		</div>
	);
};
