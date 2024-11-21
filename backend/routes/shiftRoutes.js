const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res, next) => {
  try {
      const [rows] = await db.query('SELECT * FROM shifts');
      res.json(rows);
  } catch (err) {
      next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
      const [rows] = await db.query('SELECT * FROM shifts WHERE id = ?', [id]);
      if (rows.length === 0) {
          return res.status(404).json({ error: 'Shift not found' });
      }
      res.json(rows[0]);
  } catch (err) {
      next(err);
  }
});

router.post('/', async (req, res, next) => {
  const { employee_id, start_time, end_time, shift_date } = req.body;
  const connection = await db.getConnection();
  try {
      await connection.beginTransaction();

      const result = await connection.query(
          'INSERT INTO shifts (employee_id, start_time, end_time, shift_date) VALUES (?, ?, ?, ?)',
          [employee_id, start_time, end_time, shift_date]
      );

      await connection.commit();
      res.status(201).json({
          id: result.insertId,
          employee_id,
          start_time,
          end_time,
          shift_date
      });
  } catch (err) {
      await connection.rollback();
      next(err);
  } finally {
      connection.release();
  }
});

router.put('/:id', async (req, res, next) => {
  const { employee_id, start_time, end_time, shift_date } = req.body;
  const shiftId = req.params.id;
  const connection = await db.getConnection();
  try {
      await connection.beginTransaction();

      // Check if employee exists
      const [employee] = await connection.query('SELECT id FROM employees WHERE id = ?', [employee_id]);
      if (employee.length === 0) {
          await connection.rollback();
          return res.status(400).json({ error: 'Invalid employee_id: Employee does not exist' });
      }

      // Update shift
      await connection.query(
          'UPDATE shifts SET employee_id = ?, start_time = ?, end_time = ?, shift_date = ? WHERE id = ?',
          [employee_id, start_time, end_time, shift_date, shiftId]
      );

      await connection.commit();
      res.json({ message: 'Shift updated successfully' });
  } catch (err) {
      await connection.rollback();
      next(err);
  } finally {
      connection.release();
  }
});

router.delete('/:id', async (req, res, next) => {
  const shiftId = req.params.id;
  const connection = await db.getConnection();
  try {
      await connection.beginTransaction();

      // Validate ID
      if (!shiftId) {
          await connection.rollback();
          return res.status(400).json({ status: 'error', message: 'Shift ID is required' });
      }

      // Check if the shift exists
      const [shift] = await connection.query('SELECT * FROM shifts WHERE id = ?', [shiftId]);
      if (shift.length === 0) {
          await connection.rollback();
          return res.status(404).json({ status: 'error', message: 'Shift not found' });
      }

      // Delete the shift
      await connection.query('DELETE FROM shifts WHERE id = ?', [shiftId]);

      await connection.commit();
      res.status(200).json({ status: 'success', message: 'Shift deleted successfully' });
  } catch (err) {
      await connection.rollback();
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  } finally {
      connection.release();
  }
});

module.exports = router;