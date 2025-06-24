import React from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { HandGuide } from '../components/guide/HandGuide';

interface GuidePageProps {
  onBack: () => void;
}

export function GuidePage({ onBack }: GuidePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-200 rounded-full opacity-20 animate-bounce-slow"></div>
      <div className="absolute bottom-20 right-20 w-16 h-16 bg-emerald-300 rounded-full opacity-30 animate-pulse-slow"></div>
      
      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm border-b-2 border-emerald-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-6">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">返回</span>
            </Button>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-black text-gray-900">使用指南</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <HandGuide />
      </div>
    </div>
  );
}