import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useFinanceiro } from '@/hooks/useFinanceiro';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const Financeiro = () => {
  // ✅ Chamar o hook UMA VEZ apenas
  const {
    registros,
    addRegistro,
    updateRegistro,
    deleteRegistro,
    getTotalRecebido
  } = useFinanceiro();

  const [open, setOpen] = useState(false);
  const [selectedRegistro, setSelectedRegistro] = useState<string | null>(null);

  const servicos = [
  { id: "1", nome: "Corte de Cabelo" },
  { id: "2", nome: "Manutenção" },
  { id: "3", nome: "Consultoria" },
];


  // ✅ Corrigido servicoId
  const [formData, setFormData] = useState({
    servicoId: '',
    dataPagamento: new Date().toISOString().split('T')[0],
    valorPago: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...formData,
      valorPago: parseFloat(formData.valorPago),
    };

    if (selectedRegistro) {
      updateRegistro(selectedRegistro, data);
      toast.success('Registro atualizado!');
    } else {
      addRegistro(data);
      toast.success('Pagamento registrado!');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      servicoId: '',
      dataPagamento: new Date().toISOString().split('T')[0],
      valorPago: '',
    });
    setSelectedRegistro(null);
    setOpen(false);
  };

  const handleEdit = (registro: any) => {
    setFormData({
      servicoId: registro.servicoId,
      dataPagamento: registro.dataPagamento || '',
      valorPago: registro.valorPago.toString(),
    });
    setSelectedRegistro(registro.id);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      deleteRegistro(id);
      toast.success('Registro excluído!');
    }
  };

  const getServicoNome = (servicoId: string) => {
    return servicos.find(s => s.id === servicoId)?.nome || 'Serviço não encontrado';
  };


  const totalRecebido = getTotalRecebido();

  return (
    <Layout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold">Financeiro</h1>
            <p className="text-muted-foreground text-lg">Controle de pagamentos</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="shadow-lg hover:shadow-glow transition-all" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Novo Pagamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedRegistro ? 'Editar Pagamento' : 'Novo Pagamento'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Serviço */}
                <div className="space-y-2">
                  <Label htmlFor="servicoId">Serviço</Label>
                  <Select
                    value={formData.servicoId}
                    onValueChange={(value) => setFormData({ ...formData, servicoId: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {servicos.map((servico) => (
                        <SelectItem key={servico.id} value={servico.id}>
                          {servico.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Valor */}
                <div className="space-y-2">
                  <Label htmlFor="valorPago">Valor Pago (R$)</Label>
                  <Input
                    id="valorPago"
                    type="number"
                    step="0.01"
                    value={formData.valorPago}
                    onChange={(e) => setFormData({ ...formData, valorPago: e.target.value })}
                    required
                  />
                </div>

                {/* Data */}
                <div className="space-y-2">
                  <Label htmlFor="dataPagamento">Data do Pagamento</Label>
                  <Input
                    id="dataPagamento"
                    type="date"
                    value={formData.dataPagamento}
                    onChange={(e) => setFormData({ ...formData, dataPagamento: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full">
                  {selectedRegistro ? 'Atualizar' : 'Registrar Pagamento'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Total */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-accent/10 to-accent/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Recebido</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gradient-accent">
              R$ {totalRecebido.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {registros.length} pagamento(s) registrado(s)
            </p>
          </CardContent>
        </Card>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {registros.map((registro) => (
            <Card key={registro.id} className="card-hover border-0 shadow-lg overflow-hidden group bg-gradient-to-br from-card to-card/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-accent opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity" />

              <CardHeader className="relative">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-accent flex items-center justify-center shadow-md">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">
                      {getServicoNome(registro.servicoId)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {registro.dataPagamento 
                        ? new Date(registro.dataPagamento).toLocaleDateString('pt-BR')
                        : 'Data não informada'
                      }
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 relative">
                <div className="bg-gradient-accent rounded-xl p-4 shadow-md">
                  <div className="text-3xl font-bold text-white">
                    R$ {Number(registro.valorPago || 0).toLocaleString('pt-BR')}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleEdit(registro)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => handleDelete(registro.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Financeiro;
