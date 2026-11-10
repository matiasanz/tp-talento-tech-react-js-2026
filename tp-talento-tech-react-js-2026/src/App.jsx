import { useEffect, useState } from "react";
import { db } from "./js/repositories/firebase/config"; // Importa la instancia de Firestore que exportaste
import { collection, addDoc } from "firebase/firestore";

function App() {
  const [estado, setEstado] = useState("Conectando con Firebase...");

  useEffect(() => {
    const probarConexion = async () => {
      try {
        await addDoc(collection(db, "test_conexiones"), {
          fecha: new Date().toISOString(),
          mensaje: "¡Hola Firebase! Conexión exitosa desde mi proyecto de React."
        });
        setEstado("¡Conectado exitosamente a Firebase! 🎉");
      } catch (error) {
        console.error("Error de conexión:", error);
        setEstado(`Error al conectar: ${error.message}`);
      }
    };

    probarConexion();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif" }}>
      <h2>Prueba de Conexión Firebase</h2>
      <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: estado.includes("🎉") ? "green" : "red" }}>
        {estado}
      </p>
    </div>
  );
}

export default App;

/*

import Layout from './components/Layout';
import { CartProvider } from './context/cart';
import Router from './router';
import { BrowserRouter } from 'react-router-dom';

export default () => (
    <BrowserRouter>
    <CartProvider>
        <Layout>
            <Router/>
        </Layout>
    </CartProvider>
    </BrowserRouter>
)

*/