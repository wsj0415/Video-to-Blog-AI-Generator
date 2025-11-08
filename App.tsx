import React, { useState, useCallback } from 'react';
import { BlogStyle, BlogPost, ExtractedFrame } from './types';
import { generateBlogPostFromVideo } from './services/geminiService';
import { extractFramesFromVideo } from './utils';
import { FileUpload } from './components/FileUpload';
import { StyleSelector } from './components/StyleSelector';
import { BlogDisplay } from './components/BlogDisplay';
import { SpinnerIcon } from './components/icons/SpinnerIcon';

const App: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoTopic, setVideoTopic] = useState<string>('');
  const [blogStyle, setBlogStyle] = useState<BlogStyle>(BlogStyle.PROFESSIONAL);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [extractedFrames, setExtractedFrames] = useState<ExtractedFrame[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((file: File) => {
    setVideoFile(file);
    // Auto-populate topic from filename, removing extension
    setVideoTopic(file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "));
    setBlogPost(null);
    setExtractedFrames(null);
    setError(null);
  }, []);

  const handleGenerate = async () => {
    if (!videoFile) {
      setError('Please upload a video file first.');
      return;
    }
    if (!videoTopic.trim()) {
        setError('Please provide a topic for the video.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setBlogPost(null);
    setExtractedFrames(null);

    const messages = [
        "Initializing AI analysis...",
        "Transcribing audio content...",
        "Analyzing key video frames...",
        "Structuring blog content...",
        "Generating final article...",
        "Almost there..."
    ];

    let messageIndex = 0;
    const interval = setInterval(() => {
        setLoadingMessage(messages[messageIndex]);
        messageIndex = (messageIndex + 1) % messages.length;
    }, 2000);
    
    try {
      const result = await generateBlogPostFromVideo(videoTopic, blogStyle);
      setBlogPost(result);
      
      if (result.imageSuggestions?.length > 0 && videoFile) {
        setLoadingMessage('Extracting keyframes...');
        try {
            const frames = await extractFramesFromVideo(videoFile, result.imageSuggestions);
            setExtractedFrames(frames);
        } catch (frameError) {
            console.error("Could not extract frames:", frameError);
            setExtractedFrames(null); // Non-critical error, blog is still viewable
        }
      }

    } catch (err) {
      setError('An error occurred while generating the blog post. Please try again.');
      console.error(err);
    } finally {
      clearInterval(interval);
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleReset = () => {
    setVideoFile(null);
    setVideoTopic('');
    setBlogPost(null);
    setExtractedFrames(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
            Video to Blog AI
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-400">
            Upload your video, and let AI craft a perfect blog post for you.
          </p>
        </header>

        <main>
          {!blogPost && (
            <div className="max-w-2xl mx-auto bg-gray-800/50 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-700">
              <div className="space-y-6">
                <FileUpload onFileChange={handleFileChange} disabled={isLoading} />
                
                <div>
                  <label htmlFor="video-topic" className="block mb-2 text-sm font-medium text-gray-300">
                    Video Topic
                  </label>
                  <input
                    id="video-topic"
                    type="text"
                    value={videoTopic}
                    onChange={(e) => setVideoTopic(e.target.value)}
                    placeholder="e.g., 'Advanced React performance optimization'"
                    disabled={isLoading || !videoFile}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-brand-secondary focus:border-brand-secondary block w-full p-2.5 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">A clear topic helps the AI generate more accurate content.</p>
                </div>

                <StyleSelector selectedStyle={blogStyle} onStyleChange={setBlogStyle} disabled={isLoading} />

                <button
                  onClick={handleGenerate}
                  disabled={!videoFile || isLoading || !videoTopic.trim()}
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-secondary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-brand-secondary disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      <span>{loadingMessage || 'Generating...'}</span>
                    </>
                  ) : (
                    'Generate Blog Post'
                  )}
                </button>
                {error && <p className="text-center text-red-400 mt-2">{error}</p>}
              </div>
            </div>
          )}

          {blogPost && (
            <div className="animate-fade-in">
              <BlogDisplay blogPost={blogPost} extractedFrames={extractedFrames} />
              <div className="text-center mt-8">
                <button
                    onClick={handleReset}
                    className="px-8 py-3 bg-brand-secondary hover:bg-brand-dark text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-brand-light"
                >
                    Analyze Another Video
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
