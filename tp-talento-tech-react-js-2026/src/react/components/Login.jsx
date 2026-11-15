// src/componentes/Login/Login.jsx
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = (e) => {
		e.preventDefault();
		const auth = getAuth();
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				console.log('ok: '+JSON.stringify(userCredential, null, 2))
			}).catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log('no ok: '+JSON.stringify(error, null, 2)+' '+errorCode+ ' '+errorMessage)
			}
		);
	};

	return (
		<>
			<h2>Iniciar Sesión</h2>
			<form onSubmit={handleLogin}>
				<input type="email"
					placeholder="Correo electrónico"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<input
					type="password"

					placeholder="Contraseña"
					value={password}

					onChange={(e) => setPassword(e.target.value)}
				/>
				<input type="submit" value="Ingresar"/>
			</form>
		</>
	);
};

export default Login;