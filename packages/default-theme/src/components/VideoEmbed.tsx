import React, { useState } from 'react';

export interface VideoEmbedProps {
  provider: 'youtube' | 'vimeo' | 'onedrive' | 'googledrive' | 'custom';
  id?: string;
  url?: string;
  title?: string;
  startTime?: number;
  endTime?: number;
  autoplay?: boolean;
  loop?: boolean;
  showControls?: boolean;
  aspectRatio?: '16:9' | '4:3' | '1:1';
}

function getYouTubeEmbedUrl(id: string, startTime?: number, endTime?: number): string {
  const params = new URLSearchParams();
  params.set('embed', id);
  params.set('rel', '0');
  params.set('modestbranding', '1');
  if (startTime) params.set('start', String(startTime));
  if (endTime) params.set('end', String(endTime));
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function getVimeoEmbedUrl(id: string): string {
  return `https://player.vimeo.com/video/${id}?dnt=1`;
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

function getOneDriveEmbedUrl(url: string): string {
  const encodedUrl = encodeURIComponent(url);
  return `https://onedrive.live.com/embed?resid=${encodedUrl}`;
}

function getGoogleDriveEmbedUrl(url: string): string {
  const match = url.match(/\/file\/d\/([^/]+)/);
  if (match) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
}

export function VideoEmbed({
  provider,
  id,
  url,
  title,
  startTime,
  endTime,
  autoplay = false,
  loop = false,
  showControls = true,
  aspectRatio = '16:9',
}: VideoEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const resolvedUrl = (() => {
    if (provider === 'youtube') {
      if (url) {
        const videoId = getYouTubeId(url);
        return videoId ? getYouTubeEmbedUrl(videoId, startTime, endTime) : '';
      }
      return id ? getYouTubeEmbedUrl(id, startTime, endTime) : '';
    }
    if (provider === 'vimeo') {
      if (url) {
        const videoId = getVimeoId(url);
        return videoId ? getVimeoEmbedUrl(videoId) : '';
      }
      return id ? getVimeoEmbedUrl(id) : '';
    }
    if (provider === 'onedrive' && url) {
      return getOneDriveEmbedUrl(url);
    }
    if (provider === 'googledrive' && url) {
      return getGoogleDriveEmbedUrl(url);
    }
    if (provider === 'custom' && url) {
      return url;
    }
    return '';
  })();

  const aspectRatioClass = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
  }[aspectRatio];

  if (!resolvedUrl) {
    return (
      <div className="card my-4 bg-[rgb(var(--error))]/10 border-[rgb(var(--error))]/30">
        <p className="text-[rgb(var(--error))]">Invalid video URL or ID</p>
      </div>
    );
  }

  return (
    <div className="my-6">
      {title && <h4 className="font-semibold mb-2">{title}</h4>}
      <div className={`relative ${aspectRatioClass} rounded-lg overflow-hidden bg-black`}>
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[rgb(var(--bg-tertiary))]">
            <button
              onClick={() => setIsLoaded(true)}
              className="w-16 h-16 rounded-full bg-[rgb(var(--color-primary-500))] text-white flex items-center justify-center hover:bg-[rgb(var(--color-primary-600))] transition-colors"
              aria-label="Load video"
            >
              <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        )}
        {(isLoaded || autoplay) && (
          <iframe
            src={`${resolvedUrl}${resolvedUrl.includes('?') ? '&' : '?'}autoplay=${autoplay}&loop=${loop}&controls=${showControls}`}
            title={title || 'Video player'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            onLoad={() => setIsLoaded(true)}
          />
        )}
      </div>
      <p className="text-xs text-[rgb(var(--text-muted))] mt-2 capitalize">
        {provider === 'youtube' && 'YouTube'}
        {provider === 'vimeo' && 'Vimeo'}
        {provider === 'onedrive' && 'Microsoft OneDrive'}
        {provider === 'googledrive' && 'Google Drive'}
        {provider === 'custom' && 'Video'}
      </p>
    </div>
  );
}

export default VideoEmbed;
