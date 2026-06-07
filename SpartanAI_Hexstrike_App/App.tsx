import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, BottomNavigation, FAB } from 'react-native-paper';
import { HexstrikeTheme } from './src/theme/HexstrikeTheme';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { PayloadScreen } from './src/screens/PayloadScreen';
import { MetasploitScreen } from './src/screens/MetasploitScreen';
import { ShodanScreen } from './src/screens/ShodanScreen';
import { ArsenalScreen } from './src/screens/ArsenalScreen';
import { NovaScreen } from './src/screens/NovaScreen';
import { NovaChatScreen } from './src/screens/NovaChatScreen';
import { VoiceService } from './src/services/VoiceService';

export default function App() {
  const [index, setIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [routes] = useState([
    { key: 'dashboard', title: 'Dashboard', focusedIcon: 'view-dashboard', unfocusedIcon: 'view-dashboard-outline' },
    { key: 'chat', title: 'Intelligence', focusedIcon: 'comment-text-multiple', unfocusedIcon: 'comment-text-multiple-outline' },
    { key: 'nova', title: 'NOVA', focusedIcon: 'auto-fix', unfocusedIcon: 'auto-fix' },
    { key: 'arsenal', title: 'Arsenal', focusedIcon: 'toolbox', unfocusedIcon: 'toolbox-outline' },
    { key: 'metasploit', title: 'Metasploit', focusedIcon: 'matrix', unfocusedIcon: 'matrix' },
  ]);

  const handleVoicePress = async () => {
    if (isListening) {
      await VoiceService.stopListening();
      setIsListening(false);
    } else {
      await VoiceService.startListening();
      setIsListening(true);
    }
  };

  const renderScene = BottomNavigation.SceneMap({
    dashboard: DashboardScreen,
    chat: NovaChatScreen,
    nova: NovaScreen,
    arsenal: ArsenalScreen,
    metasploit: MetasploitScreen,
    shodan: ShodanScreen,
    payloads: PayloadScreen,
  });

  return (
    <SafeAreaProvider>
      <PaperProvider theme={HexstrikeTheme}>
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          barStyle={{ backgroundColor: HexstrikeTheme.colors.surface }}
          activeColor={HexstrikeTheme.colors.primary}
          inactiveColor="#757575"
        />
        <FAB
          icon={isListening ? "microphone" : "microphone-outline"}
          onPress={handleVoicePress}
          style={{
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 80,
            backgroundColor: isListening ? HexstrikeTheme.colors.primary : '#333',
          }}
          color={isListening ? '#fff' : HexstrikeTheme.colors.primary}
        />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
