# Offline AI Chatbot

A modern desktop application providing a clean interface for interacting with Ollama's AI models locally. Chat with AI models without needing internet connectivity after initial setup.

## Features

- Fully offline AI chat capabilities
- Multiple AI model support through Ollama
- Support for basic text files, CSVs, and JSON
- Support for images compatible with select models (LLaVa, Llama 3.2, etc.)
- Clean, modern interface with shadcn/ui components
- Dark/Light mode support
- Real-time streaming responses
- Local data storage
- TypeScript for type safety
- Modular, extensible architecture

## Prerequisites

1. Install Ollama:
   - Visit [Ollama's website](https://ollama.com/)
   - Download and install for your system
   - Open terminal and verify installation:
     ```bash
     ollama --version
     ```
   - Pull and run your first model:
     ```bash
     ollama pull llama2
     ollama run llama2
     ```
   - Check out my [blog post](https://medium.com/@mrmendoza-dev/offline-chatbots-with-ollama-52dd18f97933) for more information on how to get started with Ollama.

## Setup

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/offline-chatbot.git
   cd offline-chatbot
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory (optional):
   ```env
   VITE_PORT=3000       # Frontend Vite server port (default: 3000)
   VITE_API_PORT=3001  # Backend API server port (default: 3001)
   ```

## Running the Application

Start both frontend and backend servers:

```bash
npm start
```

This will:

1. Automatically clean up any processes using ports 3000 and 3001
2. Start both servers:
   - Frontend: `http://localhost:3000` (default)
   - Backend: `http://localhost:3001` (default)

The server will automatically find an available port if the default is in use.

## Development

Run frontend only:

```bash
npm run dev
```

Run backend only:

```bash
npm run server
```

Run tests:

```bash
npm test
```

## Project Structure

```
offline-chatbot/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── chatbot/        # Chat-related components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # shadcn/ui components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── server/                 # Backend server code
│   ├── routes/             # Express routes
│   └── types/              # Server type definitions
├── tests/                  # Test files
└── public/                 # Static assets
```

## Architecture

### Frontend

- **React 19** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS v4** for styling with shadcn/ui components
- **Context API** for state management
- **Custom hooks** for reusable logic
- **Services layer** for API calls

### Backend

- **Express.js** with TypeScript
- **Ollama API** integration for AI models
- **Streaming responses** for real-time chat
- **Error handling** middleware
- **Health check** endpoint

### Key Design Patterns

- **Separation of Concerns**: Business logic separated from UI components
- **DRY Principle**: Reusable utilities and hooks
- **Type Safety**: Comprehensive TypeScript types
- **Modular Architecture**: Easy to extend and maintain

## Environment Variables

| Variable      | Description               | Default | Required |
| ------------- | ------------------------- | ------- | -------- |
| VITE_PORT     | Frontend Vite server port | 3000    | No       |
| VITE_API_PORT | Backend API server port   | 3001    | No       |

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS v4, shadcn/ui
- **Backend**: Express.js, TypeScript, Ollama API
- **Testing**: Vitest, React Testing Library
- **Build**: Vite, TypeScript

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Additional Resources

- [Offline Chatbots with Ollama - Blog Post](https://medium.com/@mrmendoza-dev/offline-chatbots-with-ollama-52dd18f97933)
- [Ollama JS Documentation](https://github.com/ollama/ollama-js)
- [Ollama Model Library](https://ollama.com/library)

## License

MIT
