// client/src/pages/SearchPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SearchForm, { SearchParams } from '../components/search/SearchForm';
import MediaGrid from '../components/media/MediaGrid';
import { searchMedia } from '../services/searchService';
import { ImageResult, AudioResult } from '../types/media';
import { useAuth } from '../hooks/useAuth';

const SearchPage: React.FC = () => {
  const [results, setResults] = useState<(ImageResult | AudioResult)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Parse search parameters from URL
  const getSearchParamsFromUrl = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || '';
    const mediaType = searchParams.get('mediaType') || 'all';
    const page = parseInt(searchParams.get('page') || '1', 10);
    
    // Extract filters
    const filters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'q' && key !== 'mediaType' && key !== 'page') {
        filters[key] = value;
      }
    });
    
    return {
      query,
      mediaType,
      filters,
      page,
    };
  }, [location.search]);

  // Execute search based on URL parameters
  const executeSearch = useCallback(async (isLoadMore = false) => {
    const { query, mediaType, filters, page } = getSearchParamsFromUrl();
    
    if (!query) return;
    
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setIsLoading(true);
        setResults([]);
      }
      
      setError(null);
      
      const response = await searchMedia({
        query,
        mediaType,
        filters,
        page,
        pageSize: 20,
      });
      
      if (isLoadMore) {
        // Add new results to existing ones
        setResults((prev) => [...prev, ...response.results]);
      } else {
        setResults(response.results);
      }
      
      setTotalResults(response.result_count);
      setHasMore(page < response.page_count);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to load search results. Please try again.');
      toast.error('Search failed. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  }, [getSearchParamsFromUrl]);

  // Initial search on page load or URL change
  useEffect(() => {
    executeSearch();
  }, [location.search, executeSearch]);

  // Handle search form submission
  const handleSearch = (params: SearchParams) => {
    // Update will be handled by the URL change and useEffect
    const searchParams = new URLSearchParams();
    searchParams.set('q', params.query);
    searchParams.set('mediaType', params.mediaType);
    searchParams.set('page', '1');
    
    // Add filters to URL
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      }
    });
    
    navigate({
      pathname: '/search',
      search: searchParams.toString(),
    });
  };

  // Handle loading more results
  const handleLoadMore = () => {
    const { query, mediaType, filters, page } = getSearchParamsFromUrl();
    const nextPage = page + 1;
    
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', nextPage.toString());
    
    navigate({
      pathname: '/search',
      search: searchParams.toString(),
    }, { replace: true });
    
    executeSearch(true);
  };

  // Get current search parameters for form initialization
  const currentParams = getSearchParamsFromUrl();

  return (
    <div className="container mx-auto px-4 py-6">
      <SearchForm
        onSearch={handleSearch}
        initialQuery={currentParams.query}
        initialMediaType={currentParams.mediaType as any}
        initialFilters={currentParams.filters}
        isLoading={isLoading}
      />
      
      {currentParams.query && (
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h2 className="text-xl font-semibold dark:text-white">
              {isLoading ? 'Searching...' : `${totalResults.toLocaleString()} results for "${currentParams.query}"`}
            </h2>
            
            {totalResults > 0 && !isAuthenticated && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-0">
                <a href="/login" className="text-blue-600 hover:underline dark:text-blue-400">
                  Sign in
                </a>{' '}
                to save your searches
              </p>
            )}
          </div>
        </div>
      )}
      
      <MediaGrid
        results={results}
        isLoading={isLoading}
        error={error}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        loadingMore={loadingMore}
      />
    </div>
  );
};

export default SearchPage;