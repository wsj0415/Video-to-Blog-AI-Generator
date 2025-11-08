# Video to Blog AI Generator

An AI-powered application that analyzes video content and automatically generates a complete, well-structured blog post including a title, summary, key points, timestamps, and automatically extracted image frames.

![Video to Blog Demo](https://storage.googleapis.com/aistudio-public-assets/readme-images/video-to-blog-demo.gif)

## ✨ Features

- **AI-Powered Content Creation**: Leverages the Google Gemini API to generate high-quality, structured blog content from a simple video topic.
- **Video File Upload**: Supports various video formats with an intuitive drag-and-drop and file selection interface.
- **Comprehensive Blog Structure**: Automatically generates:
    - An engaging **Title**
    - A concise **Summary**
    - A well-formatted **Body** (using Markdown)
    - A bulleted list of **Key Points**
    - **Timestamped References** to highlight important moments.
- **Automatic Keyframe Extraction**: Intelligently identifies and extracts relevant frames from the uploaded video to serve as blog illustrations, based on AI suggestions.
- **Customizable Writing Styles**: Tailor the tone of the generated article by choosing from styles like Professional, Casual, Technical, and more.
- **Responsive Design**: A clean, modern, and fully responsive user interface built with Tailwind CSS.
- **Client-Side Processing**: Video frame extraction is handled entirely in the browser for speed and user privacy.

## 🚀 How It Works

1.  **Upload Video**: The user uploads a video file. The application automatically suggests a topic based on the filename.
2.  **Set Preferences**: The user confirms or edits the video topic and selects a desired writing style for the blog post.
3.  **Generate Content**: Upon clicking "Generate," the application sends the topic and style preference to the Google Gemini API.
4.  **AI Analysis**: The Gemini API returns a structured JSON object containing the complete blog post, including suggestions for which timestamps to use for keyframe images.
5.  **Frame Extraction**: The application reads the uploaded video file in the browser, seeks to the AI-suggested timestamps, and captures those frames using the HTML Canvas API.
6.  **Display Result**: The final, fully-formatted blog post is displayed, complete with the extracted images, ready to be copied and published.

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript
- **AI Model**: Google Gemini API (`@google/genai`)
- **Styling**: Tailwind CSS
- **Browser APIs**: File API, HTML Video & Canvas API for frame extraction

## ⚙️ Getting Started

To run this project locally, follow these steps:

### Prerequisites

- A modern web browser.
- A Google Gemini API key. You can obtain one from [Google AI Studio](https://aistudio.google.com/).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/video-to-blog-generator.git
    cd video-to-blog-generator
    ```

2.  **Set up Environment Variables:**
    This project is configured to work in an environment where the API key is provided as an environment variable (`process.env.API_KEY`). When running locally or deploying, ensure that this variable is set.

3.  **Run the application:**
    Serve the `index.html` file using a local web server. A simple way to do this is with the `serve` package:
    ```bash
    npx serve
    ```
    Then, open your browser to the provided local URL.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
