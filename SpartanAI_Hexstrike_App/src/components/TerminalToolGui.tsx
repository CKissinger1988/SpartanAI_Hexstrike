import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Switch, List, IconButton, Divider } from 'react-native-paper';
import { RedTeamTool, ToolParam } from '../services/ArsenalService';
import { HexstrikeTheme } from '../theme/HexstrikeTheme';

interface Props {
  tool: RedTeamTool;
  onExecute: (toolId: string, args: Record<string, any>) => void;
}

export const TerminalToolGui: React.FC<Props> = ({ tool, onExecute }) => {
  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    tool.params?.forEach(p => {
      initial[p.id] = p.defaultValue || '';
    });
    return initial;
  });

  const [manualArgs, setManualArgs] = useState('');

  const handleInputChange = (id: string, value: any) => {
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleCommandPress = (cmd: string) => {
    setManualArgs(cmd);
    // Visual feedback
    console.log(`Populated manual args with: ${cmd}`);
  };

  const renderParam = (param: ToolParam) => {
    switch (param.type) {
      case 'text':
      case 'ip':
        return (
          <TextInput
            key={param.id}
            label={param.label}
            placeholder={param.placeholder}
            value={formValues[param.id]}
            onChangeText={(val) => handleInputChange(param.id, val)}
            mode="outlined"
            style={styles.input}
            textColor="#fff"
            outlineColor="#333"
            activeOutlineColor={HexstrikeTheme.colors.primary}
          />
        );
      case 'boolean':
        return (
          <View key={param.id} style={styles.switchRow}>
            <Text style={{ color: '#fff' }}>{param.label}</Text>
            <Switch
              value={formValues[param.id]}
              onValueChange={(val) => handleInputChange(param.id, val)}
              color={HexstrikeTheme.colors.primary}
            />
          </View>
        );
      case 'dropdown':
        return (
          <List.Accordion
            key={param.id}
            title={`${param.label}: ${formValues[param.id] || 'Select'}`}
            style={styles.accordion}
            titleStyle={{ color: '#fff' }}
          >
            {param.options?.map(opt => (
              <List.Item
                key={opt}
                title={opt}
                onPress={() => handleInputChange(param.id, opt)}
                titleStyle={{ color: formValues[param.id] === opt ? HexstrikeTheme.colors.primary : '#aaa' }}
              />
            ))}
          </List.Accordion>
        );
      default:
        return null;
    }
  };

  const constructFinalArgs = () => {
    if (manualArgs.trim()) return manualArgs;
    
    return Object.entries(formValues).map(([k, v]) => {
      if (typeof v === 'boolean') return v ? `--${k}` : '';
      return v ? `--${k} ${v}` : '';
    }).filter(Boolean).join(' ');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="terminal" iconColor={HexstrikeTheme.colors.primary} size={32} />
        <View>
          <Text variant="headlineSmall" style={styles.title}>{tool.name} GUI</Text>
          <Text variant="bodySmall" style={styles.subtitle}>Automated Terminal Bridge</Text>
        </View>
      </View>

      <Text variant="bodyMedium" style={styles.description}>{tool.description}</Text>

      {tool.commands && tool.commands.length > 0 && (
        <View style={styles.commandList}>
          <Text style={styles.sectionLabel}>COMMAND REFERENCE (TAP TO POPULATE)</Text>
          <List.Section>
            {tool.commands.map((cmd, idx) => (
              <List.Item
                key={idx}
                title={cmd}
                left={props => <List.Icon {...props} icon="code-braces" color={HexstrikeTheme.colors.primary} />}
                titleStyle={styles.commandItemText}
                onPress={() => handleCommandPress(cmd)}
                style={styles.commandItem}
              />
            ))}
          </List.Section>
          <Divider style={{ backgroundColor: '#333', marginVertical: 16 }} />
        </View>
      )}

      <View style={styles.form}>
        <Text style={styles.sectionLabel}>MANUAL OVERRIDE / PARAMS</Text>
        <TextInput
          label="Manual Command Arguments"
          placeholder="Enter custom flags or select from reference..."
          value={manualArgs}
          onChangeText={setManualArgs}
          mode="outlined"
          style={styles.input}
          textColor={HexstrikeTheme.colors.primary}
          outlineColor="#444"
        />

        <Divider style={{ backgroundColor: '#222', marginVertical: 16 }} />
        
        <Text style={styles.sectionLabel}>PARAMETER BUILDER</Text>
        {tool.params?.map(renderParam)}
      </View>

      <Button
        mode="contained"
        icon="play"
        style={styles.executeButton}
        buttonColor={HexstrikeTheme.colors.primary}
        onPress={() => onExecute(tool.id, manualArgs.trim() ? { manual: manualArgs } : formValues)}
      >
        EXECUTE TOOL
      </Button>

      <View style={styles.consolePreview}>
        <Text style={styles.consoleLabel}>COMMAND PREVIEW</Text>
        <Text style={styles.consoleText}>
          $ {tool.id} {constructFinalArgs()}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#757575',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  description: {
    color: '#aaa',
    lineHeight: 20,
    marginBottom: 24,
  },
  sectionLabel: {
    color: '#757575',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 1,
  },
  commandList: {
    marginBottom: 24,
  },
  commandItem: {
    paddingVertical: 0,
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    marginBottom: 4,
  },
  commandItemText: {
    fontSize: 12,
    color: '#aaa',
    fontFamily: 'monospace',
  },
  form: {
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#1e1e1e',
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#1e1e1e',
    borderRadius: 4,
  },
  accordion: {
    backgroundColor: '#1e1e1e',
    marginBottom: 16,
  },
  executeButton: {
    paddingVertical: 8,
    borderRadius: 4,
  },
  consolePreview: {
    marginTop: 32,
    marginBottom: 60,
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  consoleLabel: {
    color: '#757575',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  consoleText: {
    color: '#00FF00',
    fontFamily: 'monospace',
    fontSize: 12,
  }
});
