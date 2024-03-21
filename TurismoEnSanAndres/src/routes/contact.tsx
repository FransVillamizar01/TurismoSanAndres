
import './db.css';

export default function Contact() {
    return (
        <div className="container">
            <input type="text" placeholder="Ingrese el establecimiento a buscar..." />

            <h2>Resultados</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>RNT</th>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Detalles</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Aquí puedes mapear tus datos para generar filas de tabla */}
                    <tr>
                        <td>123</td>
                        <td>gagssasssssssssssssssa</td>
                        <td>Calle Principal 123 asfasf asfasfa</td>
                        <td>
                            <button>Ver Detalles</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
