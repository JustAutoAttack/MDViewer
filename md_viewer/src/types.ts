export enum EditorView {
	MD = 'md',
	FORMATTED = 'formatted',
	SPLIT = 'split'
}

export type SyncStatus = 'synced' | 'unsaved' | 'syncing' | 'error';

export interface OpenFile {
	id: string;
	path: string | null;
	baseName: string;
	content: string;
	status: SyncStatus;
}

export interface Theme {
	id: string;
	name: string;
	colors: {
		bgPrimary: string;
		bgSecondary: string;
		bgHover: string;
		textPrimary: string;
		textSecondary: string;
		accentPrimary: string;
		accentHover: string;
		border: string;
	};
}
