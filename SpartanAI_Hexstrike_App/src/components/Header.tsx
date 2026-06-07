import React from 'react';
import { Appbar } from 'react-native-paper';
import { HexstrikeTheme } from '../theme/HexstrikeTheme';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <Appbar.Header style={{ backgroundColor: HexstrikeTheme.colors.surface }}>
      <Appbar.Content title={title} titleStyle={{ color: HexstrikeTheme.colors.primary, fontWeight: 'bold' }} />
      <Appbar.Action icon="shield-half-full" iconColor={HexstrikeTheme.colors.primary} onPress={() => {}} />
    </Appbar.Header>
  );
};
