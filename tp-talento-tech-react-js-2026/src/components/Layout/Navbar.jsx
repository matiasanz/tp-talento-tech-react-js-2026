import { Link } from "react-router-dom"
import paths from "../../router/paths"
const {HOME, ABOUT} = paths

export default () => (
    <>
        <nav style={{ padding: '10px', background: '#eee', marginBottom: '20px' }}>
            <Link to={HOME} style={{ marginRight: '15px' }}>Inicio</Link>
            <Link to={ABOUT}>Acerca de</Link>
        </nav>
    </>
)