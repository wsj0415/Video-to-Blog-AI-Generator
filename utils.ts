import { ImageSuggestion, ExtractedFrame, BlogPost } from './types';

const parseTimestamp = (time: string): number => {
    const parts = time.split(':').map(Number);
    if (parts.length === 2) { // MM:SS
        return parts[0] * 60 + parts[1];
    }
    if (parts.length === 1) { // SS
        return parts[0];
    }
    return NaN;
};

export const extractFramesFromVideo = (
    videoFile: File,
    suggestions: ImageSuggestion[]
): Promise<ExtractedFrame[]> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return reject(new Error('Canvas context could not be created.'));
        }

        const objectUrl = URL.createObjectURL(videoFile);
        video.src = objectUrl;

        video.onloadedmetadata = async () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const extractedFrames: ExtractedFrame[] = [];
            
            // Process frames sequentially to avoid race conditions on a single video element
            for (const suggestion of suggestions) {
                const timeInSeconds = parseTimestamp(suggestion.time);
                if (isNaN(timeInSeconds) || timeInSeconds > video.duration) {
                    console.warn(`Skipping invalid or out-of-bounds timestamp: ${suggestion.time}`);
                    continue;
                }

                try {
                    const frame = await new Promise<ExtractedFrame>((resolveFrame, rejectFrame) => {
                        const onSeeked = () => {
                            video.removeEventListener('seeked', onSeeked);
                            video.removeEventListener('error', onError);
                            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                            const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                            resolveFrame({ ...suggestion, imageDataUrl });
                        };
                        const onError = () => {
                             video.removeEventListener('seeked', onSeeked);
                             video.removeEventListener('error', onError);
                             rejectFrame(new Error('Error seeking video to timestamp.'));
                        }
                        
                        video.addEventListener('seeked', onSeeked);
                        video.addEventListener('error', onError);
                        video.currentTime = timeInSeconds;
                    });
                    extractedFrames.push(frame);
                } catch (error) {
                    console.error(`Failed to extract frame at ${suggestion.time}`, error);
                }
            }

            URL.revokeObjectURL(objectUrl);
            resolve(extractedFrames);
        };

        video.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to load video file.'));
        };
    });
};

export const formatBlogPostAsMarkdown = (blogPost: BlogPost): string => {
  let markdown = '';

  markdown += `# ${blogPost.title}\n\n`;

  markdown += `## Summary\n${blogPost.summary}\n\n`;

  // Body is already in Markdown, so we just add it.
  markdown += `${blogPost.body}\n\n`;

  markdown += `## Key Points\n`;
  blogPost.keyPoints.forEach(point => {
    markdown += `- ${point}\n`;
  });
  markdown += `\n`;

  markdown += `## Timestamped Notes\n`;
  blogPost.timestamps.forEach(ts => {
    markdown += `- **${ts.time}**: ${ts.description}\n`;
  });
  markdown += `\n`;

  return markdown.trim();
};
