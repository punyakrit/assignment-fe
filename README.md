# AI Chat Interface

A modern, full-featured AI chat interface built with Next.js, featuring server-side rendering, autocomplete search, and nested comment functionality.

## Features

- 🤖 **AI Integration**: Powered by Google Gemini AI
- 🔍 **Autocomplete Search**: Smart search with suggestions and debouncing
- 💬 **Nested Comments**: Threaded conversations with reply functionality
- ⚡ **Server-Side Rendering**: Fast initial page loads with Next.js SSR
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations
- 💾 **Local Storage**: Persistent conversation history
- 🔄 **Real-time Updates**: Live message updates and typing indicators

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **Icons**: Lucide React
- **State Management**: React Hooks + Local Storage

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd assignment-fe
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Gemini API key to `.env.local`:
```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── chat/          # Chat API endpoint
│   │   └── search/        # Search API endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── chat/              # Chat-related components
│   │   ├── ChatInterface.tsx
│   │   └── Message.tsx
│   ├── layout/            # Layout components
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── pages/             # Page components
│   │   └── ChatPage.tsx
│   ├── search/            # Search components
│   │   └── AutocompleteSearch.tsx
│   └── ui/                # UI components
│       └── LoadingSpinner.tsx
└── lib/                   # Utilities and services
    ├── gemini.ts          # Gemini AI integration
    └── utils.ts           # Utility functions
```

## Key Features Explained

### Server-Side Rendering (SSR)
- Initial page load is server-rendered for better SEO and performance
- API routes handle AI requests server-side
- Suspense boundaries for loading states

### Autocomplete Search
- Debounced search input with 300ms delay
- Keyboard navigation (arrow keys, enter, escape)
- Categorized suggestions (recent, trending, suggestions)
- Real-time filtering of search results

### Nested Comments
- Threaded conversation system
- Maximum depth of 3 levels to prevent deep nesting
- Reply functionality with proper parent-child relationships
- Collapsible reply threads

### State Management
- React hooks for local state management
- Local storage for conversation persistence
- Optimistic updates for better UX

## API Endpoints

### POST /api/chat
Send a message to the AI and get a response.

**Request:**
```json
{
  "message": "Hello, how are you?"
}
```

**Response:**
```json
{
  "response": "Hello! I'm doing well, thank you for asking..."
}
```

### GET /api/search?q=query
Get search suggestions for a given query.

**Response:**
```json
{
  "suggestions": [
    {
      "id": "1",
      "text": "How to implement authentication in Next.js?",
      "category": "suggestion"
    }
  ]
}
```

## Customization

### Styling
The app uses Tailwind CSS for styling. You can customize the design by:
- Modifying `src/app/globals.css` for global styles
- Updating component classes in individual components
- Extending the Tailwind config in `tailwind.config.js`

### AI Model
To use a different AI model, update the configuration in `src/lib/gemini.ts`:
```typescript
export const geminiModel = genAI.getGenerativeModel({ 
  model: 'gemini-pro' // Change this to your preferred model
});
```

## Performance Optimizations

- Debounced search input to reduce API calls
- Lazy loading with React Suspense
- Optimized re-renders with proper key props
- Local storage caching for conversations
- Efficient state updates with functional setState

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.