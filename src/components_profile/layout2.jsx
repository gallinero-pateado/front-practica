import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';

const Layout2 = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Cierra el menú desplegable al cambiar de ruta
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    return (
        <div className="flex flex-col min-h-screen bg-[#DAEDF2] font-ubuntu">
            {/* Header */}
            <header className="bg-[#0092BC] text-white p-6 relative z-20">
                <div className="flex justify-between items-center mx-auto">
                    <Link to="/search" className="text-5xl font-bold italic">ULINK</Link>
                    <button
                        onClick={toggleMenu}
                        className="p-2 bg-[#DAEDF2] rounded-full"
                    >
                        {isMenuOpen ? <X color="#0092BC" size={32} /> : <Menu color="#0092BC" size={32} />}
                    </button>
                </div>
            </header>

            {/* Sidebar Menu */}
            {isMenuOpen && (
                <div className="fixed top-0 right-0 h-full w-64 bg-[#0092BC] text-white shadow-lg z-30 flex flex-col p-6 transition-transform duration-300">
                    <Link to="/user-profile" className="block py-4 px-2 hover:bg-[#DAEDF2] hover:text-[#0092BC] rounded-md">Perfil</Link>
                    <Link to="/search" className="block py-4 px-2 hover:bg-[#DAEDF2] hover:text-[#0092BC] rounded-md">Buscar</Link>
                    <Link to="/leerforo" className="block py-4 px-2 hover:bg-[#DAEDF2] hover:text-[#0092BC] rounded-md">Foro</Link>
                    <Link to="/logout" className="block py-4 px-2 hover:bg-[#DAEDF2] hover:text-[#0092BC] rounded-md">Salir</Link>

                    {/* Icono de Cierre */}
                    <ChevronRight
                        onClick={toggleMenu}
                        className="mt-auto self-end cursor-pointer hover:text-[#DAEDF2] transition duration-300"
                        size={24}
                        color="white"
                    />
                </div>
            )}

            {/* Body */}
            <main className="flex-grow">
                {children} {/* Aquí se renderiza el contenido principal */}
            </main>

            {/* Footer */}
            <footer className="bg-[#0092BC] text-white text-center p-2">
                <p>Desarrollado por estudiantes UTEM</p>
                <p>tallersistemasdesoftware@utem.cl / Teléfono (---) --- --- ---</p>
                <p>&copy; 2024 ULINK. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Layout2;
