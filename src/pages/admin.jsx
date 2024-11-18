import { useState } from "react";
import { firebaseApp } from "../services/firebase";
import { deleteDoc, doc, getFirestore, setDoc } from "firebase/firestore";

export const AdminPage = () => {
    const [adminNumero, setAdminNumero] = useState("");
    const [adminMensagem, setAdminMensagem] = useState("");
    const [isNumeroDefinido, setIsNumeroDefinido] = useState(false);
    const db = getFirestore(firebaseApp);

    // Função para definir o número sorteado
    const setNumeroAdmin = async () => {
        if (adminNumero) {
            const docRef = doc(db, "sorteio", "numeroSorteado");
            await setDoc(docRef, { numero: parseInt(adminNumero) });
            setAdminMensagem("Número sorteado definido com sucesso!");
            setIsNumeroDefinido(true);
            console.log("Número definido: ", adminNumero);
        }
    };

    // Função para tirar o número definido
    const tirarNumeroDefinido = async () => {
        const docRef = doc(db, "sorteio", "numeroSorteado");
        await deleteDoc(docRef);
        setAdminMensagem("Sorteio voltou ao normal!");
        setIsNumeroDefinido(false);
    };

    return (
        <div>
            <h3>Admin: Alterar número sorteado</h3>
            <input
                type="number"
                placeholder="Definir número do sorteio"
                value={adminNumero}
                onChange={(e) => setAdminNumero(e.target.value)}
            />
            <button onClick={setNumeroAdmin}>Definir número do sorteio</button>
            <button onClick={tirarNumeroDefinido}>Tirar número definido</button>
            <p>{isNumeroDefinido ? "Número definido pelo admin." : "Sorteio aleatório em andamento."}</p>
            <p>{adminMensagem}</p>
        </div>
    );
}