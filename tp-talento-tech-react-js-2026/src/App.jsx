import Layout from './components/Layout';
import Router from './router';
import { BrowserRouter } from 'react-router-dom';

export default () => (
    <BrowserRouter>
        <Layout>
            <Router/>
        </Layout>
    </BrowserRouter>
)

