import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()

        if (!email || !senha) {
            setMensagem("Preencha todos os campos!")
            return
        }

        try {
            await signInWithEmailAndPassword(auth, email, senha)
            setMensagem("Login realizado com sucesso!")
            navigate("/admin")
        } catch (error){
            setMensagem("Email ou senha inválidos!")
        }

    }

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2 className="login-title">Login</h2>

                <input
                    type="email"
                    className="login-input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="login-input"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />

                <button type="submit" className="login-button">Entrar</button>

                {mensagem && <p className="login-message">{mensagem}</p>}
            </form>
        </div>
    )
}