import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseApp } from "../services/firebase";
import { Container, Row, Col, Form, Button, Alert, InputGroup } from "react-bootstrap";

export const UserPage = () => {
    const [numero, setNumero] = useState("");
    const [inputNumero, setInputNumero] = useState("");
    const [mensagem, setMensagem] = useState("Defina um intervalo");
    const [intervaloEscolhido, setIntervaloEscolhido] = useState("100");
    const [inicioIntervalo, setInicioIntervalo] = useState(1);
    const [fimIntervalo, setFimIntervalo] = useState(100);
    const [intervaloDefinido, setIntervaloDefinido] = useState(false);
    const [mostrarBotaoDefinir, setMostrarBotaoDefinir] = useState(true);
    const [mostrarInputsPersonalizados, setMostrarInputsPersonalizados] = useState(false);
    const db = getFirestore(firebaseApp);

    useEffect(() => {
        // Verificar se já existe um intervalo salvo no localStorage
        const intervaloSalvo = localStorage.getItem("intervaloEscolhido");
        if (intervaloSalvo) {
            const intervalo = JSON.parse(intervaloSalvo);
            setIntervaloEscolhido(intervalo.intervaloEscolhido);
            setInicioIntervalo(intervalo.inicioIntervalo);
            setFimIntervalo(intervalo.fimIntervalo);
            setIntervaloDefinido(true);
            setMensagem("");
        }
    }, []);

    const buscarNumeroSorteado = async () => {
        const docRef = doc(db, "sorteio", "numeroSorteado");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setNumero(docSnap.data().numero);
        } else {
            setNumero(Math.floor(Math.random() * fimIntervalo) + inicioIntervalo);
        }
    };

    const sortearNumero = async () => {
        await buscarNumeroSorteado();

        if (parseInt(inputNumero) === numero) {
            setMensagem("Parabéns, você acertou o número!");
        } else {
            setMensagem("Infelizmente você errou o número!");
        }
    };

    const handleIntervaloChange = (event) => {
        const novoIntervalo = event.target.value;
        setIntervaloEscolhido(novoIntervalo);
        setMostrarBotaoDefinir(true);

        if (novoIntervalo === "custom") {
            setMostrarInputsPersonalizados(true);
            setInicioIntervalo(1);
            setFimIntervalo(100);
        } else {
            setMostrarInputsPersonalizados(false);
            setInicioIntervalo(1);
            setFimIntervalo(Number(novoIntervalo));
        }
    };

    const definirIntervalo = () => {
        if (inicioIntervalo >= fimIntervalo) {
            setMensagem("Erro: O número de início deve ser menor que o de fim.");
        } else {
            setIntervaloDefinido(true);
            setMostrarBotaoDefinir(false);
            setMensagem("");
            setMostrarInputsPersonalizados(false);

            // Salvar o intervalo no localStorage
            const intervalo = {
                intervaloEscolhido,
                inicioIntervalo,
                fimIntervalo,
            };
            localStorage.setItem("intervaloEscolhido", JSON.stringify(intervalo));
        }
    };

    const alterarIntervalo = () => {
        setIntervaloDefinido(false);
        setMostrarBotaoDefinir(true);
        setMensagem("Intervalo alterado. Escolha um novo intervalo.");
        setMostrarInputsPersonalizados(false);

        // Limpar o intervalo salvo no localStorage
        localStorage.removeItem("intervaloEscolhido");
    };

    return (
        <Container>
            <Row className="my-4">
                <Col>
                    <h2 className="text-center">
                        {intervaloDefinido ? `Número Sorteado: ${numero}` : "Defina um intervalo"}
                    </h2>
                </Col>
            </Row>

            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <Alert variant={mensagem.includes("Erro") ? "danger" : "primary"}>
                        {mensagem}
                    </Alert>
                </Col>
            </Row>

            {!intervaloDefinido && (
                <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                        <Form.Group controlId="intervalo">
                            <Form.Label>Escolha o intervalo de números:</Form.Label>
                            <Form.Select value={intervaloEscolhido} onChange={handleIntervaloChange}>
                                <option value="100">1 - 100</option>
                                <option value="50">1 - 50</option>
                                <option value="30">1 - 30</option>
                                <option value="15">1 - 15</option>
                                <option value="custom">Customizado</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            )}

            {mostrarInputsPersonalizados && intervaloEscolhido === "custom" && (
                <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="number"
                                value={inicioIntervalo}
                                onChange={(e) => setInicioIntervalo(e.target.value)}
                                placeholder="Número de início"
                            />
                            <Form.Control
                                type="number"
                                value={fimIntervalo}
                                onChange={(e) => setFimIntervalo(e.target.value)}
                                placeholder="Número de fim"
                            />
                        </InputGroup>
                    </Col>
                </Row>
            )}

            {mostrarBotaoDefinir && (
                <Row>
                    <Col className="text-center">
                        <Button variant="primary" onClick={definirIntervalo}>
                            Definir intervalo
                        </Button>
                    </Col>
                </Row>
            )}

            {intervaloDefinido && (
                <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="number"
                                placeholder="Digite seu número"
                                onChange={(e) => setInputNumero(e.target.value)}
                            />
                            <Button variant="success" onClick={sortearNumero}>
                                Sortear
                            </Button>
                        </InputGroup>
                        <Button variant="warning" className="w-100" onClick={alterarIntervalo}>
                            Alterar Intervalo
                        </Button>
                    </Col>
                </Row>
            )}
        </Container>
    );
};
