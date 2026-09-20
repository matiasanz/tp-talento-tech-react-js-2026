import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {routes, paths } from './routes';

const {HOME, ABOUT} = paths

export default () => (
    <BrowserRouter>
        <nav style={{ padding: '10px', background: '#eee', marginBottom: '20px' }}>
            <Link to={HOME} style={{ marginRight: '15px' }}>Inicio</Link>
            <Link to={ABOUT}>Acerca de</Link>
        </nav>

        <Routes>
            {
                routes.map(({path, element}) => {
                    <Route path={path} element={element}></Route>                    
                })
            }
        </Routes>
    </BrowserRouter>
)

