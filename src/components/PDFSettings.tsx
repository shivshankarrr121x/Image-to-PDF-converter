import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, FileImage } from 'lucide-react';

export interface PDFSettingsData {
  pageSize: 'A4' | 'A3' | 'A5' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  scaling: 'fit' | 'fill' | 'original';
  quality: 'high' | 'medium' | 'low';
}

interface PDFSettingsProps {
  settings: PDFSettingsData;
  onSettingsChange: (settings: PDFSettingsData) => void;
}

export const PDFSettings: React.FC<PDFSettingsProps> = ({ settings, onSettingsChange }) => {
  const updateSetting = (key: keyof PDFSettingsData, value: string) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50 shadow-elegant">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold">PDF Settings</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="pageSize" className="text-sm font-medium">Page Size</Label>
          <Select value={settings.pageSize} onValueChange={(value) => updateSetting('pageSize', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select page size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
              <SelectItem value="A3">A3 (297 × 420 mm)</SelectItem>
              <SelectItem value="A5">A5 (148 × 210 mm)</SelectItem>
              <SelectItem value="Letter">Letter (8.5 × 11")</SelectItem>
              <SelectItem value="Legal">Legal (8.5 × 14")</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="orientation" className="text-sm font-medium">Orientation</Label>
          <Select value={settings.orientation} onValueChange={(value) => updateSetting('orientation', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select orientation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="portrait">Portrait</SelectItem>
              <SelectItem value="landscape">Landscape</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="scaling" className="text-sm font-medium">Image Scaling</Label>
          <Select value={settings.scaling} onValueChange={(value) => updateSetting('scaling', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select scaling" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fit">Fit to page</SelectItem>
              <SelectItem value="fill">Fill page</SelectItem>
              <SelectItem value="original">Original size</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quality" className="text-sm font-medium">Output Quality</Label>
          <Select value={settings.quality} onValueChange={(value) => updateSetting('quality', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High Quality</SelectItem>
              <SelectItem value="medium">Medium Quality</SelectItem>
              <SelectItem value="low">Low Quality (smaller file)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 p-4 bg-accent/30 rounded-lg border border-border/50">
        <div className="flex items-start space-x-3">
          <FileImage className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium mb-1">Preview Settings</p>
            <p className="text-xs text-muted-foreground">
              {settings.pageSize} • {settings.orientation} • {settings.scaling} scaling • {settings.quality} quality
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};