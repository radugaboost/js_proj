import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import permissions from './utils/permissions.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/admin', permissions.isAdminAuthenticated, async (req, res) => {
    res.sendFile(path.join(__dirname, '../static/admin.html'));
});

router.get('/', permissions.isAdminAuthenticated, async (req, res) => {
    res.sendFile(path.join(__dirname, '../static/index.html'));
});

router.get('/register', permissions.isNotAuthenticated, async (req, res) => {
    res.sendFile(path.join(__dirname, '../static/register.html'));
});

router.get('/login', permissions.isNotAuthenticated, async (req, res) => {
    if (req.session && req.session.isAuthenticated) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, '../static/login.html'));
});

export default router;