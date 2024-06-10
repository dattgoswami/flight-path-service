import express from 'express';
import bodyParser from 'body-parser';
import flightRoutes from './routes/flightRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use('/', flightRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
