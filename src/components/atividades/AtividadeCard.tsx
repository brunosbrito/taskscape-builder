import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Building2,
  Calendar,
  ClipboardList,
  Clock,
  Clock1,
  Edit2,
  Eye,
  GripHorizontal,
  Hourglass,
  MoveHorizontal,
  Upload,
  User,
  Users,
  CheckCircle2,
  RefreshCcw,
  Trash2,
} from 'lucide-react';
import { NovaAtividadeForm } from './NovaAtividadeForm';
import { useToast } from '@/hooks/use-toast';
import { AtividadeStatus } from '@/interfaces/AtividadeStatus';
import { useParams } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';
import { AtividadeHistoricoList } from './AtividadeHistoricoList';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { uploadActivityImage } from '@/services/ActivityImageService';
import { useState } from 'react';
import { AtividadeImageCarousel } from './AtividadeImageCarousel';
import { AtividadeInfoBasica } from './AtividadeInfoBasica';
import { AtividadeEquipe } from './AtividadeEquipe';
import { AtividadeUploadDialog } from './AtividadeUploadDialog';
import { MoverAtividadeDialog } from './MoverAtividadeDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { Progress } from '@/components/ui/progress';
import { AtualizarProgressoDialog } from './AtualizarProgressoDialog';
import { deleteActivity } from '@/services/ActivityService';

interface AtividadeCardProps {
  atividade: AtividadeStatus;
  index: number;
  onMoveAtividade?: (atividadeId: number, novoStatus: string) => void;
  onDelete?: () => void;
}

export const AtividadeCard = ({
  atividade,
  index,
  onMoveAtividade,
  onDelete,
}: AtividadeCardProps) => {
  const { toast } = useToast();
  const { projectId, serviceOrderId } = useParams();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageDescription, setImageDescription] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isMobile = useIsMobile();

  function formatTime(totalTime) {
    if (isNaN(totalTime) || totalTime <= 0) return '00:00';

    const hours = Math.floor(totalTime);
    const minutes = Math.round((totalTime - hours) * 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}`;
  }

  const calculateElapsedTime = (totalTime, startDate) => {
    if (!startDate) return totalTime / 3600;

    const startDateTime = new Date(startDate);
    const now = new Date();

    if (now < startDateTime) {
      console.error('Erro: A data de início é maior que o horário atual.');
      return 0;
    }

    const elapsedSeconds =
      totalTime + (now.getTime() - startDateTime.getTime()) / 1000;

    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);

    return hours + minutes / 60;
  };

  const formatEstimatedTime = (estimatedTime: string) => {
    if (!estimatedTime) return '00:00';
    const [hours, minutes] = estimatedTime.split(/[h|min]/).filter(Boolean);
    return `${hours.padStart(2, '0')}:${minutes?.padStart(2, '0')}`;
  };

  const calculatePercentage = (elapsedTime, estimatedTime: string) => {
    if (!estimatedTime) return 0;

    const [hours, minutes] = estimatedTime.split(/[h|min]/).filter(Boolean);
    const totalEstimatedSeconds =
      parseInt(hours) * 3600 + parseInt(minutes) * 60;

    elapsedTime += elapsedTime * 3600;

    return Math.round((elapsedTime / totalEstimatedSeconds) * 100);
  };

  const elapsedTime =
    atividade.status === 'Em execução'
      ? calculateElapsedTime(atividade.totalTime, atividade.startDate)
      : atividade.totalTime;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsUploadDialogOpen(true);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;
    const userId = localStorage.getItem('userId');
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('description', imageDescription);
      formData.append('createdById', userId);

      await uploadActivityImage(atividade.id, formData);

      toast({
        title: 'Upload realizado com sucesso',
        description: 'A imagem foi enviada e será processada em breve.',
      });

      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      setImageDescription('');
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        variant: 'destructive',
        title: 'Erro no upload',
        description:
          'Ocorreu um erro ao fazer o upload da imagem. Tente novamente.',
      });
    }
  };

  const handleMove = (novoStatus: string) => {
    if (onMoveAtividade) {
      onMoveAtividade(atividade.id, novoStatus);
    }
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    window.location.reload();
  };

  const calculateProgress = () => {
    if (!atividade.quantity || !atividade.completedQuantity) return 0;
    const progress = (atividade.completedQuantity / atividade.quantity) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const handleProgressSuccess = () => {
    window.location.reload();
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteActivity(atividade.id);
      toast({
        title: "Atividade excluída",
        description: "A atividade foi excluída com sucesso.",
      });
      setIsDeleteDialogOpen(false);
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Erro ao excluir atividade:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir atividade",
        description: "Não foi possível excluir a atividade. Tente novamente.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Draggable draggableId={String(atividade.id)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#FF7F0E]">
                    #{atividade.cod_sequencial}
                  </span>
                  <CardTitle className="text-sm font-medium">
                    {atividade.description}
                  </CardTitle>
                </div>
                <GripHorizontal className="w-4 h-4 text-gray-400" />
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0 text-sm text-gray-500">
              <div className="flex items-center mb-2">
                <Building2 className="w-4 h-4 mr-2" />
                {atividade.project?.name}
              </div>
              <div className="flex items-center mb-2">
                <ClipboardList className="w-4 h-4 mr-2" />
                OS Nº: {atividade.serviceOrder.serviceOrderNumber}
              </div>
              <div className="flex items-center mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Data Criação: {format(atividade?.createdAt, 'dd/MM/yyyy')}
              </div>

              {typeof atividade.quantity === 'number' && (
                <div className="space-y-2 mb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-[#FF7F0E]" />
                      <span>
                        Progresso: {Math.round(calculateProgress())}% (
                        {atividade.completedQuantity || 0} de{' '}
                        {atividade.quantity} )
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsProgressDialogOpen(true)}
                    >
                      <RefreshCcw size={16} />
                    </Button>
                  </div>
                  <Progress value={calculateProgress()} className="h-2" />
                </div>
              )}

              {atividade.status !== 'Planejadas' && (
                <div className="flex items-center mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  {(() => {
                    switch (atividade.status) {
                      case 'Em execução':
                        return `Data início (${format(
                          new Date(atividade.startDate),
                          'dd/MM/yyyy'
                        )})`;

                      case 'Paralizadas':
                        return `Data Paralisação: ${format(
                          new Date(atividade.pauseDate),
                          'dd/MM/yyyy'
                        )}`;

                      default:
                        return `Data Conclusão: ${format(
                          new Date(atividade.endDate),
                          'dd/MM/yyyy'
                        )}`;
                    }
                  })()}
                </div>
              )}

              <div className="flex items-center mb-2">
                <Clock1 className="w-4 h-4 mr-2" />
                Tempo Previsto: {formatEstimatedTime(atividade?.estimatedTime)}
              </div>

              {atividade.status === 'Planejadas' ? null : (
                <div className="flex items-center mb-2">
                  <Hourglass className="w-4 h-4 mr-2" />
                  Tempo Atividade: {formatTime(elapsedTime)}
                  {' | '}
                  <span
                    style={{
                      marginLeft: '5px',
                      color:
                        calculatePercentage(
                          elapsedTime,
                          atividade?.estimatedTime
                        ) > 100
                          ? 'red'
                          : 'green',
                    }}
                  >
                    {calculatePercentage(elapsedTime, atividade?.estimatedTime)}
                    %
                  </span>
                </div>
              )}

              <div className="flex items-center mb-2">
                <Users className="w-4 h-4 mr-2" />
                Equipe:{' '}
                {atividade.collaborators
                  ?.map((collaborator) => collaborator.name)
                  .join(', ')}
              </div>
              <div className="flex items-center mb-2">
                <User className="w-4 h-4 mr-2" /> Criado por:{' '}
                {atividade.createdBy?.username}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Detalhes
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-construction-800">
                      Detalhes da Atividade
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    <AtividadeImageCarousel images={atividade.images} />
                    <AtividadeInfoBasica atividade={atividade} />
                    <Separator className="my-4" />
                    <AtividadeEquipe collaborators={atividade.collaborators} />
                    <Separator className="my-4" />
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-construction-700">
                        Histórico de Alterações
                      </h3>
                      <div className="bg-construction-50 p-4 rounded-lg">
                        <AtividadeHistoricoList
                          activityId={Number(atividade.id)}
                        />
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <div className="flex gap-2">
                {isMobile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMoveDialogOpen(true)}
                  >
                    <MoveHorizontal className="w-4 h-4" />
                  </Button>
                )}
                <Dialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Editar Atividade</DialogTitle>
                    </DialogHeader>
                    <NovaAtividadeForm
                      editMode={true}
                      atividadeInicial={atividade}
                      projectId={Number(projectId)}
                      orderServiceId={Number(serviceOrderId)}
                      onSuccess={handleEditSuccess}
                    />
                  </DialogContent>
                </Dialog>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id={`upload-image-${atividade.id}`}
                  />
                  <label htmlFor={`upload-image-${atividade.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      asChild
                    >
                      <span>
                        <Upload className="w-4 h-4" />
                      </span>
                    </Button>
                  </label>
                </div>
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar Exclusão</DialogTitle>
                      <DialogDescription>
                        Tem certeza que deseja excluir esta atividade? Esta ação não pode ser desfeita.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDeleteDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Excluindo...' : 'Excluir'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardFooter>
          </Card>

          <Dialog
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
          >
            <AtividadeUploadDialog
              imageDescription={imageDescription}
              onDescriptionChange={setImageDescription}
              onCancel={() => {
                setIsUploadDialogOpen(false);
                setSelectedFile(null);
                setImageDescription('');
              }}
              onUpload={handleImageUpload}
            />
          </Dialog>

          <MoverAtividadeDialog
            open={isMoveDialogOpen}
            onOpenChange={setIsMoveDialogOpen}
            onMove={handleMove}
          />

          {typeof atividade.quantity === 'number' && (
            <AtualizarProgressoDialog
              open={isProgressDialogOpen}
              onOpenChange={setIsProgressDialogOpen}
              atividade={{
                id: atividade.id,
                quantity: atividade.quantity,
                completedQuantity: atividade.completedQuantity || 0,
              }}
              onSuccess={handleProgressSuccess}
            />
          )}
        </div>
      )}
    </Draggable>
  );
};
