import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './form.css';

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleClick = async () => {
        setIsLoading(true);

        try {
            const username = (document.getElementById('username') as HTMLInputElement).value;
            const password = (document.getElementById('password') as HTMLInputElement).value;

            if (!username || !password) {
                setError('Por favor, completa todos los campos.');
                setIsLoading(false);
                return;
            }

            // Inicio de sesión con la API correspondiente
            const loginResponse = await axios.post('https://apisd-production-cb9f.up.railway.app/login', {
                nombre: username,
                contraseña: password
            }, {
                headers: {
                    "ngrok-skip-browser-warning": "69420"
                }
            });

            if (loginResponse.data && loginResponse.data.success) {
                // Obtener el ID del usuario con la segunda API
                const userResponse = await axios.get(`https://mongo-sesion-latest.onrender.com/usuarios`, {
                    params: {
                        nombre: username,
                        contraseña: password
                    }
                });

                const users = userResponse.data;
                const user = users.find((user: any) => user.nombre === username && user.contraseña === password);

                if (user) {
                    // Guardar el ID del usuario en localStorage
                    localStorage.setItem('userId', user.id);

                    // Redirigir a la página de usuarios o contactos dependiendo del rol
                    if (user.rol === 2) {
                        navigate('/usuario');
                        alert('¡Bienvenido ' + user.nombre + '!');
                    } else if (user.rol === 1) {
                        navigate('/contact');
                        alert('¡Bienvenido Administrador!\nLos registros pueden tardar un poco en verse reflejados');
                    } else {
                        setError('Rol desconocido. Por favor, inténtalo de nuevo.');
                    }
                } else {
                    setError('No se pudo obtener el ID del usuario. Por favor, inténtalo de nuevo.');
                }
            } else {
                setError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error en inicio de sesión:', error);
            setError('Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const goToRegistroPage = () => {
        navigate('/registro');
    }

    return (
        <div className="container">
            <h2 className="title">¡Bienvenido a la Playa!</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form className="form">
                <div className="form-group">
                    <label htmlFor="username" className="label">Nombre de usuario:</label>
                    <input type="text" id="username" name="username" className="input" placeholder="Tu nombre de usuario" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '16px' }} />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="label">Contraseña:</label>
                    <input type="password" id="password" name="password" className="input" placeholder="Tu contraseña" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '16px' }} />
                </div>
                <button type="button" className={`styled-button  ${isLoading ? 'loading' : ''}`} onClick={handleClick}>
                    {isLoading ? 'Cargando...' : '¡Iniciar Sesión!'}
                </button>
            </form>
            <button className="styled-button" onClick={goToRegistroPage}>
                Registrarse
            </button>
        </div>
    );
}
