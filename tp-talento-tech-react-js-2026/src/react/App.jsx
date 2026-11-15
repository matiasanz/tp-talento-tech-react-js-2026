import Layout from './components/Layout';
import { CartProvider } from './context/cart';
import { ErrorHandlerProvider } from './context/error_handler';
import Router from './router';
import { BrowserRouter } from 'react-router-dom';

export default () => (
    <BrowserRouter>
        <ErrorHandlerProvider>
        <CartProvider>
                <Layout>
                    <Router/>
                </Layout>
        </CartProvider>
        </ErrorHandlerProvider>
    </BrowserRouter>
)