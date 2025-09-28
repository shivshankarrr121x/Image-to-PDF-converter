import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { PDFSettings, type PDFSettingsData } from '@/components/PDFSettings';
import { ConversionPanel } from '@/components/ConversionPanel';
import { Button } from '@/components/ui/button';
import { FileImage, Zap, Shield, Download } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

const Index = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [settings, setSettings] = useState<PDFSettingsData>({
    pageSize: 'A4',
    orientation: 'portrait',
    scaling: 'fit',
    quality: 'high'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <img 
                src={heroImage} 
                alt="Image to PDF conversion illustration" 
                className="w-full max-w-2xl mx-auto rounded-2xl shadow-elegant"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Convert Images to PDF
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your images into high-quality PDF documents instantly. Fast, secure, and completely free.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Zap className="w-5 h-5 text-primary" />
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Shield className="w-5 h-5 text-primary" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Download className="w-5 h-5 text-primary" />
                <span>No Registration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Conversion Interface */}
      <section className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Step 1: Upload Images */}
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Step 1: Upload Your Images</h2>
              <p className="text-muted-foreground">Drag and drop or click to select multiple images</p>
            </div>
            <ImageUpload onImagesChange={setImages} />
          </div>

          {/* Step 2: Configure Settings & Convert */}
          {images.length > 0 && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Step 2: Configure PDF Settings</h2>
                  <p className="text-muted-foreground">Customize your PDF output preferences</p>
                </div>
                <PDFSettings settings={settings} onSettingsChange={setSettings} />
              </div>
              
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Step 3: Convert & Download</h2>
                  <p className="text-muted-foreground">Generate your PDF and download instantly</p>
                </div>
                <ConversionPanel 
                  images={images} 
                  settings={settings} 
                  onReset={() => setImages([])}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-accent/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Converter?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional-grade image to PDF conversion with industry-leading features
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-gradient-card rounded-xl shadow-elegant">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <FileImage className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">High Quality Output</h3>
              <p className="text-muted-foreground">
                Preserve original image resolution and quality in your PDF documents
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-card rounded-xl shadow-elegant">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Processing</h3>
              <p className="text-muted-foreground">
                Convert multiple images to PDF in seconds with our optimized engine
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-card rounded-xl shadow-elegant">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
              <p className="text-muted-foreground">
                Your files are processed securely and never stored on our servers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Image to PDF Converter. Convert your images to PDF with confidence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;