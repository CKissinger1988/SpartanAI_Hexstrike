import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, TextInput, Button, Card, IconButton, Divider, ActivityIndicator, Searchbar } from 'react-native-paper';
import { Header } from '../components/Header';
import { ShodanService, ShodanHost } from '../services/ShodanService';
import { HexstrikeTheme } from '../theme/HexstrikeTheme';

export const ShodanScreen: React.FC = () => {
  const [searchQuery, setSearchbarQuery] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [results, setResults] = useState<ShodanHost[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      if (apiKey) ShodanService.setApiKey(apiKey);
      const data = await ShodanService.search(searchQuery);
      setResults(data.matches);
      setTotal(data.total);
    } catch (e) {
      
    } finally {
      setLoading(false);
    }
  };

  const dorks = [
    { label: 'Default Passwords', query: '"default password" port:23' },
    { label: 'Vulnerable SMB', query: 'os:"Windows" port:445' },
    { label: 'Industrial Control', query: 'port:502' },
    { label: 'Webcams', query: 'webcam' },
    { label: 'Jenkins No Auth', query: '"Dashboard [Jenkins]" port:8080' },
  ];

  const handleDorkPress = (query: string) => {
    setSearchbarQuery(query);
  };

  return (
    <View style={styles.container}>
      <Header title="SHODAN INTEL" />
      <View style={styles.inputSection}>
        <TextInput
          label="Shodan API Key (Optional for Demo)"
          value={apiKey}
          onChangeText={setApiKey}
          mode="outlined"
          secureTextEntry
          style={styles.apiKeyInput}
          textColor="#fff"
        />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dorkScroll}>
          {dorks.map((d, i) => (
            <Chip 
              key={i} 
              onPress={() => handleDorkPress(d.query)} 
              style={styles.dorkChip}
              textStyle={styles.dorkChipText}
            >
              {d.label}
            </Chip>
          ))}
        </ScrollView>

        <Searchbar
          placeholder="Search (e.g. apache, port:21)"
          onChangeText={setSearchbarQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchbar}
          iconColor={HexstrikeTheme.colors.primary}
          placeholderTextColor="#757575"
          inputStyle={{ color: '#fff' }}
        />
        <Button 
          mode="contained" 
          onPress={handleSearch} 
          disabled={loading}
          buttonColor={HexstrikeTheme.colors.primary}
          style={styles.searchButton}
        >
          {loading ? 'SEARCHING...' : 'RUN SHODAN QUERY'}
        </Button>
      </View>

      {loading ? (
        <ActivityIndicator animating={true} color={HexstrikeTheme.colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.ip_str}-${index}`}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={results.length > 0 ? (
            <Text style={styles.resultCount}>{total} results found</Text>
          ) : null}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Text variant="titleMedium" style={{ color: HexstrikeTheme.colors.primary }}>
                    {item.ip_str}
                  </Text>
                  <Text variant="bodySmall" style={{ color: '#AAAAAA' }}>Port: {item.port}</Text>
                </View>
                <Text variant="bodyMedium" style={styles.orgText}>{item.org || item.isp}</Text>
                <Text variant="bodySmall" style={styles.locationText}>
                  {item.location.city}, {item.location.country_name}
                </Text>
                <Divider style={styles.divider} />
                <View style={styles.bannerContainer}>
                  <Text style={styles.bannerTitle}>BANNER DATA</Text>
                  <Text style={styles.bannerText} numberOfLines={3}>{item.data}</Text>
                </View>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HexstrikeTheme.colors.background,
  },
  inputSection: {
    padding: 16,
    backgroundColor: HexstrikeTheme.colors.surface,
  },
  apiKeyInput: {
    marginBottom: 12,
    height: 40,
    backgroundColor: HexstrikeTheme.colors.background,
  },
  dorkScroll: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dorkChip: {
    backgroundColor: '#333',
    marginRight: 8,
    height: 32,
  },
  dorkChipText: {
    fontSize: 10,
    color: HexstrikeTheme.colors.primary,
  },
  searchbar: {
    backgroundColor: HexstrikeTheme.colors.background,
    borderRadius: 8,
  },
  searchButton: {
    marginTop: 12,
  },
  listContent: {
    padding: 16,
  },
  resultCount: {
    color: '#757575',
    marginBottom: 12,
    fontSize: 12,
  },
  card: {
    backgroundColor: HexstrikeTheme.colors.surface,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orgText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  locationText: {
    color: '#AAAAAA',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 8,
    backgroundColor: '#333',
  },
  bannerContainer: {
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 4,
  },
  bannerTitle: {
    color: HexstrikeTheme.colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerText: {
    color: '#00FF00',
    fontSize: 10,
    fontFamily: 'monospace',
  }
});
