import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Camera, Upload } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";

interface FileUploadFieldProps {
  form: UseFormReturn<any>;
  fileType: "imagem" | "arquivo";
  accept?: string;
}

export function FileUploadField({ form, fileType, accept }: FileUploadFieldProps) {
  const isImage = fileType === "imagem";
  const fieldName = isImage ? "imagem" : "arquivo";
  const descriptionField = isImage ? "imagemDescricao" : "arquivoDescricao";
  const label = isImage ? "Upload de Imagem (opcional)" : "Upload de Arquivo (opcional)";
  const placeholder = isImage ? "Descrição da imagem (opcional)" : "Descrição do arquivo (opcional)";

  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <div className="mt-2 space-y-2">
        <Input
          type="file"
          accept={accept}
          capture={isImage ? "environment" : undefined}
          onChange={(e) => form.setValue(fieldName, e.target.files?.[0])}
          className="hidden"
          id={fieldName}
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <label
            htmlFor={fieldName}
            className="flex-1 flex items-center justify-center h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
          >
            <span className="flex items-center space-x-2">
              <Upload className="w-6 h-6 text-gray-600" />
              <span className="text-sm text-gray-600">
                Clique para fazer upload {isImage ? "de imagem" : "de arquivo"}
              </span>
            </span>
          </label>
          
          {isImage && (
            <label
              htmlFor={fieldName}
              className="flex items-center justify-center h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none sm:w-32"
            >
              <span className="flex flex-col items-center space-y-2">
                <Camera className="w-6 h-6 text-gray-600" />
                <span className="text-sm text-center text-gray-600">
                  Tirar foto
                </span>
              </span>
            </label>
          )}
        </div>
        
        <FormField
          control={form.control}
          name={descriptionField}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder={placeholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}