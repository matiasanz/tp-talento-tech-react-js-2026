import { logout } from '../../../js/repositories/firebase/login';
import { useErrorHandler } from '../../context/error_handler';
import { useSessionUser } from '../../context/session';
import LoginForm from './form';

const Login = () => {
	const {sessionUser} = useSessionUser() 
	const {handleError} = useErrorHandler()

	return !sessionUser && <LoginForm/> || (
	<>
		<h2>Bienvenido {sessionUser.email}</h2>
		<button onClick={handleLogout(handleError)}>Cerrar sesión</button>
	</>)
};

export default Login;


const handleLogout = (handleError) => event => {
	event.preventDefault()
	logout().catch(handleError)
}