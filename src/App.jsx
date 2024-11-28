import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UserProfile from './components_profile/user-profile';
import EditProfile from './components_profile/edit-profile';
import Logout from './components_profile/logout';
import Layout2 from './components_profile/layout2'; // Layout para el resto de cosas 

import LogoutEm from './components_crud/logout-em';
import Layout3 from './components_crud/layout3'; // Nuevo Layout3
import Cpractica from './components_crud/cpractica'; // Componente para crear prácticas
import Rpractica from './components_crud/rpractica'; // Componente para que los estudiantes lean prácticas
import Dpractica from './components_crud/dpractica'; // Componente para eliminar y editar prácticas
import Gpracticas from './components_crud/gpracticas'; // Componente para que las empresas lean prácticas

import PracticasList from './components_busqueda/search';

import PostulacionPractica from './components_postulacion/postulacion_practica';
import PostulantesList from './components_postulacion/postulantesapracticas';

import TemasList from './components_foro/leerforo';
import CrearTemaForm from './components_foro/creartema';
import CommentEdit from './components_foro/actualizarcomentario';
import CrearComentario from './components_foro/crearcomentario';
import ReplyComment from './components_foro/respondercomentario';


const App = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Layout2><PracticasList /></Layout2>} />

        {/* Rutas con el segundo Layout (Layout2) */}
        <Route path="/user-profile" element={<Layout2><UserProfile /></Layout2>} />
        <Route path="/edit-profile" element={<Layout2><EditProfile /></Layout2>} />
        <Route path="/logout" element={<Layout2><Logout /></Layout2>} />
        <Route path="/rpractica" element={<Layout2><Rpractica /></Layout2>} />
        <Route path="/postulacion_practica" element={<Layout2><PostulacionPractica /></Layout2>} />
        <Route path="/leerforo" element={<Layout2><TemasList /></Layout2>} />
        <Route path="/creartema" element={<Layout2><CrearTemaForm /></Layout2>} />
        <Route path="/actualizarcomentarios" element={<Layout2><CommentEdit /></Layout2>} />
        <Route path="/crearcomentario" element={<Layout2><CrearComentario /></Layout2>} />
        <Route path="/respondercomentario" element={<Layout2><ReplyComment /></Layout2>} />




        {/* Rutas con el Layout3 */}
        <Route path="/cpractica" element={<Layout3><Cpractica /></Layout3>} />
        <Route path="/upractica" element={<Layout3><Dpractica /></Layout3>} />
        <Route path="/gpracticas" element={<Layout3><Gpracticas /></Layout3>} />
        <Route path="/postulantesapracticas" element={<Layout3><PostulantesList /></Layout3>} />
        <Route path="/logout-em" element={<Layout3><LogoutEm /></Layout3>} />

      </Routes>
    </Router>
  );
}

export default App;
