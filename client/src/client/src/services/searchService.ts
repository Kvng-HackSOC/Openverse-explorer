// client/src/services/searchService.ts
import { get, del } from './apiService';
import { SearchResult, ImageResult, AudioResult } from '../types/media';
import { SearchHistory } from '../types/searchHistory';

interface SearchParams {
  query: string;
  mediaType: string;
  filters: Record<string, string>;
  page?: number;
  pageSize?: number;
}

interface SearchHistoryResponse {
  total: number;
  page: number;
  pageSize: number;
  pages: number;
  history: SearchHistory[];
}

/**
 * Search for media (images and audio) from Openverse
 */
export const searchMedia = async (params: SearchParams): Promise<SearchResult<ImageResult | AudioResult>> => {
  // Build query parameters
  const queryParams = new URLSearchParams();
  queryParams.append('q', params.query);
  queryParams.append('mediaType', params.mediaType);
  
  if (params.page) {
    queryParams.append('page', params.page.toString());
  }
  
  if (params.pageSize) {
    queryParams.append('pageSize', params.pageSize.toString());
  }
  
  // Add filters
  Object.entries(params.filters).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value);
    }
  });
  
  return get<SearchResult<ImageResult | AudioResult>>(`/search?${queryParams.toString()}`);
};

/**
 * Get details for a specific media item
 */
export const getMediaDetails = async (type: string, id: string): Promise<ImageResult | AudioResult> => {
  return get<ImageResult | AudioResult>(`/media/${type}/${id}`);
};

/**
 * Get related media items
 */
export const getRelatedMedia = async (type: string, id: string): Promise<SearchResult<ImageResult | AudioResult>> => {
  return get<SearchResult<ImageResult | AudioResult>>(`/media/${type}/${id}/related`);
};

/**
 * Get user's search history
 */
export const getSearchHistory = async (page: number = 1, pageSize: number = 20): Promise<SearchHistoryResponse> => {
  return get<SearchHistoryResponse>(`/history?page=${page}&pageSize=${pageSize}`);
};

/**
 * Delete a specific search history item
 */
export const deleteSearchHistoryItem = async (id: string): Promise<{ message: string }> => {
  return del<{ message: string }>(`/history/${id}`);
};

/**
 * Clear all search history
 */
export const clearSearchHistory = async (): Promise<{ message: string }> => {
  return del<{ message: string }>('/history');
};

/**
 * Get Openverse API statistics
 */
export const getOpenverseStats = async (): Promise<any> => {
  return get<any>('/stats');
};