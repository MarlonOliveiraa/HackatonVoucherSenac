import { useState, useEffect, useCallback } from 'react';
import { Orcamento, OrcamentoItem } from '@/types';

const API_BASE_URL = 'http://localhost/hackatonvouchersenac/backend/router/orcamentosRouter.php';

export const useOrcamentos = () => {
    const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
    const [items, setItems] = useState<OrcamentoItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // --- 2. FUNÇÃO DE BUSCA PRINCIPAL (GET) ---
    // Usada para carregar os dados na inicialização e após qualquer alteração (POST, PUT, DELETE)
    const fetchOrcamentos = useCallback(async () => {
        setIsLoading(true);
        try {
            // 1. Busca dos Orçamentos Principais
            const responseOrc = await fetch(`${API_BASE_URL}?acao=listar`);
            if (!responseOrc.ok) {
                throw new Error('Falha ao buscar orçamentos.');
            }
            const fetchedOrcamentos: Orcamento[] = await responseOrc.json();
            setOrcamentos(fetchedOrcamentos);

            // 2. Busca dos Itens para todos os Orçamentos
            const itemPromises = fetchedOrcamentos.map(async (o) => {
                 const itemResponse = await fetch(`${API_BASE_URL}?acao=itens&id=${o.id}`);
                 if (!itemResponse.ok) return [];
                 // O backend retorna 'valor' como string? Se sim, precisa ser convertido aqui.
                 const rawItems: any[] = await itemResponse.json();
                 
                 // Certifique-se de que 'valor' é um number para o frontend
                 return rawItems.map(item => ({
                     ...item,
                     valor: parseFloat(item.valor) // Conversão crítica
                 })) as OrcamentoItem[];
            });
            
            const itemsArrays = await Promise.all(itemPromises);
            const allItems = itemsArrays.flat(); 
            setItems(allItems);

        } catch (error) {
            console.error("Erro ao carregar dados do servidor:", error);
            setOrcamentos([]);
            setItems([]);
            // toast.error("Não foi possível carregar os dados. Verifique a conexão.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // --- 3. EXECUÇÃO DA BUSCA NA MONTAGEM ---
    useEffect(() => {
        fetchOrcamentos();
    }, [fetchOrcamentos]);

    // --- 4. FUNÇÕES CRUD (POST/PUT/DELETE) ---

    // A. CRIAR NOVO ORÇAMENTO (POST)
    const addOrcamento = async (
        orcamentoData: Omit<Orcamento, 'id'>, 
        selectedItems: { nomeItem: string, valor: string }[]
    ) => {
        const payload = {
            orcamento: orcamentoData,
            itens: selectedItems.map(item => ({ 
                nomeItem: item.nomeItem, 
                valor: item.valor 
            })), 
        };

        try {
            const response = await fetch(`${API_BASE_URL}?acao=criar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                await fetchOrcamentos(); // Recarrega os dados do servidor
                return result; 
            } else {
                console.error("Erro na criação:", result.mensagem);
                throw new Error(result.mensagem || "Falha desconhecida ao criar.");
            }
        } catch (error) {
            console.error("Erro de rede/servidor na criação:", error);
            throw error;
        }
    };
    
    // B. ATUALIZAR ORÇAMENTO PRINCIPAL (PUT)
    const updateOrcamento = async (id: string, updates: Partial<Orcamento>) => {
        try {
            const response = await fetch(`${API_BASE_URL}?acao=atualizar&id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            const result = await response.json();

            if (result.success) {
                // Atualiza o estado sem recarregar tudo (para ser mais rápido)
                setOrcamentos(
                    orcamentos.map(o => o.id === id ? { ...o, ...updates } : o)
                );
                return result;
            } else {
                throw new Error(result.mensagem || "Falha ao atualizar orçamento.");
            }
        } catch (error) {
            console.error("Erro ao atualizar orçamento:", error);
            throw error;
        }
    };

    // C. ATUALIZAR/SINCRONIZAR ITENS (PUT/POST)
    const updateOrcamentoItems = async (
        orcamentoId: string,
        updatedItems: OrcamentoItem[]
    ) => {
         // O backend espera um payload com o array de itens, incluindo IDs existentes
        const payload = {
            itens: updatedItems.map(item => ({ 
                id: item.id, // Manda o ID se existir (para UPDATE) ou undefined/null (para INSERT)
                nomeItem: item.nomeItem, 
                valor: item.valor // Manda o valor como Number, o fetch converterá para JSON
            })),
        };

        try {
            const response = await fetch(`${API_BASE_URL}?acao=atualizarItens&id=${orcamentoId}`, {
                method: 'PUT', // Ou POST, dependendo de como você mapeou no seu Router
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                await fetchOrcamentos(); // Recarrega os dados (itens + orçamento) para sincronização completa
                return result;
            } else {
                throw new Error(result.mensagem || "Falha ao sincronizar itens.");
            }
        } catch (error) {
            console.error("Erro ao atualizar itens:", error);
            throw error;
        }
    };

    // D. DELETAR ORÇAMENTO (DELETE)
    const deleteOrcamento = async (id: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}?acao=deletar&id=${id}`, {
                method: 'DELETE',
            });
            
            const result = await response.json();

            if (result.success) {
                // Remove do estado local para feedback instantâneo
                setOrcamentos(orcamentos.filter(o => o.id !== id));
                setItems(items.filter(i => i.orcamentoId !== id));
            } else {
                 throw new Error(result.mensagem || "Falha ao deletar orçamento.");
            }
        } catch (error) {
            console.error("Erro ao deletar orçamento:", error);
            throw error;
        }
    };
    
    // E. FUNÇÕES LOCAIS (APENAS LEITURA DE ESTADO)
    
    // Estas funções usam os dados já carregados no estado 'items'
    const getOrcamentoItems = (orcamentoId: string) => {
        return items.filter(i => i.orcamentoId === orcamentoId);
    };

    const getOrcamentoTotal = (orcamentoId: string) => {
        return items
            .filter(i => i.orcamentoId === orcamentoId)
            .reduce((acc, item) => acc + item.valor, 0);
    };

    return { 
        orcamentos, 
        items, 
        isLoading,
        addOrcamento, 
        updateOrcamento, 
        updateOrcamentoItems, 
        deleteOrcamento, 
        getOrcamentoItems, 
        getOrcamentoTotal 
    };
};