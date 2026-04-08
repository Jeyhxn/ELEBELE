# React Frontend Setup

This is the React frontend for the Social Media for Gamers app.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Navigate to the client folder:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

## Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

The API proxy is configured in `vite.config.js` to forward API requests to `http://localhost:5000`.

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

## Project Structure

```
client/
├── src/
│   ├── main.jsx          # React entry point
│   ├── App.jsx           # Main App component
│   ├── api.js            # API client and endpoints
│   ├── index.css         # Global styles
│   └── components/       # React components (to be added)
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
├── package.json          # Dependencies and scripts
└── .gitignore
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## API Endpoints Used

- `GET /api/category` - Get categories
- `GET /api/game` - Get games
- `GET /api/game/creation-options` - Get options for creating a game
- `POST /api/game` - Create a new game
- `GET /api/platform` - Get platforms
