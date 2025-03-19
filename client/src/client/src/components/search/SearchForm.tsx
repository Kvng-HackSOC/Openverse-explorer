// client/src/components/search/SearchForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { MediaType } from '../../types/media';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  initialQuery?: string;
  initialMediaType?: MediaType;
  initialFilters?: Record<string, string>;
  isLoading?: boolean;
}

export interface SearchParams {
  query: string;
  mediaType: MediaType;
  filters: Record<string, string>;
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  initialQuery = '',
  initialMediaType = 'all',
  initialFilters = {},
  isLoading = false,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [mediaType, setMediaType] = useState<MediaType>(initialMediaType);
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Update form state when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    const urlQuery = searchParams.get('q') || '';
    const urlMediaType = searchParams.get('mediaType') as MediaType || 'all';
    
    // Extract filters from URL
    const urlFilters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'q' && key !== 'mediaType' && key !== 'page') {
        urlFilters[key] = value;
      }
    });
    
    setQuery(urlQuery);
    setMediaType(urlMediaType);
    setFilters(urlFilters);
  }, [location.search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Skip empty searches
    if (!query.trim()) return;
    
    // Update URL parameters
    const searchParams = new URLSearchParams();
    searchParams.set('q', query);
    searchParams.set('mediaType', mediaType);
    
    // Add filters to URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      }
    });
    
    // Navigate to search page with query parameters
    navigate({
      pathname: '/search',
      search: searchParams.toString(),
    });
    
    // Execute search
    onSearch({
      query,
      mediaType,
      filters,
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-2">
          {/* Search input */}
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for images, audio..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              data-testid="search-input"
            />
          </div>

          {/* Media type selector */}
          <div className="flex-shrink-0">
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value as MediaType)}
              className="w-full md:w-auto px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              data-testid="media-type-select"
            >
              <option value="all">All Media</option>
              <option value="image">Images</option>
              <option value="audio">Audio</option>
            </select>
          </div>

          {/* Filter toggle button */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex-shrink-0 flex items-center justify-center px-4 py-2 border rounded-md focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-white"
            data-testid="filter-toggle"
          >
            <FiFilter className="mr-2" /> Filters
          </button>

          {/* Search button */}
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="flex-shrink-0 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="search-button"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Filter options */}
        {showFilters && (
          <div className="mt-4 p-4 border rounded-md dark:border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium dark:text-white">Advanced Filters</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* License type filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  License Type
                </label>
                <select
                  value={filters.licenseType || ''}
                  onChange={(e) => handleFilterChange('licenseType', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Any License</option>
                  <option value="commercial">Commercial Use</option>
                  <option value="modification">Allows Modification</option>
                  <option value="cc0">CC0 / Public Domain</option>
                </select>
              </div>

              {/* Image specific filters */}
              {(mediaType === 'image' || mediaType === 'all') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Image Size
                    </label>
                    <select
                      value={filters.size || ''}
                      onChange={(e) => handleFilterChange('size', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Any Size</option>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Aspect Ratio
                    </label>
                    <select
                      value={filters.aspectRatio || ''}
                      onChange={(e) => handleFilterChange('aspectRatio', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Any Ratio</option>
                      <option value="tall">Tall</option>
                      <option value="wide">Wide</option>
                      <option value="square">Square</option>
                    </select>
                  </div>
                </>
              )}

              {/* Source filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Source
                </label>
                <input
                  type="text"
                  value={filters.source || ''}
                  onChange={(e) => handleFilterChange('source', e.target.value)}
                  placeholder="e.g. Flickr, Wikimedia"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Creator filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Creator
                </label>
                <input
                  type="text"
                  value={filters.creator || ''}
                  onChange={(e) => handleFilterChange('creator', e.target.value)}
                  placeholder="Creator name"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Tags filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={filters.tags || ''}
                  onChange={(e) => handleFilterChange('tags', e.target.value)}
                  placeholder="Comma separated tags"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchForm;