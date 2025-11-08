
import { GoogleGenAI, Type } from "@google/genai";
import { BlogStyle, BlogPost } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const blogPostSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "An attractive and SEO-friendly title for the blog post."
        },
        summary: {
            type: Type.STRING,
            description: "A concise summary (2-4 sentences) of the video's core message."
        },
        body: {
            type: Type.STRING,
            description: "The main content of the blog post, well-structured with paragraphs, converting the video's content into clear, engaging text. Use Markdown for formatting like headers, bold text, and lists."
        },
        keyPoints: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING
            },
            description: "A list of the most important takeaways or bullet points from the video."
        },
        timestamps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    time: { type: Type.STRING, description: "The timestamp in MM:SS format." },
                    description: { type: Type.STRING, description: "A brief description of the key event at that time." }
                },
                required: ['time', 'description']
            },
            description: "An array of important moments in the video with their corresponding timestamps."
        },
        imageSuggestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    time: { type: Type.STRING, description: "The timestamp in MM:SS format for a suggested image." },
                    description: { type: Type.STRING, description: "A description of the suggested keyframe (e.g., 'A diagram of the component lifecycle')." }
                },
                required: ['time', 'description']
            },
            description: "An array of suggestions for keyframes from the video to use as illustrations in the blog post."
        }
    },
    required: ['title', 'summary', 'body', 'keyPoints', 'timestamps', 'imageSuggestions']
};

export const generateBlogPostFromVideo = async (
  videoTopic: string,
  blogStyle: BlogStyle
): Promise<BlogPost> => {
  const prompt = `
    You are an expert content creator specializing in converting video content into engaging blog posts.
    I have a video about "${videoTopic}".
    Please generate a comprehensive blog post in a '${blogStyle}' tone.
    The blog post must be structured as a JSON object that strictly follows the provided schema.
    It should include:
    1. A catchy title.
    2. A brief summary.
    3. A detailed body with markdown formatting.
    4. A list of key takeaways.
    5. At least 3-4 timestamped references to important moments.
    6. At least 2-3 suggestions for illustrative images based on keyframes.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: blogPostSchema,
      },
    });

    const jsonText = response.text.trim();
    // It's already an object thanks to the API, but we'll parse to be safe and type-cast.
    const blogPost = JSON.parse(jsonText) as BlogPost;
    return blogPost;

  } catch (error) {
    console.error("Error generating blog post:", error);
    throw new Error("Failed to generate blog post from Gemini API.");
  }
};
   