import { Check, Zap, Star, Crown, User, CreditCard, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";

interface PlanFeature {
  text: string;
}

interface Plan {
  name: string;
  subtitle: string;
  price: string;
  period: string;
  features: PlanFeature[];
  icon: React.ReactNode;
  highlighted?: boolean;
  badge?: string;
  current?: boolean;
}

const plans: Plan[] = [
  {
    name: "START",
    subtitle: "Para começar a organizar seu negócio",
    price: "R$ 19,90",
    period: "/ mês",
    icon: <Zap className="h-5 w-5" />,
    highlighted: true,
    badge: "Mais Popular",
    current: true,
    features: [
      { text: "Cadastro de até 100 clientes" },
      { text: "Geração de orçamentos básicos (PDF)" },
      { text: "Controle de receitas e despesas" },
      { text: "Painel financeiro simples" },
      { text: "Exportação em CSV" },
      { text: "Suporte por e-mail" },
    ],
  },
  {
    name: "PRO",
    subtitle: "Para negócios em crescimento",
    price: "R$ 49,90",
    period: "/ mês",
    icon: <Star className="h-5 w-5" />,
    features: [
      { text: "Cadastro ilimitado de clientes" },
      { text: "Orçamentos personalizados" },
      { text: "Controle financeiro automatizado" },
      { text: "Relatórios detalhados" },
      { text: "Integração com bancos" },
      { text: "Suporte prioritário" },
    ],
  },
  {
    name: "BUSINESS",
    subtitle: "Para equipes e empresas",
    price: "R$ 99,90",
    period: "/ mês",
    icon: <Crown className="h-5 w-5" />,
    features: [
      { text: "Tudo do plano Pro" },
      { text: "Múltiplos usuários" },
      { text: "API para integrações" },
      { text: "Relatórios personalizados" },
      { text: "Consultoria mensal" },
      { text: "Suporte 24/7 dedicado" },
    ],
  },
];

const Perfil = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">Minha Conta</h1>
          <p className="text-muted-foreground mt-1">Gerencie seu perfil e assinatura</p>
        </div>

        <Tabs defaultValue="perfil" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 h-12">
            <TabsTrigger value="perfil" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="planos" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Planos</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Config</span>
            </TabsTrigger>
          </TabsList>

          {/* Perfil Tab */}
          <TabsContent value="perfil" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Atualize seus dados de conta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-primary-foreground">
                      {user?.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{user?.name}</h3>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <Badge variant="secondary" className="mt-2">
                      <Zap className="h-3 w-3 mr-1" />
                      Plano START
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input id="name" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" defaultValue={user?.email} />
                  </div>
                </div>

                <Button className="mt-4">Salvar alterações</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Planos Tab */}
          <TabsContent value="planos" className="space-y-6">
            {/* Current Plan */}
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Seu plano atual: START
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Renovação automática em 15/01/2025
                    </CardDescription>
                  </div>
                  <Badge>Ativo</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative transition-all duration-300 hover:shadow-lg ${
                    plan.current
                      ? "border-2 border-primary ring-2 ring-primary/20"
                      : "border-border/50 hover:border-border"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground shadow-md">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  {plan.current && (
                    <div className="absolute -top-3 right-4">
                      <Badge variant="outline" className="bg-background">
                        Atual
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pt-6 pb-4">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${
                      plan.highlighted 
                        ? "bg-primary/10 text-primary" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {plan.icon}
                    </div>

                    <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-muted-foreground/80">{plan.subtitle}</p>

                    <div className="mt-4 flex items-baseline gap-1">
                      <span className={`text-2xl font-display font-bold ${
                        plan.highlighted ? "text-primary" : "text-foreground"
                      }`}>
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground text-xs">{plan.period}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <Button
                      className="w-full mb-4"
                      variant={plan.current ? "outline" : plan.highlighted ? "default" : "secondary"}
                      disabled={plan.current}
                    >
                      {plan.current ? "Plano atual" : "Fazer upgrade"}
                    </Button>

                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs">
                          <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${
                            plan.highlighted 
                              ? "bg-primary/10 text-primary" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            <Check className="h-2.5 w-2.5" strokeWidth={3} />
                          </div>
                          <span className="text-foreground/80">{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* FAQ */}
            <Card>
              <CardContent className="py-6 text-center">
                <p className="text-muted-foreground text-sm mb-3">
                  Dúvidas sobre os planos?
                </p>
                <Button variant="outline" size="sm">
                  Falar com suporte
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Config Tab */}
          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
                <CardDescription>Preferências gerais da conta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">Notificações por e-mail</p>
                    <p className="text-sm text-muted-foreground">Receber atualizações e novidades</p>
                  </div>
                  <Button variant="outline" size="sm">Ativado</Button>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">Tema</p>
                    <p className="text-sm text-muted-foreground">Alternar entre claro e escuro</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Use o botão no menu</p>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-destructive">Excluir conta</p>
                    <p className="text-sm text-muted-foreground">Remover permanentemente seus dados</p>
                  </div>
                  <Button variant="destructive" size="sm">Excluir</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Perfil;