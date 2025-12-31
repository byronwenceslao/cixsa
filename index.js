const express = require('express');
const cors = require('cors'); 
const jwt = require('jsonwebtoken');
const axios = require('axios');
const db = require('./db');
require('dotenv').config();

// PRIMERO: Creas la aplicación
const app = express(); 

// SEGUNDO: Configuras los middlewares (AHORA SÍ FUNCIONA)
app.use(cors()); 
app.use(express.json());

// --- ESTA ES LA LÍNEA CLAVE ---
// Sirve todos los archivos de tu carpeta (index.html, app.js, etc.)
app.use(express.static(__dirname)); 

// Opcional: Forzar que cargue index.html en la ruta raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- 1. MIDDLEWARE DE VERIFICACIÓN ---
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: "Token requerido" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Guardamos el objeto decodificado (id, rol) en req.user
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token inválido" });
    }
};

// --- 2. GESTIÓN DE USUARIOS ---

// LOGIN (Texto Plano)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        const user = rows[0];

        if (!user || password !== user.password) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const token = jwt.sign(
            { id: user.id, rol: user.rol }, 
            process.env.JWT_SECRET, 
            { expiresIn: '8h' }
        );

        res.json({ token, rol: user.rol });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREAR NUEVO USUARIO (Solo Admin)
app.post('/api/usuarios', verifyToken, async (req, res) => {
   if (req.user.rol !== 'Admin') {
        return res.status(403).json({ message: "No tienes permisos para crear usuarios." });
    }

    const { nombre, email, password, rol } = req.body;
    try {
        const [existente] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existente.length > 0) {
            return res.status(400).json({ message: "El correo electrónico ya está registrado." });
        }

        await db.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
            [nombre, email, password, rol || 'Usuario']
        );

        res.status(201).json({ 
            message: `Usuario '${nombre}' creado con éxito con el rol '${rol || 'Usuario'}'.` 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- 3. RUTA: SINCRONIZAR (Solo Admin) ---
app.post('/api/sincronizar', verifyToken, async (req, res) => {
    if (req.user.rol !== 'Admin') return res.status(403).json({ message: "No autorizado" });

    try {
        const config = { headers: { 'Authorization': `Bearer ${process.env.EXTERNAL_TOKEN}` } };

        const resGranjas = await axios.post(process.env.API_GRANJAS, {}, config);
        for (let g of resGranjas.data) {
            await db.query(
                `INSERT INTO granjas (id, nombre, ubicacion) VALUES (?, ?, ?) 
                 ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), ubicacion = VALUES(ubicacion)`,
                [g.id, g.nombre || `Granja ${g.id}`, g.ubicacion || 'Sin ubicación']
            );
        }

        const resGaleras = await axios.post(process.env.API_GALERAS, {}, config);
        for (let gal of resGaleras.data) {
            await db.query(
                `INSERT INTO galeras (id, id_granja, nombre, capacidad) VALUES (?, ?, ?, ?) 
                 ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), capacidad = VALUES(capacidad)`,
                [gal.id, gal.id_granja, gal.nombre || `Galera ${gal.id}`, gal.capacidad || 0]
            );
        }

        res.json({ message: "Sincronización exitosa", granjas: resGranjas.data.length, galeras: resGaleras.data.length });
    } catch (error) {
        res.status(500).json({ error: "Error en sincronización externa" });
    }
});

// --- 4. GESTIÓN DE ANIMALES ---
// --- 5. CONSULTA DE CATÁLOGOS ---

// LISTAR TODAS LAS GRANJAS
app.get('/api/granjas', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM granjas');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// LISTAR TODAS LAS GALERAS
app.get('/api/galeras', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT gal.*, g.nombre AS nombre_granja 
            FROM galeras gal
            JOIN granjas g ON gal.id_granja = g.id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// LISTAR ANIMALES
app.get('/api/animales', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT a.*, g.nombre AS nombre_granja, gal.nombre AS nombre_galera 
            FROM animales a
            LEFT JOIN granjas g ON a.id_granja = g.id
            LEFT JOIN galeras gal ON a.id_galera = gal.id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// REGISTRAR ANIMAL
app.post('/api/animales', verifyToken, async (req, res) => {
    const { 
        codigo_internounico, especie, nombre, sexo, fecha_nacimiento, 
        raza, peso_inicial, observaciones, id_granja, id_galera 
    } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO animales 
            (codigo_internounico, especie, nombre, sexo, fecha_nacimiento, raza, peso_inicial, observaciones, id_granja, id_galera) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [codigo_internounico, especie, nombre, sexo, fecha_nacimiento, raza, peso_inicial, observaciones, id_granja, id_galera]
        );

        await db.query(
            'INSERT INTO movimientos (id_animal, tipo_movimiento, id_granja_destino, id_galera_destino, nota) VALUES (?, ?, ?, ?, ?)',
            [result.insertId, 'ingreso', id_granja, id_galera, 'Ingreso inicial al sistema']
        );

        res.status(201).json({ message: "Animal registrado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// REGISTRAR TRASLADO (Con validación de estado)
app.post('/api/traslados', verifyToken, async (req, res) => {
    const { id_animal, id_granja_destino, id_galera_destino, nota } = req.body;

    try {
        const [rows] = await db.query('SELECT estado FROM animales WHERE id = ?', [id_animal]);
        if (rows.length === 0) return res.status(404).json({ message: "Animal no encontrado." });

        if (rows[0].estado !== 'Activo') {
            return res.status(400).json({ message: `No se puede trasladar: El animal está en estado '${rows[0].estado}'.` });
        }

        await db.query('UPDATE animales SET id_granja = ?, id_galera = ? WHERE id = ?', [id_granja_destino, id_galera_destino, id_animal]);

        await db.query(
            'INSERT INTO movimientos (id_animal, tipo_movimiento, id_granja_destino, id_galera_destino, nota) VALUES (?, ?, ?, ?, ?)',
            [id_animal, 'traslado', id_granja_destino, id_galera_destino, nota || 'Traslado de galera']
        );

        res.json({ message: "Traslado procesado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// VER HISTORIAL DE UN ANIMAL
app.get('/api/animales/:id/historial', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT m.tipo_movimiento, m.fecha_hora, g.nombre AS granja, gal.nombre AS galera, m.nota
            FROM movimientos m
            JOIN granjas g ON m.id_granja_destino = g.id
            JOIN galeras gal ON m.id_galera_destino = gal.id
            WHERE m.id_animal = ?
            ORDER BY m.fecha_hora DESC
        `, [req.params.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- CORRECCIÓN AQUÍ: DAR DE BAJA (Líneas 202+) ---
app.put('/api/animales/:id/baja', verifyToken, async (req, res) => {
    const { estado, observaciones } = req.body; 
    const id_animal = req.params.id;
    const id_usuario = req.user.id; // Obtenido del token decodificado

    try {
        // 1. Actualizar el estado en la tabla animales
        await db.query(
            'UPDATE animales SET estado = ?, observaciones = ? WHERE id = ?',
            [estado, observaciones, id_animal]
        );
        
        // 2. Registrar el movimiento de salida detallando quién lo hizo
        await db.query(
            `INSERT INTO movimientos 
            (id_animal, tipo_movimiento, id_granja_destino, id_galera_destino, nota) 
            SELECT id, 'salida', id_granja, id_galera, ? 
            FROM animales WHERE id = ?`,
            [`BAJA POR: ${estado}. Detalle: ${observaciones} (Registrado por Usuario ID: ${id_usuario})`, id_animal]
        );

        res.json({ message: `Estado actualizado a ${estado} correctamente.` });
    } catch (error) {
        console.error("Error en Baja:", error);
        res.status(500).json({ error: error.message });
    }
});

// ELIMINAR REGISTRO (¡SOLO ADMIN!)
app.delete('/api/animales/:id', verifyToken, async (req, res) => {
    if (req.user.rol !== 'Admin') {
        return res.status(403).json({ message: "Acceso denegado: Solo administradores pueden eliminar registros." });
    }

    try {
        await db.query('DELETE FROM animales WHERE id = ?', [req.params.id]);
        res.json({ message: "Registro eliminado permanentemente." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- 6. VISTA DE MOVIMIENTOS (AUDITORÍA) ---
app.get('/api/movimientos', verifyToken, async (req, res) => {
    try {
        // Consultamos los movimientos uniendo con animales, granjas y galeras
        const [rows] = await db.query(`
            SELECT 
                m.id AS movimiento_id,
                a.nombre AS animal_nombre,
                a.codigo_internounico,
                m.tipo_movimiento,
                m.fecha_hora,
                g.nombre AS granja_destino,
                gal.nombre AS galera_destino,
                m.nota
            FROM movimientos m
            JOIN animales a ON m.id_animal = a.id
            LEFT JOIN granjas g ON m.id_granja_destino = g.id
            LEFT JOIN galeras gal ON m.id_galera_destino = gal.id
            ORDER BY m.fecha_hora DESC
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));