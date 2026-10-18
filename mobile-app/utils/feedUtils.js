import * as rssParser from 'react-native-rss-parser';
import axios from 'axios';
import { decode } from 'html-entities';

const SOURCES = [
  { id: 'google_news', name: 'Google News', url: 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en' },
  { id: 'techcrunch', name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
  { id: 'wired', name: 'Wired', url: 'https://www.wired.com/feed/rss' },
  { id: 'reddit_science', name: 'Reddit Science', url: 'https://www.reddit.com/r/science/.rss' },
];

export const fetchFeeds = async (selectedSources = []) => {
  const sourcesToFetch = selectedSources.length > 0
    ? SOURCES.filter(s => selectedSources.includes(s.id))
    : SOURCES;

  const allItems = [];

  for (const source of sourcesToFetch) {
    try {
      // Adding standard headers to bypass bot protection/429 errors
      const response = await axios.get(source.url, {
        timeout: 10000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      const parsedData = await rssParser.parse(response.data);

      const items = parsedData.items.map(item => ({
        id: item.id || item.links[0]?.url || Math.random().toString(),
        title: decode(item.title),
        description: decode(item.description || '').replace(/<[^>]+>/g, ''), // Strip HTML
        url: item.links[0]?.url || item.id,
        sourceName: source.name,
        sourceId: source.id,
        publishedAt: item.published ? new Date(item.published) : new Date(),
        imageUrl: extractImage(item),
      }));

      allItems.push(...items);
    } catch (error) {
      console.warn(`Error fetching feed ${source.name}:`, error.message);
    }
  }

  // Sort by newest first
  return allItems.sort((a, b) => b.publishedAt - a.publishedAt);
};

const extractImage = (item) => {
  if (item.enclosures && item.enclosures.length > 0) {
    return item.enclosures[0].url;
  }

  if (item.description) {
    // Try to find image in description HTML
    const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
      return imgMatch[1];
    }
  }

  // Fallback placeholder based on source
  return null;
};

export const getAvailableSources = () => SOURCES;
