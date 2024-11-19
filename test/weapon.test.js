import express from 'express';
import session from 'express-session';
import { expect } from 'chai';
import weaponRepository from '../src/core/repositories/weapon.js';
import userRepository from '../src/core/repositories/user.js';
import weaponRouter from '../src/api/weapon.js';
import request from 'supertest';
import mockSession from 'mock-session'

const app = express();
app.use(express.json());
app.use(
    session({
        secret: 'test-secret',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    })
);

app.use((req, res, next) => {
    req.session.username = "test";
    req.session.user_id = 1;
    next();
});

app.use('/weapons', weaponRouter);

const mockWeapons = [
    {
        "id": 12,
        "damage": 12,
        "name": "test",
        "description": "test",
        "price": 12
    },
    {
        "id": 13,
        "damage": 13,
        "name": "test",
        "description": "test",
        "price": 13
    }
];

const mockWeapon = { id: 1, name: "test", damage: 1, description: "test", price: 1 };


describe('GET /weapons', () => {
    before(() => {
        weaponRepository.getAll = (limit, offset) => {
            return Promise.resolve(mockWeapons);
        }
    });

    after(() => {
        delete weaponRepository.getAll;
    });

    it('should return list of weapons', async () => {
        const response = await request(app).get('/weapons?limit=100&offset=1')

        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal(mockWeapons);
    });
});


describe('POST /weapons', () => {
    beforeEach(() => {
        weaponRepository.create = (weaponData) => {
            return Promise.resolve({ ...mockWeapon, ...weaponData });
        };
        userRepository.getById = (id) => {
            if (id === 1) {
                return Promise.resolve({ id: 1, username: 'test', is_admin: true });
            } else {
                return Promise.resolve({ id, username: 'test', is_admin: false });
            }
        };
    });

    after(() => {
        delete weaponRepository.create;
        delete userRepository.getById;
    });

    it('should return new weapon', async () => {
        let cookie = mockSession('my-session', 'test-secret', {username: "test", user_id: 1});

        const response = await request(app)
            .post('/weapons')
            .set('cookie', [cookie])
            .send({
                name: "test",
                description: "test",
                damage: 1,
                price: 1
            });

        expect(response.status).to.equal(201);
        expect(response.body).to.deep.equal(mockWeapon);
    });
});


describe('PUT /weapons/:weapon_id', () => {
    beforeEach(() => {
        weaponRepository.update = (weapon_id, weaponData) => {
            if (weapon_id == 1) {
                return Promise.resolve({ id: weapon_id, ...weaponData });
            }

            return Promise.resolve(null);
        };

        userRepository.getById = (id) => {
            return Promise.resolve({ id, username: 'test', is_admin: true });
        };
    });

    after(() => {
        delete weaponRepository.update;
        delete userRepository.getById;
    });

    it('should update weapon and return updated weapon', async () => {
        const updatedWeapon = {
            name: "updated name",
            description: "updated description",
            damage: 10,
            price: 100
        };

        const cookie = mockSession('my-session', 'test-secret', { username: "test", user_id: 1 });

        const response = await request(app)
            .put('/weapons/1')
            .set('cookie', [cookie])
            .send(updatedWeapon);

        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal({ id: '1', ...updatedWeapon });
    });

    it('should return 404 if weapon not found', async () => {
        const cookie = mockSession('my-session', 'test-secret', { username: "test", user_id: 1 });

        const response = await request(app)
            .put('/weapons/999')
            .set('cookie', [cookie])
            .send({
                name: "updated name",
                description: "updated description",
                damage: 10,
                price: 100
            });

        expect(response.status).to.equal(404);
    });
});


describe('DELETE /weapons/:weapon_id', () => {
    beforeEach(() => {
        weaponRepository.delete = (weapon_id) => {
            if (weapon_id == 1) {
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
        };

        userRepository.getById = (id) => {
            return Promise.resolve({ id, username: 'test', is_admin: true });
        };
    });

    after(() => {
        delete weaponRepository.delete;
        delete userRepository.getById;
    });

    it('should delete weapon and return 204 status', async () => {
        const cookie = mockSession('my-session', 'test-secret', { username: "test", user_id: 1 });

        const response = await request(app)
            .delete('/weapons/1')
            .set('cookie', [cookie]);

        expect(response.status).to.equal(204);
    });

    it('should return 404 if weapon not found', async () => {
        const cookie = mockSession('my-session', 'test-secret', { username: "test", user_id: 1 });

        const response = await request(app)
            .delete('/weapons/999')
            .set('cookie', [cookie]);

        expect(response.status).to.equal(404);
    });
});