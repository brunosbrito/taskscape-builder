import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NovaRNCDialog } from './NovaRNCDialog';
import RncService from '@/services/NonConformityService';
import { NonConformity } from '@/interfaces/RncInterface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const NaoConformidades = () => {
  const [showNovaRNCDialog, setShowNovaRNCDialog] = useState(false);
  const [dadosRnc, setDadosRnc] = useState<NonConformity[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState<'todos' | 'Fabrica' | 'Obra'>('todos');

  const getAllRnc = async () => {
    const rnc = await RncService.getAllRnc();
    setDadosRnc(rnc);
  };

  useEffect(() => {
    getAllRnc();
  }, []);

  const rncsFiltradas = dadosRnc.filter((rnc) => {
    if (tipoFiltro === 'todos') return true;
    return rnc.project.type === tipoFiltro;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-construction-800">
            RNC - Registro de Não Conformidade
          </h1>
          <Button
            onClick={() => setShowNovaRNCDialog(true)}
            className="bg-secondary hover:bg-secondary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova RNC
          </Button>
        </div>

        <div className="flex items-center gap-4 p-4 bg-construction-100 rounded-lg">
          <Filter className="h-5 w-5 text-construction-600" />
          <RadioGroup
            defaultValue="todos"
            onValueChange={(value) => setTipoFiltro(value as 'todos' | 'Fabrica' | 'Obra')}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="todos" id="todos" />
              <label htmlFor="todos">Todos</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Fabrica" id="fabrica" />
              <label htmlFor="fabrica">Fábrica</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Obra" id="obra" />
              <label htmlFor="obra">Obra</label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rncsFiltradas.map((rnc) => (
            <Card key={rnc.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{rnc.project.name}</CardTitle>
                <CardDescription>
                  OS: {rnc.serviceOrder.name} | {format(new Date(rnc.dateOccurrence), 'dd/MM/yyyy', { locale: ptBR })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-construction-600">
                    <strong>Responsável:</strong> {rnc.responsibleRNC.name}
                  </p>
                  <p className="text-sm text-construction-600">
                    <strong>Descrição:</strong> {rnc.description}
                  </p>
                  {rnc.correctiveAction && (
                    <p className="text-sm text-construction-600">
                      <strong>Ação Corretiva:</strong> {rnc.correctiveAction}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <NovaRNCDialog
          open={showNovaRNCDialog}
          onOpenChange={setShowNovaRNCDialog}
        />
      </div>
    </Layout>
  );
};

export default NaoConformidades;