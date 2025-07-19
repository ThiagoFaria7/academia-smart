// pages/test-apis.js
import React, { useState } from 'react'; // Removido useEffect, pois os eventos serão no onSubmit direto

export default function TestAPIs() {
  // Estado para armazenar as respostas das APIs
  const [checkinResponse, setCheckinResponse] = useState(null);
  const [mensagemResponse, setMensagemResponse] = useState(null);
  const [checkinError, setCheckinError] = useState(false);
  const [mensagemError, setMensagemError] = useState(false);

  // URL base do seu servidor Next.js (ajuste se estiver usando a porta 3000)
  const BASE_URL = 'http://localhost:4000'; // OU 'http://localhost:3000' se você não mudou a porta

  // Função para exibir a resposta da API
  const displayResponse = (setter, data, isError) => {
    setter(data);
    if (setter === setCheckinResponse) setCheckinError(isError);
    if (setter === setMensagemResponse) setMensagemError(isError);
  };

  // Lógica para o formulário de Check-in
  const handleCheckinSubmit = async (event) => {
    event.preventDefault(); // Previne o recarregamento da página

    const clienteId = event.target.elements.checkin_cliente_id.value; // Acessa o valor pelo evento
    displayResponse(setCheckinResponse, 'Enviando...', false);

    try {
      const response = await fetch(`${BASE_URL}/api/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cliente_id: clienteId }),
      });

      const data = await response.json();
      if (response.ok) {
        displayResponse(setCheckinResponse, data, false);
      } else {
        displayResponse(setCheckinResponse, data, true);
      }
    } catch (error) {
      console.error('Erro na requisição de check-in:', error);
      displayResponse(setCheckinResponse, { error: 'Erro de rede ou servidor.', details: error.message }, true);
    }
  };

  // Lógica para o formulário de Mensagem
  const handleMensagemSubmit = async (event) => {
    event.preventDefault(); // Previne o recarregamento da página

    const clienteId = event.target.elements.mensagem_cliente_id.value; // Acessa o valor pelo evento
    const tipoMensagem = event.target.elements.tipoMensagem.value;
    displayResponse(setMensagemResponse, 'Enviando...', false);

    try {
      const response = await fetch(`${BASE_URL}/api/mensagem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cliente_id: clienteId, tipoMensagem: tipoMensagem }),
      });

      const data = await response.json();
      if (response.ok) {
        displayResponse(setMensagemResponse, data, false);
      } else {
        displayResponse(setMensagemResponse, data, true);
      }
    } catch (error) {
      console.error('Erro na requisição de mensagem:', error);
      displayResponse(setMensagemResponse, { error: 'Erro de rede ou servidor.', details: error.message }, true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="container bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold text-blue-800 text-center mb-6">Testador de APIs</h1>
        <p className="text-center text-gray-600 mb-8">
          Certifique-se de que seu servidor Next.js está rodando (<code>npm run dev</code>) na porta 4000 ou 3000.
        </p>

        {/* Formulário para Check-in */}
        <form onSubmit={handleCheckinSubmit} className="mb-8 p-6 border border-blue-200 rounded-lg shadow-md bg-blue-50">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Testar Check-in de Cliente</h2>
          <label htmlFor="checkin_cliente_id" className="block text-gray-700 text-sm font-bold mb-2">
            ID do Cliente (UUID):
          </label>
          <input
            type="text"
            id="checkin_cliente_id"
            name="checkin_cliente_id_input" // Nome diferente para evitar conflito com ID do form
            placeholder="Ex: a1a1a1a1-a1a1-4a1a-a1a1-a1a1a1a1a1a1"
            className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            required
            defaultValue="a1a1a1a1-a1a1-4a1a-a1a1-a1a1a1a1a1a1"/* Preenche com ID da Ana */
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105"
          >
            Realizar Check-in
          </button>
          {checkinResponse && (
            <div
              className={`response-box mt-4 p-3 rounded-lg text-sm ${checkinError ? 'bg-red-100 border-red-400 text-red-800' : 'bg-green-100 border-green-400 text-green-800'}`}
            >
              <pre>{JSON.stringify(checkinResponse, null, 2)}</pre>
            </div>
          )}
        </form>

        {/* Formulário para Enviar Mensagem */}
        <form onSubmit={handleMensagemSubmit} className="p-6 border border-blue-200 rounded-lg shadow-md bg-blue-50">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Testar Envio de Mensagem (IA + WhatsApp)</h2>
          <label htmlFor="mensagem_cliente_id" className="block text-gray-700 text-sm font-bold mb-2">
            ID do Cliente (UUID):
          </label>
          <input
            type="text"
            id="mensagem_cliente_id"
            name="mensagem_cliente_id_input" // Nome diferente para evitar conflito com ID do form
            placeholder="Ex: b2b2b2b2-b2b2-4b2b-b2b2-b2b2b2b2b2b2"
            className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            required
            defaultValue="b2b2b2b2-b2b2-4b2b-b2b2-b2b2b2b2b2b2"/* Preenche com ID do Bruno */
          />
          <input type="hidden" name="tipoMensagem" value="motivacional" />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105"
          >
            Enviar Mensagem Motivacional
          </button>
          {mensagemResponse && (
            <div
              className={`response-box mt-4 p-3 rounded-lg text-sm ${mensagemError ? 'bg-red-100 border-red-400 text-red-800' : 'bg-green-100 border-green-400 text-green-800'}`}
            >
              <pre>{JSON.stringify(mensagemResponse, null, 2)}</pre>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
