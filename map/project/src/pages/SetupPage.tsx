import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { GoalSelector } from '../components/setup/GoalSelector';
import { BasicInfoForm } from '../components/setup/BasicInfoForm';
import { UserProfile } from '../types';

interface SetupPageProps {
  onComplete: (profile: UserProfile) => void;
}

export function SetupPage({ onComplete }: SetupPageProps) {
  const [goal, setGoal] = useState<'reduce' | 'balanced' | 'gain'>('balanced');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [errors, setErrors] = useState<{
    height?: string;
    weight?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    
    if (!height || isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
      newErrors.height = '请输入有效身高 (100-250cm)';
    }
    
    if (!weight || isNaN(weightNum) || weightNum < 30 || weightNum > 200) {
      newErrors.weight = '请输入有效体重 (30-200kg)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onComplete({
        goal,
        height: parseFloat(height),
        weight: parseFloat(weight)
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-200 rounded-full opacity-20 animate-bounce-slow"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-emerald-300 rounded-full opacity-30 animate-pulse-slow"></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-emerald-400 rounded-full opacity-25 animate-bounce-slow"></div>
      
      <div className="relative z-10 py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="inline-block">
              <h1 className="text-6xl font-black text-gray-900 mb-4">
                一拳搞定
                <span className="block text-emerald-500">营养餐</span>
                <span className="emoji-large ml-4">👊</span>
              </h1>
            </div>
            <p className="text-2xl text-gray-600 font-medium max-w-lg mx-auto leading-relaxed">
              还在算热量？<span className="font-bold text-gray-800">太麻烦了！</span>
              <br />
              伸出你的手，轻松规划每一餐
            </p>
          </div>

          {/* Goal Selection */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-8">
                <h2 className="text-3xl font-bold text-white text-center">
                  你的主要目标是？
                </h2>
              </div>
              <div className="p-8">
                <GoalSelector 
                  selectedGoal={goal}
                  onGoalSelect={setGoal}
                />
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8">
                <h2 className="text-3xl font-bold text-white text-center">
                  你的基本信息？
                </h2>
              </div>
              <div className="p-8">
                <BasicInfoForm
                  height={height}
                  weight={weight}
                  onHeightChange={setHeight}
                  onWeightChange={setWeight}
                  errors={errors}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="text-center">
            <Button 
              size="xl" 
              className="text-2xl font-bold px-16 py-6 shadow-2xl"
              onClick={handleSubmit}
            >
              🚀 完成，开始规划
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}