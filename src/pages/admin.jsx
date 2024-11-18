import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { alterarDadosUsuario } from "../utils/authutils"; 
import { deleteDoc, doc, getFirestore, setDoc } from "firebase/firestore";

export const AdminPage = () => {
    const [adminNumero, setAdminNumero] = useState("");
    const [adminMensagem, setAdminMensagem] = useState("");
    const [isNumeroDefinido, setIsNumeroDefinido] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [novoEmail, setNovoEmail] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [mensagemAlteracao, setMensagemAlteracao] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("");  

    const db = getFirestore();

    const auth = getAuth();

    const logout = async () => {
        try {
            await signOut(auth);
            window.location.href = "/"; 
        } catch (error) {
            console.error("Erro ao deslogar: ", error.message);
        }
    };

    const abrirModal = () => {
        setIsModalOpen(true);
    };

    const fecharModal = () => {
        setIsModalOpen(false);
        setNovoEmail("");
        setNovaSenha("");
        setSenhaAtual("");
        setMensagemAlteracao("");
    };

    // Função para alterar o e-mail e a senha do usuário
    const alterarDados = async () => {
        try {
            const mensagem = await alterarDadosUsuario(auth, novoEmail, novaSenha, senhaAtual);
            setMensagemAlteracao(mensagem);
            fecharModal();
        } catch (error) {
            setMensagemAlteracao(`Erro ao alterar dados: ${error.message}`);
        }
    };

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
        <div className="admin-container">
            <h3 className="admin-title">Admin: Alterar número sorteado</h3>
            <input
                type="number"
                placeholder="Definir número do sorteio"
                value={adminNumero}
                onChange={(e) => setAdminNumero(e.target.value)}
                className="admin-input"
            />
            <button onClick={setNumeroAdmin} className="admin-button">Definir número do sorteio</button>
            <button onClick={tirarNumeroDefinido} className="admin-button">Tirar número definido</button>
            <p className={isNumeroDefinido ? "admin-message admin-message-success" : "admin-message"}>{isNumeroDefinido ? "Número definido pelo admin." : ""}</p>
            <p className={adminMensagem ? "admin-message admin-message-success" : ""}>{adminMensagem}</p>

            <button onClick={abrirModal} className="admin-button">Alterar E-mail e Senha</button>

            {/* Modal de Alteração */}
            {isModalOpen && (
                <div className="admin-modal">
                    <div className="admin-modal-content">
                        <h3 className="admin-modal-title">Alterar E-mail e Senha</h3>
                        <input
                            type="password"
                            placeholder="Senha Atual"
                            value={senhaAtual}
                            onChange={(e) => setSenhaAtual(e.target.value)} 
                            className="admin-modal-input"
                        />
                        <input
                            type="email"
                            placeholder="Novo E-mail"
                            value={novoEmail}
                            onChange={(e) => setNovoEmail(e.target.value)}
                            className="admin-modal-input"
                        />
                        <input
                            type="password"
                            placeholder="Nova Senha"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            className="admin-modal-input"
                        />
                        <button onClick={alterarDados} className="admin-modal-button">Alterar</button>
                        <button onClick={fecharModal} className="admin-modal-button">Fechar</button>
                        {mensagemAlteracao && <p>{mensagemAlteracao}</p>}
                    </div>
                </div>
            )}

            <button onClick={logout} className="admin-button">Sair</button>
        </div>
    );
};
