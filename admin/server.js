/**
 * WebMaster — Editor de contenido admin
 *
 * Servidor ligero (Node.js puro, sin dependencias externas) que:
 *   1. Sirve la interfaz del editor desde admin/public/
 *   2. Sirve las imágenes del sitio (public/) para vista previa
 *   3. GET  /api/content  → devuelve content.json
 *   4. POST /api/content  → guarda content.json y reconstruye el sitio
 *
 * Uso:
 *   ADMIN_TOKEN=mitecno node admin/server.js
 *
 * Si no se define ADMIN_TOKEN, se genera uno aleatorio y se imprime en consola.
 * El puerto por defecto es 3001 (cambiar con PORT=xxxx).
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

const PORT = parseInt(process.env.PORT || "3001", 10);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const CONTENT_PATH = path.join(PROJECT_ROOT, "src", "content", "content.json");
const ADMIN_PUBLIC = path.join(__dirname, "public");
const SITE_PUBLIC = path.join(PROJECT_ROOT, "public");

const TOKEN = process.env.ADMIN_TOKEN || crypto.randomBytes(12).toString("hex");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".svg": "image/svg+xml",
};

function serveFile(res, baseDir, relPath) {
  const filePath = path.join(baseDir, relPath);
  if (!filePath.startsWith(baseDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function checkAuth(req) {
  return req.headers.authorization === `Bearer ${TOKEN}`;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const p = url.pathname;

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // API: login check
  if (p === "/api/login" && req.method === "POST") {
    try {
      const body = JSON.parse(await readBody(req));
      if (body.token === TOKEN) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } else {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false }));
      }
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false }));
    }
    return;
  }

  // API: get content
  if (p === "/api/content" && req.method === "GET") {
    if (!checkAuth(req)) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "No autorizado" }));
      return;
    }
    try {
      const content = fs.readFileSync(CONTENT_PATH, "utf-8");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(content);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // API: save content + rebuild
  if (p === "/api/content" && req.method === "POST") {
    if (!checkAuth(req)) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "No autorizado" }));
      return;
    }
    try {
      const body = await readBody(req);
      const data = JSON.parse(body);
      if (typeof data !== "object" || data === null || Array.isArray(data)) {
        throw new Error("El contenido debe ser un objeto JSON");
      }
      fs.writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2) + "\n", "utf-8");
      execSync("npm run build", {
        cwd: PROJECT_ROOT,
        stdio: "pipe",
        timeout: 120000,
      });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Contenido guardado y sitio reconstruido" }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Static: site images under /static/ (for previews)
  if (p.startsWith("/static/")) {
    serveFile(res, SITE_PUBLIC, p.slice("/static".length));
    return;
  }

  // Static: editor files
  serveFile(res, ADMIN_PUBLIC, p === "/" ? "index.html" : p);
});

server.listen(PORT, () => {
  console.log(`\n  WebMaster Editor`);
  console.log(`  ─────────────────────────────`);
  console.log(`  URL:   http://localhost:${PORT}`);
  console.log(`  Token: ${TOKEN}`);
  console.log(`  ─────────────────────────────\n`);
});
