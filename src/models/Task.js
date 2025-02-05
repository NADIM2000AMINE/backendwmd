const pool = require('../config/db');

class Task {
  static async create(title, description, userId, status = 'TODO') {
    const { rows } = await pool.query(
      'INSERT INTO tasks (title, description, user_id, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, userId, status]
    );
    return rows[0];
  }

  static async findByUser(userId) {
    const { rows } = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
    return rows;
  }

  static async update(id, title, description, status) {
    const { rows } = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *',
      [title, description, status, id]
    );
    return rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  }
  static async findTaskByName(userId, title) {
    const { rows } = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 AND title ILIKE $2',
      [userId, `%${title}%`] // Ajout des "%" pour une recherche partielle
    );
    return rows;
}



}

module.exports = Task;
