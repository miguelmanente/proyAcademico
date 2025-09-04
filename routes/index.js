const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Página principal
router.get('/index', (req, res) => {
  res.render('index', { titulo: 'Sistema Académico' });
});

// Listar profesores
router.get('/profesores', (req, res) => {
  db.query('SELECT * FROM profesores', (err, result) => {
    if (err) throw err;
    res.render('profesores', { data: result });
  });
});

// Listar Materias
router.get('/materias', (req, res) => {
  db.query('SELECT * FROM materias', (err, results) => {
    if (err) throw err;
    res.render('materias', { materias: results });
  });
});

// Listar Cursos
router.get('/cursos', (req, res) => {
  db.query('SELECT * FROM cursos', (err, results) => {
    if (err) throw err;
    res.render('cursos', { cursos: results });
  });
});

// Listar Horarios
router.get('/horarios', (req, res) => {
  db.query('SELECT * FROM horarios', (err, results) => {
    if (err) throw err;
    res.render('horarios', { horarios: results });
  });
});

// Ver asignaciones (profesor, materia, curso, horario)
router.get('/asignaciones', (req, res) => {
  const sql = `
    SELECT a.id_asignacion, p.nombre AS profesor, m.nombre AS materia, 
           c.nombre AS curso, h.dia_semana, h.hora_inicio, h.hora_fin
    FROM asignaciones a
    JOIN profesores p ON a.id_profesor = p.id_profesor
    JOIN materias m ON a.id_materia = m.id_materia
    JOIN cursos c ON a.id_curso = c.id_curso
    JOIN horarios h ON a.id_horario = h.id_horario
  `;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('asignaciones', { data: results });
  });
});

// ==================== PROFESORES ====================--------------------------------
// Formulario
router.get('/nuevoProfesor', (req, res) => {
  res.render('nuevoProfesor');
});

// Guardar
router.post('/nuevoProfesor', (req, res) => {
  const { nombre, email } = req.body;
  db.query('INSERT INTO profesores (nombre, email) VALUES (?, ?)', [nombre, email], (err) => {
    if (err) throw err;
    res.redirect('/profesores');
  });
});

// Formulario editar - Listar profesores
  router.get('/editPro', (req, res) => {
    db.query('SELECT * FROM profesores', (err, results) => {
      if (err) throw err;
          res.render('editPro', { profesores: results });
    });
  });

// Formulario para editar un profesor
  router.get('/editPro/:id_profesor', (req, res) => {
    const {id_profesor} = req.params;
      db.query('SELECT * FROM profesores WHERE id_profesor = ?', [id_profesor], (err, result)  => {
      if (err) throw err;
      res.render('actualiPro', { profesores: result[0] });
      });
  });

// Actualizar profesor
  router.post('/actualiPro/:id_profesor', (req, res) => {
    const {id_profesor} = req.params;
    const { nombre, email } = req.body;
    db.query('UPDATE profesores SET nombre = ?, email = ? WHERE id_profesor = ?',[nombre, email, id_profesor], (err) => {
      if (err) throw err;
        res.redirect('/profesores');
      });
  });

  // Eliminar profesores
  router.get('/elimPro', (req, res) => {
    db.query('SELECT * FROM profesores', (err, results) => {
      if (err) throw err;
          res.render('elimPro', { profesores: results });
    });
  });
  router.get('/elimPro/:id_profesor', (req, res) => {
    const {id_profesor} = req.params;
    db.query('DELETE FROM profesores WHERE id_profesor=?', [id_profesor], (err, results) => {
      if (err) throw err;
      res.redirect('/profesores');
    });
  }); 

//-------------------------------------------------------------------------------------------------------

/* // --- MATERIAS ---
router.get('/nuevaMateria', (req, res) => {
  res.render('nuevaMateria');
});

router.post('/nuevaMateria', (req, res) => {
  const { nombre, descripcion } = req.body;
  db.query('INSERT INTO materias (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion], (err) => {
    if (err) throw err;
    res.redirect('/materias');
  });
});

// --- CURSOS ---
router.get('/nuevoCurso', (req, res) => {
  res.render('nuevoCurso');
});

router.post('/nuevoCurso', (req, res) => {
  const { nombre, nivel } = req.body;
  db.query('INSERT INTO cursos (nombre, nivel) VALUES (?, ?)', [nombre, nivel], (err) => {
    if (err) throw err;
    res.redirect('/cursos');
  });
});

// --- HORARIOS ---
router.get('/nuevoHorario', (req, res) => {
  res.render('nuevoHorario');
});

router.post('/nuevoHorario', (req, res) => {
  const { dia_semana, hora_inicio, hora_fin } = req.body;
  db.query('INSERT INTO horarios (dia_semana, hora_inicio, hora_fin) VALUES (?, ?, ?)', [dia_semana, hora_inicio, hora_fin], (err) => {
    if (err) throw err;
    res.redirect('/horarios');
  });
});
 */
// --- ASIGNACIONES ---
router.get('/nuevaAsignacion', (req, res) => {
  const sql = `
    SELECT * FROM profesores;
    SELECT * FROM materias;
    SELECT * FROM cursos;
    SELECT * FROM horarios;
  `;
  db.query(sql, [1,2,3,4], (err, results) => {
    if (err) throw err;
    res.render('nuevaAsignacion', { 
      profesores: results[0], 
      materias: results[1], 
      cursos: results[2], 
      horarios: results[3] 
    });
  });
});

router.post('/nuevaAsignacion', (req, res) => {
  const { id_profesor, id_materia, id_curso, id_horario } = req.body;
  db.query(
    'INSERT INTO asignaciones (id_profesor, id_materia, id_curso, id_horario) VALUES (?, ?, ?, ?)',
    [id_profesor, id_materia, id_curso, id_horario],
    (err) => {
      if (err) throw err;
      res.redirect('/asignaciones');
    }
  );
});





// ==================== MATERIAS ====================

// Listar
router.get('/materias', (req, res) => {
  db.query('SELECT * FROM materias', (err, results) => {
    if (err) throw err;
    res.render('materias', { materias: results });
  });
});

// Nuevo
router.get('/materias/nuevo', (req, res) => {
  res.render('nuevaMateria');
});

router.post('/materias/nuevo', (req, res) => {
  const { nombre, descripcion } = req.body;
  db.query('INSERT INTO materias (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion], (err) => {
    if (err) throw err;
    res.redirect('/materias');
  });
});

// Editar
router.get('/materias/editar/:id', (req, res) => {
  db.query('SELECT * FROM materias WHERE id_materia=?', [req.params.id], (err, result) => {
    if (err) throw err;
    res.render('editarMateria', { materia: result[0] });
  });
});

router.post('/materias/editar/:id', (req, res) => {
  const { nombre, descripcion } = req.body;
  db.query('UPDATE materias SET nombre=?, descripcion=? WHERE id_materia=?', [nombre, descripcion, req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/materias');
  });
});

// Eliminar
router.get('/materias/eliminar/:id', (req, res) => {
  db.query('DELETE FROM materias WHERE id_materia=?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/materias');
  });
});


// ==================== CURSOS ====================

router.get('/cursos', (req, res) => {
  db.query('SELECT * FROM cursos', (err, results) => {
    if (err) throw err;
    res.render('cursos', { cursos: results });
  });
});

router.get('/cursos/nuevo', (req, res) => {
  res.render('nuevoCurso');
});

router.post('/cursos/nuevo', (req, res) => {
  const { nombre, nivel } = req.body;
  db.query('INSERT INTO cursos (nombre, nivel) VALUES (?, ?)', [nombre, nivel], (err) => {
    if (err) throw err;
    res.redirect('/cursos');
  });
});

router.get('/cursos/editar/:id', (req, res) => {
  db.query('SELECT * FROM cursos WHERE id_curso=?', [req.params.id], (err, result) => {
    if (err) throw err;
    res.render('editarCurso', { curso: result[0] });
  });
});

router.post('/cursos/editar/:id', (req, res) => {
  const { nombre, nivel } = req.body;
  db.query('UPDATE cursos SET nombre=?, nivel=? WHERE id_curso=?', [nombre, nivel, req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/cursos');
  });
});

router.get('/cursos/eliminar/:id', (req, res) => {
  db.query('DELETE FROM cursos WHERE id_curso=?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/cursos');
  });
});


// ==================== HORARIOS ====================

router.get('/horarios', (req, res) => {
  db.query('SELECT * FROM horarios', (err, results) => {
    if (err) throw err;
    res.render('horarios', { horarios: results });
  });
});

router.get('/horarios/nuevo', (req, res) => {
  res.render('nuevoHorario');
});

router.post('/horarios/nuevo', (req, res) => {
  const { dia_semana, hora_inicio, hora_fin } = req.body;
  db.query('INSERT INTO horarios (dia_semana, hora_inicio, hora_fin) VALUES (?, ?, ?)', [dia_semana, hora_inicio, hora_fin], (err) => {
    if (err) throw err;
    res.redirect('/horarios');
  });
});

router.get('/horarios/editar/:id', (req, res) => {
  db.query('SELECT * FROM horarios WHERE id_horario=?', [req.params.id], (err, result) => {
    if (err) throw err;
    res.render('editarHorario', { horario: result[0] });
  });
});

router.post('/horarios/editar/:id', (req, res) => {
  const { dia_semana, hora_inicio, hora_fin } = req.body;
  db.query('UPDATE horarios SET dia_semana=?, hora_inicio=?, hora_fin=? WHERE id_horario=?', [dia_semana, hora_inicio, hora_fin, req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/horarios');
  });
});

router.get('/horarios/eliminar/:id', (req, res) => {
  db.query('DELETE FROM horarios WHERE id_horario=?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/horarios');
  });
});


// ==================== ASIGNACIONES ====================

router.get('/asignaciones', (req, res) => {
  const sql = `
    SELECT a.id_asignacion, p.nombre AS profesor, m.nombre AS materia, 
           c.nombre AS curso, h.dia_semana, h.hora_inicio, h.hora_fin
    FROM asignaciones a
    JOIN profesores p ON a.id_profesor = p.id_profesor
    JOIN materias m ON a.id_materia = m.id_materia
    JOIN cursos c ON a.id_curso = c.id_curso
    JOIN horarios h ON a.id_horario = h.id_horario
  `;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('asignaciones', { asignaciones: results });
  });
});

router.get('/asignaciones/nuevo', (req, res) => {
  const sql = `
    SELECT * FROM profesores;
    SELECT * FROM materias;
    SELECT * FROM cursos;
    SELECT * FROM horarios;
  `;
  db.query(sql, [1,2,3,4], (err, results) => {
    if (err) throw err;
    res.render('nuevaAsignacion', { 
      profesores: results[0], 
      materias: results[1], 
      cursos: results[2], 
      horarios: results[3] 
    });
  });
});

router.post('/asignaciones/nuevo', (req, res) => {
  const { id_profesor, id_materia, id_curso, id_horario } = req.body;
  db.query(
    'INSERT INTO asignaciones (id_profesor, id_materia, id_curso, id_horario) VALUES (?, ?, ?, ?)',
    [id_profesor, id_materia, id_curso, id_horario],
    (err) => {
      if (err) throw err;
      res.redirect('/asignaciones');
    }
  );
});

// Eliminar asignación
router.get('/asignaciones/eliminar/:id', (req, res) => {
  db.query('DELETE FROM asignaciones WHERE id_asignacion=?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/asignaciones');
  });
});

module.exports = router;