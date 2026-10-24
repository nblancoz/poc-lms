import cors from 'cors';
import express from 'express';
import { authRouter } from './routes/auth.routes';
import { courseRouter } from './routes/course.routes';
import { lessonRouter } from './routes/lesson.routes';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/courses', courseRouter);
app.use('/api/lessons', lessonRouter);
