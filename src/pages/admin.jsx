import { useState } from "react";
import { getFirestore, setDoc, deleteDoc, doc } from "firebase/firestore";

export const AdminPage = () => {
    const [adminNumero, setAdminNumero] = useState("");
    const [adminMensagem, setAdminMensagem] = useState("");
    const [isNumeroDefinido, setIsNumeroDefinido] = useState(false);

    const db = getFirestore();

    const setNumeroAdmin = async () => {
        if (adminNumero) {
            const docRef = doc(db, "sorteio", "numeroSorteado");
            await setDoc(docRef, { numero: parseInt(adminNumero) });
            setAdminMensagem("Número sorteado definido com sucesso!");
            setIsNumeroDefinido(true);
        }
    };

    const tirarNumeroDefinido = async () => {
        const docRef = doc(db, "sorteio", "numeroSorteado");
        await deleteDoc(docRef);
        setAdminMensagem("Sorteio voltou ao normal!");
        setIsNumeroDefinido(false);
    };

    return (
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f4f4' }}>
            <div style={{ maxWidth: '600px', width: '100%', backgroundColor: 'white', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
                <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Alterar Número Sorteado</h4>
                <div>
                    <label htmlFor="numeroSorteio" style={{ display: 'block', marginBottom: '8px' }}>Definir Número do Sorteio</label>
                    <input
                        id="numeroSorteio"
                        type="number"
                        placeholder="Digite o número sorteado"
                        value={adminNumero}
                        onChange={(e) => setAdminNumero(e.target.value)}
                        style={{ width: '100%', padding: '8px', fontSize: '16px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: '10px' }}>
                    <button
                        onClick={setNumeroAdmin}
                        disabled={isNumeroDefinido}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isNumeroDefinido ? 'not-allowed' : 'pointer',
                        }}
                    >
                        Definir Número
                    </button>
                    <button
                        onClick={tirarNumeroDefinido}
                        disabled={!isNumeroDefinido}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: !isNumeroDefinido ? 'not-allowed' : 'pointer',
                        }}
                    >
                        Remover Número
                    </button>
                </div>

                {adminMensagem && (
                    <div
                        style={{
                            marginTop: '20px',
                            padding: '10px',
                            backgroundColor: isNumeroDefinido ? '#28a745' : '#17a2b8',
                            color: 'white',
                            borderRadius: '4px',
                            textAlign: 'center',
                        }}
                    >
                        {adminMensagem}
                    </div>
                )}
            </div>
        </div>
    );
};
