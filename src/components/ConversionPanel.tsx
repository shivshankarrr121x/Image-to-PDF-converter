import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, CheckCircle, Loader2 } from 'lucide-react';
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

  const simulateConversion = async () => {
    setIsConverting(true);
    setProgress(0);
    setIsComplete(false);

    // Simulate conversion progress
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Create a mock PDF blob for download
    const mockPdfContent = new Blob(['Mock PDF content'], { type: 'application/pdf' });
    const url = URL.createObjectURL(mockPdfContent);
    setDownloadUrl(url);
    
    setIsConverting(false);
    setIsComplete(true);
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
              onClick={simulateConversion}
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