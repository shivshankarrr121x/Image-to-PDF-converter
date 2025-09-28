import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, CheckCircle, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import type { PDFSettingsData } from './PDFSettings';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

interface ConversionPanelProps {
  images: UploadedImage[];
  settings: PDFSettingsData;
}

export const ConversionPanel: React.FC<ConversionPanelProps> = ({ images, settings }) => {
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const convertToPDF = async () => {
    setIsConverting(true);
    setProgress(0);
    setIsComplete(false);

    try {
      // Create PDF with proper dimensions based on settings
      const orientation = settings.orientation === 'landscape' ? 'landscape' : 'portrait';
      const format = settings.pageSize.toLowerCase() as 'a4' | 'a3' | 'a5' | 'letter' | 'legal';
      
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: format === 'letter' ? [215.9, 279.4] : 
               format === 'legal' ? [215.9, 355.6] : format
      });

      // Process each image
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        setProgress(((i + 1) / images.length) * 90); // 90% for processing, 10% for final generation

        // Create image element and wait for it to load
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = image.preview;
        });

        // Add new page for each image except the first
        if (i > 0) {
          pdf.addPage();
        }

        // Get PDF page dimensions
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Calculate image dimensions based on scaling setting
        let imgWidth = img.width;
        let imgHeight = img.height;
        
        if (settings.scaling === 'fit') {
          // Fit image to page while maintaining aspect ratio  
          const aspectRatio = imgWidth / imgHeight;
          const pageAspectRatio = pageWidth / pageHeight;
          
          if (aspectRatio > pageAspectRatio) {
            imgWidth = pageWidth;
            imgHeight = pageWidth / aspectRatio;
          } else {
            imgHeight = pageHeight;
            imgWidth = pageHeight * aspectRatio;
          }
        } else if (settings.scaling === 'fill') {
          // Fill entire page
          imgWidth = pageWidth;
          imgHeight = pageHeight;
        } else {
          // Original size - convert pixels to mm (rough conversion)
          imgWidth = imgWidth * 0.264583;
          imgHeight = imgHeight * 0.264583;
          
          // Don't exceed page size
          if (imgWidth > pageWidth) {
            const ratio = pageWidth / imgWidth;
            imgWidth = pageWidth;
            imgHeight = imgHeight * ratio;
          }
          if (imgHeight > pageHeight) {
            const ratio = pageHeight / imgHeight;
            imgHeight = pageHeight;
            imgWidth = imgWidth * ratio;
          }
        }

        // Center image on page
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        // Add image to PDF
        pdf.addImage(img, 'JPEG', x, y, imgWidth, imgHeight);
      }

      setProgress(100);

      // Generate PDF blob
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setDownloadUrl(url);
      
      setIsConverting(false);
      setIsComplete(true);
    } catch (error) {
      console.error('PDF conversion failed:', error);
      setIsConverting(false);
      // You could add error state handling here
    }
  };

  const downloadPDF = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `converted-images-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetConversion = () => {
    setIsComplete(false);
    setProgress(0);
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  };

  if (images.length === 0) {
    return (
      <Card className="p-8 bg-gradient-card border-border/50 shadow-elegant text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Ready to Convert</h3>
            <p className="text-muted-foreground">
              Upload some images to get started with the conversion process.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card border-border/50 shadow-elegant">
      <div className="text-center space-y-6">
        {!isConverting && !isComplete && (
          <>
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Ready to Convert</h3>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{images.length} image{images.length > 1 ? 's' : ''} • {settings.pageSize} {settings.orientation}</p>
              <p>{settings.scaling} scaling • {settings.quality} quality</p>
            </div>
            <Button 
              onClick={convertToPDF}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-8 py-3 text-lg font-semibold"
              size="lg"
            >
              Convert to PDF
            </Button>
          </>
        )}

        {isConverting && (
          <>
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <h3 className="text-lg font-semibold">Converting Images...</h3>
            </div>
            <div className="space-y-4">
              <Progress value={progress} className="w-full h-3" />
              <p className="text-sm text-muted-foreground">
                Processing {Math.ceil((progress / 100) * images.length)} of {images.length} images
              </p>
            </div>
          </>
        )}

        {isComplete && (
          <>
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-600">Conversion Complete!</h3>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Your PDF has been generated successfully from {images.length} image{images.length > 1 ? 's' : ''}.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={downloadPDF}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-6 py-3"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </Button>
                <Button 
                  onClick={resetConversion}
                  variant="outline"
                  size="lg"
                  className="px-6 py-3"
                >
                  Convert Another
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};