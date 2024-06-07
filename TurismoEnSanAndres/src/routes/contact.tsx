import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './db.css';
import { Link } from 'react-router-dom'; // Importa el componente Link

interface TurismoData {
    rtn: number;
    municipio: string;
    categoria: string;
    subcategoria: string;
    razonSocial: string;
    ano: number;
}

interface ReviewData {
    id: number;
    valor: number;
    comentario: string;
    usuarioID: string;
    datoID: number;
    estadoID: string;
}

const axiosTurismo = axios.create({
    baseURL: 'https://datos-turismo-latest.onrender.com/api/turismo/getTurismo',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        "ngrok-skip-browser-warning": "69420"
    },
});

const axiosReseñas = axios.create({
    baseURL: 'https://mongo-sesion-latest.onrender.com/reseñas',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        "ngrok-skip-browser-warning": "69420"
    },
});

const ITEMS_PER_PAGE = 5;
const TABLE_WIDTH = 800;

export default function Contact() {
    const [data, setData] = useState<TurismoData[]>([]);
    const [filteredData, setFilteredData] = useState<TurismoData[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalData, setModalData] = useState<ReviewData[]>([]);
    const [selectedRNT, setSelectedRNT] = useState<number | null>(null);
    const [detalleData, setDetalleData] = useState<TurismoData | null>(null); // Nuevo estado para los detalles

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axiosTurismo.get<TurismoData[]>('');
                setData(result.data);
                setFilteredData(result.data);
            } catch (error) {
                console.error('Error fetching turismo data:', error);
            }
        };
        fetchData();
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            // Cancela el evento de cierre si el usuario decide quedarse en la página
            e.preventDefault();
            // Muestra la alerta de confirmación
            e.returnValue = '';
            return '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Remueve el event listener cuando el componente se desmonta
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const handleCloseSession = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            e.preventDefault(); // Evita la acción predeterminada si el usuario cancela
        }
    };
    
    const getCurrentPageData = (): TurismoData[] => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length);
        return filteredData.slice(startIndex, endIndex);
    };

    const nextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const prevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleVerCalificaciones = async (rnt: number) => {
        setSelectedRNT(rnt);
        try {
            const response = await axiosReseñas.get<ReviewData[]>('');
            if (response.data.length > 0) {
                const reviews = response.data.filter(review => review.datoID === rnt);
                if (reviews.length > 0) {
                    setModalData(reviews); // Almacena todas las reseñas correspondientes al datoID
                } else {
                    console.log('No hay reseñas para este datoID');
                    setModalData([]); // Limpia las reseñas anteriores
                }
            } else {
                console.log('No hay reseñas disponibles');
                setModalData([]); // Limpia las reseñas anteriores
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleCloseModal = () => {
        setSelectedRNT(null);
        setModalData([]);
    };

    const handleVerMas = (rtn: number) => {
        const item = data.find(item => item.rtn === rtn);
        if (item) {
            setDetalleData(item); // Establece los detalles del elemento seleccionado
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredResults = data.filter(item =>item.rtn.toString().includes(searchTerm) || item.categoria.toLowerCase().includes(searchTerm)
    );
    setFilteredData(filteredResults);
    setCurrentPage(1); // Reiniciar la página actual al realizar una nueva búsqueda
};

return (
    <div className="container">
        <input type="text" placeholder="Buscar por RNT o categoría..." onChange={handleSearchChange} />

        <h2>Resultados</h2>
        <div className="table-container">
            <table className="table" style={{ width: TABLE_WIDTH }}>
                <thead>
                    <tr>
                        <th>RNT</th>
                        <th>Municipio</th>
                        <th>Categoria</th>
                        <th>Detalles</th>
                        <th>Calificaciones</th>
                    </tr>
                </thead>
                <tbody>
                    {getCurrentPageData().map(item => (
                        <tr key={item.rtn}>
                            <td>{item.rtn ? item.rtn : 'No disponible'}</td>
                            <td>{item.municipio ? item.municipio : 'No disponible'}</td>
                            <td>
                                <span className="categoria">{item.categoria}</span>
                            </td>
                            <td>
                                <button className="ver-mas" onClick={() => handleVerMas(item.rtn)}>Ver más</button>
                            </td>
                            <td>
                                <button className="ver-calificaciones" onClick={() => handleVerCalificaciones(item.rtn)}>Ver calificaciones</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>Anterior</button>
            <span style={{ color: 'black' }}>Página {currentPage}</span>
            <button onClick={nextPage} disabled={getCurrentPageData().length < ITEMS_PER_PAGE}>Siguiente</button>
        </div>

        {detalleData && (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={() => setDetalleData(null)}>×</span>
                    <h2>Detalles para RNT: {detalleData.rtn}</h2>
                    <p>Año: {detalleData.ano}</p>
                    <p>Subcategoria: {detalleData.subcategoria}</p>
                    <p>Razón Social: {detalleData.razonSocial}</p>
                </div>
            </div>
        )}

        {selectedRNT && (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={handleCloseModal}>×</span>
                    <h2>Calificaciones para RNT: {selectedRNT}</h2>
                    {modalData.length === 0 && <p>No hay calificaciones disponibles.</p>}
                    {modalData.map((review, index) => (
                        <div key={index}>
                            <p>Valor: {review.valor}</p>
                            <p>Comentario: {review.comentario}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
            <Link to="/" onClick={handleCloseSession}>
                <button style={{ alignSelf: 'flex-start', marginTop: '20px' }}>Cerrar sesión</button>
            </Link>
    </div>
);
}