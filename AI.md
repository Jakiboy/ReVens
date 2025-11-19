# ReVens AI Assistant Setup

## Requirements

The AI assistant requires **Ollama** to be installed on your system.

## Installation Steps

### 1. Install Ollama

**Windows:**

```bash
winget install Ollama.Ollama
```

Or download from: https://ollama.ai

### 2. Pull the AI Model

After installing Ollama, open a terminal and run:

```bash
ollama pull llama3.2:1b
```

This downloads the lightweight 1.3GB model optimized for local analysis.

### 3. Restart ReVens

Close and reopen ReVens. The AI assistant will now be available in the **AI** tab.

## Usage

### Analyze Files
1. Click **File > Open File** in the menu
2. Select any file (EXE, DLL, ZIP, etc.)
3. The AI tab will open automatically with file analysis

### Ask Questions
1. Navigate to the **AI** tab
2. Type your question in the text area
3. Press Enter or click Send

## Models

| Model         | Size  | Best For                 |
| ------------- | ----- | ------------------------ |
| `llama3.2:1b` | 1.3GB | Fast responses (default) |
| `phi3:mini`   | 2.3GB | Better reasoning         |
| `mistral:7b`  | 4.1GB | Advanced analysis        |

To change model, edit `src/main/ai.js` and update `this.modelName`.

## Troubleshooting

**AI not available:**
- Ensure Ollama is running: `ollama --version`
- Check if model is downloaded: `ollama list`
- Restart ReVens after installing Ollama

**Slow responses:**
- First response is slower (model loading)
- Consider using GPU acceleration
- Use smaller models for faster speeds
