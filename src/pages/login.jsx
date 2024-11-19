import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [variant, setVariant] = useState("danger"); // Para estilos diferentes no Alert
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !senha) {
            setMensagem("Preencha todos os campos!");
            setVariant("warning");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, senha);
            setMensagem("Login realizado com sucesso!");
            setVariant("success");
            setTimeout(() => navigate("/admin"), 1000);
        } catch (error) {
            setMensagem("Email ou senha inválidos!");
            setVariant("danger");
        }
    };

    return (
        <Container className="vh-100 d-flex justify-content-center align-items-center">
            <Card style={{ maxWidth: "400px", width: "100%" }} className="shadow p-4">
                <h2 className="text-center mb-4">Login</h2>
                {mensagem && <Alert variant={variant}>{mensagem}</Alert>}
                <Form onSubmit={handleLogin}>
                    <Form.Group controlId="email" className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Digite seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="senha" className="mb-3">
                        <Form.Label>Senha</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary" className="w-100">
                        Entrar
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};
