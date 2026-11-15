import { useState } from 'react';
import { login, ErrInvalidCredentials } from '../../../js/repositories/firebase/login';
import { useErrorHandler } from '../../context/error_handler';

export default () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const {handleError} = useErrorHandler()

    return (
    <>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin({email, password}, login, setMessage, handleError)}>
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
}

const handleLogin = ({email, password}, login, setMessage, handleError) => (event) => {
	event.preventDefault();

	login(email, password)
		.catch((error) => {
			if(error instanceof ErrInvalidCredentials){
				setMessage("El usuario y/o la contraseña son incorrectos")
				return
			}

			handleError(error)
		})
}

//utils
function onChange(setter){
	return ({target: {value}}) => {
		setter(value)
	}
}

