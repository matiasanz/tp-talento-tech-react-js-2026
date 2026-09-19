import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const Home = () => <h2>Página de Inicio 🏠</h2>;
const About = () => <h2>Acerca de Nosotros ℹ️</h2>;
const NotFound = () => <h2>Error 404: Página no encontrada ❌</h2>;

export default () => (
    <BrowserRouter>
        <nav style={{ padding: '10px', background: '#eee', marginBottom: '20px' }}>
          <Link to="/" style={{ marginRight: '15px' }}>Inicio</Link>
          <Link to="/about">Acerca de</Link>
        </nav>

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </BrowserRouter>
)