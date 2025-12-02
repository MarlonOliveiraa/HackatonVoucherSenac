import { Layout } from '@/components/Layout';
import { useServicos } from '@/hooks/useServicos';
import { useClientes } from '@/hooks/useClientes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Users, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const { servicos } = useServicos();
  const { clientes } = useClientes();

  // Calcular métricas
  const servicosConcluidos = servicos.filter(s => s.status === 'concluido');
  const faturamentoTotal = servicosConcluidos.reduce((acc, s) => acc + s.valor, 0);
  const clientesAtivos = clientes.filter(c => c.status === 'ativo').length;

  // Serviço mais lucrativo
  const servicoMaisLucrativo = servicos.reduce((max, s) => 
    s.valor > (max?.valor || 0) ? s : max
  , servicos[0]);

  // Faturamento por dia da semana (mock)
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const faturamentoPorDia = servicosConcluidos.reduce((acc, s) => {
    const dia = new Date(s.data).getDay();
    acc[dia] = (acc[dia] || 0) + s.valor;
    return acc;
  }, {} as Record<number, number>);

  const diaMaiorFaturamento = Object.entries(faturamentoPorDia)
    .sort(([, a], [, b]) => b - a)[0];

  const tempoMedio = servicosConcluidos.length > 0
    ? servicosConcluidos.reduce((acc, s) => acc + s.tempoEstimado, 0) / servicosConcluidos.length
    : 0;

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
              <CardTitle className="text-sm font-medium text-muted-foreground">Faturamento Total</CardTitle>
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient-accent">
                R$ {faturamentoTotal.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {servicosConcluidos.length} serviços concluídos
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Serviços Concluídos</CardTitle>
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {servicosConcluidos.length}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {servicos.filter(s => s.status === 'pendente').length} pendentes
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg card-hover bg-gradient-to-br from-card to-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Médio</CardTitle>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                R$ {servicosConcluidos.length > 0 
                  ? Math.round(faturamentoTotal / servicosConcluidos.length).toLocaleString('pt-BR')
                  : '0'
                }
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Por serviço
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Insights de Produtividade */}
        <div>
          <h2 className="text-2xl font-display font-bold mb-4">Insights de Produtividade</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-lg card-hover bg-gradient-to-br from-accent/5 to-accent/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-accent" />
                  </div>
                  Serviço Mais Lucrativo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {servicoMaisLucrativo ? (
                  <>
                    <p className="font-semibold text-lg text-foreground line-clamp-1">{servicoMaisLucrativo.nome}</p>
                    <p className="text-3xl font-bold text-accent mt-3">
                      R$ {servicoMaisLucrativo.valor.toLocaleString('pt-BR')}
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">Nenhum serviço cadastrado</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg card-hover bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  Dia com Maior Faturamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                {diaMaiorFaturamento ? (
                  <>
                    <p className="font-semibold text-lg text-foreground">
                      {diasSemana[parseInt(diaMaiorFaturamento[0])]}
                    </p>
                    <p className="text-3xl font-bold text-primary mt-3">
                      R$ {Math.round(diaMaiorFaturamento[1]).toLocaleString('pt-BR')}
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">Sem dados</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg card-hover bg-gradient-to-br from-success/5 to-success/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-success/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </div>
                  Tempo Médio por Serviço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-success">
                  {tempoMedio.toFixed(1)}h
                </p>
                <p className="text-sm text-muted-foreground mt-3">
                  Baseado em {servicosConcluidos.length} serviços
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
