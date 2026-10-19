import * as rssParser from 'react-native-rss-parser';
import axios from 'axios';
import { decode } from 'html-entities';
import { Platform } from 'react-native';

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
      // Due to public CORS proxy instability and aggressive rate limiting on web,
      // fall back directly to the source if web proxy attempts fail. Note: On a real production
      // web deployment, you must host your own simple reverse proxy server (e.g. via Next.js API route,
      // Express, or Cloudflare worker) rather than relying on public corsproxy/allorigins.
      const targetUrl = Platform.OS === 'web'
        ? `https://api.allorigins.win/raw?url=${encodeURIComponent(source.url)}`
        : source.url;

      let response;
      try {
        response = await axios.get(targetUrl, {
          timeout: 20000,
          headers: {
              'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
        });
      } catch (proxyError) {
         if (Platform.OS === 'web') {
           // Fallback to direct request (this works if user has a CORS unblocker extension, or if
           // source allows it, although it may still fail due to strict browser CORS policies)
           console.warn(`Proxy failed for ${source.name}, attempting direct fetch...`);
           response = await axios.get(source.url, { timeout: 15000 });
         } else {
           throw proxyError;
         }
      }

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
    const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
      return imgMatch[1];
    }
  }

  return null;
};

export const getAvailableSources = () => SOURCES;
