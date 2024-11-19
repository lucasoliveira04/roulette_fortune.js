import { useState } from "react";
import { auth, createUserWithEmailAndPassword } from "../services/firebase";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";

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

        if (senha.length < 6) {
            setMensagem("A senha deve ter pelo menos 6 caracteres.");
            setErro(true);
            return;
        }

        createUserWithEmailAndPassword(auth, email, senha)
            .then((userCredential) => {
                setMensagem("Conta criada com sucesso! Bem-vindo!");
                setErro(false);
                setTimeout(() => (window.location.href = "/login"), 1500);
            })
            .catch((error) => {
                const errorCode = error.code;
                let errorMessage = error.message;

                if (errorCode === "auth/email-already-in-use") {
                    errorMessage = "Este e-mail já está em uso. Tente outro.";
                } else if (errorCode === "auth/weak-password") {
                    errorMessage = "A senha é muito fraca. Escolha uma senha mais forte.";
                } else if (errorCode === "auth/invalid-email") {
                    errorMessage = "O e-mail fornecido é inválido. Verifique o formato.";
                }

                setMensagem(errorMessage);
                setErro(true);
            });
    };

    return (
        <Container className="vh-100 d-flex justify-content-center align-items-center">
            <Card style={{ maxWidth: "400px", width: "100%" }} className="shadow p-4">
                <h2 className="text-center mb-4">Crie sua Conta</h2>
                {mensagem && <Alert variant={erro ? "danger" : "success"}>{mensagem}</Alert>}
                <Form onSubmit={handleRegister}>
                    <Form.Group controlId="email" className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            isInvalid={erro && !email}
                        />
                        <Form.Control.Feedback type="invalid">
                            O campo de email é obrigatório.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="senha" className="mb-3">
                        <Form.Label>Senha</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Crie uma senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            isInvalid={erro && senha.length < 6}
                        />
                        <Form.Control.Feedback type="invalid">
                            A senha deve ter pelo menos 6 caracteres.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit" variant="primary" className="w-100">
                        Registrar
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};
