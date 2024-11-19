import baseRepository from './base.js';
import dotenv from 'dotenv';
import { pool } from '../../integrations/postgres/pool.js';

dotenv.config();

class userWeaponRepository extends baseRepository {
  constructor() {
    super('"user_weapon"');
  }

  async getAllForUser(user_id) {
    const query = `
        SELECT 
            uw.*, 
            w.name AS weapon_name,
            w.description AS weapon_description,
            w.damage AS weapon_damage,
            w.price AS weapon_price
        FROM ${this.tableName} uw
        JOIN "weapon" w ON uw.weapon_id = w.id
        WHERE uw.user_id = $1
        ORDER BY uw.id;
    `;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
  }

}

export default new userWeaponRepository();