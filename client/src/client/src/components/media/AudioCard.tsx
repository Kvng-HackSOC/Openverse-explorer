// client/src/components/media/AudioCard.tsx
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiPause, FiMusic, FiExternalLink, FiDownload } from 'react-icons/fi';
import { AudioResult } from '../../types/media';

interface AudioCardProps {
  audio: AudioResult;
}

const AudioCard: React.FC<AudioCardProps> = ({ audio }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Format duration in MM:SS
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        setError('Could not play audio');
        console.error('Audio playback error:', err);
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = audio.url;
    link.download = audio.title || `audio-${audio.id}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-200">
      <Link to={`/media/audio/${audio.id}`} className="block relative">
        {/* Audio player (hidden) */}
        <audio
          ref={audioRef}
          src={audio.url}
          onCanPlay={() => setIsLoaded(true)}
          onEnded={() => setIsPlaying(false)}
          onError={() => setError('Could not load audio')}
          preload="metadata"
        />

        {/* Audio visual representation */}
        <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          {audio.thumbnail ? (
            <img
              src={audio.thumbnail}
              alt={audio.title || 'Audio thumbnail'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-gray-500 dark:text-gray-400">
              <FiMusic size={32} className="mb-2" />
              {audio.waveform ? (
                <img
                  src={audio.waveform}
                  alt="Audio waveform"
                  className="w-full h-12 mt-2"
                />
              ) : (
                <div className="w-full h-8 bg-gray-200 dark:bg-gray-600 rounded mt-2">
                  {/* Simple waveform visualization */}
                  <div className="flex h-full items-end justify-around px-1">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-blue-500 dark:bg-blue-400 rounded-t"
                        style={{
                          height: `${Math.random() * 80 + 20}%`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Play/pause button overlay */}
          <button
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 text-white transition-all duration-200"
            onClick={handlePlayPause}
            disabled={!isLoaded && !error}
          >
            {!isLoaded && !error ? (
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : error ? (
              <div className="text-sm bg-red-500 bg-opacity-80 px-3 py-1 rounded">{error}</div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-white bg-opacity-80 flex items-center justify-center text-gray-900">
                {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} className="ml-1" />}
              </div>
            )}
          </button>

          {/* Duration badge */}
          {audio.duration && !error && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {formatDuration(audio.duration)}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={handleDownload}
            className="p-2 bg-black bg-opacity-70 rounded-full text-white hover:bg-opacity-90 transition-opacity duration-200"
            title="Download audio"
          >
            <FiDownload size={16} />
          </button>
          
          <a
            href={audio.foreign_landing_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-black bg-opacity-70 rounded-full text-white hover:bg-opacity-90 transition-opacity duration-200"
            title="View original source"
            onClick={(e) => e.stopPropagation()}
          >
            <FiExternalLink size={16} />
          </a>
        </div>
      </Link>

      {/* Audio info */}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1" title={audio.title}>
          {audio.title || 'Untitled'}
        </h3>
        
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1" title={`Creator: ${audio.creator}`}>
          By {audio.creator || 'Unknown'}
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {audio.tags?.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded"
            >
              {tag.name}
            </span>
          ))}
        </div>
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {audio.license}
          {audio.bit_rate ? ` • ${Math.round(audio.bit_rate / 1000)} kbps` : ''}
        </div>
      </div>
    </div>
  );
};

export default AudioCard;