import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { initializeTables } from './integrations/postgres/init.js';

import authRouter from './api/user.js';
import weaponRouter from './api/weapon.js';
import pagesRouter from './api/pages.js';

dotenv.config();

const app = express();
const PORT= process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000000 }
}));

await initializeTables()

app.use(express.static(path.join(__dirname, 'static')));
app.use('', pagesRouter)
app.use('/users', authRouter)
app.use('/weapons', weaponRouter)

app.listen(PORT, () => {
    console.log(`Application is running http://localhost:${PORT}`);
});

export default app;