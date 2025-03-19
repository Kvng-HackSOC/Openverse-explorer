// client/src/types/media.ts

// Media types
export type MediaType = 'image' | 'audio' | 'video' | 'all';

// Base interface for all media results
interface MediaResultBase {
  id: string;
  title: string;
  creator: string;
  creator_url: string;
  tags: { name: string }[];
  url: string;
  thumbnail: string;
  source: string;
  license: string;
  license_version: string;
  license_url: string;
  foreign_landing_url: string;
  detail_url: string;
  related_url: string;
  attribution: string;
  filesize: number;
  filetype: string;
}

// Image result interface
export interface ImageResult extends MediaResultBase {
  width: number;
  height: number;
}

// Audio result interface
export interface AudioResult extends MediaResultBase {
  duration: number;
  bit_rate: number;
  sample_rate: number;
  genres: string[];
  waveform: string;
}

// Search result interface
export interface SearchResult<T> {
  result_count: number;
  page_count: number;
  page_size: number;
  page: number;
  results: T[];
}