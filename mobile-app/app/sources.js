import React from 'react';
import { View, Text, StyleSheet, Switch, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import useStore from '../store/useStore';
import { getAvailableSources } from '../utils/feedUtils';

export default function SourcesScreen() {
  const router = useRouter();
  const { selectedSources, toggleSource } = useStore();
  const sources = getAvailableSources();

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Choose the sources you want to see in your feed. If none are selected, all sources will be shown.
      </Text>

      <FlatList
        data={sources}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.sourceRow}>
            <Text style={styles.sourceName}>{item.name}</Text>
            <Switch
              value={selectedSources.includes(item.id)}
              onValueChange={() => toggleSource(item.id)}
              trackColor={{ false: '#3e3e3e', true: '#3498db' }}
              thumbColor={selectedSources.includes(item.id) ? '#fff' : '#f4f3f4'}
            />
          </View>
        )}
      />

      <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()}>
        <Text style={styles.doneBtnText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  description: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 30,
    lineHeight: 24,
  },
  sourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sourceName: {
    color: '#fff',
    fontSize: 18,
  },
  doneBtn: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  doneBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
