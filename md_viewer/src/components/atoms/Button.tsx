interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

export const Button = ({ children, className = '', ...props }: ButtonProps) => (
	<button
		className={`px-3 py-1.5 rounded-md transition-colors duration-200 
                bg-bg-secondary hover:bg-bg-hover text-text 
                font-medium text-sm ${className}`}
		{...props}
	>
		{children}
	</button>
);
