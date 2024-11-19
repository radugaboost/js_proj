import weaponRepository from '../core/repositories/weapon.js';
import userWeaponRepository from '../core/repositories/user_weapon.js';
import permissions from './utils/permissions.js';
import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    let { limit, offset } = req.query;
    limit = parseInt(limit, 10) || 10;
    offset = parseInt(offset, 10) || 0;

    try {
        const weapons = await weaponRepository.getAll(limit, offset);
        res.status(200).json(weapons);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get('/:weapon_id', async (req, res) => {
    const { weapon_id } = req.params;
    try {
        const weapon = await weaponRepository.getById(weapon_id);
        if (!weapon) {
            return res.status(404).send();
        }
        res.status(200).json(weapon);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.post('/:weapon_id/buy', permissions.isAuthenticated, async (req, res) => {
    const { weapon_id } = req.params;
    const { count } = req.body;
    const user_id = req.session.user_id;
    try {
        const weapon = await weaponRepository.getById(weapon_id);
        if (!weapon) {
            return res.status(404).send();
        }
        const newUserWeapon = await userWeaponRepository.create({ weapon_id, count, user_id})
        res.status(200).json(newUserWeapon);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.post('/', permissions.isAdminAuthenticated, async (req, res) => {
    const { name, description, damage, price } = req.body;
    try {
        const newWeapon = await weaponRepository.create({ name, description, damage, price });
        res.status(201).json(newWeapon);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.put('/:weapon_id', permissions.isAdminAuthenticated, async (req, res) => {
    const { weapon_id } = req.params;
    const { name, description, damage, price } = req.body;

    try {
        const updatedWeapon = await weaponRepository.update(weapon_id, { name, damage, description, price });
        if (!updatedWeapon) {
            return res.status(404).send();
        }
        res.status(200).json(updatedWeapon);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.delete('/:weapon_id', permissions.isAdminAuthenticated, async (req, res) => {
    const { weapon_id } = req.params;
    try {
        const deletedWeapon = await weaponRepository.delete(weapon_id);
        if (!deletedWeapon) {
            return res.status(404).send();
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

export default router;