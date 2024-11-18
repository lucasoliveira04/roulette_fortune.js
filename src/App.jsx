import { useState, useEffect } from "react";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { firebaseApp } from "./services/firebase";

function App() {
  const [numero, setNumero] = useState(0);
  const [inputNumero, setInputNumero] = useState(""); 
  const [adminNumero, setAdminNumero] = useState("");
  const [mensagem, setMensagem] = useState(""); 
  const [isAdminMode, setIsAdminMode] = useState(false);  

  const db = getFirestore(firebaseApp);

  const buscarNumeroSorteado = async () => {
    const docRef = doc(db, "sorteio", "numeroSorteado");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setNumero(docSnap.data().numero); 
    } else {
      console.log("No such document!");
    }
  };

  
  const setNumeroAdmin = async () => {
    if (adminNumero) {
      const docRef = doc(db, "sorteio", "numeroSorteado");
      await setDoc(docRef, { numero: parseInt(adminNumero) });
      setMensagem("Número sorteado com sucesso!");
      setIsAdminMode(false); 
      setAdminNumero(""); 
    }
  };

  const sortearNumero = async () => {
    let numeroSorteado;

    if (adminNumero) {
      numeroSorteado = parseInt(adminNumero);
    } else {
      numeroSorteado = Math.floor(Math.random() * 10);
    }

    setNumero(numeroSorteado);

    if (parseInt(inputNumero) === numeroSorteado) {
      setMensagem("Parabéns, você acertou o número!");
    } else {
      setMensagem("Infelizmente você errou o número!");
    }
  };

  return (
    <>
      <h2>Número Sorteado: {numero}</h2>
      <input
        type="number"
        name="Coloque o número"
        onChange={(e) => setInputNumero(e.target.value)}
      />
      <button onClick={sortearNumero}>Sortear</button>
      <p>{mensagem}</p>

      <h3>Admin: Alterar número sorteado</h3>
      {isAdminMode ? (
        <>
          <input
            type="number"
            placeholder="Digite o número do admin"
            value={adminNumero}
            onChange={(e) => setAdminNumero(e.target.value)}
          />
          <button onClick={setNumeroAdmin}>Atualizar Sorteio</button>
        </>
      ) : (
        <button onClick={() => setIsAdminMode(true)}>Ativar Modo Admin</button>
      )}
    </>
  );
}

export default App;
