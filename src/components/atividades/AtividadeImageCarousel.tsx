import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface AtividadeImage {
  id: number;
  imageName: string;
  imageData: Buffer;
  description: Buffer;
}

interface AtividadeImageCarouselProps {
  images: AtividadeImage[];
}

export const AtividadeImageCarousel = ({
  images,
}: AtividadeImageCarouselProps) => {
  if (!images || images.length === 0) return null;

  console.log(images.map((i) => i.imageData));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-construction-700">
        Imagens da Atividade
      </h3>
      <Carousel className="w-full max-w-xl mx-auto">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image.id}>
              <div className="p-1">
                <div className="flex flex-col space-y-2">
                  <img
                    src={`data:image/jpeg;base64,${image.imageData.toString(
                      'base64'
                    )}`}
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />

                  {image.description && (
                    <p className="text-sm text-gray-600 text-center">
                      {image.description.toString()}
                    </p>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
