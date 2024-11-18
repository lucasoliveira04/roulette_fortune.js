import { useState } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { firebaseApp } from "../services/firebase";

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

    // Função para buscar o número sorteado ou gerar um novo
    const buscarNumeroSorteado = async () => {
        const docRef = doc(db, "sorteio", "numeroSorteado");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setNumero(docSnap.data().numero);
        } else {
            const numeroSorteado = Math.floor(Math.random() * fimIntervalo) + inicioIntervalo;
            await setDoc(docRef, { numero: numeroSorteado }); 
            setNumero(numeroSorteado); 
        }
    };

    // Função para o sorteio de número
    const sortearNumero = async () => {
        await buscarNumeroSorteado();
        if (parseInt(inputNumero) === numero) {
            setMensagem("Parabéns, você acertou o número!");
        } else {
            setMensagem("Infelizmente você errou o número!");
        }
    };

    // Função para definir o intervalo de números
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

    // Função para definir o intervalo
    const definirIntervalo = () => {
        if (inicioIntervalo >= fimIntervalo) {
            setMensagem("Erro: O número de início deve ser menor que o de fim.");
        } else {
            setIntervaloDefinido(true);
            setMostrarBotaoDefinir(false);
            setMensagem("");
            setMostrarInputsPersonalizados(false);
        }
    };

    // Função para alterar o intervalo
    const alterarIntervalo = () => {
        setIntervaloDefinido(false);
        setMostrarBotaoDefinir(true);
        setMensagem("Intervalo alterado. Escolha um novo intervalo.");
        setMostrarInputsPersonalizados(false);
    };

    return (
        <div>
            <h2>{intervaloDefinido ? `Número Sorteado: ${numero}` : "Defina um intervalo"}</h2>

            {/* Mensagem inicial */}
            <div>
                <p>{mensagem}</p>
            </div>

            {/* Opção de escolher intervalo */}
            {!intervaloDefinido && (
                <div>
                    <label htmlFor="intervalo">Escolha o intervalo de números: </label>
                    <select
                        id="intervalo"
                        value={intervaloEscolhido}
                        onChange={handleIntervaloChange}
                    >
                        <option value="100">1 - 100</option>
                        <option value="50">1 - 50</option>
                        <option value="30">1 - 30</option>
                        <option value="15">1 - 15</option>
                        <option value="custom">Customizado</option>
                    </select>
                </div>
            )}

            {/* Inputs para intervalo personalizado */}
            {mostrarInputsPersonalizados && intervaloEscolhido === "custom" && (
                <div>
                    <input
                        type="number"
                        value={inicioIntervalo}
                        onChange={(e) => setInicioIntervalo(e.target.value)}
                        placeholder="Número de início"
                    />
                    <input
                        type="number"
                        value={fimIntervalo}
                        onChange={(e) => setFimIntervalo(e.target.value)}
                        placeholder="Número de fim"
                    />
                </div>
            )}

            {mostrarBotaoDefinir && (
                <button onClick={definirIntervalo}>Definir intervalo</button>
            )}

            {intervaloDefinido && (
                <div>
                    <input
                        type="number"
                        placeholder="Digite seu número"
                        onChange={(e) => setInputNumero(e.target.value)}
                    />
                    <button onClick={sortearNumero}>Sortear</button>
                    <button onClick={alterarIntervalo}>Alterar Intervalo</button>
                </div>
            )}
        </div>
    );
};
