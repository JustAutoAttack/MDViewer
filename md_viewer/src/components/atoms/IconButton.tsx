import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	icon: LucideIcon;
}

export const IconButton = ({
	icon: Icon,
	className = '',
	...props
}: IconButtonProps) => (
	<button
		className={`p-2 rounded-md transition-all bg-transparent hover:bg-bg-hover 
                text-text-secondary hover:text-text ${className}`}
		{...props}
	>
		<Icon size={18} />
	</button>
);
