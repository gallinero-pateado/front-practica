import React from 'react';
import { Link } from 'react-router-dom';

const Layout2 = ({ children, isLogout }) => {
    return (
        <div className="flex flex-col min-h-screen bg-[#DAEDF2] font-ubuntu">
            {/* Header */}
            <header className="bg-[#0092BC] text-white p-7">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <Link to="/rpractica" className="text-5xl font-bold italic">ULINK</Link>
                    {/* Solo muestra los botones si no es una página de Logout */}
                    {!isLogout && (
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/user-profile"
                                className="flex items-center text-lg font-bold text-white border border-white rounded-lg px-4 py-2 hover:bg-[#A3D9D3] transition-colors font-rubik"
                            >
                                Perfil
                            </Link>
                            <Link
                                to="/logout"
                                className="flex items-center text-lg font-bold text-white border border-white bg-red-600 rounded-lg px-4 py-2 hover:bg-red-700 transition-colors font-inter"
                            >
                                Salir
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            {/* Body */}
            <main className="flex-grow">
                {children} {/* Aquí se renderiza el contenido principal */}
            </main>
            <footer className="bg-[#0092BC] text-white text-center p-2">
                <p>Desarrollado por estudiantes UTEM</p>
                <p>tallersistemasdesoftware@utem.cl / Teléfono (---) --- --- ---</p>
                <p>&copy; 2024 ULINK. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Layout2;
