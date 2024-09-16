# Langchain websocket server example with TypeScript and Ollama

This is a simple websocket server that uses LangChain and Ollama to provide a chat interface.

## Run Demo

Uses Node.js v22.6.0 or later.

Install Ollama or use another LLM compatible with LangChain. Run `ollama run llama3.1` to start the Ollama server.

```bash
npm install
npm start
```

In a separate terminal, run the test to see the completion response:

```bash
npm test
```

## How to create a new websocket client to connect to the server.
_Examples were generated with an LLM and were not tested._

Vanilla example:

```typescript
const ws = new WebSocket("ws://localhost:8080");

ws.on("open", () => {
  console.log("Connected to the server");
});

ws.on("message", (data) => {
  console.log("Received message:", data);
});

ws.on("close", () => {
  console.log("Disconnected from the server");
});

ws.send("Hello");
```

Example with React:

```typescript
import { useEffect, useState } from "react";

const App = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
      console.log('WebSocket connection established.');
    };

    ws.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>WebSocket Chat</h1>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <div>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default App;
```
