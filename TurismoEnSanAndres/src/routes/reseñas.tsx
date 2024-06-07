import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './usuario.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import axios from 'axios';

type Place = {
  id: number;
  name: string;
  rating?: number;
  review?: string;
};

type APIResponse = {
  valor: number;
  comentario: string;     
  usuarioID: string;
  datoID: string;
  estadoID: string;
};

export default function Reseñas() {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [ratedPlaces, setRatedPlaces] = useState<Place[]>([]);
  const [visitedPlaces, setVisitedPlaces] = useState<Place[]>([]);
  const [showReviewBox, setShowReviewBox] = useState(false);
  const [currentPlaceId, setCurrentPlaceId] = useState<number | null>(null);

  // Obtener el ID del usuario que inició sesión desde localStorage
  const loggedInUserId = localStorage.getItem('userId');

  useEffect(() => {
    if (loggedInUserId) {
      axios.get('https://mongo-sesion-latest.onrender.com/reseñas')
        .then(response => {
          const filteredData = response.data
            .filter((item: APIResponse) => item.usuarioID === loggedInUserId && item.estadoID === '2') // Filtrar por usuario y estadoID igual a '2'
            .map((item: APIResponse) => ({
              id: parseInt(item.datoID),
              name: 'Recinto A', // Ajusta el nombre según tus datos
              rating: item.valor,
              review: item.comentario
            }));
          setVisitedPlaces(filteredData);
        })
        .catch(error => {
          console.error('Hubo un error al obtener los datos:', error);
        });
    }
  }, [loggedInUserId]);

  const handleRatingChange = (newRating: number, placeId: number) => {
    setRating(newRating);
    setCurrentPlaceId(placeId);
    setShowReviewBox(true);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = () => {
    if (currentPlaceId !== null) {
      const ratedPlace = { id: currentPlaceId, name: 'Recinto A', rating: rating, review: text };
      setRatedPlaces(prevRatedPlaces => [...prevRatedPlaces, ratedPlace]);
      setVisitedPlaces(prevVisitedPlaces => prevVisitedPlaces.filter(place => place.id !== currentPlaceId));
      setShowReviewBox(false);
    }
  };

  return (
    <div>
      <h2 style={{ color: 'black' }}>Reseñas</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>RNT</th>
            <th>Lugar</th>
            <th>Calificación</th>
            <th>Reseña</th>
          </tr>
        </thead>
        <tbody>
          {visitedPlaces.map(place => (
            <tr key={place.id}>
              <td>{place.id}</td>
              <td>{place.name}</td>
              <td>{place.rating}</td>
              <td>{place.review}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showReviewBox && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
          <h2>Escribe tu reseña</h2>
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            placeholder="Escribe un comentario"
          />
          <button onClick={handleSubmit}>Enviar</button>
        </div>
      )}

      <Link to="/usuario" style={{ padding: '10px 20px', backgroundColor: 'black', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Volver</Link>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Reseñas />} />
        <Route path="/reseñas" element={<Reseñas />} />
      </Routes>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
