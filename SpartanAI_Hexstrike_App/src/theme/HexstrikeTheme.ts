import { MD3DarkTheme } from 'react-native-paper';

export const HexstrikeTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#E53935', // Red Team Red
    secondary: '#1E1E1E', // Dark Grey
    background: '#121212', // Very Dark Grey
    surface: '#1E1E1E',
    text: '#FFFFFF',
    onPrimary: '#FFFFFF',
    onSurface: '#FFFFFF',
    accent: '#B71C1C',
    error: '#CF6679',
  },
};
