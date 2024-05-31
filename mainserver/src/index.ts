import express, { Request, Response } from 'express';
import homeroute from './routes/homeroute';
import createUserRoute from './routes/createuserroute';
import sdkusercreate from './routes/sdkusercreate';
import sdkuserlogin from './routes/sdkuserlogin'
import connectToMongo from './utils/db';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

connectToMongo();

app.use('/', homeroute);

// Mount the createUserRoute
app.use('/', createUserRoute);

app.use('/', sdkusercreate);

app.use('/', sdkuserlogin);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});