export const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL
]

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  preflightContinue: true,
};

export default corsOptions;