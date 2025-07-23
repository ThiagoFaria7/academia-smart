// pages/api/mensagem.js
import { supabase } from '../../supabase/client';
import { gerarMensagemMotivacional } from '../../lib/openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  const { cliente_id, tipoMensagem } = req.body; // Pega o ID do cliente e o tipo da mensagem (ex: 'motivacional')

  if (!cliente_id || !tipoMensagem) {
    return res.status(400).json({ error: 'cliente_id e tipoMensagem são obrigatórios.' });
  }

  try {
    // 1. Buscar dados do cliente
    const { data: cliente, error: clienteError } = await supabase
      .from('clientes')
      .select('nome, telefone')
      .eq('id', cliente_id)
      .single();

    if (clienteError || !cliente) {
      throw new Error(`Cliente não encontrado ou erro ao buscar: ${clienteError ? clienteError.message : 'Cliente não existe.'}`);
    }

    // 2. Gerar a mensagem com a IA
    let mensagem = "";
    if (tipoMensagem === 'motivacional') {
      mensagem = await gerarMensagemMotivacional(cliente.nome);
    } else {
      mensagem = `Olá ${cliente.nome}! Mensagem padrão.`; // Implemente outros tipos de mensagem aqui
    }

    // 3. Enviar a mensagem via Z-API (WhatsApp)
    // ESTA É A LINHA CRÍTICA QUE ESTAVA FALTANDO OU INCOMPLETA!
    const zapiUrl = `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`;
    const payload = {
      phone: cliente.telefone, // O número de telefone do cliente
      message: mensagem,       // A mensagem gerada pela IA
    };

    const zapiRes = await fetch(zapiUrl, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const zapiData = await zapiRes.json();

    if (!zapiRes.ok || zapiData.error) {
        console.error("Erro ao enviar para Z-API:", zapiData);
        // Lança um erro para ser capturado pelo catch e retornado ao frontend
        throw new Error(`Erro ao enviar mensagem via Z-API: ${zapiData.error || zapiRes.statusText}`);
    }


    // 4. Registrar o envio no Supabase
    const { data: logEnvio, error: logError } = await supabase
      .from('mensagens_enviadas')
      .insert([
        {
          cliente_id: cliente_id,
          tipo_mensagem: tipoMensagem,
          conteudo_mensagem: mensagem,
          status_envio: 'sucesso' // Ou 'falha' se a Z-API retornar erro
        }
      ]);

    if (logError) {
      console.error("Erro ao registrar envio da mensagem no Supabase:", logError.message);
      // Continua, pois a mensagem já foi enviada, mas registra o erro no log
    }

    return res.status(200).json({ message: 'Mensagem enviada e registrada com sucesso!', zapiResponse: zapiData });

  } catch (error) {
    console.error('Erro no processo de envio de mensagem:', error.message);
    return res.status(500).json({ error: 'Erro interno do servidor ao enviar mensagem.', details: error.message });
  }
}
