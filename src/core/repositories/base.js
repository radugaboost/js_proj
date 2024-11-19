import { pool } from '../../integrations/postgres/pool.js';

class baseRepository {
    constructor(tableName) {
      this.tableName = tableName;
    }

    async getAll(limit, offset) {
      const query = `SELECT * FROM ${this.tableName} ORDER BY id LIMIT ${limit} OFFSET ${offset}`;
      const { rows } = await pool.query(query);
      return rows;
    }

    async getById(id) {
      console.log(id);
      const query = `SELECT * FROM ${this.tableName} WHERE id = ${id}`;
      const { rows } = await pool.query(query);
      return rows[0];
    }

    async create(data) {
      const keys = Object.keys(data).join(', ');
      const values = Object.values(data);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
      const query = `INSERT INTO ${this.tableName} (${keys}) VALUES (${placeholders}) RETURNING *`;

      const { rows } = await pool.query(query, values);
      return rows[0];
    }

    async update(id, data) {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const setQuery = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
      const query = `UPDATE ${this.tableName} SET ${setQuery} WHERE id = ${id} RETURNING *`;
      const { rows } = await pool.query(query, [...values]);
      return rows[0];
    }

    async delete(id) {
      const query = `DELETE FROM ${this.tableName} WHERE id = ${id} RETURNING *`;
      const { rows } = await pool.query(query);
      return rows[0];
    }
  }

  export default baseRepository;