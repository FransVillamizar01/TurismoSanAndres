import { useEffect, useState } from 'react';
import axios from 'axios';
import './db.css';

interface TurismoData {
    rtn: number;
    municipio: string;
    categoria: string;
    subcategoria: string;
    razonSocial: string;
    ano: number;
}

const axiosInstance = axios.create({
    baseURL: 'https://a156-186-114-123-139.ngrok-free.app/api/turismo/getTurismo',
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
    const [modalData, setModalData] = useState<TurismoData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axiosInstance.get<TurismoData[]>('');
                setData(result.data);
                setFilteredData(result.data);
            } catch (error) {
                console.error('Error fetching turismo data:', error);
            }
        };
        fetchData();
    }, []);

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

    const handleVerMas = (item: TurismoData) => {
        setModalData(item);
    };

    const handleCloseModal = () => {
        setModalData(null);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredResults = data.filter(item =>
            item.rtn.toString().includes(searchTerm) || item.categoria.toLowerCase().includes(searchTerm)
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
                                    <button className="ver-mas" onClick={() => handleVerMas(item)}>Ver más</button>
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

            {modalData && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>{modalData.subcategoria}</h2>
                        <p>Subcategoría: {modalData.subcategoria}</p>
                        <p>Razón Social: {modalData.razonSocial}</p>
                        <p>Año: {modalData.ano}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
