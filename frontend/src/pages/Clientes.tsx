import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useClientes } from '@/hooks/useClientes';
import { useServicos } from '@/hooks/useServicos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Mail, Phone, Edit, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';

const Clientes = () => {
  const { clientes, addCliente, updateCliente, deleteCliente } = useClientes();
  const { servicos } = useServicos();
  const [open, setOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    observacoes: '',
    status: 'ativo' as 'ativo' | 'inativo',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCliente) {
      updateCliente(selectedCliente, formData);
      toast.success('Cliente atualizado!');
    } else {
      addCliente(formData);
      toast.success('Cliente cadastrado!');
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ nome: '', telefone: '', email: '', observacoes: '', status: 'ativo' });
    setSelectedCliente(null);
    setOpen(false);
  };

  const handleEdit = (cliente: any) => {
    setFormData(cliente);
    setSelectedCliente(cliente.id);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteCliente(id);
      toast.success('Cliente excluído!');
    }
  };

  const getClienteTimeline = (clienteId: string) => {
    return servicos
      .filter(s => s.clienteId === clienteId)
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold">Clientes</h1>
            <p className="text-muted-foreground text-lg">Gerencie seus clientes</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="shadow-lg hover:shadow-glow transition-all" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedCliente ? 'Editar Cliente' : 'Novo Cliente'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'ativo' | 'inativo') => 
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {selectedCliente ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clientes.map((cliente) => (
            <Card key={cliente.id} className="card-hover border-0 shadow-lg overflow-hidden group bg-gradient-to-br from-card to-card/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity" />
              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
                      <span className="text-lg font-bold text-white">
                        {cliente.nome[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-xl">{cliente.nome}</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {cliente.email}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant={cliente.status === 'ativo' ? 'default' : 'secondary'}
                    className="shadow-sm"
                  >
                    {cliente.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 relative">
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                  <Phone className="h-4 w-4 text-primary" />
                  {cliente.telefone}
                </div>
                {cliente.observacoes && (
                  <p className="text-sm text-muted-foreground line-clamp-2 italic border-l-2 border-primary/20 pl-3">
                    {cliente.observacoes}
                  </p>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => {
                      setSelectedCliente(cliente.id);
                      setTimelineOpen(true);
                    }}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Timeline
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleEdit(cliente)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => handleDelete(cliente.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Timeline Dialog */}
        <Dialog open={timelineOpen} onOpenChange={setTimelineOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Timeline do Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {selectedCliente && getClienteTimeline(selectedCliente).map((servico) => (
                <div key={servico.id} className="flex gap-4 border-l-2 border-primary pl-4 pb-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{servico.nome}</h4>
                      <Badge variant={
                        servico.status === 'concluido' ? 'default' :
                        servico.status === 'pendente' ? 'secondary' : 'outline'
                      }>
                        {servico.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Data: {new Date(servico.data).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm font-semibold text-accent">
                      R$ {servico.valor.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
              {selectedCliente && getClienteTimeline(selectedCliente).length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum serviço encontrado
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Clientes;
