import { Layout } from '@/components/Layout';
import { useClientes } from '@/hooks/useClientes';
import { useOrcamentos } from '@/hooks/useOrcamentos';
import { useFinanceiro } from '@/hooks/useFinanceiro';
import { useServicos } from '@/hooks/useServicos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Users, FileText, CheckCircle2, Clock, Briefcase } from 'lucide-react';

// async function carregarUsuarios() {
//     try {
//         const resposta = await fetch("http://localhost/hackatonvouchersenac/backend");

//         if (!resposta.ok) {
//             throw new Error("Erro ao buscar usuários");
//         }

//         const dados = await resposta.json();
//         console.log("Dados recebidos:", dados);

//     } catch (erro) {
//         console.error("Erro na requisição:", erro);
//     }
// }

// carregarUsuarios();


const Dashboard = () => {
  const { clientes } = useClientes();
  const { orcamentos, getOrcamentoTotal } = useOrcamentos();
  const { registros, getTotalRecebido } = useFinanceiro();
  const { servicos } = useServicos();

  const clientesAtivos = clientes.filter(c => c.status === 'ativo').length;
  const orcamentosAprovados = orcamentos.filter(o => o.status === 'aprovado');
  const orcamentosPendentes = orcamentos.filter(o => o.status === 'pendente');
  const totalRecebido = getTotalRecebido();
  
  const totalOrcamentosAprovados = orcamentosAprovados.reduce(
    (acc, o) => acc + getOrcamentoTotal(o.id), 0
  );

  const getServicoNome = (servicoId: string) => {
    return servicos.find(s => s.id === servicoId)?.nome || 'Serviço';
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-lg">Visão geral do seu negócio</p>
        </div>

        {/* Cards de Métricas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-lg card-hover bg-gradient-to-br from-card to-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Recebido</CardTitle>
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient-accent">
                R$ {totalRecebido.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {registros.length} pagamentos registrados
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg card-hover bg-gradient-to-br from-card to-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Ativos</CardTitle>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient-primary">
                {clientesAtivos}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Total de {clientes.length} clientes
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg card-hover bg-gradient-to-br from-card to-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Orçamentos Aprovados</CardTitle>
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {orcamentosAprovados.length}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                R$ {totalOrcamentosAprovados.toLocaleString('pt-BR')} em valor
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg card-hover bg-gradient-to-br from-card to-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Serviços Cadastrados</CardTitle>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {servicos.length}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Catálogo de serviços
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <div>
          <h2 className="text-2xl font-display font-bold mb-4">Resumo</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-lg card-hover bg-gradient-to-br from-accent/5 to-accent/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-accent" />
                  </div>
                  Orçamentos Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-accent">
                  {orcamentosPendentes.length}
                </p>
                <p className="text-sm text-muted-foreground mt-3">
                  Aguardando aprovação
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg card-hover bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  Ticket Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  R$ {registros.length > 0 
                    ? Math.round(totalRecebido / registros.length).toLocaleString('pt-BR')
                    : '0'
                  }
                </p>
                <p className="text-sm text-muted-foreground mt-3">
                  Por pagamento
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg card-hover bg-gradient-to-br from-success/5 to-success/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-success/20 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-success" />
                  </div>
                  Total Orçamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-success">
                  {orcamentos.length}
                </p>
                <p className="text-sm text-muted-foreground mt-3">
                  {orcamentosAprovados.length} aprovados, {orcamentosPendentes.length} pendentes
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
