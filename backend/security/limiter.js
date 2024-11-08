import rateLimit from "express-rate-limit"

export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 40,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        message: 'Too many requests, please try again later.',
      });
    },
  });