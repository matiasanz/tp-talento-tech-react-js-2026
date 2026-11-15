// src/componentes/Login/Login.jsx
import { useState } from 'react';
import login, { ErrInvalidCredentials } from '../../js/repositories/firebase/login';
import { useErrorHandler } from '../context/error_handler';
import { useSessionUser } from '../context/session';

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("")
	const [message, setMessage] = useState("")
	const {handleError} = useErrorHandler()
	const {sessionUser, onLogin} = useSessionUser() 

	return sessionUser && (<h2>Bienvenido {sessionUser.email}</h2>) || (
	<>
		<h2>Iniciar Sesión</h2>
		<form onSubmit={handleLogin({email, password}, login, onLogin, setMessage, handleError)}>
			<input type="email" required autoComplete='on'
				placeholder="Correo electrónico"
				value={email}
				onChange={onChange(setEmail)}
			/>

			<input type="password" required autoComplete='on'
				placeholder="Contraseña"
				value={password}
				onChange={onChange(setPassword)}
			/>
			<input type="submit" value="Ingresar"/>
		</form>

		<h5>{message}</h5>
	</>
	);
};

export default Login;

const handleLogin = ({email, password}, login, onLogin, setMessage, handleError) => (event) => {
	event.preventDefault();

	login(email, password)
		.then(onLogin).catch((error) => {
			if(error instanceof ErrInvalidCredentials){
				setMessage("El usuario y/o la contraseña son incorrectos")
				return
			}

			handleError(error)
		}
	)
}

//utils
function onChange(setter){
	return ({target: {value}}) => {
		setter(value)
	}
}

