// pages/api/inativos.js
import { supabase } from '../../supabase/client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido. Use GET.' });
  }

  // Calcula a data de 7 dias atrás
  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
  const dataLimiteISO = seteDiasAtras.toISOString();

  try {
    // 1. Obtenha os IDs dos clientes que TIVERAM check-in nos últimos 7 dias
    // Usamos um Set para otimizar a busca por IDs depois
    const { data: frequenciaRecente, error: checkinError } = await supabase
      .from('frequencia')
      .select('cliente_id')
      .gte('data_checkin', dataLimiteISO);

    if (checkinError) {
      throw checkinError;
    }

    // Cria um Set (conjunto) de IDs para uma busca rápida em JavaScript
    const idsComCheckinRecente = new Set(frequenciaRecente.map(f => f.cliente_id));
    console.log('IDs de clientes com check-in recente:', Array.from(idsComCheckinRecente));


    // 2. Obtenha TODOS os clientes que atendem aos critérios básicos de inatividade:
    //    - Não estão com status 'inativo', 'suspenso' ou 'cancelado'
    //    - Foram cadastrados há mais de 7 dias (para evitar clientes muito novos)
    const { data: todosClientesPotenciaisInativos, error: clientesError } = await supabase
      .from('clientes')
      .select('id, nome, telefone, email, status')
      .not('status', 'eq', 'inativo')
      .not('status', 'eq', 'suspenso')
      .not('status', 'eq', 'cancelado')
      .lt('data_cadastro', dataLimiteISO); // Clientes cadastrados há mais de 7 dias

    if (clientesError) {
      throw clientesError;
    }

    // 3. FILTRAGEM FINAL EM JAVASCRIPT:
    // Percorremos a lista de clientes potenciais inativos e removemos aqueles
    // que estão no nosso conjunto de IDs com check-in recente.
    const clientesInativos = todosClientesPotenciaisInativos.filter(cliente => {
      // Se o ID do cliente NÃO estiver no Set de IDs com check-in recente, ele é inativo.
      return !idsComCheckinRecente.has(cliente.id);
    });

    console.log('Clientes inativos encontrados (após filtro JS):', clientesInativos);

    return res.status(200).json(clientesInativos);

  } catch (error) {
    console.error('Erro ao buscar clientes inativos:', error.message);
    return res.status(500).json({ error: 'Erro interno do servidor ao buscar clientes inativos.', details: error.message || 'Erro desconhecido.' });
  }
}