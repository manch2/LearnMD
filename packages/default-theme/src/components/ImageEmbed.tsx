import React, { useState } from 'react';

export interface ImageEmbedProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number | string;
  height?: number | string;
  rounded?: boolean;
  shadow?: boolean;
  zoomable?: boolean;
  fallbackSrc?: string;
}

export function ImageEmbed({
  src,
  alt,
  caption,
  width,
  height,
  rounded = true,
  shadow = true,
  zoomable = true,
  fallbackSrc,
}: ImageEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleError = () => {
    if (fallbackSrc && !hasError) {
      setHasError(true);
    } else {
      setHasError(true);
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const displaySrc = hasError && fallbackSrc ? fallbackSrc : src;

  const imageClasses = `
    ${rounded ? 'rounded-lg' : ''}
    ${shadow ? 'shadow-md' : ''}
    ${isLoading ? 'opacity-0' : 'opacity-100'}
    transition-opacity duration-300
  `;

  return (
    <>
      <figure className="my-6">
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[rgb(var(--bg-tertiary))] rounded-lg">
              <div className="w-8 h-8 border-4 border-[rgb(var(--color-primary-500))] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {hasError ? (
            <div className="flex flex-col items-center justify-center p-8 bg-[rgb(var(--bg-tertiary))] rounded-lg text-[rgb(var(--text-muted))]">
              <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm">Failed to load image</span>
            </div>
          ) : (
            <img
              src={displaySrc}
              alt={alt}
              width={width}
              height={height}
              className={`${imageClasses} ${zoomable ? 'cursor-zoom-in' : ''}`}
              onClick={() => zoomable && setIsZoomed(true)}
              onLoad={handleLoad}
              onError={handleError}
            />
          )}
        </div>
        {caption && (
          <figcaption className="text-center text-sm text-[rgb(var(--text-muted))] mt-2">
            {caption}
          </figcaption>
        )}
      </figure>

      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={displaySrc}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
          <button
            className="absolute top-4 right-4 text-white hover:text-[rgb(var(--text-secondary))] transition-colors"
            onClick={() => setIsZoomed(false)}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}

export interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  columns?: 2 | 3 | 4;
}

export function ImageGallery({ images, columns = 3 }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  return (
    <>
      <div className={`grid ${gridCols[columns]} gap-4 my-6`}>
        {images.map((image) => (
          <ImageEmbed
            key={image.src}
            src={image.src}
            alt={image.alt}
            caption={image.caption}
            zoomable
          />
        ))}
      </div>

      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={images[selectedImage].src}
            alt={images[selectedImage].alt}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
          {images[selectedImage].caption && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-lg text-white text-sm">
              {images[selectedImage].caption}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ImageEmbed;
