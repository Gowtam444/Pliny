import * as rssParser from 'react-native-rss-parser';
import axios from 'axios';
import { decode } from 'html-entities';

const SOURCES = [
  { id: 'google_news', name: 'Google News', url: 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en' },
  { id: 'techcrunch', name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
  { id: 'wired', name: 'Wired', url: 'https://www.wired.com/feed/rss' },
  { id: 'reddit_til', name: 'Reddit TIL', url: 'https://www.reddit.com/r/todayilearned/.rss' },
  { id: 'reddit_science', name: 'Reddit Science', url: 'https://www.reddit.com/r/science/.rss' },
];

export const fetchFeeds = async (selectedSources = []) => {
  const sourcesToFetch = selectedSources.length > 0
    ? SOURCES.filter(s => selectedSources.includes(s.id))
    : SOURCES;

  const allItems = [];

  for (const source of sourcesToFetch) {
    try {
      const response = await axios.get(source.url, { timeout: 10000 });
      const parsedData = await rssParser.parse(response.data);

      const items = parsedData.items.map(item => ({
        id: item.id || item.links[0]?.url || Math.random().toString(),
        title: decode(item.title),
        description: decode(item.description).replace(/<[^>]+>/g, ''), // Strip HTML
        url: item.links[0]?.url || item.id,
        sourceName: source.name,
        sourceId: source.id,
        publishedAt: item.published ? new Date(item.published) : new Date(),
        imageUrl: extractImage(item),
      }));

      allItems.push(...items);
    } catch (error) {
      console.error(`Error fetching feed ${source.name}:`, error);
    }
  }

  // Sort by newest first
  return allItems.sort((a, b) => b.publishedAt - a.publishedAt);
};

const extractImage = (item) => {
  if (item.enclosures && item.enclosures.length > 0) {
    return item.enclosures[0].url;
  }

  // Try to find image in description HTML
  const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
  if (imgMatch) {
    return imgMatch[1];
  }

  // Fallback placeholder based on source
  return null;
};

export const getAvailableSources = () => SOURCES;
