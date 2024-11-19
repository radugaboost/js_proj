import baseRepository from './base.js';
import dotenv from 'dotenv';

dotenv.config();

class weaponRepository extends baseRepository {
  constructor() {
    super('"weapon"');
  }

}

export default new weaponRepository();