import { Switch } from '../atoms/Switch';

interface FooterProps {
	version: string;
	autosave: boolean;
	onAutosaveChange: (value: boolean) => void;
}

export const Footer = ({
	version,
	autosave,
	onAutosaveChange
}: FooterProps) => (
	<footer className='h-8 flex items-center justify-between px-4 border-t border-border bg-bg-secondary shrink-0'>
		<Switch
			checked={autosave}
			onChange={onAutosaveChange}
			label='Autosave'
		/>
		<span className='text-xs font-mono text-text-secondary'>
			v{version}
		</span>
	</footer>
);
