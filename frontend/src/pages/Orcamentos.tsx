import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useOrcamentos } from '@/hooks/useOrcamentos';
import { useClientes } from '@/hooks/useClientes';
import { useServicos } from '@/hooks/useServicos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';

const Orcamentos = () => {
  const { orcamentos, addOrcamento, updateOrcamento, deleteOrcamento, getOrcamentoItems } = useOrcamentos();
  const { clientes } = useClientes();
  const { servicos } = useServicos();
  const [open, setOpen] = useState(false);
  const [selectedOrcamento, setSelectedOrcamento] = useState<string | null>(null);
  const [selectedServicos, setSelectedServicos] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    clienteId: '',
    status: 'pendente' as 'aprovado' | 'pendente' | 'rejeitado',
    data: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedServicos.length === 0) {
      toast.error('Selecione pelo menos um serviço');
      return;
    }

    const servicosData = selectedServicos.map(servicoId => {
      const servico = servicos.find(s => s.id === servicoId);
      return {
        id: '',
        orcamentoId: '',
        servicoId,
        valor: servico?.valor || 0,
      };
    });

    const total = servicosData.reduce((acc, s) => acc + s.valor, 0);

    if (selectedOrcamento) {
      updateOrcamento(selectedOrcamento, { ...formData, total });
      toast.success('Orçamento atualizado!');
    } else {
      addOrcamento({ ...formData, total }, servicosData);
      toast.success('Orçamento criado!');
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      clienteId: '',
      status: 'pendente',
      data: new Date().toISOString().split('T')[0],
    });
    setSelectedServicos([]);
    setSelectedOrcamento(null);
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
      deleteOrcamento(id);
      toast.success('Orçamento excluído!');
    }
  };

  const getClienteNome = (clienteId: string) => {
    return clientes.find(c => c.id === clienteId)?.nome || 'Cliente não encontrado';
  };

  const getServicoNome = (servicoId: string) => {
    return servicos.find(s => s.id === servicoId)?.nome || 'Serviço não encontrado';
  };

  const getClienteServicos = (clienteId: string) => {
    return servicos.filter(s => s.clienteId === clienteId);
  };

  const toggleServico = (servicoId: string) => {
    setSelectedServicos(prev =>
      prev.includes(servicoId)
        ? prev.filter(id => id !== servicoId)
        : [...prev, servicoId]
    );
  };

  const calculateTotal = () => {
    return selectedServicos.reduce((acc, servicoId) => {
      const servico = servicos.find(s => s.id === servicoId);
      return acc + (servico?.valor || 0);
    }, 0);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold">Orçamentos</h1>
            <p className="text-muted-foreground text-lg">Crie e gerencie orçamentos</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="shadow-lg hover:shadow-glow transition-all" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Novo Orçamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedOrcamento ? 'Editar Orçamento' : 'Novo Orçamento'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clienteId">Cliente</Label>
                  <Select
                    value={formData.clienteId}
                    onValueChange={(value) => {
                      setFormData({ ...formData, clienteId: value });
                      setSelectedServicos([]);
                    }}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.clienteId && (
                  <div className="space-y-2">
                    <Label>Serviços</Label>
                    <div className="border rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
                      {getClienteServicos(formData.clienteId).map((servico) => (
                        <div key={servico.id} className="flex items-center justify-between p-2 hover:bg-accent rounded">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedServicos.includes(servico.id)}
                              onCheckedChange={() => toggleServico(servico.id)}
                            />
                            <div>
                              <p className="font-medium">{servico.nome}</p>
                              <p className="text-sm text-muted-foreground">
                                R$ {servico.valor.toLocaleString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data">Data</Label>
                    <Input
                      id="data"
                      type="date"
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="aprovado">Aprovado</SelectItem>
                        <SelectItem value="rejeitado">Rejeitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedServicos.length > 0 && (
                  <div className="bg-accent/50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total</span>
                      <span className="text-2xl font-bold text-accent">
                        R$ {calculateTotal().toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full">
                  {selectedOrcamento ? 'Atualizar' : 'Criar Orçamento'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orcamentos.map((orcamento) => {
            const items = getOrcamentoItems(orcamento.id);
            return (
              <Card key={orcamento.id} className="card-hover border-0 shadow-lg overflow-hidden group bg-gradient-to-br from-card to-card/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-success opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity" />
                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold">
                          Orçamento #{orcamento.id.slice(0, 6)}
                        </CardTitle>
                        <CardDescription className="mt-1 font-medium">
                          {getClienteNome(orcamento.clienteId)}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={
                      orcamento.status === 'aprovado' ? 'default' :
                      orcamento.status === 'pendente' ? 'secondary' : 'outline'
                    } className="shadow-sm">
                      {orcamento.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 relative">
                  <div className="bg-gradient-accent rounded-xl p-4 shadow-md">
                    <div className="text-xs text-white/80 font-medium mb-1">Valor Total</div>
                    <div className="text-3xl font-bold text-white">
                      R$ {orcamento.total.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg px-3 py-2">
                    <div className="text-xs text-muted-foreground font-medium mb-1">Data</div>
                    <div className="text-sm font-semibold text-foreground">
                      {new Date(orcamento.data).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Serviços inclusos</p>
                    <ul className="text-sm space-y-1.5">
                      {items.map((item) => (
                        <li key={item.id} className="flex items-center gap-2 text-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {getServicoNome(item.servicoId)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 hover:bg-success hover:text-success-foreground hover:border-success transition-colors"
                      onClick={() => {
                        updateOrcamento(orcamento.id, {
                          status: orcamento.status === 'pendente' ? 'aprovado' : 'pendente'
                        });
                        toast.success('Status atualizado!');
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
                      onClick={() => handleDelete(orcamento.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Orcamentos;
