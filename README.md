# 🧠 AI Chat Interface - Claude & Perplexity Inspired

A modern, feature-rich AI chat application built with Next.js 14+, TypeScript, and shadcn/ui. This project replicates the elegant user experience of Claude and Perplexity AI with advanced features like streaming responses, artifacts, intelligent search, and more.

## ✨ Features

### 💬 **Advanced Chat Interface**
- **Streaming Responses**: Real-time token-by-token streaming with smooth animations
- **Claude-style Artifacts**: Inline rich blocks (code, markdown, tables) with expand/collapse functionality
- **Sticky Question Header**: Perplexity-style pinned question header when scrolling long responses
- **Message Actions**: Copy, regenerate, and edit functionality for all messages
- **Local Persistence**: Complete chat history saved across browser sessions

### 🔍 **Intelligent Search & Autocomplete**
- **Server-Side Search**: Mock API integration with React Query caching
- **Real-time Autocomplete**: Character highlighting and keyboard navigation (↑↓↩Esc)
- **Mentions Support**: Type "@" to trigger people search with 1M+ placeholder names
- **Client-Side Caching**: Optimized performance with intelligent cache management

### ⚙️ **System Quality & Architecture**
- **Clean Architecture**: Modular folder structure with features/, hooks/, types/, lib/
- **React Query Integration**: Advanced state management and caching
- **Command Menu**: ⌘K shortcut for quick actions (New Chat, Clear History, Settings)
- **Responsive Design**: Fully responsive with elegant black & white theme
- **Error Handling**: Graceful error states and loading indicators

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd assignment-fe

# Install dependencies
npm install
# or
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys to .env.local

# Start development server
npm run dev
# or
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Architecture

### Folder Structure
```
src/
├── app/                    # Next.js App Router
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── chat/             # Chat-specific components
│   └── search/           # Search components
├── features/             # Feature-based modules
│   ├── chat/             # Chat functionality
│   └── search/           # Search functionality
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
│   ├── api/              # API functions
│   └── providers/        # Context providers
└── types/                # TypeScript type definitions
```

### Key Components

- **ChatInterface**: Main chat component with streaming and artifacts
- **StreamingMessage**: Real-time message display with animations
- **ArtifactBlock**: Expandable code blocks and rich content
- **EnhancedSearchInput**: Intelligent search with autocomplete
- **StickyHeader**: Perplexity-style pinned question header
- **CommandMenu**: ⌘K command palette for quick actions

## 🎨 Design System

### Theme
- **Color Scheme**: Elegant black & white with subtle grays
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent spacing using Tailwind's design tokens
- **Animations**: Smooth transitions and micro-interactions

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🔧 Technical Implementation

### Streaming Responses
```typescript
// Token-by-token streaming with realistic delays
for await (const token of generateStreamingResponse(prompt)) {
  setStreamingContent(prev => prev + token);
  await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
}
```

### Artifacts System
```typescript
// Extract and display rich content blocks
const artifacts = generateArtifacts(content);
// Supports: code blocks, markdown, tables, images
```

### React Query Integration
```typescript
// Intelligent caching and state management
const { data, isLoading } = useQuery({
  queryKey: ['search', query],
  queryFn: () => mockSearchResults(query),
  staleTime: 5 * 60 * 1000,
});
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

## 📝 Environment Variables

Create a `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Claude AI** - Inspiration for the artifact system and UI design
- **Perplexity AI** - Inspiration for the sticky header and search experience
- **shadcn/ui** - Beautiful, accessible component library
- **Next.js Team** - Amazing React framework
- **TanStack Query** - Powerful data fetching and caching

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Review the code comments

---

**Built with ❤️ using Next.js, TypeScript, and shadcn/ui**