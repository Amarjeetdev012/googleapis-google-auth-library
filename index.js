import express from 'express';
import dotenv from 'dotenv';
import router from './route.js';
dotenv.config();

const app = express();
app.set('view engine', 'ejs')
const port = process.env.PORT;

app.use('/', router)
// app.listen(port, () => {
//   console.log(`app is running on port ${port}`);
// });
