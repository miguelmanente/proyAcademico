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


// Formulario para editar un profesor
  router.get('/editPro/:id_profesor', (req, res) => {
    const {id_profesor} = req.params;
      db.query('SELECT * FROM profesores WHERE id_profesor = ?', [id_profesor], (err, result)  => {
      if (err) throw err;
        res.render('editPro', { data: result[0] });
      });
  });

// Actualizar profesor
  router.post('/editPro/:id_profesor', (req, res) => {
    const {id_profesor} = req.params;
    const { nombre, email, dni, fecNac, sitRev, telefono, tomaPos, finTomaPos } = req.body;
    db.query('UPDATE profesores SET nombre = ?, email = ?, dni = ?, fecNac = ?, sitRev = ?, telefono = ?, tomaPos = ?, finTomaPos = ? WHERE id_profesor = ?',[nombre, email, dni, fecNac, sitRev, telefono, tomaPos, finTomaPos, id_profesor], (err, result) => {
      if (err) throw err;
        res.redirect('/profesores');
      });
  });

  // Eliminar profesores
  router.get('/elimPro', (req, res) => {
    db.query('SELECT * FROM profesores', (err, results) => {
      if (err) throw err;
          res.render('elimPro', { data: results });
    });
  });
  router.get('/elimPro/:id_profesor', (req, res) => {
    const {id_profesor} = req.params;
    db.query('DELETE FROM profesores WHERE id_profesor=?', [id_profesor], (err, results) => {
      if (err) throw err;
      res.redirect('/profesores');
    });
  }); 

  //Buscar Profesores por Apellido
  router.get('/buscarPro', (req, res) => {
    res.render('buscarPro');
  });

  router.post('/buscarPro', (req, res) => {
  const termino = req.body.nombre
  const sql = ("SELECT * FROM profesores WHERE nombre LIKE ?")
  db.query(sql, [`%${termino}%`], (err, resultados) => {
        if (err) throw err;
        res.render('profesores', { data: resultados });
    });
});



//-------------------------------------------------------------------------------------------------------

// ======================================   MATERIAS  ===================================================

// Listar Materias
router.get('/materias', (req, res) => {
  db.query('SELECT * FROM materias', (err, results) => {
    if (err) throw err;
    res.render('materias', { data: results });
  });
});

// Altas Materias
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

// Formulario para editar MATERIAS
  router.get('/editMateria/:id_materia', (req, res) => {
    const {id_materia} = req.params;
      db.query('SELECT * FROM materias WHERE id_materia = ?', [id_materia], (err, result)  => {
      if (err) throw err;
        res.render('editMateria', { data: result[0] });
      });
  });

// Actualizar MATERIAS
  router.post('/editMateria/:id_materia', (req, res) => {
    const {id_materia} = req.params;
    const { nombre, descripcion } = req.body;
    db.query('UPDATE materias SET nombre = ?, descripcion = ? WHERE id_materia = ?',[nombre, descripcion, id_materia], (err, result) => {
      if (err) throw err;
        res.redirect('/materias');
      });
  });

    // Eliminar Materias
  router.get('/elimMat', (req, res) => {
    db.query('SELECT * FROM materias', (err, results) => {
      if (err) throw err;
          res.render('elimMat', { data: results });
    });
  });
  router.get('/elimMat/:id_materia', (req, res) => {
    const {id_materia} = req.params;
    db.query('DELETE FROM materias WHERE id_materia=?', [id_materia], (err, results) => {
      if (err) throw err;
      res.redirect('/materias');
    });
  });

  //Buscar Materias por Nombre
  router.get('/buscarMat', (req, res) => {
    res.render('buscarMat');
  });

  router.post('/buscarMat', (req, res) => {
  const termino = req.body.nombre
  const sql = ("SELECT * FROM materias WHERE nombre LIKE ?")
  db.query(sql, [`%${termino}%`], (err, resultados) => {
        if (err) throw err;
        res.render('materias', { data: resultados });
    });
});

//========================================================  CURSOS  ===============================================
/*
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




module.exports = router;