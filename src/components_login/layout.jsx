import React from 'react';
import { Outlet } from 'react-router-dom';
import bodyImage from '../imagen/body.jpg';

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#DAEDF2] font-ubuntu">
            {/* Header */}
            <header className="bg-[#0092BC] text-white p-4 md:p-6">
                <div className="flex justify-between items-center mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold italic">ULINK</h1>
                    <div className="flex space-x-2 md:space-x-4">
                        <a
                            href="/register"
                            className="bg-[#A3D9D3] text-[#0092BC] px-3 py-2 rounded font-bold italic text-sm md:text-lg hover:bg-[#8ec3c0] transition duration-300"
                        >
                            Registrarse
                        </a>
                        <a
                            href="/"
                            className="bg-[#0092BC] text-white px-3 py-2 rounded font-bold italic text-sm md:text-lg hover:bg-[#007a9a] transition duration-300"
                        >
                            Iniciar sesión
                        </a>
                    </div>
                </div>
            </header>

            {/* Body */}
            <main className="flex-grow flex flex-col md:flex-row container mx-auto my-8 items-start justify-between px-4 w-full">
                <div className="w-full md:w-1/2 mb-8 md:mb-0">
                    <Outlet />
                </div>
                <div className="w-full md:w-1/2 md:ml-8">
                    <div className="text-right mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#0092BC] mb-4">Bienvenido a ULINK</h2>
                        <p className="text-lg md:text-xl text-[#005F7F]">Conectamos estudiantes con oportunidades increíbles.</p>
                    </div>
                    <img
                        src={bodyImage}
                        alt="Personas trabajando"
                        className="w-full h-auto object-cover rounded-lg shadow-lg"
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#0092BC] text-white text-center p-4 md:p-2">
                <p className="text-sm md:text-base">Desarrollado por estudiantes UTEM</p>
                <p className="text-sm md:text-base">tallersistemasdesoftware@utem.cl / Teléfono (---) --- --- ---</p>
                <p className="text-sm md:text-base">&copy; 2024 ULINK. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Layout;
