// src/utils/authUtils.js
import { getAuth, updateEmail, updatePassword, sendEmailVerification, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

const URL_REDIRECIONAMENTO = "https://sorteio-nine-zeta.vercel.app/login"; // URL para onde o usuário será redirecionado após a verificação

// Função para reautenticar o usuário com a senha atual
export const reautenticarUsuario = async (auth, senhaAtual) => {
    const user = auth.currentUser;
    if (user && senhaAtual) {
        const credential = EmailAuthProvider.credential(user.email, senhaAtual);
        try {
            await reauthenticateWithCredential(user, credential);
            return true;
        } catch (error) {
            throw new Error(`Erro ao reautenticar: ${error.message}`);
        }
    } else {
        throw new Error("Por favor, forneça a senha atual.");
    }
};

// Função para alterar e-mail e senha
export const alterarDadosUsuario = async (auth, novoEmail, novaSenha, senhaAtual) => {
    try {
        const user = auth.currentUser;
        if (!novoEmail || !novaSenha) {
            throw new Error("Por favor, preencha todos os campos.");
        }

        // Reautentica o usuário
        const usuarioReautenticado = await reautenticarUsuario(auth, senhaAtual);
        if (usuarioReautenticado) {
            // Envia um e-mail de verificação para o novo e-mail com URL de continuação
            await sendEmailVerification(user, {
                url: URL_REDIRECIONAMENTO, // Define o URL de continuação
            });

            // Atualiza o e-mail e a senha
            if (novoEmail !== user.email) {
                await updateEmail(user, novoEmail); // Atualiza o e-mail
            }
            await updatePassword(user, novaSenha); // Atualiza a senha

            return "Senha alterada com sucesso! Agora verifique seu novo e-mail para confirmar a alteração.";
        }
    } catch (error) {
        throw new Error(`Erro ao alterar dados: ${error.message}`);
    }
};
