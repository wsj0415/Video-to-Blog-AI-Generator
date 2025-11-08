export enum BlogStyle {
  PROFESSIONAL = 'Professional',
  CASUAL = 'Casual',
  TECHNICAL = 'Technical',
  HUMOROUS = 'Humorous',
}

export interface Timestamp {
  time: string;
  description: string;
}

export interface ImageSuggestion {
  time: string;
  description: string;
}

export interface ExtractedFrame extends ImageSuggestion {
  imageDataUrl: string;
}

export interface BlogPost {
  title: string;
  summary: string;
  body: string;
  keyPoints: string[];
  timestamps: Timestamp[];
  imageSuggestions: ImageSuggestion[];
}
