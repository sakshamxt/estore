import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AspectRatio } from "@/components/ui/aspect-ratio"

const ProductImageGallery = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  if (!images || images.length === 0) {
    return (
      <AspectRatio ratio={1 / 1} className="bg-muted rounded-lg">
        <img src="/placeholder.svg" alt="Placeholder" className="object-cover w-full h-full rounded-lg" />
      </AspectRatio>
    );
  }

  return (
    <div className="space-y-4">
      <AspectRatio ratio={1 / 1} className="w-full">
        <img
          src={selectedImage}
          alt={`Main view of ${productName}`}
          className="object-cover w-full h-full rounded-lg shadow-md"
        />
      </AspectRatio>
      <div className="grid grid-cols-5 gap-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={cn(
              "rounded-md overflow-hidden border-2 transition-all",
              selectedImage === img ? 'border-primary' : 'border-transparent hover:border-muted-foreground'
            )}
          >
            <AspectRatio ratio={1 / 1}>
              <img src={img} alt={`Thumbnail ${index + 1} of ${productName}`} className="object-cover w-full h-full" />
            </AspectRatio>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;