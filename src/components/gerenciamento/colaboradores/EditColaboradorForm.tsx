import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Colaborador } from '@/interfaces/ColaboradorInterface';
import ColaboradorService from '@/services/ColaboradorService';
import {
  ColaboradorFormFields,
  colaboradorFormSchema,
  ColaboradorFormValues,
} from './ColaboradorFormFields';

interface EditColaboradorFormProps {
  colaborador: Colaborador;
  onSuccess: () => void;
}

export const EditColaboradorForm = ({
  colaborador,
  onSuccess,
}: EditColaboradorFormProps) => {
  const { toast } = useToast();
  const form = useForm<ColaboradorFormValues>({
    resolver: zodResolver(colaboradorFormSchema),
    defaultValues: {
      name: colaborador.name,
      role: colaborador.role,
    },
  });

  const onSubmit = async (data: ColaboradorFormValues) => {
    try {
      const updatedColaborador: Colaborador = {
        id: colaborador.id,
        name: data.name,
        role: data.role,
      };

      await ColaboradorService.updateColaborador(
        colaborador.id,
        updatedColaborador
      );
      toast({
        title: 'Colaborador atualizado',
        description:
          'As informações do colaborador foram atualizadas com sucesso.',
      });
      onSuccess();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar colaborador',
        description:
          'Ocorreu um erro ao atualizar as informações do colaborador.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ColaboradorFormFields form={form} />
        <Button
          type="submit"
          className="w-full bg-[#FF7F0E] hover:bg-[#FF7F0E]/90"
        >
          Atualizar Colaborador
        </Button>
      </form>
    </Form>
  );
};
