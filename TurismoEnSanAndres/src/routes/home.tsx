import { useState } from 'react';
import { Link } from 'react-router-dom';
import './form.css';

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="container">
            <h2 className="title">¡Bienvenido a la Playa!</h2>
            <form className="form">
                <div className="form-group">
                    <label htmlFor="username" className="label">Nombre de usuario:</label>
                    <input type="text" id="username" name="username" className="input" placeholder="Tu nombre de usuario" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '16px' }} />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="label">Contraseña:</label>
                    <input type="password" id="password" name="password" className="input" placeholder="Tu contraseña" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '16px' }} />
                </div>
                <Link to="/contact" className="link">
                    <button type="submit" className={`button ${isLoading ? 'loading' : ''}`} onClick={handleClick}>
                        {isLoading ? 'Cargando...' : '¡Iniciar Sesión!'}
                    </button>
                </Link>
            </form>
        </div>
    );
}
