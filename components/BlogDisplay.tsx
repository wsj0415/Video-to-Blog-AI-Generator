import React from 'react';
import { BlogPost, Timestamp, ImageSuggestion, ExtractedFrame } from '../types';

interface BlogDisplayProps {
  blogPost: BlogPost;
  extractedFrames: ExtractedFrame[] | null;
}

const TimeStampCard: React.FC<{ item: Timestamp }> = ({ item }) => (
  <div className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg">
    <div className="flex-shrink-0 bg-blue-900/80 text-brand-light font-mono text-sm rounded-md px-2 py-1">
      {item.time}
    </div>
    <p className="text-gray-300">{item.description}</p>
  </div>
);

const ImageSuggestionCard: React.FC<{ item: ImageSuggestion }> = ({ item }) => (
    <div className="flex items-start space-x-3 p-4 bg-gray-800 border border-dashed border-gray-600 rounded-lg">
        <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
        <div>
            <p className="font-semibold text-brand-light">Frame at {item.time}</p>
            <p className="text-gray-400 text-sm">{item.description}</p>
        </div>
    </div>
);

const ImageFrameCard: React.FC<{ item: ExtractedFrame }> = ({ item }) => (
    <div className="flex flex-col space-y-3 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-md transition-transform transform hover:scale-105">
        <img src={item.imageDataUrl} alt={item.description} className="rounded-md object-cover w-full aspect-video" />
        <div className="text-center px-1">
            <p className="font-semibold text-brand-light text-sm">Frame at {item.time}</p>
            <p className="text-gray-400 text-xs leading-tight">{item.description}</p>
        </div>
    </div>
);


export const BlogDisplay: React.FC<BlogDisplayProps> = ({ blogPost, extractedFrames }) => {
  // A simple markdown to HTML converter for body text
  const renderMarkdown = (text: string) => {
    // Basic bold and italic
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-3">$1</h2>');
    // Newlines
    html = html.replace(/\n/g, '<br />');
    return { __html: html };
  };

  const showExtractedFrames = extractedFrames && extractedFrames.length > 0;
  const showImageSuggestions = !showExtractedFrames && blogPost.imageSuggestions.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-800/50 rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-700 animate-fade-in">
      <article className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
          {blogPost.title}
        </h1>
        
        <div className="mt-8 mb-10 p-5 bg-gray-900/70 rounded-xl border border-gray-700">
          <h2 className="text-xl font-bold text-brand-light mb-2">Summary</h2>
          <p className="text-gray-300">{blogPost.summary}</p>
        </div>

        <div className="text-gray-300 leading-relaxed space-y-4" dangerouslySetInnerHTML={renderMarkdown(blogPost.body)} />

        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-brand-light border-b-2 border-brand-primary pb-2">Key Points</h2>
            <ul className="list-disc list-inside space-y-3 pl-2">
                {blogPost.keyPoints.map((point, index) => (
                    <li key={index} className="text-gray-300">{point}</li>
                ))}
            </ul>
        </div>
        
        {showExtractedFrames && (
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4 text-brand-light border-b-2 border-brand-primary pb-2">Key Frames</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {extractedFrames.map((frame, index) => (
                        <ImageFrameCard key={index} item={frame} />
                    ))}
                </div>
            </div>
        )}
        
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-brand-light border-b-2 border-brand-primary pb-2">Timestamped Notes</h2>
            <div className="space-y-4">
                {blogPost.timestamps.map((ts, index) => (
                    <TimeStampCard key={index} item={ts} />
                ))}
            </div>
        </div>
        
        {showImageSuggestions && (
             <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4 text-brand-light border-b-2 border-brand-primary pb-2">Image Suggestions</h2>
                <div className="space-y-4">
                    {blogPost.imageSuggestions.map((img, index) => (
                        <ImageSuggestionCard key={index} item={img} />
                    ))}
                </div>
            </div>
        )}

      </article>
    </div>
  );
};
