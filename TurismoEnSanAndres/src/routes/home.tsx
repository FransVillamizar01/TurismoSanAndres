import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importamos useHistory
import './form.css';

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const history = useNavigate(); // Inicializamos useHistory

    const handleClick = async () => {
        setIsLoading(true);

        try {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (!username || !password) {
                setError('Por favor, completa todos los campos.');
                setIsLoading(false);
                return;
            }

            const response = await axios.post('https://5211-45-65-235-36.ngrok-free.app/login', {
                nombre: username,
                contrasena: password
            }, {
                headers: {
                    "ngrok-skip-browser-warning": "69420"
                }
            });

            console.log('Inicio de sesión exitoso:', response.data);

            // Verificar la respuesta de la API para determinar si el inicio de sesión fue exitoso
            if (response.data && response.data.id) { // Se verifica si hay un ID en la respuesta
                // Redirigir a la página de contactos después de iniciar sesión
                history('/contact'); // Redirigimos a la página de contactos
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
                <button type="button" className={`button ${isLoading ? 'loading' : ''}`} onClick={handleClick}>
                    {isLoading ? 'Cargando...' : '¡Iniciar Sesión!'}
                </button>
            </form>
        </div>
    );
}
