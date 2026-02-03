const http = require("http");
const fs = require("fs");
const path = require("path");
const { WebSocketServer } = require("ws");

const port = process.env.PORT ? Number(process.env.PORT) : 4173;
const publicDir = __dirname;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const server = http.createServer((req, res) => {
  const safePath = req.url === "/" ? "/index.html" : req.url;
  const filePath = path.join(publicDir, safePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 - nie znaleziono pliku");
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
    });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

const broadcast = (payload) => {
  const message = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
};

const sendPresence = () => {
  broadcast({ type: "presence", count: wss.clients.size });
};

wss.on("connection", (socket) => {
  sendPresence();

  socket.on("message", (raw) => {
    const payload = JSON.parse(raw.toString());
    if (payload.type === "message") {
      broadcast({ type: "message", data: payload.data });
    }
  });

  socket.on("close", () => {
    sendPresence();
  });
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Serwer działa: http://localhost:${port}`);
});
