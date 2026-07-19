import { ThemeProvider } from './context/ThemeContext';
import { MainLayout } from './components/organisms/MainLayout';
import './index.css';

function App() {
	return (
		<div className='h-screen w-screen overflow-hidden'>
			<ThemeProvider>
				<MainLayout />
			</ThemeProvider>
		</div>
	);
}

export default App;
