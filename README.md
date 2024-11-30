# Offline AI Chatbot

A desktop application that provides a clean interface for interacting with Ollama's AI models locally. Chat with AI models without needing internet connectivity after initial setup.

## Features

* Fully offline AI chat capabilities
* Clean, modern interface  
* Dark/Light mode support
* Multiple AI model support through Ollama
* Real-time responses
* Local data storage

## Prerequisites

1. Install Ollama:
   * Visit [Ollama's website](https://ollama.com/)
   * Download and install for your system
   * Open terminal and verify installation:
     ```bash
     ollama --version
     ```
   * Pull and run your first model:
     ```bash
     ollama pull llama2
     ollama run llama2
     ```
   * Check out my [blog post](https://medium.com/@mrmendoza-dev/offline-chatbots-with-ollama-52dd18f97933) for more information on how to get started with Ollama.

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

3. Create a `.env` file in the root directory:
   ```env
   VITE_PORT=3030
   ```

## Running the Application

Start both frontend and backend servers:
```bash
npm start
```

This will run:
* Frontend: `http://localhost:5173`
* Backend: `http://localhost:3030`

## Development

Run frontend only:
```bash
npm run dev
```

Run backend only:
```bash
npm run server
```

## Project Structure
```
offline-chatbot/
├── src/               # Frontend source code
├── server/            # Backend server code
└── public/            # Static assets
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_PORT | Backend server port | Yes |

## Tech Stack
* React + Vite
* Express.js
* Ollama API
* TailwindCSS
* Node.js

## Additional Resources
* [Offline Chatbots with Ollama - Blog Post](https://medium.com/@mrmendoza-dev/offline-chatbots-with-ollama-52dd18f97933)
* [Ollama JS Documentation](https://github.com/ollama/ollama-js)
* [Ollama Model Library](https://ollama.com/library)

## License
MIT