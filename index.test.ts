import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import WebSocket from "ws";

describe("WebSocketServer", async() => {
  it("should be able to connect to the server", async () => {
    const ws = new WebSocket("ws://localhost:8080");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    ws.send('Hello');

    const response = await new Promise<string>((resolve) =>
      ws.once("message", (data) => resolve(data.toString()))
    );

    assert.ok(response.length > 0, "Response should not be empty");
  
    ws.close();
  });
});