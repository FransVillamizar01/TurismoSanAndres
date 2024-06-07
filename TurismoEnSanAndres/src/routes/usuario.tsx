import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Rating from 'react-rating-stars-component';
import './usuario.css';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from 'react-router-dom';
import Reseñas from './reseñas';
import axios from 'axios';
import Home from './home'; // Importamos Home

type Place = {
  id: number; // Esto debe ser el ID de la reseña, no el datoID
  name: string;
  rating?: number;
  review?: string;
  estadoID?: string;
  datoID: number; // Añadido datoID como propiedad separada
};

type APIResponse = {
  id: number; // ID de la reseña
  valor: number;
  comentario: string;
  usuarioID: string;
  datoID: number;
  estadoID: string;
};

export default function Usuario() {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [visitedPlaces, setVisitedPlaces] = useState<Place[]>([]);
  const [showReviewBox, setShowReviewBox] = useState(false);
  const [currentPlaceId, setCurrentPlaceId] = useState<number | null>(null);
  const navigate = useNavigate(); // Hook de navegación

  // Obtener el ID del usuario que inició sesión desde localStorage
  const loggedInUserId = localStorage.getItem('userId');

  useEffect(() => {
    if (loggedInUserId) {
      axios
        .get('https://mongo-sesion-latest.onrender.com/reseñas')
        .then((response) => {
          const filteredData = response.data
            .filter((item: APIResponse) => item.usuarioID === loggedInUserId)
            .map((item: APIResponse) => ({
              id: item.id, // Usamos el ID correcto de la reseña
              name: 'Recinto A', // Ajusta el nombre según tus datos
              rating: item.valor,
              review: item.comentario,
              estadoID: item.estadoID,
              datoID: item.datoID, // Añadido datoID
            }));
          setVisitedPlaces(filteredData);
        })
        .catch((error) => {
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
    if (currentPlaceId !== null && loggedInUserId !== null) {
      // Buscar el lugar actual en los lugares visitados
      const currentPlace = visitedPlaces.find(place => place.id === currentPlaceId);
  
      if (currentPlace) {
        // Crear el objeto de la reseña con todos los datos necesarios
        const review = {
          id: currentPlace.id, // El ID de la reseña correcto
          valor: rating, // El valor modificado
          comentario: text, // El comentario modificado
          usuarioID: loggedInUserId, // El ID del usuario
          datoID: currentPlace.datoID, // El datoID correcto
          estadoID: '2', // El estadoID
        };
  
        // Imprimir los datos en la consola
        console.log('Datos enviados:', review);
  
        // Actualizar la reseña utilizando el método PUT
        axios
          .put('https://apisd-production-cb9f.up.railway.app/updateResena', review)
          .then((response) => {
            console.log('Reseña actualizada con éxito:', response.data);
            // Actualizar el estado local con el nuevo estadoID
            setVisitedPlaces((prevVisitedPlaces) =>
              prevVisitedPlaces.map((place) =>
                place.id === currentPlaceId
                  ? { ...place, estadoID: '2' }
                  : place
              )
            );
            setShowReviewBox(false); // Agregar esta línea para cerrar la ventana emergente
          })
          .catch((error) => {
            console.error('Error al actualizar la reseña:', error);
          });
      } else {
        console.error('Error: no se encontró el lugar con el ID dado');
      }
    } else {
      console.error('Error: loggedInUserId o currentPlaceId son nulos');
    }
  };

  // Filtrar lugares con estadoID diferente de "2"
  const filteredVisitedPlaces = visitedPlaces.filter(place => place.estadoID !== '2');

  const handleLogout = () => {
    localStorage.removeItem('userId'); // Eliminar el ID del usuario de localStorage
    navigate('/'); // Redirigir a la página de inicio
  };

  return (
    <div>
      <h2 style={{ color: 'black' }}>Lugares Visitados</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Link
          to="/reseñas"
          style={{
            padding: '10px 20px',
            backgroundColor: 'black',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            marginRight: '10px'
          }}
        >
          Ver Reseñas
        </Link>
        <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px' }}>
          Cerrar sesión
        </button>
      </div>
      <table border={1}>
        <thead>
          <tr>
            <th>RNT</th>
            <th>Lugar</th>
            <th>Calificación</th>
          </tr>
        </thead>
        <tbody>
          {filteredVisitedPlaces.map((place) => (
            <tr key={place.id}>
              <td>{place.datoID}</td> {/* Mostrar el datoID aquí */}
              <td>{place.name}</td>
              <td>
                <Rating
                  count={5}
                  size={24}
                  activeColor="#ffd700"
                  value={place.rating}
                  onChange={(newRating: number) =>
                    handleRatingChange(newRating, place.id)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showReviewBox && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
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
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/usuario" element={<Usuario />} />
        <Route path="/reseñas" element={<Reseñas />} />
      </Routes>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));









