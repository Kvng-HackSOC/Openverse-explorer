// client/src/types/searchHistory.ts
import { MediaType } from './media';

// Search history interface
export interface SearchHistory {
  id: string;
  userId: string;
  query: string;
  filters: Record<string, string>;
  mediaType: MediaType;
  resultCount: number;
  createdAt: string;
  updatedAt: string;
}