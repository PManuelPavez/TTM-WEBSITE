import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(express.json({ limit: "256kb" }));
app.use(cors({ origin: true, credentials: false }));
app.use(morgan("tiny"));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

function readJson(name){
  return JSON.parse(fs.readFileSync(path.join(__dirname, "data", `${name}.json`), "utf8"));
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/artists", (_req, res) => res.json(readJson("artists")));
app.get("/api/services", (_req, res) => res.json(readJson("services")));
app.get("/api/partners", (_req, res) => res.json(readJson("partners")));
app.get("/api/team", (_req, res) => res.json(readJson("team"))); // <- TEAM

app.listen(PORT, () => console.log(`TTM API running on http://localhost:${PORT}`));
