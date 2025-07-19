// lib/openai.js
// Temporariamente desabilitado o uso da API OpenAI devido a problemas de quota.
// A função retornará uma mensagem padrão para permitir o teste do fluxo.

// import OpenAI from "openai"; // Não precisamos importar se não vamos usar

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

export async function gerarMensagemMotivacional(nomeCliente) {
  console.warn("Aviso: Chamada à API OpenAI desabilitada. Retornando mensagem padrão.");
  return `Olá ${nomeCliente}! Sentimos sua falta na Academia Smart! Que tal voltar a treinar e cuidar de você? Te esperamos!`;
}