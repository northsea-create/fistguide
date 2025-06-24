import React from 'react';
import { Input } from '../ui/Input';

interface BasicInfoFormProps {
  height: string;
  weight: string;
  onHeightChange: (height: string) => void;
  onWeightChange: (weight: string) => void;
  errors: {
    height?: string;
    weight?: string;
  };
}

export function BasicInfoForm({ 
  height, 
  weight, 
  onHeightChange, 
  onWeightChange, 
  errors 
}: BasicInfoFormProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Input
            label="身高 📏"
            type="number"
            value={height}
            onChange={(e) => onHeightChange(e.target.value)}
            placeholder="175"
            min="100"
            max="250"
            error={errors.height}
          />
          <div className="text-center">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">厘米 (cm)</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <Input
            label="体重 ⚖️"
            type="number"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
            placeholder="70"
            min="30"
            max="200"
            error={errors.weight}
          />
          <div className="text-center">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">公斤 (kg)</span>
          </div>
        </div>
      </div>
    </div>
  );
}