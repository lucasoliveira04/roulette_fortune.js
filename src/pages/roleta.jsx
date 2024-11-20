import { useState, useEffect, useRef } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseApp } from "../services/firebase";
import "../public/roleta.css";
import audio from "../public/audio.mp3";
import fortuneTiger from "../public/fortuneAudio.mp3";
import { FaPlay, FaPause, FaMusic, FaVolumeMute, FaVolumeDown } from "react-icons/fa";

export const RoletaPage = () => {
    const numeros = Array.from({ length: 35 }, (_, index) => index + 1);
    const espacamento = 20;
    const [roletaSize, setRoletaSize] = useState(400);
    const [sorteando, setSorteando] = useState(false);
    const [numeroSorteado, setNumeroSorteado] = useState(null);
    const [animacaoClasse, setAnimacaoClasse] = useState("");
    const [numeroPassando, setNumeroPassando] = useState(null);
    const [showRoleta, setShowRoleta] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [countdownActive, setCountdownActive] = useState(false);
    const [countdownEnabled, setCountdownEnabled] = useState(true);
    const [countdownKey, setCountdownKey] = useState(0);
    const [numeroInserido, setNumeroInserido] = useState('');
    const [acertou, setAcertou] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);

    const roletaSound = useRef(new Audio(audio));
    const audioSite = useRef(new Audio(fortuneTiger));
    const db = getFirestore(firebaseApp);

    useEffect(() => {
        const handleResize = () => {
            setRoletaSize(window.innerWidth < 644 ? 300 : 400);
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        setIsPlaying(true);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    const calcularTransform = (index) => {
        let distanciaEntreBotoes = roletaSize * 0.57;
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
            setCountdownActive(true);
            let countdownValue = 3;
            setCountdown(countdownValue);

            const countdownInterval = setInterval(() => {
                countdownValue--;
                setCountdown(countdownValue);

                if (countdownValue <= 0) {
                    clearInterval(countdownInterval);
                    setCountdownActive(false);
                    iniciarRoleta();
                }
            }, 1000);
        } else {
            iniciarRoleta();
            console.log("Sortenado..")
        }
    };

    const iniciarRoleta = async () => {
        roletaSound.current.loop = true;
        roletaSound.current.play();
        setIsPlaying(true);

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
                    roletaSound.current.pause();

                    if (parseInt(numeroInserido) === numeroAleatorio) {
                        setAcertou(true);
                    } else {
                        setAcertou(false);
                    }
                    setModalAberto(true);
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
        if (sorteando) {
            if (roletaSound.current) {
                if (roletaSound.current.paused) {
                    roletaSound.current.play();
                } else {
                    roletaSound.current.pause();
                }
                setIsPlaying(!roletaSound.current.paused);
            }
        }
    };


    const toggleCountdown = () => {
        setCountdownEnabled(!countdownEnabled);
    };


    const verificarAcerto = () => {
        if (parseInt(numeroInserido) === numeroSorteado) {
            setAcertou(true);
        } else {
            setAcertou(false);
        }

        setModalAberto(true); 
    }

    return (
        <div className="container-fluid">
            <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
                {showRoleta && (
                    <button onClick={toggleAudio}>
                        {isPlaying ? <FaVolumeMute /> : <FaVolumeDown />}
                    </button>
                )}
            </div>

            {showRoleta ? (
                <div className="roleta-container">
                    {numeros.map((numero, index) => (
                        <button
                            key={numero}
                            className={`roleta-button ${numero === numeroSorteado ? "active" : ""
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

                    {countdownActive && (
                        <div key={countdownKey} className="countdown-display">
                            {countdown}
                        </div>
                    )}

                    {!countdownActive && numeroSorteado !== null && (
                        <div className={`numero-sorteado ${animacaoClasse}`}>
                            {numeroSorteado}
                        </div>
                    )}
                </div>
            ) : (
                <div className="welcome-message">
                    <h1 className="h1t" style={{ color: "white", fontWeight: "bold", fontFamily: "Sour Gummy sans-serif", fontSize: "50px" }}>
                        {"Seja bem-vindo!".split("").map((letter, index) => (
                            <span key={index} className="letter" style={{ animationDelay: `${index * 0.1}s` }}>
                                {letter === " " ? "\u00A0" : letter}
                            </span>
                        ))}
                    </h1>
                    <p style={{ color: "white", fontWeight: "bold", fontFamily: "Sour Gummy sans-serif", fontSize: "20px" }}>
                        {"Aproveite o jogo e boa sorte!".split("").map((letter, index) => (
                            <span key={index} className="letter" style={{ animationDelay: `${index * 0.1}s` }}>
                                {letter === " " ? "\u00A0" : letter}
                            </span>
                        ))}
                    </p>
                </div>
            )}

            {showRoleta && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>

                    <div>
                        <input
                            type="number"
                            placeholder="Insira um número"
                            value={numeroInserido}
                            onChange={(e) => setNumeroInserido(e.target.value)}
                            disabled={sorteando}
                            style={{
                                padding: "10px",
                                fontSize: "16px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                textAlign: "center",
                            }}
                        />

                        <button
                            onClick={verificarAcerto}
                            className="button-roxo"
                            disabled={!numeroInserido || sorteando}
                            style={{
                                padding: "10px 20px",
                                fontSize: "16px",
                                borderRadius: "5px",
                                backgroundColor: "#6a0dad",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            Verificar Número
                        </button>
                    </div>


                    <div style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}>
                        {showRoleta && (
                            <button
                                className="sortear-button"
                                onClick={iniciarSorteio}
                                disabled={sorteando || countdownActive}
                            >
                                Sortear
                            </button>
                        )}

                        {showRoleta && (
                            <div className="checkbox-container">
                                <input
                                    type="checkbox"
                                    checked={countdownEnabled}
                                    onChange={toggleCountdown}
                                    style={{
                                        cursor: countdownActive ? 'not-allowed' : 'pointer'
                                    }}
                                />
                                <label style={{ color: "white", fontWeight: countdownEnabled ? 'bold' : 'normal' }}>
                                    {countdownEnabled ? 'Desativar contagem regressiva' : 'Ativar contagem regressiva'}
                                </label>
                            </div>
                        )}
                    </div>


                </div>
            )}

            <div>
                <button
                    className={`button-roxo ${showRoleta ? "btn-danger" : "btn-primary"}`}
                    onClick={toggleRoleta}
                >
                    {showRoleta ? "Esconder Roleta" : "Mostrar Roleta"}
                </button>
            </div>

            {modalAberto && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            background: "white",
                            padding: "20px",
                            borderRadius: "8px",
                            textAlign: "center",
                            maxWidth: "300px",
                        }}
                    >
                        <h2 style={{ color: acertou ? "green" : "red" }}>
                            {acertou ? "Parabéns!" : "Que pena!"}
                        </h2>
                        <p>{acertou ? "Você acertou o número!" : "Tente novamente!"}</p>
                        <button
                            onClick={() => setModalAberto(false)}
                            style={{
                                marginTop: "10px",
                                padding: "10px 20px",
                                fontSize: "16px",
                                borderRadius: "5px",
                                backgroundColor: "#6a0dad",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
