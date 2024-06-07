import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import './db.css';

export default function Registro() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Inicializamos useNavigate

    const handleRegister = async () => {
        try {
            // Mostrar alerta de confirmación antes de registrar al usuario
            const confirmRegister = window.confirm('¿Estás seguro de que deseas registrarte?');
            if (confirmRegister) {
                if (username !== "" && password !== "") {
                    const response = await axios.post('https://mongo-sesion-latest.onrender.com/crearUsuario',
                        {
                            nombre: username,
                            contraseña: password
                        }, {
                        headers: {
                            "ngrok-skip-browser-warning": "69420"
                        }
                    });
                    alert('Registro Exitoso\n¡Bienvenido ' + username + '!');
                    console.log('Registro exitoso:', response.data);
                    setError(''); // Limpiar el mensaje de error
                    // Redirigir a la página de inicio después de registrar
                    navigate('/'); // Redirigimos a la página de inicio
                } else {
                    setError('Verifique que los campos no se encuentren vacíos');
                }
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            setError('Ocurrió un error al registrarse. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div className="container">
            <h2>Registro</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form className="form">
                <div className="form-group">
                    <label htmlFor="username" className="label">Nombre de usuario:</label>
                    <input type="text" id="username" name="username" className="input" placeholder="Tu nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="label">Contraseña:</label>
                    <input type="password" id="password" name="password" className="input" placeholder="Tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="button" className="button" onClick={handleRegister}>
                    Registrarse
                </button>
                <br></br>
                <br></br>
                <button type="button" className="button" onClick={() => history.back()}>
                    Volver
                </button>
            </form>
        </div>
    );
}
