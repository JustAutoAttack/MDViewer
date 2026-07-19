import { Plus, X } from 'lucide-react';
import { OpenFile } from '../../types';

interface TabBarProps {
	files: OpenFile[];
	activeId: string;
	onSelect: (id: string) => void;
	onClose: (id: string) => void;
	onNew: () => void;
	onReorder: (from: number, to: number) => void;
}

export const TabBar = ({
	files,
	activeId,
	onSelect,
	onClose,
	onNew,
	onReorder
}: TabBarProps) => {
	const handleDragStart = (e: React.DragEvent, index: number) => {
		e.dataTransfer.setData('text/plain', index.toString());
	};

	const handleDrop = (e: React.DragEvent, targetIndex: number) => {
		e.preventDefault();
		const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
		if (sourceIndex !== targetIndex) {
			onReorder(sourceIndex, targetIndex);
		}
	};

	return (
		<div className='flex items-end bg-bg-secondary border-b border-border px-2 gap-0.5 overflow-x-auto shrink-0 h-9'>
			{files.map((file, index) => {
				const isActive = file.id === activeId;
				return (
					<div
						key={file.id}
						draggable
						onDragStart={(e) => handleDragStart(e, index)}
						onDragOver={(e) => e.preventDefault()}
						onDrop={(e) => handleDrop(e, index)}
						onClick={() => onSelect(file.id)}
						className={`group flex items-center gap-2 px-3 py-1.5 text-xs rounded-t-md cursor-pointer transition-all max-w-40 border-t border-l border-r -mb-px
                            ${
								isActive
									? 'bg-bg border-border text-text'
									: 'bg-transparent border-transparent text-text-secondary hover:bg-bg-hover hover:border-border'
							}`}
					>
						{file.status === 'unsaved' && (
							<span className='w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0' />
						)}
						<span className='truncate'>{file.baseName}</span>
						<button
							onClick={(e) => {
								e.stopPropagation();
								onClose(file.id);
							}}
							className='opacity-0 group-hover:opacity-100 hover:text-text transition-opacity shrink-0'
						>
							<X size={12} />
						</button>
					</div>
				);
			})}
			<button
				onClick={onNew}
				className='p-2 text-text-secondary hover:text-text transition-colors shrink-0'
			>
				<Plus size={14} />
			</button>
		</div>
	);
};
