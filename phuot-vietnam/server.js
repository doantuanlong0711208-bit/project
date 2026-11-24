/**
 * ============================================================================
 * DỌC MIỀN ĐẤT NƯỚC — BACKEND SERVER (TIER 2 APPLICATION API & TIER 3 STORAGE)
 * Chạy độc lập không cần cài thư viện ngoài: `node server.js`
 * ============================================================================
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, "data-store.json");

function readStore() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    }
  } catch (e) {
    console.error("Read DB error:", e);
  }
  return { savedTrips: [], reviews: {} };
}

function writeStore(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("Write DB error:", e);
  }
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // REST API ENDPOINTS (TIER 2)
  if (url.pathname === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok", architecture: "3-Tier Multi-Layer Web" }));
  }

  if (url.pathname === "/api/trips" && req.method === "GET") {
    const store = readStore();
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(store.savedTrips));
  }

  if (url.pathname === "/api/trips" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const trip = JSON.parse(body || "{}");
      const store = readStore();
      store.savedTrips.unshift({ ...trip, id: "trip_" + Date.now() });
      writeStore(store);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(store.savedTrips));
    });
    return;
  }

  // STATIC FILE SERVER (TIER 1 PRESENTATION)
  let filePath = path.join(__dirname, url.pathname === "/" ? "index.html" : url.pathname);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("404 Not Found");
    }
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server Đa Tầng Dọc Miền Đất Nước đang chạy tại: http://localhost:${PORT}`);
});
