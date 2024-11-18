import { useState } from "react";

function App() {
  const [numero, setNumero] = useState(0); // Número sorteado
  const [inputNumero, setInputNumero] = useState(""); // Número do usuário
  const [adminNumero, setAdminNumero] = useState(""); // Número definido pelo admin
  const [mensagem, setMensagem] = useState(""); // Mensagem de feedback

  const sortearNumero = () => {
    let novoNumero;

    // Verifica se o admin forneceu um número
    if (adminNumero) {
      novoNumero = parseInt(adminNumero); // Usa o número fornecido pelo admin
    } else {
      novoNumero = Math.floor(Math.random() * 10); // Sorteia um número aleatório
    }

    setNumero(novoNumero);

    // Compara o número digitado pelo usuário com o número sorteado
    if (parseInt(inputNumero) === novoNumero) {
      setMensagem("Parabéns, você acertou!");
    } else {
      setMensagem(`Que pena! O número sorteado foi ${novoNumero}.`);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div>
          <h2>Sorteio</h2>
          <input
            type="number"
            placeholder="Coloque o número"
            value={inputNumero}
            onChange={(e) => setInputNumero(e.target.value)} 
          />
          <button onClick={sortearNumero}>Sortear</button>
          <p>{mensagem}</p>
        </div>

        <div>
          <h2>Input Admin</h2>
          <input
            type="number"
            placeholder="Número sorteado pelo admin"
            value={adminNumero}
            onChange={(e) => setAdminNumero(e.target.value)} 
          />
        </div>
      </div>
    </>
  );
}

export default App;
