import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

interface ImageUploadProps {
  onImagesChange: (images: UploadedImage[]) => void;
  onReset?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImagesChange, onReset }) => {
  const [images, setImages] = useState<UploadedImage[]>([]);

  // Reset images when onReset prop changes to true
  React.useEffect(() => {
    if (onReset) {
      setImages([]);
    }
  }, [onReset]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
    }));
    
    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange(updatedImages);
  }, [images, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: true
  });

  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const moveImage = (dragIndex: number, hoverIndex: number) => {
    const dragImage = images[dragIndex];
    const updatedImages = [...images];
    updatedImages.splice(dragIndex, 1);
    updatedImages.splice(hoverIndex, 0, dragImage);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="p-8 bg-gradient-card border-border/50 shadow-elegant">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
            transition-all duration-300 ease-smooth
            ${isDragActive 
              ? 'border-primary bg-primary/5 shadow-glow' 
              : 'border-border hover:border-primary/50 hover:bg-accent/50'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {isDragActive ? 'Drop your images here' : 'Upload your images'}
              </h3>
              <p className="text-muted-foreground">
                Drag & drop your images here, or click to select files
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Supports JPG, PNG, GIF, BMP, WebP
              </p>
            </div>
          </div>
        </div>

        {images.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-4">Uploaded Images ({images.length})</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="relative group rounded-lg overflow-hidden bg-gradient-card shadow-elegant hover:shadow-glow transition-all duration-300"
                >
                  <img
                    src={image.preview}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => removeImage(image.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black/50 rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ImageIcon className="w-3 h-3 text-white" />
                    <span className="text-xs text-white truncate max-w-16">
                      {image.file.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};