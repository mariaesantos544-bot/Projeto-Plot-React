import type { RespostaLogin } from "../types/auth";

// funçao de salvar a sessao do usuario
export function salvarSessao(dados: RespostaLogin) {

    // sessionStorage: armazena informações durante a sessao da aba do navegador
    // setItem(): salva uma informação (ex: token: aksdgashdjksahkjk)   
    sessionStorage.setItem("token", dados.token);

    // cria a chave(variavel) usuario e cria um JSON para tranformar o objeto usuario recebido pela API em um texto JSON
    // vai ficar mais ou menos assim na sessao:
    // usuario: {
    //     nome: "Usuario",
    //     email: "email@email.com",
    //     tipoUsuario: "Admin"
    //}
    sessionStorage.setItem("usuario", JSON.stringify({
        nome: dados.nome,
        email: dados.email,
        tipoUsuario: dados.tipoUsuario
    }));

    sessionStorage.setItem("expiracaoUtc", dados.expiracaoUtc);
}

export function obterToken() {
    // getItem(): recupera uma informação
    // aqui nessa função retornamos o token
    return sessionStorage.getItem("token");
}

export interface UsuarioSessao {
    nome: string;
    email: string;
    tipoUsuario: string;
}

export function obterUsuario(): UsuarioSessao | null {
    try {
        const usuario = sessionStorage.getItem("usuario");
        if (!usuario || usuario === "undefined") {
            return null;
        }
        return JSON.parse(usuario) as UsuarioSessao;
    } catch {
        return null;
    }
}

// Limpando a sessao do navegador
export function encerrarSessao() {
   sessionStorage.removeItem("token");
   sessionStorage.removeItem("usuario");
   sessionStorage.removeItem("expiracaoUtc");
}

export function sessaoValida() {

    const token = obterToken();
    const expiracaoUtc = sessionStorage.getItem("expiracaoUtc");

    // se nao existir um token (!token) ou data de expiração (!expiracaoUtc), retorna false
    if(!token || !expiracaoUtc) {
        return false;
    }

    // verifica se a data de expiração é maior que a data atul
    // retorna true se o token ainda estiver dentro do prazo de validade e false se estiver expirado
    return new Date(expiracaoUtc).getTime() > Date.now();
}