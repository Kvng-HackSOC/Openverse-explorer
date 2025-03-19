// client/src/components/media/MediaGrid.tsx
import React from 'react';
import { ImageResult, AudioResult } from '../../types/media';
import ImageCard from './ImageCard';
import AudioCard from './AudioCard';
import LoadingSpinner from '../layout/LoadingSpinner';

interface MediaGridProps {
  results: (ImageResult | AudioResult)[];
  isLoading: boolean;
  error: string | null;
  onLoadMore?: () => void;
  hasMore: boolean;
  loadingMore: boolean;
}

// Function to determine if result is an image
const isImageResult = (result: ImageResult | AudioResult): result is ImageResult => {
  return 'width' in result && 'height' in result;
};

const MediaGrid: React.FC<MediaGridProps> = ({
  results,
  isLoading,
  error,
  onLoadMore,
  hasMore,
  loadingMore,
}) => {
  if (isLoading && results.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && results.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">Error loading results</div>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2 dark:text-white">No results found</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your search terms or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((result) => (
          <div key={`${result.id}-${isImageResult(result) ? 'image' : 'audio'}`}>
            {isImageResult(result) ? (
              <ImageCard image={result} />
            ) : (
              <AudioCard audio={result} />
            )}
          </div>
        ))}
      </div>

      {/* Load more button */}
      {(hasMore || loadingMore) && (
        <div className="flex justify-center mt-8 pb-8">
          {loadingMore ? (
            <LoadingSpinner />
          ) : (
            <button
              onClick={onLoadMore}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!hasMore || loadingMore}
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaGrid;