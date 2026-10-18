import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, RefreshControl, TouchableOpacity, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import useStore from '../store/useStore';

const { width, height } = Dimensions.get('window');

const ArticleCard = ({ item }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <Text style={styles.sourceText}>{item.sourceName}</Text>
          <Text style={styles.timeText}>
            {item.publishedAt.toLocaleDateString()} {item.publishedAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Text>
        </View>
        <Text style={styles.title} numberOfLines={3}>{item.title}</Text>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
        ) : null}
        <Text style={styles.description} numberOfLines={item.imageUrl ? 6 : 12}>{item.description}</Text>
        <TouchableOpacity style={styles.readMoreBtn} onPress={() => Linking.openURL(item.url)}>
          <Text style={styles.readMoreText}>Read Full Article</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function FeedScreen() {
  const router = useRouter();
  const { articles, isLoading, loadArticles } = useStore();

  useEffect(() => {
    loadArticles();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.topBar}>
        <Text style={styles.logo}>Discover</Text>
        <TouchableOpacity onPress={() => router.push('/sources')}>
          <Text style={styles.settingsIcon}>⚙️ Sources</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ArticleCard item={item} />}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadArticles} tintColor="#fff" />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isLoading ? 'Loading fresh content...' : 'No articles found. Try adjusting your sources.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1a1a1a',
  },
  logo: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsIcon: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
  cardContainer: {
    height: height - 120, // Approximate height minus topbar and safe area
    width: width,
    padding: 20,
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sourceText: {
    color: '#3498db',
    fontWeight: 'bold',
    fontSize: 14,
  },
  timeText: {
    color: '#888',
    fontSize: 12,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    lineHeight: 32,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  description: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  readMoreBtn: {
    marginTop: 'auto',
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  readMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});
