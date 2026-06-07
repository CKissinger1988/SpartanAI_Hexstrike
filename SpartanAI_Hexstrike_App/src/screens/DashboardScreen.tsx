import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, ActivityIndicator, Chip } from 'react-native-paper';
import { Header } from '../components/Header';
import { BoazApiService, BoazOperation } from '../services/BoazApiService';
import { HexstrikeTheme } from '../theme/HexstrikeTheme';

export const DashboardScreen: React.FC = () => {
  const [operations, setOperations] = useState<BoazOperation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOperations();
  }, []);

  const loadOperations = async () => {
    try {
      const ops = await BoazApiService.getActiveOperations();
      setOperations(ops);
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'failed': return HexstrikeTheme.colors.error;
      case 'completed': return '#2196F3';
      default: return '#757575';
    }
  };

  return (
    <View style={styles.container}>
      <Header title="HEXSTRIKE C2" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Active Operations</Text>
        
        {loading ? (
          <ActivityIndicator animating={true} color={HexstrikeTheme.colors.primary} style={{ marginTop: 40 }} />
        ) : (
          operations.map((op) => (
            <Card key={op.id} style={styles.card}>
              <Card.Title 
                title={op.name} 
                subtitle={`Target: ${op.target} | Last Seen: ${op.lastSeen}`}
                titleStyle={{ color: HexstrikeTheme.colors.text }}
                subtitleStyle={{ color: '#AAAAAA' }}
              />
              <Card.Content>
                <Chip textStyle={{ color: '#fff' }} style={{ backgroundColor: getStatusColor(op.status), alignSelf: 'flex-start' }}>
                  {op.status.toUpperCase()}
                </Chip>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HexstrikeTheme.colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    color: HexstrikeTheme.colors.text,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: HexstrikeTheme.colors.surface,
    marginBottom: 12,
  }
});
