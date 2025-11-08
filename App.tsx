import React, { useState, useCallback } from 'react';
import { BlogStyle, BlogPost, ExtractedFrame } from './types';
import { generateBlogPostFromVideo } from './services/geminiService';
import { extractFramesFromVideo, formatBlogPostAsMarkdown } from './utils';
import { FileUpload } from './components/FileUpload';
import { StyleSelector } from './components/StyleSelector';
import { BlogDisplay } from './components/BlogDisplay';
import { SpinnerIcon } from './components/icons/SpinnerIcon';
import { CopyIcon } from './components/icons/CopyIcon';
import { CheckIcon } from './components/icons/CheckIcon';

const sampleBlogPost: BlogPost = {
  title: "Unlocking the Power of a Morning Routine",
  summary: "Discover how a structured morning routine can revolutionize your productivity, reduce stress, and set a positive tone for your entire day. This post breaks down the key components of an effective morning ritual based on scientific principles.",
  body: "## Why Mornings Matter\nThe first few hours of your day set the stage for everything that follows. A well-designed morning routine helps you start with intention, rather than reacting to the demands of the world. It's about taking control of your time and energy before distractions take over.\n\n### The 'SAVERS' Method\nA popular framework for a successful morning routine is the 'SAVERS' acronym:\n\n- **S**ilence: Start with a few minutes of quiet meditation or deep breathing.\n- **A**ffirmations: Reinforce your goals and positive mindset.\n- **V**isualization: Imagine your perfect day unfolding.\n- **E**xercise: Even a short 10-minute workout can boost your energy.\n- **R**eading: Consume a few pages of an inspiring book.\n- **S**cribing: Write down your thoughts, goals, or things you're grateful for.\n\n> The key is not to do everything every day, but to create a consistent practice that works for you. Start small and build from there.",
  keyPoints: [
    "A morning routine reduces stress and increases focus throughout the day.",
    "The 'SAVERS' method provides a simple, structured framework.",
    "Consistency is more important than duration, especially when starting out.",
    "Personalize your routine to align with your own goals and lifestyle."
  ],
  timestamps: [
    { time: "00:45", description: "Introduction to the core concept of 'winning the morning'." },
    { time: "01:30", description: "Detailed breakdown of the 'Silence' and 'Affirmations' steps." },
    { time: "03:15", description: "Visual example of a simple 10-minute morning exercise routine." }
  ],
  imageSuggestions: [
    { time: "00:55", description: "A person meditating peacefully as the sun rises." },
    { time: "02:10", description: "A close-up shot of a person writing in a journal." },
    { time: "03:45", description: "An infographic summarizing the 'SAVERS' method." }
  ]
};

const sampleExtractedFrames: ExtractedFrame[] = [
    { time: "00:55", description: "A person meditating peacefully as the sun rises.", imageDataUrl: "https://placehold.co/600x400/1e3a8a/dbeafe?text=Meditation" },
    { time: "02:10", description: "A close-up shot of a person writing in a journal.", imageDataUrl: "https://placehold.co/600x400/1e3a8a/dbeafe?text=Journaling" },
    { time: "03:45", description: "An infographic summarizing the 'SAVERS' method.", imageDataUrl: "https://placehold.co/600x400/1e3a8a/dbeafe?text=SAVERS" }
];


const App: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoTopic, setVideoTopic] = useState<string>('');
  const [blogStyle, setBlogStyle] = useState<BlogStyle>(BlogStyle.PROFESSIONAL);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [extractedFrames, setExtractedFrames] = useState<ExtractedFrame[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleFileChange = useCallback((file: File) => {
    setVideoFile(file);
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
            setExtractedFrames(null);
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
  
  const handleShowDemo = () => {
    setBlogPost(sampleBlogPost);
    setExtractedFrames(sampleExtractedFrames);
    setError(null);
    setIsLoading(false);
  };

  const handleCopyToClipboard = () => {
    if (!blogPost) return;
    const markdown = formatBlogPostAsMarkdown(blogPost);
    navigator.clipboard.writeText(markdown).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
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

                <div className="flex flex-col sm:flex-row gap-4">
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
                   <button
                    onClick={handleShowDemo}
                    disabled={isLoading}
                    className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 disabled:opacity-50 transition-colors"
                  >
                    See an example
                  </button>
                </div>
                {error && <p className="text-center text-red-400 mt-2">{error}</p>}
              </div>
            </div>
          )}

          {blogPost && (
            <div className="animate-fade-in">
              <BlogDisplay blogPost={blogPost} extractedFrames={extractedFrames} />
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-8 py-3 bg-brand-secondary hover:bg-brand-dark text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-brand-light"
                >
                    Analyze Another Video
                </button>
                <button
                    onClick={handleCopyToClipboard}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500"
                >
                  {isCopied ? (
                    <>
                      <CheckIcon className="w-5 h-5 text-green-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="w-5 h-5" />
                      <span>Copy as Markdown</span>
                    </>
                  )}
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
