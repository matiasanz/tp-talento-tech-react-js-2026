import Layout from './components/Layout';
import { CartProvider } from './context/cart';
import { ErrorHandlerProvider } from './context/error_handler';
import { SessionUserProvider } from './context/session';
import Router from './router';
import { BrowserRouter } from 'react-router-dom';

export default () => (
    <BrowserRouter>
        <ErrorHandlerProvider>
            <CartProvider>
                <SessionUserProvider>
                    <Layout>
                        <Router/>
                    </Layout>
                </SessionUserProvider>
            </CartProvider>
        </ErrorHandlerProvider>
    </BrowserRouter>
)