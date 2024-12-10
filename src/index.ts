import express, { NextFunction, Request, Response } from 'express';
import connectDB from './db.config';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/User';

dotenv.config();
const app = express();

const port: number = 3000;

app.use(cors());
app.use(express.json());

app.use('/users', userRoute);

// if no endpoints found
app.use((req: Request, res: Response, next: NextFunction)=> {
  next({
    status: 404,
    message: "No Routes Found"
  });
});

app.use((err: ErrorType, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Issue";
  res.status(status).json({status, message});
  return;
});

type ErrorType = {
  status: number,
  message: string
}

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
};

startServer();


export default app;