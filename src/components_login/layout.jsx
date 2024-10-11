import React from 'react';
import { Outlet } from 'react-router-dom';
import bodyImage from '../imagen/body.jpg';

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-sky-100">
            {/* Header */}
            <header className="bg-blue-600 text-white p-6">
                <div className="flex justify-between items-center mx-auto">
                    <h1 className="text-5xl font-bold italic">ULINK</h1>
                    <div>
                        <a href="/register" className="bg-sky-300 text-blue-800 px-8 py-3 rounded mr-5 font-bold italic text-lg hover:bg-sky-400 transition duration-300">
                            Sign Up
                        </a>
                        <a href="/" className="bg-blue-800 text-white px-9 py-3 rounded font-bold italic text-lg hover:bg-blue-400 transition duration-300">
                            Log In
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
                        <h2 className="text-4xl font-bold text-blue-800 mb-6">Bienvenido a ULINK</h2>
                        <p className="text-xl text-blue-600">Conectamos estudiantes con oportunidades increíbles.</p>
                    </div>
                    <img
                        src={bodyImage}
                        alt="Personas trabajando"
                        className="w-full h-auto object-cover rounded-lg shadow-lg"
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-blue-600 text-white text-center p-2">
                <p>Desarrollado por estudiantes UTEM</p>
                <p>tallersistemasdesoftware@utem.cl / Teléfono (---) --- --- ---</p>
                <p>&copy; 2024 ULINK. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Layout;