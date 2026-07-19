import { EditorView } from '../../types';

interface ViewSwitcherProps {
	currentView: EditorView;
	onViewChange: (view: EditorView) => void;
}

const VIEW_ORDER: { view: EditorView; label: string }[] = [
	{ view: EditorView.MD, label: 'MD' },
	{ view: EditorView.SPLIT, label: 'Split' },
	{ view: EditorView.FORMATTED, label: 'Formatted' }
];

export const ViewSwitcher = ({
	currentView,
	onViewChange
}: ViewSwitcherProps) => (
	<div className='flex bg-bg-secondary rounded-full overflow-hidden border border-border'>
		{VIEW_ORDER.map(({ view, label }, index) => (
			<button
				key={view}
				onClick={() => onViewChange(view)}
				className={`px-4 py-1.5 text-xs font-medium transition-colors
          ${index > 0 ? 'border-l border-border' : ''}
          ${
				currentView === view
					? 'bg-bg text-accent'
					: 'text-text-secondary hover:text-text hover:bg-bg-hover'
			}`}
			>
				{label}
			</button>
		))}
	</div>
);
