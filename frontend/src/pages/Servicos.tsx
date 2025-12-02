import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useServicos } from '@/hooks/useServicos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

const Servicos = () => {
  const { servicos, addServico, updateServico, deleteServico } = useServicos();
  const [open, setOpen] = useState(false);
  const [selectedServico, setSelectedServico] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedServico) {
      updateServico(selectedServico, formData);
      toast.success('Serviço atualizado!');
    } else {
      addServico(formData);
      toast.success('Serviço cadastrado!');
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
    });
    setSelectedServico(null);
    setOpen(false);
  };

  const handleEdit = (servico: any) => {
    setFormData({
      nome: servico.nome,
      descricao: servico.descricao || '',
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

  return (
    <Layout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold">Serviços</h1>
            <p className="text-muted-foreground text-lg">Catálogo de serviços oferecidos</p>
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
                  <Label htmlFor="nome">Nome do Serviço</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descreva o serviço..."
                    rows={4}
                  />
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
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity" />
              <CardHeader className="relative">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{servico.nome}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {servico.descricao || 'Sem descrição'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 relative">
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
