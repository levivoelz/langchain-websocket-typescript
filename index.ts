import express from "express";
import { WebSocketServer } from "ws";
import type { Request } from "express";
import type { WebSocket } from "ws";

import { llm } from "./llm.ts";

const app = express();
const wsServer = new WebSocketServer({ noServer: true });

function heartbeat() {
  this.isAlive = true;
}

type WebSocketWithAlive = WebSocket & { isAlive: boolean };

export type ClientMessage = {
  content: string;
};

wsServer.on(
  "connection",
  (ws: WebSocketWithAlive, _req: Request) => {
    ws.isAlive = true;

    ws.on("error", console.error);
    ws.on("pong", heartbeat);

    ws.on("message", async (data: Buffer, isBinary: boolean) => {
      if (isBinary) ws.close(1002, "binary data not supported");

      const message = data.toString();

      console.log(
        `Received message ${message}`
      );

      const aiMsg = await llm.invoke([
        ["system", "You are a helpful assistant."],
        ["human", message],
      ]);

      console.log(`Sending message ${aiMsg.content}`);

      ws.send(aiMsg.content);
    });
  }
);

const interval = setInterval(() => {
  wsServer.clients.forEach((ws) => {
    const aliveWs = ws as WebSocketWithAlive;
    if (aliveWs.isAlive === false) return aliveWs.terminate();

    aliveWs.isAlive = false;
    aliveWs.ping();
  });
}, 30000);

wsServer.on("close", () => {
  clearInterval(interval);
});

const server = app.listen(8080);

server.on("upgrade", (request, ws, head) => {
  wsServer.handleUpgrade(request, ws, head, (ws) => {
    wsServer.emit("connection", ws, request);
  });
});
