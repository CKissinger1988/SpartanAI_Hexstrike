import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { Text, TextInput, IconButton, Card, Menu, Button, ActivityIndicator } from 'react-native-paper';
import { Header } from '../components/Header';
import { HexstrikeTheme } from '../theme/HexstrikeTheme';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'nova';
  timestamp: Date;
}

export const NovaChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Sovereign Intelligence Node Active. Standing by for tactical directives.', sender: 'nova', timestamp: new Date() }
  ]);
  const [inputText, setTextInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('Spartan-7 (Omni)');
  const [menuVisible, setMenuVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [modelStatus, setModelStatus] = useState<Record<string, string>>({});
  const flatListRef = useRef<FlatList>(null);

  const models = [
    { id: 'spartan-7', name: 'Spartan-7 (Omni)', detail: 'Full Arsenal Access', type: 'cloud' },
    { id: 'gemma4', name: 'Gemma-4 E2B (Offline)', detail: 'Ultra-Efficient Edge Intelligence', type: 'local' },
    { id: 'gemini-ultra', name: 'Gemini-Ultra', detail: 'Strategic Reasoning', type: 'cloud' },
    { id: 'claude-3-red', name: 'Claude-3-Red', detail: 'Adversarial Modeling', type: 'cloud' }
  ];

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/status');
        const data = await response.json();
        setModelStatus(data.offline_cortex || {});
      } catch (e) {
        console.warn('Status check failed.');
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const currentModel = models.find(m => m.name === selectedModel);
    if (currentModel?.type === 'local' && modelStatus[currentModel.id] !== 'Available') {
      alert(`${selectedModel} is still auto-provisioning. Please wait.`);
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setTextInput('');
    setIsTyping(true);

    const modelType = models.find(m => m.name === selectedModel)?.type;
    const endpoint = modelType === 'local' ? 'http://127.0.0.1:8000/chat-local' : 'http://127.0.0.1:8000/chat-cloud';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: inputText,
          model: selectedModel.toLowerCase().includes('gemma') ? 'gemma4' : selectedModel.toLowerCase()
        }),
      });
      const data = await response.json();
      
      const novaMsg: Message = {
        id: Date.now().toString(),
        text: data.response || `Error communicating with ${selectedModel}.`,
        sender: 'nova',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, novaMsg]);
    } catch (e) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: 'Orchestrator offline. Check local service status.',
        sender: 'nova',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageWrapper,
      item.sender === 'user' ? styles.userWrapper : styles.novaWrapper
    ]}>
      <Card style={[
        styles.messageCard,
        item.sender === 'user' ? styles.userCard : styles.novaCard
      ]}>
        <Card.Content>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.timestamp}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );

  const handleDownload = async () => {
    try {
      await fetch('http://127.0.0.1:8000/download-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          model_id: 'google/gemma-4-E2B-it-qat-q4_0-gguf', 
          quant: 'q4_0' 
        }),
      });
      alert('Gemma 4 Download Started. Check orchestrator logs.');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="SOVEREIGN CHAT" />
      
      <View style={styles.modelHeader}>
        <View style={{ flex: 1 }}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button 
                mode="outlined" 
                onPress={() => setMenuVisible(true)}
                icon="chevron-down"
                contentStyle={{ flexDirection: 'row-reverse' }}
                textColor={HexstrikeTheme.colors.primary}
                style={{ borderColor: HexstrikeTheme.colors.primary }}
              >
                {selectedModel}
              </Button>
            }
          >
            {models.map(m => (
              <Menu.Item 
                key={m.name} 
                onPress={() => {
                  setSelectedModel(m.name);
                  setMenuVisible(false);
                }} 
                title={m.name} 
              />
            ))}
          </Menu>
        </View>
        
        <View style={styles.statusContainer}>
          {models.find(m => m.name === selectedModel)?.type === 'local' && (
            <Chip 
              icon={modelStatus['gemma4'] === 'Available' ? 'check-circle' : 'download'} 
              style={[
                styles.statusChip,
                { backgroundColor: modelStatus['gemma4'] === 'Available' ? '#1b5e20' : '#333' }
              ]}
              textStyle={{ fontSize: 10, color: '#fff' }}
            >
              {modelStatus['gemma4'] || 'Checking...'}
            </Chip>
          )}
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {isTyping && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color={HexstrikeTheme.colors.primary} />
          <Text style={styles.typingText}>NOVA is thinking...</Text>
        </View>
      )}

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputArea}>
          <TextInput
            mode="flat"
            placeholder="Enter sovereign directive..."
            value={inputText}
            onChangeText={setTextInput}
            style={styles.input}
            placeholderTextColor="#757575"
            textColor="#fff"
            underlineColor="transparent"
            activeUnderlineColor="transparent"
          />
          <IconButton 
            icon="send" 
            mode="contained"
            containerColor={HexstrikeTheme.colors.primary}
            iconColor="#fff"
            onPress={handleSend}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HexstrikeTheme.colors.background,
  },
  modelHeader: {
    padding: 12,
    backgroundColor: HexstrikeTheme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modelDetail: {
    color: '#757575',
    fontSize: 12,
    fontStyle: 'italic',
  },
  statusContainer: {
    marginLeft: 8,
  },
  statusChip: {
    height: 28,
  },
  chatList: {
    padding: 16,
    paddingBottom: 32,
  },
  messageWrapper: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  userWrapper: {
    alignSelf: 'flex-end',
  },
  novaWrapper: {
    alignSelf: 'flex-start',
  },
  messageCard: {
    borderRadius: 12,
  },
  userCard: {
    backgroundColor: HexstrikeTheme.colors.primary,
  },
  novaCard: {
    backgroundColor: HexstrikeTheme.colors.surface,
    borderLeftWidth: 3,
    borderLeftColor: HexstrikeTheme.colors.primary,
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  typingText: {
    color: HexstrikeTheme.colors.primary,
    fontSize: 12,
    marginLeft: 8,
    fontFamily: 'monospace',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: HexstrikeTheme.colors.surface,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  input: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    borderRadius: 24,
    height: 45,
    marginRight: 8,
  },
});
