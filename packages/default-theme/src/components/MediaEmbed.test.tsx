import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VideoEmbed } from './VideoEmbed';
import { ImageEmbed } from './ImageEmbed';

describe('VideoEmbed', () => {
  it('renders an error state for invalid inputs', () => {
    render(<VideoEmbed provider="custom" />);
    expect(screen.getByText('Invalid video URL or ID')).toBeInTheDocument();
  });

  it('loads the iframe when the video is activated', () => {
    render(<VideoEmbed provider="youtube" url="https://youtu.be/dQw4w9WgXcQ" title="Demo" />);
    fireEvent.click(screen.getByLabelText('Load video'));
    expect(screen.getByTitle('Demo')).toBeInTheDocument();
  });
});

describe('ImageEmbed', () => {
  it('renders an image with caption and can zoom it', () => {
    render(<ImageEmbed src="/diagram.png" alt="Diagram" caption="System diagram" />);

    const image = screen.getByAltText('Diagram');
    fireEvent.load(image);
    fireEvent.click(image);

    expect(screen.getByText('System diagram')).toBeInTheDocument();
  });

  it('renders the error state when the image fails to load', () => {
    render(<ImageEmbed src="/broken.png" alt="Broken" />);
    fireEvent.error(screen.getByAltText('Broken'));
    expect(screen.getByText('Failed to load image')).toBeInTheDocument();
  });
});
