import React from 'react';
import { Settings, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { MealCard } from '../components/dashboard/MealCard';
import { DailyMealPlan, UserProfile } from '../types';
import { getGoalLabel } from '../utils/calculations';

interface DashboardPageProps {
  profile: UserProfile;
  mealPlan: DailyMealPlan;
  onReset: () => void;
  onShowGuide: () => void;
}

export function DashboardPage({ profile, mealPlan, onReset, onShowGuide }: DashboardPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-16 h-16 bg-emerald-200 rounded-full opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-12 h-12 bg-emerald-300 rounded-full opacity-30 animate-bounce-slow"></div>
      
      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm border-b-2 border-emerald-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">👊</span>
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900">一拳膳食</h1>
                <p className="text-lg font-semibold text-emerald-600">
                  {getGoalLabel(profile.goal)} · {profile.height}cm · {profile.weight}kg
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={onReset}
              className="flex items-center space-x-2"
            >
              <Settings className="w-5 h-5" />
              <span className="font-semibold">重新设置</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Meal Plans */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Welcome Message */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold text-gray-900">
            你的专属膳食计划 ✨
          </h2>
          <p className="text-xl text-gray-600 font-medium">
            根据你的目标和身体数据，为你量身定制
          </p>
        </div>

        <div className="grid gap-8">
          <MealCard 
            title="早餐推荐"
            emoji="☀️"
            meal={mealPlan.breakfast}
            timeOfDay="morning"
          />
          
          <MealCard 
            title="午餐推荐"
            emoji="🕛"
            meal={mealPlan.lunch}
            timeOfDay="afternoon"
          />
          
          <MealCard 
            title="晚餐推荐"
            emoji="🌙"
            meal={mealPlan.dinner}
            timeOfDay="evening"
          />
        </div>

        {/* Guide Link */}
        <div className="text-center pt-8">
          <Button 
            variant="outline" 
            size="lg"
            onClick={onShowGuide}
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-300 text-xl px-8 py-4"
          >
            <Sparkles className="w-6 h-6 mr-3" />
            查看如何估算？
          </Button>
        </div>
      </div>
    </div>
  );
}