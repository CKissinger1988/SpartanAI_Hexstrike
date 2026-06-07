import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { Header } from '../components/Header';
import { HexstrikeTheme } from '../theme/HexstrikeTheme';
import { BoazApiService, PayloadConfig } from '../services/BoazApiService';

export const PayloadScreen: React.FC = () => {
  const [os, setOs] = useState<PayloadConfig['os']>('windows');
  const [arch, setArch] = useState<PayloadConfig['arch']>('x64');
  const [format, setFormat] = useState<PayloadConfig['format']>('exe');
  const [obfuscation, setObfuscation] = useState('3');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const config: PayloadConfig = {
        os,
        arch,
        format,
        obfuscationLevel: parseInt(obfuscation) || 1
      };
      const response = await BoazApiService.generatePayload(config);
      if (response.success) {
        Alert.alert('Payload Ready', `${response.message}\nURL: ${response.downloadUrl}`);
      }
    } catch (e) {
      Alert.alert('Generation Failed', 'Failed to generate payload via Boaz backend.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="BOAZ EVASION" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="titleMedium" style={styles.label}>Target OS</Text>
        <SegmentedButtons
          value={os}
          onValueChange={(val) => setOs(val as any)}
          buttons={[
            { value: 'windows', label: 'Windows' },
            { value: 'linux', label: 'Linux' },
            { value: 'macos', label: 'macOS' },
          ]}
          style={styles.segmented}
        />

        <Text variant="titleMedium" style={styles.label}>Architecture</Text>
        <SegmentedButtons
          value={arch}
          onValueChange={(val) => setArch(val as any)}
          buttons={[
            { value: 'x64', label: 'x64' },
            { value: 'x86', label: 'x86' },
          ]}
          style={styles.segmented}
        />

        <Text variant="titleMedium" style={styles.label}>Format</Text>
        <SegmentedButtons
          value={format}
          onValueChange={(val) => setFormat(val as any)}
          buttons={[
            { value: 'exe', label: '.exe' },
            { value: 'dll', label: '.dll' },
            { value: 'elf', label: 'ELF' },
            { value: 'sh', label: '.sh' },
          ]}
          style={styles.segmented}
        />

        <TextInput
          label="Obfuscation Level (1-10)"
          value={obfuscation}
          onChangeText={setObfuscation}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
          textColor="#fff"
        />

        <Button 
          mode="contained" 
          onPress={handleGenerate} 
          loading={generating}
          disabled={generating}
          style={styles.button}
          buttonColor={HexstrikeTheme.colors.primary}
        >
          GENERATE EVASIVE PAYLOAD
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HexstrikeTheme.colors.background,
  },
  content: {
    padding: 16,
  },
  label: {
    color: '#AAAAAA',
    marginBottom: 8,
    marginTop: 16,
  },
  segmented: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: HexstrikeTheme.colors.surface,
    marginTop: 16,
    marginBottom: 24,
  },
  button: {
    paddingVertical: 8,
    marginTop: 16,
  }
});
