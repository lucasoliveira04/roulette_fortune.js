import { useState, useEffect } from "react";
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { firebaseApp } from "./services/firebase";

function App() {
  const [numero, setNumero] = useState(0);
  const [inputNumero, setInputNumero] = useState(""); 
  const [adminNumero, setAdminNumero] = useState("");
  const [mensagem, setMensagem] = useState(""); 
  const [isNumeroDefinido, setIsNumeroDefinido] = useState(false); // Marca se o número foi definido pelo admin

  const db = getFirestore(firebaseApp)

  // Função para buscar o número sorteado do Firestore
  const buscarNumeroSorteado = async () => {
    const docRef = doc(db, "sorteio", "numeroSorteado");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setNumero(docSnap.data().numero);
      setIsNumeroDefinido(true);
    } else {
      setNumero(Math.floor(Math.random() * 10)); // Sorteia um número aleatório se não houver número definido
      setIsNumeroDefinido(false);
    }
  };

  // Função para definir o número do sorteio
  const setNumeroAdmin = async () => {
    if (adminNumero) {
      const docRef = doc(db, "sorteio", "numeroSorteado");
      await setDoc(docRef, { numero: parseInt(adminNumero) });
      setMensagem("Número sorteado definido com sucesso!");
      setIsNumeroDefinido(true);
      
      // Exibe no console o número definido
      console.log("Número definido: ", adminNumero);
    }
  };

  // Função para remover o número definido e voltar ao sorteio normal
  const tirarNumeroDefinido = async () => {
    const docRef = doc(db, "sorteio", "numeroSorteado");
    await deleteDoc(docRef); // Remove o número do Firestore
    setMensagem("Sorteio voltou ao normal!");
    setIsNumeroDefinido(false);
    buscarNumeroSorteado(); // Refaz a busca para retornar ao sorteio aleatório
  };

  // Função para realizar o sorteio
  const sortearNumero = async () => {
    await buscarNumeroSorteado();

    if (parseInt(inputNumero) === numero) {
      setMensagem("Parabéns, você acertou o número!");
    } else {
      setMensagem("Infelizmente você errou o número!");
    }
  };

  return (
    <>
      <h2>Número Sorteado: {numero}</h2>

      <div>
        <input 
          type="number" 
          placeholder="Digite seu número" 
          onChange={(e) => setInputNumero(e.target.value)} 
        />
        <button onClick={sortearNumero}>Sortear</button>
        <p>{mensagem}</p>
      </div>

      {/* Admin Control */}
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
      </div>
    </>
  );
}

export default App;
