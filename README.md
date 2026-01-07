# MoodTunes

![MoodTunes Landing Page](public/landing.webp)

**MoodTunes** is an AI-powered music recommendation platform that transforms your feelings into the perfect soundtrack. Using advanced natural language processing, MoodTunes analyzes your emotional state and generates personalized Spotify playlists that match how you're feeling right now.

<div align="center">

[![Demo Video](https://img.shields.io/badge/Demo-Watch_Now-red)](https://youtu.be/RUkqsLs97gU)

**Live Site:** [moodtunes.zeropse.org](https://moodtunes.zeropse.org)

</div>

## Features

- **AI Mood Analysis**: Powered by Google Gemini (gemini-2.5-flash-lite), the app understands the nuance of your input—from "feeling nostalgic but sad" to "pumped for the gym."
- **Smart Spotify Search**: Automatically generates optimized search queries to find tracks that perfectly align with your detected mood.
- **Playlist Generation**: Instant generation of track lists with artist details, album art, and direct Spotify links.
- **Mood History**: Keep track of your past moods and the playlists generated for them (stored locally for now).
- **Secure Authentication**: Integrated simple authentication with NextAuth.js.
- **Fully Responsive**: A seamless experience across desktop, tablet, and mobile devices.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Language**: JavaScript / React 19
- **AI**: [Google Gemini](https://ai.google.dev/)
- **Music**: [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [pnpm](https://pnpm.io/) (Recommended)
- Spotify Developer Account
- Google AI Studio API Key

### Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/zeropse/moodtunes.git
    cd moodtunes
    ```

2.  **Install dependencies**:

    ```bash
    pnpm install
    ```

3.  **Set up environment variables**:
    Create a `.env.local` file in the root directory and add:

    ```env
    GEMINI_API_KEY=your_gemini_api_key
    SPOTIFY_CLIENT_ID=your_spotify_client_id
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    AUTH_SECRET=your_nextauth_secret
    ```

4.  **Run the development server**:
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

1.  **Input**: User describes their current mood or vibe in plain text.
2.  **Analyze**: The Google Gemini model processes the text to extract a descriptive mood label and an optimized Spotify search query.
3.  **Search**: The app queries the Spotify API using the generated search parameters.
4.  **Display**: A curated list of tracks is presented to the user with playback options and links to open in Spotify.

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.
