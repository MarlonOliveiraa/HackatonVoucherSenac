import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Users, FileText, CheckCircle2, Clock, Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const resposta = await fetch(
        "http://localhost/hackatonvouchersenac/backend/router/dashboardRouter.php?acao=getDashboardData"
      );

      if (!resposta.ok) throw new Error("Erro ao buscar dados");

      const dados = await resposta.json();
      setDashboardData(dados.dados);

    } catch (erro) {
      console.error("Erro na requisição:", erro);
    }
  }

  // EVITA RENDERIZAÇÃO ANTES DE CARREGAR
  if (!dashboardData) {
    return (
      <Layout>
        <div className="p-6 text-lg">Carregando dashboard...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-lg">Visão geral do seu negócio</p>
        </div>

        {/* -------- CARDS PRINCIPAIS -------- */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          {/* FATURAMENTO TOTAL */}
          <Card className="border-0 shadow-lg card-hover bg-gradient-to-br from-card to-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Faturamento Total</CardTitle>
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient-accent">
                R$ {Number(dashboardData.faturamento_total).toLocaleString("pt-BR")}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Total recebido no período
              </p>
            </CardContent>
          </Card>

          {/* CLIENTES ATIVOS */}
          <Card className="border-0 shadow-lg card-hover bg-gradient-to-br from-card to-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Ativos</CardTitle>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient-primary">
                {dashboardData.clientes_ativos}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Total de clientes ativos
              </p>
            </CardContent>
          </Card>

          {/* TICKET MÉDIO */}
          <Card className="border-0 shadow-lg card-hover bg-gradient-to-br from-card to-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Médio</CardTitle>
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                R$ {Number(dashboardData.ticket_medio).toLocaleString("pt-BR")}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Média por serviço concluído
              </p>
            </CardContent>
          </Card>

          {/* SERVIÇO MAIS LUCRATIVO */}
          <Card className="border-0 shadow-lg card-hover bg-gradient-to-br from-card to-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Serviço Mais Lucrativo</CardTitle>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {dashboardData.servico_mais_lucrativo?.nome}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                R$ {Number(dashboardData.servico_mais_lucrativo?.faturamento).toLocaleString("pt-BR")}
              </p>
            </CardContent>
          </Card>

        </div>


        {/*  RESUMO INFEROR*/}
        <div>
          <h2 className="text-2xl font-display font-bold mb-4">Resumo</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {/* DIA DE MAIOR FATURAMENTO */}
            <Card className="border-0 shadow-lg card-hover bg-gradient-to-br from-accent/5 to-accent/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-accent" />
                  </div>
                  Dia de Maior Faturamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-accent">
                  {["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"][dashboardData.dia_maior_faturamento?.dia_semana]}
                </p>
                <p className="text-sm text-muted-foreground mt-3">
                  R$ {Number(dashboardData.dia_maior_faturamento?.total).toLocaleString("pt-BR")}
                </p>
              </CardContent>
            </Card>

            {/* SERVIÇOS CONCLUÍDOS */}
            <Card className="border-0 shadow-lg card-hover bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  Serviços Concluídos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  {dashboardData.servicos_concluidos}
                </p>
                <p className="text-sm text-muted-foreground mt-3">
                  Total finalizado no período
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
