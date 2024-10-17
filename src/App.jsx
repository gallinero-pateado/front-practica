import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components_login/layout'; // Layout para login
import Login from './components_login/login'; //Login para estudiante
import Register from './components_login/register'; //Register para estudiante
import LoginEm from './components_login/login_em'; //Login para empresa
import RegisterEm from './components_login/register_em'; //Register para empresa
import CompleteProfile from './components_login/complete_profile';
import PasswordResetForm from './components_login/password_recovery';
import Layout2 from './components_profile/layout2'; // Layout para el resto de cosas 
import UserProfile from './components_profile/user-profile';
import EditProfile from './components_profile/edit-profile';
import Logout from './components_profile/logout';
import Cpractica from './components_crud/cpractica'; // Componente para crear prácticas
import Rpractica from './components_crud/rpractica'; // Componente para que los estudiantes lean prácticas 
import Upractica from './components_crud/upractica'; // Componente para actualizar prácticas
import Dpractica from './components_crud/dpractica'; // Componente para eliminar prácticas
import Gpracticas from './components_crud/gpracticas'; // Componente para que las empresas lean prácticas
import PracticasList from './components_busqueda/search';
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas con el primer Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="login_em" element={<LoginEm />} />
          <Route path="register_em" element={<RegisterEm />} />
          <Route path="complete_profile" element={<CompleteProfile />} />
          <Route path="password_recovery" element={<PasswordResetForm />} />
        </Route>

        {/* Rutas con el segundo Layout (Layout2) */}
        <Route path="/user-profile" element={<Layout2><UserProfile /></Layout2>} />
        <Route path="/edit-profile" element={<Layout2><EditProfile /></Layout2>} />
        <Route path="/logout" element={<Layout2><Logout /></Layout2>} />

        {/* Rutas CRUD para las prácticas */}
        <Route path="/cpractica" element={<Layout2><Cpractica /></Layout2>} />
        <Route path="/rpractica" element={<Layout2><Rpractica /></Layout2>} />
        <Route path="/upractica" element={<Layout2><Upractica /></Layout2>} />
        <Route path="/dpractica" element={<Layout2><Dpractica /></Layout2>} />
        <Route path="/gpracticas" element={<Layout2><Gpracticas /></Layout2>} />
        <Route path="/search" element={<Layout2><PracticasList /></Layout2>} />
      </Routes>
    </Router>
  );
}

export default App;
