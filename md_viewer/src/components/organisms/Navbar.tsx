import { FolderOpen, Palette, Trash2 } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';
import { ViewSwitcher } from '../atoms/ViewSwitcher';
import { FileStatus } from '../molecules/FileStatus';
import { EditorView, OpenFile } from '../../types';

interface NavbarProps {
	currentView: EditorView;
	setView: (view: EditorView) => void;
	activeFile: OpenFile;
	onOpenFile: () => void;
	onOpenTheme: () => void;
	onRename: (newBaseName: string) => void;
	onDelete: () => void;
}

export const Navbar = ({
	currentView,
	setView,
	activeFile,
	onOpenFile,
	onOpenTheme,
	onRename,
	onDelete
}: NavbarProps) => (
	<nav className='h-14 flex items-center justify-between px-4 border-b border-border bg-bg-secondary shrink-0'>
		<div className='flex items-center gap-3'>
			<span className='font-mono text-sm font-medium text-text tracking-tight flex items-center'>
				md
				<span
					className='caret ml-0.5'
					aria-hidden='true'
				/>
			</span>
			<span
				className='w-px h-4 bg-border'
				aria-hidden='true'
			/>
			<IconButton
				icon={FolderOpen}
				onClick={onOpenFile}
				aria-label='Open file'
			/>
			<FileStatus
				baseName={activeFile.baseName}
				status={activeFile.status}
				onRename={onRename}
			/>
			<IconButton
				icon={Trash2}
				onClick={onDelete}
				aria-label='Delete file'
			/>
		</div>

		<div className='flex items-center gap-3'>
			<ViewSwitcher
				currentView={currentView}
				onViewChange={setView}
			/>
			<IconButton
				icon={Palette}
				onClick={onOpenTheme}
				aria-label='Edit theme'
			/>
		</div>
	</nav>
);
