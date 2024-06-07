import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createHashRouter, RouterProvider} from 'react-router-dom'

import Home from './routes/home'
import About from './routes/about'
import Contact from './routes/contact'
import Usuario from './routes/usuario'
import Registro from './routes/regsitro'
import Reseñas from './routes/reseñas'





const router = createHashRouter([
  {
    path:'/',
    element:<Home />
  },
  {
    path:'/about',
    element:<About />
  },
  {
    path:'/contact',
    element:<Contact />
  },

  {
    path:'/usuario',
    element:<Usuario/>
  },
  
  {
    path:'/registro',
    element:<Registro/>
  },

  {
    path:'/reseñas',
    element:<Reseñas/>
  },



])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode> 
    <RouterProvider router={router} />
  </React.StrictMode>,
);
