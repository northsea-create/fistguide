import React from 'react';
import { Card, CardContent } from '../ui/Card';

interface GoalOption {
  value: 'reduce' | 'balanced' | 'gain';
  emoji: string;
  label: string;
  description: string;
  color: string;
}

interface GoalSelectorProps {
  selectedGoal: string;
  onGoalSelect: (goal: 'reduce' | 'balanced' | 'gain') => void;
}

const goalOptions: GoalOption[] = [
  {
    value: 'reduce',
    emoji: '🔥',
    label: '减脂塑形',
    description: '科学减脂，塑造理想身材',
    color: 'from-red-400 to-orange-500'
  },
  {
    value: 'balanced',
    emoji: '💚',
    label: '均衡营养',
    description: '为身体和大脑提供每日活力',
    color: 'from-emerald-400 to-green-500'
  },
  {
    value: 'gain',
    emoji: '💪',
    label: '增肌增重',
    description: '健康增重，增强肌肉量',
    color: 'from-blue-400 to-purple-500'
  }
];

export function GoalSelector({ selectedGoal, onGoalSelect }: GoalSelectorProps) {
  return (
    <div className="space-y-6">
      {goalOptions.map((option) => (
        <Card 
          key={option.value}
          className={`cursor-pointer transition-all duration-300 ${
            selectedGoal === option.value 
              ? 'border-emerald-400 bg-emerald-50 scale-105 pop-shadow' 
              : 'hover:scale-102'
          }`}
          onClick={() => onGoalSelect(option.value)}
          selected={selectedGoal === option.value}
        >
          <CardContent className="p-8">
            <div className="flex items-center space-x-6">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center text-3xl shadow-lg`}>
                {option.emoji}
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900 mb-2">{option.label}</div>
                <div className="text-lg text-gray-600 font-medium">{option.description}</div>
              </div>
              <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                selectedGoal === option.value 
                  ? 'border-emerald-500 bg-emerald-500 scale-110' 
                  : 'border-gray-300'
              }`}>
                {selectedGoal === option.value && (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}