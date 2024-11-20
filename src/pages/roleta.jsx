import { useState, useEffect, useRef } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseApp } from "../services/firebase";
import "../public/roleta.css";
import audio from "../public/audio.mp3";
import { FaPlay, FaPause } from "react-icons/fa"; // Ícones de Play/Pause

export const RoletaPage = () => {
    const numeros = Array.from({ length: 35 }, (_, index) => index + 1);
    const espacamento = 20;
    const [roletaSize, setRoletaSize] = useState(400);
    const [sorteando, setSorteando] = useState(false);
    const [numeroSorteado, setNumeroSorteado] = useState(null);
    const [animacaoClasse, setAnimacaoClasse] = useState("");
    const [numeroPassando, setNumeroPassando] = useState(null);
    const [showRoleta, setShowRoleta] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);  // Controle do áudio
    const [countdown, setCountdown] = useState(3); // Contagem regressiva
    const [countdownActive, setCountdownActive] = useState(false); // Controle de contagem ativa
    const [countdownEnabled, setCountdownEnabled] = useState(true); // Controle do checkbox para ativar/desativar a contagem

    const roletaSound = useRef(new Audio(audio)); // Audio controlado pelo useRef
    const db = getFirestore(firebaseApp);

    useEffect(() => {
        const handleResize = () => {
            setRoletaSize(window.innerWidth < 644 ? 300 : 400);
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const calcularTransform = (index) => {
        let distanciaEntreBotoes = roletaSize * 0.57;
        if (window.innerWidth <= 644) {
            distanciaEntreBotoes = roletaSize * 0.575;
        }
        const angulo = (360 / numeros.length) * index + espacamento;
        return `rotate(${angulo}deg) translate(${distanciaEntreBotoes}px) rotate(${-angulo}deg)`;
    };

    const buscarNumeroSorteado = async () => {
        const docRef = doc(db, "sorteio", "numeroSorteado");
        const docSnap = await getDoc(docRef);

        let numeroAleatorio;
        if (docSnap.exists() && docSnap.data().numero !== null) {
            numeroAleatorio = docSnap.data().numero;
        } else {
            numeroAleatorio = Math.floor(Math.random() * 40) + 1;
        }

        return numeroAleatorio;
    };

    const iniciarSorteio = async () => {
        setSorteando(true);
        setAnimacaoClasse("animacao-carrossel");

        if (countdownEnabled) {
            // Iniciar contagem regressiva
            setCountdownActive(true);
            let countdownValue = 3;
            setCountdown(countdownValue);

            const countdownInterval = setInterval(() => {
                countdownValue--;
                setCountdown(countdownValue);

                if (countdownValue <= 0) {
                    clearInterval(countdownInterval); // Parar a contagem
                    setCountdownActive(false); // Finalizar a contagem
                    iniciarRoleta(); // Iniciar a roleta após a contagem
                }
            }, 1000); // Decrementa a cada segundo
        } else {
            iniciarRoleta(); // Caso a contagem não esteja ativada, iniciar a roleta imediatamente
        }
    };

    const iniciarRoleta = async () => {
        // Iniciar o áudio após a contagem regressiva
        roletaSound.current.loop = true;
        roletaSound.current.play();
        setIsPlaying(true);  // Garantir que o áudio começa a tocar

        const numeroAleatorio = await buscarNumeroSorteado();
        const indiceSorteado = numeros.indexOf(numeroAleatorio);

        const voltasMinimas = Math.random() * (3 - 2).toFixed(2) + 2;
        const totalGiros = numeros.length * Math.ceil(voltasMinimas);

        let contador = 0;
        const intervalo = setInterval(() => {
            const numeroAtual = numeros[contador % numeros.length];
            setNumeroPassando(numeroAtual);
            setNumeroSorteado(numeroAtual);

            contador++;

            if (contador >= totalGiros) {
                const distanciaDoSorteado =
                    (numeros.length + indiceSorteado - (contador % numeros.length) + 1) %
                    numeros.length;

                if (distanciaDoSorteado === 0) {
                    clearInterval(intervalo);
                    setNumeroSorteado(numeroAleatorio);
                    setSorteando(false);
                    setAnimacaoClasse("");
                    roletaSound.current.pause();  // Parar o áudio quando a roleta parar
                }
            }
        }, 100);
    };

    const getCorDoNumero = (numero) => {
        return numero === numeroPassando ? "black" : "white";
    };

    const toggleRoleta = () => {
        setShowRoleta(!showRoleta);
    };

    const toggleAudio = () => {
        if (isPlaying) {
            roletaSound.current.pause();
        } else {
            roletaSound.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleCountdown = () => {
        setCountdownEnabled(!countdownEnabled);
    };

    return (
        <div className="container-fluid">
            <div style={{ display: "flex" }}>
                <button
                    className={`button-roxo ${showRoleta ? "btn-danger" : "btn-primary"}`}
                    onClick={toggleRoleta}
                >
                    {showRoleta ? "Esconder Roleta" : "Mostrar Roleta"}
                </button>

                <button onClick={toggleAudio}>
                    {/* Exibindo ícones de play/pause */}
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={countdownEnabled}
                        onChange={toggleCountdown}
                    />
                    Ativar contagem regressiva
                </label>
            </div>

            {showRoleta && (
                <div className="roleta-container">
                    {numeros.map((numero, index) => (
                        <button
                            key={numero}
                            className={`roleta-button ${
                                numero === numeroSorteado ? "active" : ""
                            } ${numero % 2 === 0 ? "roxa-clara" : "roxo"}`}
                            style={{
                                transform: calcularTransform(index),
                                color: getCorDoNumero(numero),
                                border: "1px solid white",
                                transition: "color 0.3s ease",
                            }}
                        >
                            {numero}
                        </button>
                    ))}

                    {/* Mostrar a contagem regressiva quando estiver ativa */}
                    {countdownActive && (
                        <div className="countdown-display">
                            {countdown}
                        </div>
                    )}

                    {/* Mostrar o número sorteado somente após a contagem regressiva */}
                    {!countdownActive && numeroSorteado !== null && (
                        <div className={`numero-sorteado ${animacaoClasse}`}>
                            {numeroSorteado}
                        </div>
                    )}
                </div>
            )}

            {showRoleta && (
                <div>
                    <button
                        className="button-roxo"
                        onClick={iniciarSorteio}
                        disabled={sorteando || countdownActive}
                    >
                        Sortear
                    </button>
                </div>
            )}
        </div>
    );
};
