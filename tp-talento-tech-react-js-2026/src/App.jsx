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

