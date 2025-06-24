import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { MealPlan } from '../../types';

interface MealCardProps {
  title: string;
  emoji: string;
  meal: MealPlan;
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
}

export function MealCard({ title, emoji, meal, timeOfDay = 'morning' }: MealCardProps) {
  const portions = [
    { 
      name: '蛋白质', 
      emoji: '✋', 
      amount: meal.protein, 
      show: meal.protein > 0,
      color: 'from-red-400 to-pink-500'
    },
    { 
      name: '碳水', 
      emoji: '✊', 
      amount: meal.carbs, 
      show: meal.carbs > 0,
      color: 'from-yellow-400 to-orange-500'
    },
    { 
      name: '蔬菜', 
      emoji: '🤲', 
      amount: meal.vegetables, 
      show: meal.vegetables > 0,
      note: '(推荐)',
      color: 'from-green-400 to-emerald-500'
    },
    { 
      name: '脂肪', 
      emoji: '👍', 
      amount: meal.fat, 
      show: meal.fat > 0,
      color: 'from-purple-400 to-indigo-500'
    }
  ];

  const timeColors = {
    morning: 'from-yellow-400 to-orange-500',
    afternoon: 'from-blue-400 to-indigo-500',
    evening: 'from-purple-400 to-pink-500'
  };

  return (
    <Card className="overflow-hidden transform hover:scale-105 transition-all duration-300">
      <CardHeader className="p-0">
        <div className={`bg-gradient-to-r ${timeColors[timeOfDay]} p-8`}>
          <CardTitle className="flex items-center space-x-4 text-white">
            <span className="text-4xl">{emoji}</span>
            <span className="text-3xl font-black">{title}</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-6">
          {portions.filter(portion => portion.show).map((portion) => (
            <div key={portion.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${portion.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {portion.emoji}
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">{portion.name}</span>
                  {portion.note && (
                    <span className="text-sm text-emerald-600 font-semibold ml-2">{portion.note}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-gray-900">
                  {portion.amount}
                </div>
                <div className="text-lg font-semibold text-gray-600">
                  份
                </div>
              </div>
            </div>
          ))}
          {portions.filter(portion => portion.show).length === 0 && (
            <div className="text-center text-gray-500 py-12 text-xl">
              暂无推荐 🤷‍♀️
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}