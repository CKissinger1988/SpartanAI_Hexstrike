import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card, List, Button, IconButton, MD3DarkTheme } from 'react-native-paper';
import { Header } from '../components/Header';
import { HexstrikeTheme } from '../theme/HexstrikeTheme';

export const NovaScreen: React.FC = () => {
  const [activeProtocols, setActiveProtocols] = useState([
    { id: '1', name: 'SC-GOD-v2', status: 'Idle', detail: 'Recursive Breach Loop' },
    { id: '2', name: 'Omega Protocol', status: 'Standby', detail: 'Anti-Forensic Purge' },
    { id: '3', name: 'Crypto Harvest', status: 'Polling', detail: 'Wallet Discovery' },
  ]);

  return (
    <View style={styles.container}>
      <Header title="N.O.V.A. SOVEREIGN" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
          <IconButton icon="auto-fix" iconColor={HexstrikeTheme.colors.primary} size={48} />
          <Text variant="headlineMedium" style={styles.heroTitle}>Autonomous Intel</Text>
          <Text variant="bodyMedium" style={styles.heroSubtitle}>
            Voice Activated Sovereign Orchestration
          </Text>
        </View>

        <Text variant="titleMedium" style={styles.sectionLabel}>ACTIVE PROTOCOLS</Text>
        {activeProtocols.map(p => (
          <Card key={p.id} style={styles.protocolCard}>
            <Card.Title 
              title={p.name} 
              subtitle={p.detail} 
              titleStyle={{ color: '#fff', fontWeight: 'bold' }}
              subtitleStyle={{ color: '#aaa' }}
              right={() => <Text style={styles.statusText}>{p.status}</Text>}
            />
          </Card>
        ))}

        <View style={styles.actionGrid}>
          <Button 
            mode="contained" 
            icon="flash" 
            style={styles.actionButton} 
            buttonColor={HexstrikeTheme.colors.primary}
            onPress={() => {}}
          >
            FULL SEND
          </Button>
          <Button 
            mode="outlined" 
            icon="security" 
            style={[styles.actionButton, { borderColor: HexstrikeTheme.colors.primary }]} 
            textColor={HexstrikeTheme.colors.primary}
            onPress={() => {}}
          >
            OMEGA TRIGGER
          </Button>
        </View>

        <List.Section style={styles.listSection}>
          <List.Subheader style={{ color: '#aaa' }}>SOVEREIGN SUBSYSTEMS</List.Subheader>
          <List.Item
            title="Wireless Offensive"
            description="Bluetooth & NFC Exploitation"
            left={props => <List.Icon {...props} icon="wifi-off" color={HexstrikeTheme.colors.primary} />}
            titleStyle={{ color: '#fff' }}
          />
          <List.Item
            title="RemoteADB"
            description="Subnet Scan & Device Takeover"
            left={props => <List.Icon {...props} icon="android-debug-bridge" color={HexstrikeTheme.colors.primary} />}
            titleStyle={{ color: '#fff' }}
          />
          <List.Item
            title="Data Harvester"
            description="Secrets & Crypto Extraction"
            left={props => <List.Icon {...props} icon="database-import" color={HexstrikeTheme.colors.primary} />}
            titleStyle={{ color: '#fff' }}
          />
        </List.Section>
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
  heroSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  heroTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  heroSubtitle: {
    color: '#757575',
    marginTop: 4,
  },
  sectionLabel: {
    color: HexstrikeTheme.colors.primary,
    marginBottom: 12,
    letterSpacing: 1,
  },
  protocolCard: {
    backgroundColor: HexstrikeTheme.colors.surface,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: HexstrikeTheme.colors.primary,
  },
  statusText: {
    color: HexstrikeTheme.colors.primary,
    fontWeight: 'bold',
    marginRight: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  actionButton: {
    flex: 0.48,
    borderRadius: 4,
  },
  listSection: {
    backgroundColor: HexstrikeTheme.colors.surface,
    borderRadius: 8,
  }
});
