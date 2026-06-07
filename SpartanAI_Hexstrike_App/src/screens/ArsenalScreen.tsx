import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Modal } from 'react-native';
import { Text, Card, IconButton, Chip, Portal, Button } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { Header } from '../components/Header';
import { RedTeamTools, RedTeamTool } from '../services/ArsenalService';
import { HexstrikeTheme } from '../theme/HexstrikeTheme';
import { TerminalToolGui } from '../components/TerminalToolGui';

export const ArsenalScreen: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<RedTeamTool | null>(null);

  const handleExecute = async (toolId: string, args: Record<string, any>) => {
    console.log(`Executing ${toolId} with:`, args);
    
    // Construct argument string for CLI
    let argString = '';
    if (args.manual) {
      argString = args.manual;
    } else {
      argString = Object.entries(args)
        .map(([k, v]) => {
          if (typeof v === 'boolean') return v ? `--${k}` : '';
          return v ? `--${k} ${v}` : '';
        })
        .filter(Boolean)
        .join(' ');
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_id: toolId,
          args: argString,
          target: args.target || args.url || args.rhosts || ''
        }),
      });
      const result = await response.json();
      console.log('Execution result:', result);
    } catch (e) {
      console.error('Failed to execute tool:', e);
    }
    
    setSelectedTool(null);
  };

  const renderTool = ({ item }: { item: RedTeamTool }) => (
    <Card style={styles.card} onPress={() => setSelectedTool(item)}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="titleMedium" style={styles.toolName}>{item.name}</Text>
          <Chip style={styles.categoryChip} textStyle={styles.chipText}>{item.category}</Chip>
        </View>
        <Text variant="bodySmall" style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.typeText}>{item.type === 'webview' ? 'WEB INTERFACE' : 'GUI WRAPPER'}</Text>
          <IconButton icon="arrow-right-circle" iconColor={HexstrikeTheme.colors.primary} size={20} />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="RED TEAM ARSENAL" />
      <FlatList
        data={RedTeamTools}
        keyExtractor={(item) => item.id}
        renderItem={renderTool}
        numColumns={1}
        contentContainerStyle={styles.listContent}
      />

      <Modal visible={selectedTool !== null} onDismiss={() => setSelectedTool(null)} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text variant="headlineSmall" style={styles.modalTitle}>{selectedTool?.name}</Text>
            <IconButton icon="close" iconColor="#fff" onPress={() => setSelectedTool(null)} />
          </View>
          
          {selectedTool?.type === 'webview' && selectedTool.url ? (
            <WebView 
              source={{ uri: selectedTool.url }} 
              style={{ flex: 1 }} 
              startInLoadingState 
              backgroundColor="#121212"
            />
          ) : (
            selectedTool && <TerminalToolGui tool={selectedTool} onExecute={handleExecute} />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HexstrikeTheme.colors.background,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: HexstrikeTheme.colors.surface,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toolName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryChip: {
    backgroundColor: '#333',
    height: 24,
  },
  chipText: {
    fontSize: 10,
    color: HexstrikeTheme.colors.primary,
  },
  description: {
    color: '#aaa',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 10,
    color: '#757575',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e1e1e',
  },
  modalTitle: {
    color: HexstrikeTheme.colors.primary,
    fontWeight: 'bold',
  },
  infoContent: {
    padding: 24,
    flex: 1,
  },
  infoDesc: {
    color: '#fff',
    lineHeight: 24,
    marginBottom: 32,
  },
  repoLabel: {
    color: HexstrikeTheme.colors.primary,
    marginBottom: 8,
  },
  codeBlock: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 4,
  },
  codeText: {
    color: '#00FF00',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  deployButton: {
    marginTop: 'auto',
    marginBottom: 32,
    paddingVertical: 8,
  }
});
