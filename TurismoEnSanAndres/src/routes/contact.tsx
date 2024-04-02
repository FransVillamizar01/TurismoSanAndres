import { useEffect, useState } from 'react';
import axios from 'axios';
import './db.css';

interface TurismoData {
    rtn: number;
    municipio: string;
    categoria: string;
}

// Crear una instancia de axios con la configuración de CORS
const axiosInstance = axios.create({
    baseURL: 'https://5f74-186-114-123-139.ngrok-free.app/api/turismo/getTurismo',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});

export default function Contact() {
    const [data, setData] = useState<TurismoData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axiosInstance.get<TurismoData[]>('');
                console.log(result.data);  // Agrega esta línea
                setData(result.data);
            } catch (error) {
                console.error('Error fetching turismo data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container">
            <input type="text" placeholder="Ingrese el establecimiento a buscar..." />

            <h2>Resultados</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>RNT</th>
                        <th>Municipio</th>
                        <th>Categoria</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(data) && data.map(item => (
                        <tr key={item.rtn}>
                            <td>{item.rtn ? item.rtn : 'No disponible'}</td>
                            <td>{item.municipio ? item.municipio : 'No disponible'}</td>
                            <td>{item.categoria ? item.categoria : 'No disponible'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}
