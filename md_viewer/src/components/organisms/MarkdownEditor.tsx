interface MarkdownEditorProps {
	content: string;
	onChange: (value: string) => void;
}

export const MarkdownEditor = ({ content, onChange }: MarkdownEditorProps) => (
	<textarea
		className='w-full h-full p-4 bg-bg resize-none outline-none text-text font-mono'
		value={content}
		onChange={(e) => onChange(e.target.value)}
		placeholder='Start typing your markdown...'
	/>
);
