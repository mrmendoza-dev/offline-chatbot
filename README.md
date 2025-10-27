# Offline AI Chatbot

A modern browser application providing a clean interface for interacting with AI models **completely offline**. Chat with AI models locally using either **Ollama** (server-based) or **WebLLM** (browser-based) without requiring internet connectivity.

## Features

### Core Functionality

- **Dual Provider System**: Choose between Ollama (powerful server models) or WebLLM (instant browser models)
- **Fully Offline**: Works completely without internet after initial setup
- **Real-time Streaming**: Get responses as they're generated
- **Multi-Model Support**: Switch between different AI models easily

### File & Media Support

- **Text Files**: Upload and chat about TXT, JSON, CSV files
- **Code Files**: Analyze code across multiple languages
- **PDF Documents**: Extract and discuss PDF content
- **Image Analysis**: Vision-capable models can analyze uploaded images
- **Screen Capture**: Take screenshots directly within the app

### User Experience

- **Clean Modern UI**: Built with shadcn/ui and Tailwind CSS v4
- **Dark/Light Mode**: System-aware theme switching
- **Keyboard Shortcuts**: `Ctrl+/` to focus input, `Esc` to stop generation
- **PWA Support**: Install as a desktop app
- **Local Storage**: Conversations persist across sessions
- **Attachment Previews**: Visual feedback for uploaded files

### Developer Experience

- **TypeScript**: Full type safety throughout the application
- \*\*Modular(): Context-based architecture for easy extension
- **Comprehensive Testing**: Unit and integration tests with Vitest
- **Optimized Performance**: Memoization, streaming, and efficient rendering

## Prerequisites

### Option 1: WebLLM (Browser-Based) - Easiest

**No installation required!** WebLLM models run entirely in your browser:

- Visit [WebLLM](https://webllm.ai/) to learn more
- Start the app and select a WebLLM model from the dropdown
- Models download automatically on first use

### Option 2: Ollama (Server-Based) - More Powerful

For larger, more capable models, install Ollama:

1. Visit [Ollama's website](https://ollama.com/) and download for your OS
2. Install and verify:
   ```bash
   ollama --version
   ```
3. Pull your first model:
   ```bash
   ollama pull llama2
   ollama run llama2
   ```
4. Read our [blog post](https://medium.com/@mrmendoza-dev/offline-chatbots-with-ollama-52dd18f97933) for detailed Ollama setup

**Note**: The Ollama server automatically starts with the app when using `npm start`.

## Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/offline-chatbot.git
   cd offline-chatbot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure ports (optional)**

   Create a `.env` file in the root directory:

   ```env
   VITE_PORT=8080       # Frontend port (default: 8080)
   VITE_API_PORT=8081  # Backend port for Ollama (default: 8081)
   ```

4. **Start the application**

   ```bash
   npm start
   ```

   This automatically:

   - Clears any processes using ports 8080 and 8081
   - Starts both frontend (`http://localhost:8080`) and backend servers
   - Finds available ports if defaults are in use

## Usage Guide

### Selecting a Model

1. Click the model selector in the top navigation
2. Choose between:
   - **Ollama Models**: Installed locally via Ollama server
   - **WebLLM Models**: Browser-based models (downloads on first use)
3. Wait for model initialization (WebLLM shows download progress)

### Supported File Formats

| Category      | Formats                                                         |
| ------------- | --------------------------------------------------------------- |
| **Text**      | `.txt`, `.md`, `.csv`                                           |
| **Code**      | `.js`, `.ts`, `.py`, `.java`, `.cpp`, `.html`, `.css`, and more |
| **Documents** | `.pdf`                                                          |
| **Images**    | `.png`, `.jpg`, `.jpeg`, `.webp` (vision-capable models only)   |

### Keyboard Shortcuts

| Shortcut   | Action                           |
| ---------- | -------------------------------- |
| `Ctrl + /` | Focus message input              |
| `Esc`      | Stop message generation          |
| `Enter`    | Send message (if not generating) |

### Using Attachments

1. Click the paperclip icon in the message input
2. Select files to attach
3. Models will analyze file contents along with your prompt
4. For images, ensure your selected model supports vision (e.g., LLaVa, Llama 3.2)

## Development

### Running Individual Services

**Frontend only:**

```bash
npm run dev
```

**Backend only:**

```bash
npm run server
```

### Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test -- --watch
```

### Building

Create production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```
offline-chatbot/
├── src/                           # Frontend source
│   ├── components/
│   │   ├── OfflineChatbot/       # Main chatbot module
│   │   │   ├── components/       # UI components
│   │   │   │   ├── chat/        # Chat-specific components
│   │   │   │   ├── layout/      # Layout components
│   │   │   │   └── attachments/ # File handling components
│   │   │   ├── contexts/        # React contexts
│   │   │   ├── hooks/           # Custom hooks
│   │   │   ├── services/        # API services
│   │   │   └── types/           # TypeScript types
│   │   ├── layout/              # App layout
│   │   └── ui/                  # shadcn/ui components
│   ├── contexts/                # Global contexts
│   ├── hooks/                   # Global hooks
│   └── lib/                     # Utilities
├── server/                       # Express backend (Ollama)
│   ├── routes/                  # API routes
│   ├── types/                   # Server types
│   └── utils/                   # Server utilities
├── tests/                        # Test files
│   ├── components/              # Component tests
│   ├── contexts/                # Context tests
│   ├── hooks/                   # Hook tests
│   └── utils/                   # Utility tests
└── public/                      # Static assets
```

## Architecture

### Frontend Architecture

**Core Technologies:**

- **React 19** with TypeScript
- **Vite** for blazing-fast builds
- **Tailwind CSS v4** with shadcn/ui components
- **Context API** for centralized state management
- **Custom Hooks** for reusable logic

**Context Providers:**

- `ApplicationContext`: App-level state (sidebar, theme)
- `ModelContext`: Model management and selection
- `ChatContext`: Chat state and message handling
- `AttachmentContext`: File upload and processing

**Key Services:**

- `model.service.ts`: Ollama/WebLLM model interactions
- `provider.service.ts`: WebLLM initialization and streaming
- `message.service.ts`: Document processing
- `chat.service.ts`: Message formatting

### Backend Architecture (Optional - Ollama)

**Technologies:**

- **Express.js** with TypeScript
- **Ollama API** for local AI inference
- **Streaming responses** for real-time chat
- **Error handling** and health checks

### Design Patterns

- **Separation of Concerns**: Clear boundaries between UI, logic, and data
- **DRY Principle**: Reusable utilities and hooks
- **Performance Optimization**: Memoization, streaming, RAF-based rendering
- **Type Safety**: Comprehensive TypeScript coverage
- **Modularity**: Easy to extend and maintain

## Environment Variables

| Variable        | Description               | Default | Required |
| --------------- | ------------------------- | ------- | -------- |
| `VITE_PORT`     | Frontend Vite server port | `8080`  | No       |
| `VITE_API_PORT` | Backend API server port   | `8081`  | No       |

## Tech Stack

### Frontend

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **Radix UI** - Primitive components
- **Framer Motion** - Animations
- **Sonner** - Toast notifications

### AI Providers

- **[Ollama](https://ollama.com/)** - Local AI inference
- **[WebLLM](https://webllm.ai/)** - Browser-based AI

### Backend (Ollama Only)

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **ollama** - Ollama client library

### Development Tools

- **Vitest** - Testing framework
- **React Testing Library** - Component testing
- **ESLint** - Code linting
- **TypeScript** - Type checking

## Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Run `npm test` to ensure all tests pass
6. Commit your changes (`git commit -m 'feat: add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Commit Message Format

We follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Maintenance tasks

## Additional Resources

- **[Getting Started with Ollama - Blog Post](https://medium.com/@mrmendoza-dev/offline-chatbots-with-ollama-52dd18f97933)**
- **[Ollama Official Website](https://ollama.com/)**
- **[Ollama Model Library](https://ollama.com/library)**
- **[Ollama JS Documentation](https://github.com/ollama/ollama-js)**
- **[WebLLM Official Website](https://webllm.ai/)**
- **[WebLLM GitHub Repository](https://github.com/mlc-ai/web-llm)**

## License

MIT License - see LICENSE file for details

## Acknowledgments

- [Ollama](https://ollama.com/) for providing powerful local AI capabilities
- [WebLLM](https://webllm.ai/) for browser-based AI inference
- [shadcn](https://ui.shadcn.com/) for beautiful UI components
- The open-source community for inspiration and support
