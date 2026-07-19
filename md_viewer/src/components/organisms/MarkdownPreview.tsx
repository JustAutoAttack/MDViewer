import { useEffect, useState, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface MarkdownPreviewProps {
	rawContent: string;
}

const DEBOUNCE_MS = 100;

export const MarkdownPreview = ({ rawContent }: MarkdownPreviewProps) => {
	const [html, setHtml] = useState<string>('');
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			invoke<string>('parse_markdown', { markdown: rawContent })
				.then((processedHtml) => setHtml(processedHtml))
				.catch((err) => console.error('Parsing failed:', err));
		}, DEBOUNCE_MS);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [rawContent]);

	return (
		<div
			className='markdown-body p-8 h-full overflow-y-auto'
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
};
