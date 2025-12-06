import { useEffect } from 'react';
import { HomePage } from '@/pages/HomePage';
import { useThemeStore } from '@/stores';

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <HomePage />;
}

export default App;
