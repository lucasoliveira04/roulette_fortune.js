import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseApp } from "../services/firebase";
import "../public/roleta.css";
import audio from "../public/audio.mp3";

export const RoletaPage = () => {
    const numeros = Array.from({ length: 35 }, (_, index) => index + 1);
    const espacamento = 15;
    const [roletaSize, setRoletaSize] = useState(400);
    const [sorteando, setSorteando] = useState(false);
    const [numeroSorteado, setNumeroSorteado] = useState(null);
    const [animacaoClasse, setAnimacaoClasse] = useState("");
    const [numeroPassando, setNumeroPassando] = useState(null);  

    const roletaSound = new Audio(audio);
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
        let distanciaEntreBotoes = roletaSize * 0.575;
        if (window.innerWidth <= 644) {
            distanciaEntreBotoes = roletaSize * 0.5;
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
        roletaSound.loop = true;
        roletaSound.play();

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
                const distanciaDoSorteado = (numeros.length + indiceSorteado - (contador % numeros.length) + 1) % numeros.length;

                if (distanciaDoSorteado === 0) {
                    clearInterval(intervalo);
                    setNumeroSorteado(numeroAleatorio);
                    setSorteando(false);
                    setAnimacaoClasse("");
                    roletaSound.pause();
                }
            }
        }, 100);
    };

    // Função para verificar a cor do número
    const getCorDoNumero = (numero) => {
        return numero === numeroPassando ? 'black' : 'white';  
    };

    return (
        <div className="container-fluid">
            <div className="roleta-container">
                {numeros.map((numero, index) => (
                    <button
                        key={numero}
                        className={`roleta-button ${numero === numeroSorteado ? 'active' : ''} ${numero % 2 === 0 ? 'roxa-clara' : 'roxo'}`}
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

                {numeroSorteado !== null && (
                    <div className={`numero-sorteado ${animacaoClasse}`}>
                        {numeroSorteado}
                    </div>
                )}
            </div>

            <div>
                <button className="button-roxo" onClick={iniciarSorteio} disabled={sorteando}>
                    Sortear
                </button>
            </div>
        </div>
    );
};
