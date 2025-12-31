const API_URL = 'http://localhost:3000/api';
let TOKEN = localStorage.getItem('token');
let ROLE = localStorage.getItem('rol');

// Al cargar la página, verificar si hay sesión
document.addEventListener('DOMContentLoaded', () => {
    if (TOKEN) checkSession();
});

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPass').value;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('rol', data.rol);
            location.reload();
        } else {
            alert(data.message);
        }
    } catch (e) { console.error(e); }
}

function checkSession() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('mainDashboard').classList.remove('hidden');
    document.getElementById('logoutBtn').classList.remove('hidden');
    
    // Si es Admin, mostrar botón de sincronizar
    if (localStorage.getItem('rol') === 'Admin') {
        document.getElementById('adminControls').classList.remove('hidden');
    }
    
    cargarAnimales();
}

async function cargarAnimales() {
    const res = await fetch(`${API_URL}/animales`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const animales = await res.json();
    const tbody = document.getElementById('tablaAnimales');
    tbody.innerHTML = '';

    animales.forEach(a => {
        tbody.innerHTML += `
            <tr>
            
                <td>${a.codigo_internounico}</td>
                <td>${a.nombre}</td>
                <td><span class="badge bg-info">${a.especie}</span></td>
                <td>${a.nombre_granja} / ${a.nombre_galera}</td>
                <td><span class="badge ${a.estado === 'Activo' ? 'bg-success' : 'bg-danger'}">${a.estado}</span></td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="abrirTraslado(${a.id})">📍</button>
                    ${localStorage.getItem('rol') === 'Admin' ? `<button class="btn btn-danger btn-sm" onclick="eliminarAnimal(${a.id})">🗑️</button>` : ''}
                </td>
            </tr>
        `;
    });
}

async function cargarMovimientos() {
    const res = await fetch(`${API_URL}/movimientos`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const movs = await res.json();
    const tbody = document.getElementById('tablaMovimientos');
    tbody.innerHTML = '';

    movs.forEach(m => {
        tbody.innerHTML += `
            <tr>
                <td>${new Date(m.fecha_hora).toLocaleString()}</td>
                <td>${m.animal_nombre}</td>
                <td><strong>${m.tipo_movimiento.toUpperCase()}</strong></td>
                <td>${m.granja_destino || '-'}</td>
                <td><small>${m.nota}</small></td>
            </tr>
        `;
    });
}

async function sincronizar() {
    if (!confirm('¿Desea sincronizar con la API externa?')) return;
    const res = await fetch(`${API_URL}/sincronizar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    alert(data.message);
}

function mostrarSeccion(tipo) {
    if (tipo === 'animales') {
        document.getElementById('animalesContent').classList.remove('hidden');
        document.getElementById('movimientosContent').classList.add('hidden');
        cargarAnimales();
    } else {
        document.getElementById('animalesContent').classList.add('hidden');
        document.getElementById('movimientosContent').classList.remove('hidden');
        cargarMovimientos();
    }
}

async function guardarAnimal() {
    const nuevoAnimal = {
        codigo_internounico: "BOV-005",
        especie: "res",
        nombre: "Lucero",
        sexo: "M",
        fecha_nacimiento: "2023-01-15",
        raza: "Holstein",
        peso_inicial: 450.50,
        observaciones: "Sin novedades",
        id_granja: 1, // ID obtenido de la ruta /api/granjas
        id_galera: 2  // ID obtenido de la ruta /api/galeras
    };

    const response = await fetch('http://localhost:3000/api/animales', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // El token guardado tras el login
        },
        body: JSON.stringify(nuevoAnimal)
    });
    
    const result = await response.json();
    alert(result.message);
}

// 1. Función que se activa al dar clic en el botón amarillo (chincheta)
async function abrirTraslado(id) {
    document.getElementById('traslado_id_animal').value = id;
    
    // Cargamos las listas de granjas y galeras antes de mostrar el modal
    await cargarListasTraslado(); 
    
    // Mostramos el modal usando Bootstrap
    const myModal = new bootstrap.Modal(document.getElementById('modalTraslado'));
    myModal.show();
}

async function cargarListasTraslado() {
    const token = localStorage.getItem('token');
    try {
        const resG = await fetch(`${API_URL}/granjas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const granjas = await resG.json();
        const selectG = document.getElementById('traslado_idG');
        
        selectG.innerHTML = '<option value="">Seleccione granja...</option>';
        granjas.forEach(g => {
            selectG.innerHTML += `<option value="${g.id}">${g.nombre}</option>`;
        });

        const resGal = await fetch(`${API_URL}/galeras`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        listaGalerasGlobal = await resGal.json(); // Usamos la variable global que definimos antes
    } catch (e) { console.error("Error al cargar datos de traslado:", e); }
}

function filtrarGalerasTraslado() {
    const idG = document.getElementById('traslado_idG').value;
    const selectGal = document.getElementById('traslado_idGal');
    const filtradas = listaGalerasGlobal.filter(gal => gal.id_granja == idG);
    
    selectGal.innerHTML = '<option value="">Seleccione galera...</option>';
    filtradas.forEach(gal => {
        selectGal.innerHTML += `<option value="${gal.id}">${gal.nombre}</option>`;
    });
}

async function ejecutarTraslado() {
    const datos = {
        id_animal: document.getElementById('traslado_id_animal').value,
        id_granja_destino: document.getElementById('traslado_idG').value,
        id_galera_destino: document.getElementById('traslado_idGal').value,
        nota: document.getElementById('traslado_nota').value
    };

    const res = await fetch(`${API_URL}/traslados`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(datos)
    });

    if (res.ok) {
        alert("Traslado realizado con éxito");
        location.reload();
    } else {
        const err = await res.json();
        alert("Error: " + err.message);
    }
}

async function eliminarAnimal(id) {
    // 1. Confirmación de seguridad
    if (!confirm("¿Estás seguro de que deseas eliminar este animal permanentemente? Esta acción borrará también todo su historial de movimientos.")) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/animales/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (res.ok) {
            alert(data.message); // "Registro eliminado permanentemente."
            cargarAnimales(); // Recargar la tabla para reflejar el cambio
        } else {
            // Si el rol no es Admin, el servidor responderá con 403
            alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Ocurrió un error al intentar eliminar el registro.");
    }
}


function logout() {
    localStorage.clear();
    location.reload();
}