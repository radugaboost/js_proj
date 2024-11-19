import path from 'path';
import { fileURLToPath } from 'url';
import userRepository from '../core/repositories/user.js';
import userWeaponRepository from '../core/repositories/user_weapon.js'
import express from 'express';
import permissions from './utils/permissions.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);


router.post('/register', permissions.isNotAuthenticated, async (req, res) => {
    const { username, password, is_admin } = req.body;
    try {
        const newUser = await userRepository.create({ username, password, is_admin });
        console.log('user created:', newUser);
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(400).send();
    }
});

router.post('/login', permissions.isNotAuthenticated, async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userRepository.getByCreds(username, password);

        if (!user || user.length === 0) {
            return res.status(401).send();
        }

        req.session.username = username;
        req.session.user_id = user[0].id;
        console.log(req.session)
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.post('/logout', permissions.isAuthenticated, async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).send();
        }
        res.redirect('/login');
    });
});

router.get('/me', permissions.isAuthenticated, async (req, res) => {
    try {
        const user = await userRepository.getById(req.session.user_id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get('/weapons', permissions.isAuthenticated, async (req, res) => {
    try {
        const user_weapons = await userWeaponRepository.getAllForUser(req.session.user_id);
        if (!user_weapons) {
            return res.status(404).send();
        }
        res.status(200).json(user_weapons);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
})

export default router;