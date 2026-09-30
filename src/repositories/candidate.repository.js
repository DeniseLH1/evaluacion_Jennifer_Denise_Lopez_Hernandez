const db = require('../config/db');

class CandidateRepository {
  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM candidates WHERE id = ?', [id]);
    return rows[0] || null;
  }
}
module.exports = CandidateRepository;