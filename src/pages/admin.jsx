import { useState, useEffect } from "react";
import { getAuth, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { alterarDadosUsuario } from "../utils/authutils";
import { deleteDoc, doc, getFirestore, setDoc } from "firebase/firestore";
import { Modal, Button, Form, Alert, Container, Row, Col } from "react-bootstrap";
import { UserPage } from "./user";

export const AdminPage = () => {
    const [adminNumero, setAdminNumero] = useState("");
    const [adminMensagem, setAdminMensagem] = useState("");
    const [isNumeroDefinido, setIsNumeroDefinido] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [novoEmail, setNovoEmail] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [mensagemAlteracao, setMensagemAlteracao] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("");
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [showAdminModal, setShowAdminModal] = useState(false); // Estado para controle do modal de admin

    const db = getFirestore();
    // const auth = getAuth();

    // setPersistence(auth, browserLocalPersistence)
    //     .then(() => {
    //         console.log("Persistência definida para local");
    //     })
    //     .catch((error) => {
    //         console.error("Erro ao definir persistência: ", error.message);
    //     });

    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (user) => {
    //         if (user) {
    //             setUsuarioLogado(user);
    //         } else {
    //             window.location.href = "/login";
    //         }
    //     });

    //     return () => unsubscribe();
    // }, [auth]);

    // const logout = async () => {
    //     try {
    //         await signOut(auth);
    //         window.location.href = "/";
    //     } catch (error) {
    //         console.error("Erro ao deslogar: ", error.message);
    //     }
    // };

    const abrirModal = () => {
        setIsModalOpen(true);
    };

    const fecharModal = () => {
        setIsModalOpen(false);
        setNovoEmail("");
        setNovaSenha("");
        setSenhaAtual("");
        setMensagemAlteracao("");
    };

    const alterarDados = async () => {
        try {
            const mensagem = await alterarDadosUsuario(auth, novoEmail, novaSenha, senhaAtual);
            setMensagemAlteracao(mensagem);
            fecharModal();
        } catch (error) {
            setMensagemAlteracao(`Erro ao alterar dados: ${error.message}`);
        }
    };

    const setNumeroAdmin = async () => {
        if (adminNumero) {
            const docRef = doc(db, "sorteio", "numeroSorteado");
            await setDoc(docRef, { numero: parseInt(adminNumero) });
            setAdminMensagem("Número sorteado definido com sucesso!");
            setIsNumeroDefinido(true);
        }
    };

    const tirarNumeroDefinido = async () => {
        const docRef = doc(db, "sorteio", "numeroSorteado");
        await deleteDoc(docRef);
        setAdminMensagem("Sorteio voltou ao normal!");
        setIsNumeroDefinido(false);
    };

    return (
        <Container className="mt-5">
            <UserPage/>

            {/* Botão para abrir o modal do admin */}
            <Row className="mt-5">
                <Col md={{ span: 6, offset: 3 }}>
                    <Button variant="primary" className="w-50" onClick={() => setShowAdminModal(true)}>
                        Abrir Admin
                    </Button>
                </Col>
            </Row>

            {/* Modal para Admin */}
            <Modal show={showAdminModal} onHide={() => setShowAdminModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Admin: Alterar Número Sorteado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={{ span: 6, offset: 3 }}>
                            <h3 className="text-center mb-4">Alterar número sorteado</h3>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="number"
                                    placeholder="Definir número do sorteio"
                                    value={adminNumero}
                                    onChange={(e) => setAdminNumero(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" className="me-2" onClick={setNumeroAdmin}>
                                Definir número do sorteio
                            </Button>
                            <Button variant="danger" onClick={tirarNumeroDefinido}>
                                Tirar número definido
                            </Button>
                            {adminMensagem && (
                                <Alert className="mt-3" variant={isNumeroDefinido ? "success" : "info"}>
                                    {adminMensagem}
                                </Alert>
                            )}
                        </Col>
                    </Row>

                    {/* <Row className="mt-5">
                        <Col md={{ span: 6, offset: 3 }}>
                            <Button variant="warning" className="w-100 mb-3" onClick={abrirModal}>
                                Alterar E-mail e Senha
                            </Button>
                            <Button variant="secondary" className="w-100" onClick={logout}>
                                Sair
                            </Button>
                        </Col>
                    </Row> */}

                    {/* Modal para Alteração de Dados */}
                    <Modal show={isModalOpen} onHide={fecharModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Alterar E-mail e Senha</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Senha Atual</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Senha Atual"
                                    value={senhaAtual}
                                    onChange={(e) => setSenhaAtual(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Novo E-mail</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Novo E-mail"
                                    value={novoEmail}
                                    onChange={(e) => setNovoEmail(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Nova Senha</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Nova Senha"
                                    value={novaSenha}
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                />
                            </Form.Group>
                            {mensagemAlteracao && <Alert variant="info">{mensagemAlteracao}</Alert>}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="success" onClick={alterarDados}>
                                Alterar
                            </Button>
                            <Button variant="secondary" onClick={fecharModal}>
                                Fechar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Modal.Body>
            </Modal>
        </Container>
    );
};
