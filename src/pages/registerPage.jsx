import { useState } from "react";
import { auth, createUserWithEmailAndPassword } from "../services/firebase"; 

export const RegistroPage = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState(false);

    const handleRegister = (e) => {
        e.preventDefault();

        if (!email || !senha) {
            setMensagem("Por favor, preencha todos os campos.");
            setErro(true);
            return;
        }

        // Verificar se a senha tem pelo menos 6 caracteres
        if (senha.length < 6) {
            setMensagem("A senha deve ter pelo menos 6 caracteres.");
            setErro(true);
            return;
        }

        // Criação de usuário com email e senha no Firebase
        createUserWithEmailAndPassword(auth, email, senha)
            .then((userCredential) => {
                const user = userCredential.user;
                setMensagem("Conta criada com sucesso! Bem-vindo!");
                setErro(false);
                console.log("Usuário registrado: ", user);
                window.location.href = "/login"; 
            })
            .catch((error) => {
                const errorCode = error.code;
                let errorMessage = error.message;

                // Filtrando os erros específicos
                if (errorCode === "auth/email-already-in-use") {
                    errorMessage = "Este e-mail já está em uso. Tente outro.";
                } else if (errorCode === "auth/weak-password") {
                    errorMessage = "A senha é muito fraca. Escolha uma senha mais forte.";
                } else if (errorCode === "auth/invalid-email") {
                    errorMessage = "O e-mail fornecido é inválido. Verifique o formato.";
                }

                setMensagem(errorMessage);
                setErro(true);
                console.error("Erro no registro: ", errorCode, errorMessage);
            });
    };

    return (
        <div className="register-container">
            <form onSubmit={handleRegister} className="register-form">
                <h2 className="register-title">Crie sua Conta</h2>

                <input
                    type="email"
                    className={`register-input ${erro && !email ? "input-error" : ""}`}
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className={`register-input ${erro && !senha ? "input-error" : ""}`}
                    placeholder="Crie uma senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />

                <button type="submit" className="register-button">Registrar</button>

                {mensagem && (
                    <p className={`register-message ${erro ? "message-error" : "message-success"}`}>
                        {mensagem}
                    </p>
                )}
            </form>
        </div>
    );
};
