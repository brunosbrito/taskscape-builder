import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Send } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { updateEffective } from "@/services/EffectiveService";

interface Funcionario {
  id: number;
  nome: string;
  setor: "PRODUCAO" | "ADMINISTRATIVO";
  status: "PRESENTE" | "FALTA";
  turno: 1 | 2 | 3;
  obra?: string;
  motivoFalta?: string;
}

interface PontoTableProps {
  funcionarios: Funcionario[];
  turno: 1 | 2 | 3;
  onEdit: (funcionario: Funcionario) => void;
  onDelete: (id: number) => void;
}

export const PontoTable = ({ funcionarios, turno, onEdit, onDelete }: PontoTableProps) => {
  const funcionariosFiltrados = funcionarios.filter(f => f.turno === turno);
  
  const getTurnoLabel = (turno: number) => {
    switch (turno) {
      case 1:
        return "1º Turno (06:00 - 14:00)";
      case 2:
        return "2º Turno (14:00 - 22:00)";
      case 3:
        return "Turno Central (08:00 - 17:00)";
      default:
        return `${turno}º Turno`;
    }
  };

  const handleEnviarTurno = async () => {
    try {
      const registros = funcionariosFiltrados.map(f => ({
        username: f.nome,
        shift: f.turno.toString(),
        role: f.setor,
        project: f.obra,
        typeRegister: f.status,
        reason: f.motivoFalta,
        sector: f.setor === "ADMINISTRATIVO" ? f.setor : undefined
      }));

      // Envia cada registro individualmente
      for (const registro of registros) {
        await updateEffective(registro);
      }

      toast.success(`Registros do ${getTurnoLabel(turno)} enviados com sucesso`);
    } catch (error) {
      console.error('Erro ao enviar registros:', error);
      toast.error('Erro ao enviar registros. Tente novamente.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-construction-800">{getTurnoLabel(turno)}</h2>
        <Button onClick={handleEnviarTurno} variant="secondary" size="sm">
          <Send className="w-4 h-4 mr-2" />
          Enviar Registros do Turno
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Nome</TableHead>
            <TableHead className="w-[150px]">Setor</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[200px]">Obra</TableHead>
            <TableHead className="w-[200px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {funcionariosFiltrados.map((funcionario) => (
            <TableRow key={funcionario.id}>
              <TableCell className="font-medium">{funcionario.nome}</TableCell>
              <TableCell>
                <Badge variant={funcionario.setor === "PRODUCAO" ? "default" : "secondary"}>
                  {funcionario.setor}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={funcionario.status === "PRESENTE" ? "default" : "destructive"}>
                  {funcionario.status}
                </Badge>
              </TableCell>
              <TableCell>{funcionario.obra || "-"}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onEdit(funcionario)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir este registro de ponto? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(funcionario.id)}>
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};