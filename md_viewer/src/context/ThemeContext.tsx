import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode
} from 'react';
import { Theme } from '../types';
import {
	DEFAULT_THEME,
	CSS_VAR_MAP,
	loadStoredTheme,
	saveTheme
} from '../themes';

interface ThemeContextValue {
	theme: Theme;
	setColor: (key: keyof Theme['colors'], value: string) => void;
	resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyThemeToDOM(theme: Theme) {
	const root = document.documentElement;
	(Object.keys(theme.colors) as Array<keyof Theme['colors']>).forEach(
		(key) => {
			root.style.setProperty(CSS_VAR_MAP[key], theme.colors[key]);
		}
	);
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState<Theme>(() => loadStoredTheme());

	useEffect(() => {
		applyThemeToDOM(theme);
		saveTheme(theme);
	}, [theme]);

	const setColor = (key: keyof Theme['colors'], value: string) => {
		setTheme((prev) => ({
			...prev,
			colors: { ...prev.colors, [key]: value }
		}));
	};

	const resetTheme = () => setTheme(DEFAULT_THEME);

	return (
		<ThemeContext.Provider value={{ theme, setColor, resetTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = (): ThemeContextValue => {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
	return ctx;
};
