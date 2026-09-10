import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import studentRoutes from './routes/students';
import facultyRoutes from './routes/faculty';
import adminRoutes from './routes/admin';
import predictionRoutes from './routes/predictions';
import connectDB from './config/mongoose';
import { errorHandler, notFound } from './middleware/errorHandler';
import { exec } from 'child_process';

const app = express();

connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Global CORS preflight handler - runs before all other middleware
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Origin,Accept');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'https://eduxcel-frontend.web.app'];

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/predictions', predictionRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

const killProcessOnPort = (port: number): Promise<void> => {
  return new Promise((resolve) => {
    exec(`netstat -ano | findstr :${port} | findstr LISTENING`, (error, stdout) => {
      if (!error && stdout) {
        const lines = stdout.trim().split('\n');
        const pids = new Set<string>();
        for (const line of lines) {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && pid !== '0') pids.add(pid);
        }
        if (pids.size > 0) {
          console.log(`Killing process(es) on port ${port}: ${[...pids].join(', ')}`);
          const killCmd = [...pids].map(pid => `taskkill /PID ${pid} /F`).join(' & ');
          exec(killCmd, () => {
            setTimeout(resolve, 1000);
          });
          return;
        }
      }
      resolve();
    });
  });
};

const startServer = async (port: number) => {
  await killProcessOnPort(port);
  
  const server = app.listen(port, () => {
    console.log(`EduXcel Backend running on port ${port}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is still in use after cleanup. Please restart your terminal.`);
    } else {
      console.error(`Failed to start server: ${err.message}`);
    }
    process.exit(1);
  });
};

startServer(PORT);

export default app;
