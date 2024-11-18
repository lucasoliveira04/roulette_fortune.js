import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseApp } from "../services/firebase";

export const UserPage = () => {
    const [numero, setNumero] = useState(null);
    const [inputNumero, setInputNumero] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [isNumeroDefinido, setIsNumeroDefinido] = useState(false);
    const db = getFirestore(firebaseApp);

    const buscarNumeroSorteado = async () => {
        const docRef = doc(db, "sorteio", "numeroSorteado");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setNumero(docSnap.data().numero);
            setIsNumeroDefinido(true);
        } else {
            setNumero(Math.floor(Math.random() * 10)); 
            setIsNumeroDefinido(false);
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


    return (
        <div>
            <h2>Número Sorteado: {numero}</h2>

            <div>
                <input
                    type="number"
                    placeholder="Digite seu número"
                    onChange={(e) => setInputNumero(e.target.value)}
                />
                <button onClick={sortearNumero}>Sortear</button>
                <p className={mensagem.includes("acertou") ? "success" : "error"}>{mensagem}</p>
            </div>
        </div>
    );
};
