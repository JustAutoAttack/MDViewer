interface SwitchProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	label?: string;
}

export const Switch = ({ checked, onChange, label }: SwitchProps) => (
	<label className='flex items-center gap-2 cursor-pointer select-none'>
		<button
			type='button'
			role='switch'
			aria-checked={checked}
			onClick={() => onChange(!checked)}
			className={`relative w-8 h-4 rounded-full transition-colors duration-150 shrink-0 ${
				checked ? 'bg-accent' : 'bg-bg-hover'
			}`}
		>
			<span
				className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-text transition-transform duration-150 ${
					checked ? 'translate-x-4' : 'translate-x-0'
				}`}
			/>
		</button>
		{label && <span className='text-xs text-text-secondary'>{label}</span>}
	</label>
);
