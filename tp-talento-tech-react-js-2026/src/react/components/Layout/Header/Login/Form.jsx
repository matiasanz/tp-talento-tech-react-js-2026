import { useState } from 'react';
import { login, signup, ErrInvalidCredentials, ErrWeakPassword, ErrInvalidEmail, ErrEmailAlreadyInUse } from '../../../../../js/repositories/firebase/login';
import { useErrorHandler } from '../../../../context/error_handler';

export default () =>
<>
    <UserForm title={"Iniciar sesión"} onSubmit={login} expectedErrors={
        new Map([
            [ErrInvalidCredentials, "El usuario y/o la contraseña son incorrectos"]
        ])
    }/>
    <UserForm title={"Registrarse"} onSubmit={signup} expectedErrors={
        new Map([
            [ErrWeakPassword, "La contraseña es muy débil, debe tener al menos 6 caracteres."],
            [ErrInvalidEmail, "Por favor, ingrese un email válido."],
            [ErrEmailAlreadyInUse, "Ya existe un usuario creado para el email ingresado. desea iniciar sesión con ese usuario?"]
        ])
    }/>
</>


function UserForm({title, onSubmit, expectedErrors}){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const {handleError} = useErrorHandler()

    return (
    <>
        <h2>{title}</h2>
        <form onSubmit={handleUserForm({email, password}, onSubmit, setMessage, expectedErrors, handleError)}>
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

const handleUserForm = ({email, password}, onSubmit, setMessage, expectedErrors, handleError) => (event) => {
	event.preventDefault();

	onSubmit(email, password)
		.catch((error) => {
            for(const [errType, message] of expectedErrors){
                if(error instanceof errType){
                    setMessage(message)
                    return
                }
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

