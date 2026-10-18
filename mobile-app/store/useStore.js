import { create } from 'zustand';
import { fetchFeeds } from '../utils/feedUtils';

const useStore = create((set, get) => ({
  articles: [],
  selectedSources: [],
  isLoading: false,
  error: null,

  toggleSource: (sourceId) => {
    set((state) => {
      const newSources = state.selectedSources.includes(sourceId)
        ? state.selectedSources.filter(id => id !== sourceId)
        : [...state.selectedSources, sourceId];
      return { selectedSources: newSources };
    });
    // Re-fetch when sources change
    get().loadArticles();
  },

  loadArticles: async () => {
    set({ isLoading: true, error: null });
    try {
      const { selectedSources } = get();
      const newArticles = await fetchFeeds(selectedSources);

      // Simple local ranking/curation could go here
      // For now, feedUtils already sorts by newest.
      // A more advanced ranking could bump up items matching user interests locally.
      const rankedArticles = rankArticlesLocally(newArticles);

      set({ articles: rankedArticles, isLoading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load articles', isLoading: false });
    }
  },
}));

// Basic Local AI / Algorithmic Ranking
// In a real app we might store user 'likes' and rank articles containing matching keywords higher.
const rankArticlesLocally = (articles) => {
  // Currently just relies on chronological sorting (newest first)
  // But this is the hook where TFJS or a local keyword scoring algorithm would go.
  return articles;
};

export default useStore;
