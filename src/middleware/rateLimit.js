const rateLimit = require("express-rate-limit");

function intEnv(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const n = parseInt(raw, 10);
  return Number.isNaN(n) ? fallback : n;
}

exports.apiLimiter = rateLimit({
  windowMs: intEnv("RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
  max: intEnv("RATE_LIMIT_MAX", 100),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
  skip: (req) => req.method === "OPTIONS",
});

exports.authRouteLimiter = rateLimit({
  windowMs: intEnv("AUTH_RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
  max: intEnv("AUTH_RATE_LIMIT_MAX", 20),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts, please try again later." },
  skip: (req) => req.method === "OPTIONS",
});
