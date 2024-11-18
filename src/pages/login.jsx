import { useState } from "react";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    const handleLogin = (e) => {
        e.preventDefault()

        if (!email || !senha) {
            setMensagem("Preencha todos os campos!")
            return
        }

        if (email === "user" && senha === "user") {
            setMensagem("Login efetuado com sucesso!")
        } else {
            setMensagem("Usuário ou senha inválidos!")
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