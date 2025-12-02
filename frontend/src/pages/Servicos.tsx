import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useServicos } from '@/hooks/useServicos';
import { useClientes } from '@/hooks/useClientes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';

const Servicos = () => {
  const { servicos, addServico, updateServico, deleteServico } = useServicos();
  const { clientes } = useClientes();
  const [open, setOpen] = useState(false);
  const [selectedServico, setSelectedServico] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    clienteId: '',
    nome: '',
    valor: '',
    tempoEstimado: '',
    status: 'pendente' as 'pendente' | 'concluido' | 'cancelado',
    data: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      valor: parseFloat(formData.valor),
      tempoEstimado: parseFloat(formData.tempoEstimado),
    };
    
    if (selectedServico) {
      updateServico(selectedServico, data);
      toast.success('Serviço atualizado!');
    } else {
      addServico(data);
      toast.success('Serviço cadastrado!');
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      clienteId: '',
      nome: '',
      valor: '',
      tempoEstimado: '',
      status: 'pendente',
      data: new Date().toISOString().split('T')[0],
    });
    setSelectedServico(null);
    setOpen(false);
  };

  const handleEdit = (servico: any) => {
    setFormData({
      ...servico,
      valor: servico.valor.toString(),
      tempoEstimado: servico.tempoEstimado.toString(),
    });
    setSelectedServico(servico.id);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      deleteServico(id);
      toast.success('Serviço excluído!');
    }
  };

  const getClienteNome = (clienteId: string) => {
    return clientes.find(c => c.id === clienteId)?.nome || 'Cliente não encontrado';
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold">Serviços</h1>
            <p className="text-muted-foreground text-lg">Gerencie seus serviços e tarefas</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="shadow-lg hover:shadow-glow transition-all" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedServico ? 'Editar Serviço' : 'Novo Serviço'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clienteId">Cliente</Label>
                  <Select
                    value={formData.clienteId}
                    onValueChange={(value) => setFormData({ ...formData, clienteId: value })}
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
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Serviço</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valor">Valor (R$)</Label>
                    <Input
                      id="valor"
                      type="number"
                      step="0.01"
                      value={formData.valor}
                      onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tempoEstimado">Tempo (horas)</Label>
                    <Input
                      id="tempoEstimado"
                      type="number"
                      step="0.5"
                      value={formData.tempoEstimado}
                      onChange={(e) => setFormData({ ...formData, tempoEstimado: e.target.value })}
                      required
                    />
                  </div>
                </div>
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
                      <SelectItem value="concluido">Concluído</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  {selectedServico ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {servicos.map((servico) => (
            <Card key={servico.id} className="card-hover border-0 shadow-lg overflow-hidden group bg-gradient-to-br from-card to-card/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-accent opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity" />
              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{servico.nome}</CardTitle>
                    <CardDescription className="font-medium">
                      {getClienteNome(servico.clienteId)}
                    </CardDescription>
                  </div>
                  <Badge variant={
                    servico.status === 'concluido' ? 'default' :
                    servico.status === 'pendente' ? 'secondary' : 'outline'
                  } className="shadow-sm">
                    {servico.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 relative">
                <div className="bg-gradient-accent rounded-xl p-4 shadow-md">
                  <div className="text-3xl font-bold text-white">
                    R$ {servico.valor.toLocaleString('pt-BR')}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 flex-1">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">{new Date(servico.data).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                    <Clock className="h-4 w-4 text-accent" />
                    <span className="font-medium">{servico.tempoEstimado}h</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleEdit(servico)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => handleDelete(servico.id)}
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

export default Servicos;
