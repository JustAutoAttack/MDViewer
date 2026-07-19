import { useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../types';

interface ThemePanelProps {
	isOpen: boolean;
	onClose: () => void;
}

const COLOR_LABELS: Record<keyof Theme['colors'], string> = {
	bgPrimary: 'Background',
	bgSecondary: 'Surface',
	bgHover: 'Hover surface',
	textPrimary: 'Text',
	textSecondary: 'Muted text',
	accentPrimary: 'Accent',
	accentHover: 'Accent hover',
	border: 'Border'
};

export const ThemePanel = ({ isOpen, onClose }: ThemePanelProps) => {
	const { theme, setColor, resetTheme } = useTheme();

	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handleEsc);
		return () => window.removeEventListener('keydown', handleEsc);
	}, [onClose]);

	const colorKeys = Object.keys(theme.colors) as Array<keyof Theme['colors']>;

	return (
		<>
			<div
				className={`fixed inset-0 bg-black/40 transition-opacity duration-200 z-40 ${
					isOpen
						? 'opacity-100 pointer-events-auto'
						: 'opacity-0 pointer-events-none'
				}`}
				onClick={onClose}
				aria-hidden='true'
			/>

			<aside
				className={`fixed top-0 right-0 h-full w-80 bg-bg-secondary border-l border-border
          z-50 flex flex-col transition-transform duration-200 motion-reduce:transition-none
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
				role='dialog'
				aria-label='Theme editor'
				aria-hidden={!isOpen}
			>
				<header className='flex items-center justify-between px-5 py-4 border-b border-border'>
					<h2 className='font-mono text-sm text-text tracking-wide'>
						Theme
					</h2>
					<button
						onClick={onClose}
						className='p-1.5 rounded-md text-text-secondary hover:text-text hover:bg-bg-hover transition-colors'
						aria-label='Close theme editor'
					>
						<X size={16} />
					</button>
				</header>

				<div className='flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4'>
					{colorKeys.map((key) => (
						<label
							key={key}
							className='flex items-center justify-between gap-3'
						>
							<span className='text-sm text-text-secondary'>
								{COLOR_LABELS[key]}
							</span>
							<div className='flex items-center gap-2'>
								<span className='text-xs font-mono text-text-secondary uppercase'>
									{theme.colors[key]}
								</span>
								<input
									type='color'
									value={theme.colors[key]}
									onChange={(e) =>
										setColor(key, e.target.value)
									}
									className='w-8 h-8 rounded-md border border-border bg-transparent cursor-pointer
                    [&::-webkit-color-swatch-wrapper]:p-0.5
                    [&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-none'
								/>
							</div>
						</label>
					))}
				</div>

				<footer className='px-5 py-4 border-t border-border'>
					<button
						onClick={resetTheme}
						className='w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md
              text-sm text-text-secondary hover:text-text hover:bg-bg-hover transition-colors'
					>
						<RotateCcw size={14} />
						Reset to default
					</button>
				</footer>
			</aside>
		</>
	);
};
