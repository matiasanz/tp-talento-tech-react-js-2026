import { useState } from 'react';
import { logout } from '../../../../../js/repositories/firebase/login';
import { useErrorHandler } from '../../../../context/error_handler';
import { onAuthStateChange } from '../../../../context/session';
import LoginForm from './Form';

const Login = () => {
	const [email, setEmail] = useState("")

	onAuthStateChange( user => setEmail(user?.email??"") )

	const {handleError} = useErrorHandler()

	return !email.length && <LoginForm/> || (
	<>
		<h2>Bienvenido {email}</h2>
		<button onClick={handleLogout(handleError)}>Cerrar sesión</button>
	</>)
};

export default Login;


const handleLogout = (handleError) => event => {
	event.preventDefault()
	logout().catch(handleError)
}