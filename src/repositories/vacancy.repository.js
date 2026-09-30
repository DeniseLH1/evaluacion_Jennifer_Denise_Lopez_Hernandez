const db = require('../config/db');

class VacancyRepository {
  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM vacancies WHERE id = ?', [id]);
    return rows[0] || null;
  }
}
module.exports = VacancyRepository;