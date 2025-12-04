import { Check, Star, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";

interface PlanFeature {
  text: string;
  included: boolean;
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
}

const plans: Plan[] = [
  {
    name: "START",
    subtitle: "Para começar a organizar seu negócio",
    price: "R$ 19,90",
    period: "/ mês",
    icon: <Zap className="h-6 w-6" />,
    highlighted: true,
    badge: "Mais Popular",
    features: [
      { text: "Cadastro de até 100 clientes", included: true },
      { text: "Geração de orçamentos básicos (PDF simples)", included: true },
      { text: "Controle de receitas e despesas manual", included: true },
      { text: "Painel financeiro simples (entrada e saída)", included: true },
      { text: "Exportação de dados em CSV", included: true },
      { text: "Suporte por e-mail", included: true },
    ],
  },
  {
    name: "PRO",
    subtitle: "Para negócios em crescimento",
    price: "R$ 49,90",
    period: "/ mês",
    icon: <Star className="h-6 w-6" />,
    features: [
      { text: "Cadastro ilimitado de clientes", included: true },
      { text: "Orçamentos personalizados com marca", included: true },
      { text: "Controle financeiro automatizado", included: true },
      { text: "Relatórios detalhados e gráficos", included: true },
      { text: "Integração com bancos", included: true },
      { text: "Suporte prioritário via chat", included: true },
    ],
  },
  {
    name: "BUSINESS",
    subtitle: "Para equipes e empresas",
    price: "R$ 99,90",
    period: "/ mês",
    icon: <Crown className="h-6 w-6" />,
    features: [
      { text: "Tudo do plano Pro", included: true },
      { text: "Múltiplos usuários e permissões", included: true },
      { text: "API para integrações", included: true },
      { text: "Relatórios personalizados", included: true },
      { text: "Consultoria financeira mensal", included: true },
      { text: "Suporte 24/7 dedicado", included: true },
    ],
  },
];

const Planos = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">G</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">GestãoPro</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" size="sm">Entrar</Button>
            <Button size="sm">Criar conta</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <Badge variant="secondary" className="mb-4 px-4 py-1.5">
          <Zap className="h-3.5 w-3.5 mr-1.5" />
          Comece grátis por 7 dias
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
          Escolha o plano ideal para{" "}
          <span className="text-gradient-primary">seu negócio</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Simplifique sua gestão financeira com ferramentas intuitivas e poderosas. 
          Sem complicação, sem surpresas.
        </p>
        
        {/* Toggle Annual/Monthly - Visual only */}
        <div className="inline-flex items-center gap-3 bg-muted/50 rounded-full p-1.5 mb-12">
          <button className="px-5 py-2 rounded-full bg-background shadow-sm text-sm font-medium text-foreground transition-all">
            Mensal
          </button>
          <button className="px-5 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-all">
            Anual <span className="text-success text-xs">-20%</span>
          </button>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.highlighted
                  ? "border-2 border-primary shadow-lg shadow-primary/10 scale-[1.02] md:scale-105 z-10"
                  : "border-border/50 hover:border-border"
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-bl-xl">
                    {plan.badge}
                  </div>
                </div>
              )}
              
              <CardHeader className="pb-4 pt-8">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${
                  plan.highlighted 
                    ? "bg-primary/10 text-primary" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {plan.icon}
                </div>
                
                <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                  Plano {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground/80 mt-1">
                  {plan.subtitle}
                </p>
                
                <div className="mt-6 flex items-baseline gap-1">
                  <span className={`text-4xl md:text-5xl font-display font-bold ${
                    plan.highlighted ? "text-primary" : "text-foreground"
                  }`}>
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-2">
                <Button 
                  className={`w-full mb-8 h-12 text-base font-semibold ${
                    plan.highlighted 
                      ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25" 
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                  variant={plan.highlighted ? "default" : "secondary"}
                >
                  {plan.highlighted ? "Começar agora" : "Selecionar plano"}
                </Button>
                
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    O que está incluído:
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                          plan.highlighted 
                            ? "bg-primary/10 text-primary" 
                            : "bg-success/10 text-success"
                        }`}>
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </div>
                        <span className="text-sm text-foreground/80 leading-tight">
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="border-t border-border/50 bg-muted/30">
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Mais de 5.000 empreendedores já confiam na GestãoPro
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
            {["Empresa A", "Empresa B", "Empresa C", "Empresa D"].map((company) => (
              <div key={company} className="text-lg font-semibold text-muted-foreground">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
          Ainda tem dúvidas?
        </h2>
        <p className="text-muted-foreground mb-6">
          Fale conosco, estamos prontos para ajudar você a escolher o melhor plano.
        </p>
        <Button variant="outline" size="lg">
          Falar com especialista
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          © 2024 GestãoPro. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Planos;
