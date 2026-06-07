import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Card, List, IconButton, Badge, Divider, ActivityIndicator, Button } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import { Header } from '../components/Header';
import { MetasploitService, MetasploitSession, MetasploitJob } from '../services/MetasploitService';
import { HexstrikeTheme } from '../theme/HexstrikeTheme';

export const MetasploitScreen: React.FC = () => {
  const [sessions, setSessions] = useState<MetasploitSession[]>([]);
  const [jobs, setJobs] = useState<MetasploitJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const automationCommand = `curl -sL https://raw.githubusercontent.com/Hexstrike/mobile-automation/main/termux_setup.sh | bash`;

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(automationCommand);
    Alert.alert('Command Copied', 'Paste this command into Termux to automate setup.');
  };

  const fetchData = async () => {
    try {
      const connected = await MetasploitService.checkConnection();
      setIsConnected(connected);
      
      if (connected) {
        await MetasploitService.login('msf', 'msf');
        const [s, j] = await Promise.all([
          MetasploitService.getSessions(),
          MetasploitService.getJobs(),
        ]);
        setSessions(s);
        setJobs(j);
      }
    } catch (e) {
      
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const msfPresets = [
    { label: 'Start Handler', cmd: 'use exploit/multi/handler' },
    { label: 'SMB Scan', cmd: 'use auxiliary/scanner/smb/smb_version' },
    { label: 'DB Status', cmd: 'db_status' },
    { label: 'Active Sessions', cmd: 'sessions -l' },
  ];

  return (
    <View style={styles.container}>
      <Header title="METASPLOIT FRAMEWORK" />
      <View style={[styles.statusBanner, { backgroundColor: isConnected ? '#1B5E20' : '#B71C1C' }]}>
        <Text style={styles.statusText}>
          {isConnected ? 'LOCAL RPC CONNECTED' : 'LOCAL RPC DISCONNECTED'}
        </Text>
      </View>
      
      <View style={styles.presetSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {msfPresets.map((p, i) => (
            <Chip 
              key={i} 
              onPress={() => Alert.alert('Command Preset', p.cmd)} 
              style={styles.presetChip}
              textStyle={{ color: HexstrikeTheme.colors.primary, fontSize: 10 }}
            >
              {p.label}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={HexstrikeTheme.colors.primary} />}
      >
        {!isConnected && (
          <Card style={styles.automationCard}>
            <Card.Title title="Automate Setup" titleStyle={{ color: HexstrikeTheme.colors.primary }} left={(props) => <List.Icon {...props} icon="robot-confused" color={HexstrikeTheme.colors.primary} />} />
            <Card.Content>
              <Text variant="bodyMedium" style={{ color: '#ccc', marginBottom: 16 }}>
                The local Metasploit RPC server is not detected. Paste the command below into Termux to automatically install and start the listener.
              </Text>
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>{automationCommand}</Text>
              </View>
              <Button 
                mode="outlined" 
                onPress={copyToClipboard} 
                style={styles.copyButton}
                textColor={HexstrikeTheme.colors.primary}
              >
                COPY SETUP COMMAND
              </Button>
            </Card.Content>
          </Card>
        )}

        <View style={styles.sectionHeader}>
          <Text variant="headlineSmall" style={styles.title}>Sessions</Text>
          <Badge style={styles.badge}>{sessions.length}</Badge>
        </View>

        {loading && !refreshing ? (
          <ActivityIndicator animating={true} color={HexstrikeTheme.colors.primary} style={{ margin: 20 }} />
        ) : (
          sessions.map((s) => (
            <Card key={s.id} style={styles.card}>
              <Card.Content>
                <View style={styles.sessionHeader}>
                  <Text variant="titleMedium" style={{ color: HexstrikeTheme.colors.primary }}>
                    #{s.id} {s.type.toUpperCase()}
                  </Text>
                  <IconButton icon="console-line" iconColor="#fff" size={20} onPress={() => {}} />
                </View>
                <Text variant="bodyMedium" style={styles.infoText}>{s.info}</Text>
                <Divider style={styles.divider} />
                <View style={styles.row}>
                  <IconButton icon="ip-network" size={16} iconColor="#AAAAAA" />
                  <Text variant="bodySmall" style={styles.detailText}>{s.tunnel_peer}</Text>
                </View>
                <View style={styles.row}>
                  <IconButton icon="bug" size={16} iconColor="#AAAAAA" />
                  <Text variant="bodySmall" style={styles.detailText}>{s.via_exploit.split('/').pop()}</Text>
                </View>
              </Card.Content>
            </Card>
          ))
        )}

        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text variant="headlineSmall" style={styles.title}>Active Jobs</Text>
          <Badge style={[styles.badge, { backgroundColor: '#FF9800' }]}>{jobs.length}</Badge>
        </View>

        {jobs.map((j) => (
          <List.Item
            key={j.id}
            title={j.name}
            titleStyle={{ color: '#fff', fontSize: 14 }}
            description={`Started: ${j.start_time}`}
            descriptionStyle={{ color: '#AAAAAA' }}
            left={props => <List.Icon {...props} icon="cog-refresh" color={HexstrikeTheme.colors.primary} />}
            right={props => <IconButton {...props} icon="stop-circle" iconColor={HexstrikeTheme.colors.error} onPress={() => {}} />}
            style={styles.listItem}
          />
        ))}
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
  },
  badge: {
    marginLeft: 8,
    backgroundColor: HexstrikeTheme.colors.primary,
  },
  card: {
    backgroundColor: HexstrikeTheme.colors.surface,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: HexstrikeTheme.colors.primary,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoText: {
    color: '#E0E0E0',
    marginBottom: 8,
  },
  detailText: {
    color: '#AAAAAA',
  },
  divider: {
    marginVertical: 8,
    backgroundColor: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -12,
  },
  listItem: {
    backgroundColor: HexstrikeTheme.colors.surface,
    borderRadius: 8,
    marginBottom: 8,
  },
  statusBanner: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  presetSection: {
    padding: 12,
    backgroundColor: '#121212',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  presetChip: {
    backgroundColor: '#1e1e1e',
    marginRight: 8,
    height: 32,
    borderColor: '#333',
    borderWidth: 1,
  },
  automationCard: {
    backgroundColor: HexstrikeTheme.colors.surface,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  codeBlock: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  codeText: {
    color: '#00FF00',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  copyButton: {
    borderColor: HexstrikeTheme.colors.primary,
  }
});
