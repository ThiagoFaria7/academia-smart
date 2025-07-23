// pages/api/checkin.js
import { supabase } from '../../supabase/client';

export default async function handler(req, res) {
  // Garante que a requisição é do tipo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  // Agora, pega o cliente_id do CORPO da requisição (req.body)
  const { cliente_id } = req.body;

  if (!cliente_id) {
    return res.status(400).json({ error: 'cliente_id é obrigatório' });
  }

  try {
    const { data, error } = await supabase
      .from('frequencia')
      .insert([{ cliente_id: cliente_id, data_checkin: new Date() }]); // Usando o nome da coluna correto

    if (error) {
      console.error('Erro ao inserir check-in no Supabase:', error.message);
      throw error; // Lança o erro para ser capturado pelo catch
    }

    return res.status(200).json({ message: 'Check-in realizado com sucesso!', data });

  } catch (error) {
    console.error('Erro no processo de check-in:', error.message);
    return res.status(500).json({ error: 'Erro interno do servidor ao realizar check-in.', details: error.message });
  }
}