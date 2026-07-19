import { Theme } from './types';

export const CSS_VAR_MAP: Record<keyof Theme['colors'], string> = {
	bgPrimary: '--color-bg-primary',
	bgSecondary: '--color-bg-secondary',
	bgHover: '--color-bg-hover',
	textPrimary: '--color-text-primary',
	textSecondary: '--color-text-secondary',
	accentPrimary: '--color-accent-primary',
	accentHover: '--color-accent-hover',
	border: '--color-border'
};

export const DEFAULT_THEME: Theme = {
	id: 'phosphor-dark',
	name: 'Phosphor Dark',
	colors: {
		bgPrimary: '#14161A',
		bgSecondary: '#1C1F24',
		bgHover: '#262A30',
		textPrimary: '#EDEAE3',
		textSecondary: '#8D939B',
		accentPrimary: '#FFAE42',
		accentHover: '#FFC670',
		border: '#2C3036'
	}
};

const STORAGE_KEY = 'md_viewer_theme';

export function loadStoredTheme(): Theme {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return DEFAULT_THEME;
		const parsed = JSON.parse(raw) as Theme;
		// Guard against malformed/older saved shapes
		if (!parsed.colors) return DEFAULT_THEME;
		return {
			...DEFAULT_THEME,
			...parsed,
			colors: { ...DEFAULT_THEME.colors, ...parsed.colors }
		};
	} catch {
		return DEFAULT_THEME;
	}
}

export function saveTheme(theme: Theme) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
	} catch (err) {
		console.error('Failed to save theme:', err);
	}
}
