const db = require('../config/db');

class ApplicationRepository {
  static async countActiveByCandidateExceptVacancy(candidateId, currentVacancyId) {
    const query = `
      SELECT COUNT(*) as count 
      FROM applications 
      WHERE candidate_id = ? 
        AND vacancy_id != ? 
        AND status IN ('RECEIVED', 'IN_REVIEW')
    `;
    const [rows] = await db.execute(query, [candidateId, currentVacancyId]);
    return rows[0].count;
  }

  static async findLastByCandidateAndVacancy(candidateId, vacancyId) {
    const query = `
      SELECT * FROM applications 
      WHERE candidate_id = ? AND vacancy_id = ? 
      ORDER BY id DESC LIMIT 1
    `;
    const [rows] = await db.execute(query, [candidateId, vacancyId]);
    return rows[0] || null;
  }

  static async create(data) {
    const query = `
      INSERT INTO applications 
        (candidate_id, vacancy_id, cover_letter, source, score, priority, status)
      VALUES (?, ?, ?, ?, ?, ?, 'RECEIVED')
    `;
    const [result] = await db.execute(query, [
      data.candidateId,
      data.vacancyId,
      data.coverLetter,
      data.source,
      data.score,
      data.priority
    ]);
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM applications WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async findAllFiltered({ status, vacancyId }) {
    let query = `
      SELECT 
        a.id, a.cover_letter AS coverLetter, a.source, a.score, a.priority, a.status,
        a.created_at AS createdAt, a.status_updated_at AS statusUpdatedAt,
        c.name AS candidateName, c.email AS candidateEmail,
        v.title AS vacancyTitle
      FROM applications a
      JOIN candidates c ON a.candidate_id = c.id
      JOIN vacancies v ON a.vacancy_id = v.id
    `;
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push('a.status = ?');
      params.push(status);
    }
    if (vacancyId) {
      conditions.push('a.vacancy_id = ?');
      params.push(vacancyId);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY a.score DESC, a.created_at ASC';

    const [rows] = await db.execute(query, params);
    return rows;
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE applications 
      SET status = ?, status_updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    await db.execute(query, [status, id]);
  }
}

module.exports = ApplicationRepository;