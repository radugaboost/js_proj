import baseRepository from './base.js';
import dotenv from 'dotenv';
import { pool } from '../../integrations/postgres/pool.js';

dotenv.config();

class userRepository extends baseRepository {
  constructor() {
    super('"user"');
  }

  async getByCreds(username, password) {
    const result = await pool.query(`SELECT * FROM ${this.tableName} WHERE username = $1 AND password = $2`, [username, password]);
    return result.rows;
  }
}

export default new userRepository();