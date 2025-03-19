// client/src/components/media/ImageCard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiExternalLink, FiInfo, FiDownload } from 'react-icons/fi';
import { ImageResult } from '../../types/media';

interface ImageCardProps {
  image: ImageResult;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.title || `image-${image.id}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-200">
      <Link to={`/media/image/${image.id}`} className="block relative">
        {/* Image placeholder and loading state */}
        <div 
          className={`aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 ${isLoaded ? 'hidden' : 'block'}`}
          style={{ minHeight: '160px' }}
        >
          {!isError && (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {isError && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <FiInfo size={24} className="mb-2" />
              <span className="text-sm">Image unavailable</span>
            </div>
          )}
        </div>

        {/* Actual image */}
        <img
          src={image.thumbnail || image.url}
          alt={image.title || 'Untitled image'}
          className={`w-full h-auto object-cover ${isLoaded ? 'block' : 'hidden'}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setIsError(true);
            setIsLoaded(true); // Show error state instead of loading spinner
          }}
        />

        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="p-2 bg-white rounded-full text-gray-800 hover:bg-blue-500 hover:text-white transition-colors duration-200"
              title="Download image"
            >
              <FiDownload size={18} />
            </button>
            <a
              href={image.foreign_landing_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white rounded-full text-gray-800 hover:bg-blue-500 hover:text-white transition-colors duration-200"
              title="View original source"
              onClick={(e) => e.stopPropagation()}
            >
              <FiExternalLink size={18} />
            </a>
          </div>
        </div>
      </Link>

      {/* Image info */}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1" title={image.title}>
          {image.title || 'Untitled'}
        </h3>
        
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1" title={`Creator: ${image.creator}`}>
          By {image.creator || 'Unknown'}
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {image.tags?.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded"
            >
              {tag.name}
            </span>
          ))}
        </div>
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {image.license} • {image.width}×{image.height}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;