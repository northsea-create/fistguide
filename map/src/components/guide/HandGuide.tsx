import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface GuideItem {
  emoji: string;
  hand: string;
  nutrient: string;
  description: string;
  examples: string[];
  color: string;
}

const guideItems: GuideItem[] = [
  {
    emoji: '✋',
    hand: '手掌',
    nutrient: '蛋白质',
    description: '去掉手指的手掌大小和厚度',
    examples: ['鸡胸肉', '鱼肉', '豆腐', '鸡蛋'],
    color: 'from-red-400 to-pink-500'
  },
  {
    emoji: '✊',
    hand: '拳头',
    nutrient: '碳水化合物',
    description: '一个拳头的大小',
    examples: ['米饭', '面条', '红薯', '土豆'],
    color: 'from-yellow-400 to-orange-500'
  },
  {
    emoji: '🤲',
    hand: '双手捧',
    nutrient: '蔬菜',
    description: '双手能捧起的分量',
    examples: ['绿叶菜', '西兰花', '胡萝卜', '番茄'],
    color: 'from-green-400 to-emerald-500'
  },
  {
    emoji: '👍',
    hand: '拇指',
    nutrient: '健康脂肪',
    description: '拇指大小的分量',
    examples: ['坚果', '橄榄油', '牛油果', '芝麻'],
    color: 'from-purple-400 to-indigo-500'
  }
];

export function HandGuide() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-black text-gray-900">手部估算指南</h2>
        <p className="text-2xl text-gray-600 font-medium max-w-2xl mx-auto">
          用你的手，轻松估算每餐的营养份量 ✨
        </p>
      </div>
      
      <div className="grid gap-8">
        {guideItems.map((item) => (
          <Card key={item.nutrient} className="overflow-hidden transform hover:scale-105 transition-all duration-300">
            <CardHeader className="p-0">
              <div className={`bg-gradient-to-r ${item.color} p-8`}>
                <CardTitle className="flex items-center space-x-6 text-white">
                  <span className="text-5xl">{item.emoji}</span>
                  <div>
                    <div className="text-3xl font-black">{item.nutrient}</div>
                    <div className="text-xl font-semibold opacity-90">{item.hand}</div>
                  </div>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <p className="text-xl text-gray-700 font-medium">{item.description}</p>
              <div>
                <div className="text-lg font-bold text-gray-900 mb-4">常见食物：</div>
                <div className="flex flex-wrap gap-3">
                  {item.examples.map((example) => (
                    <span 
                      key={example}
                      className="px-4 py-2 bg-gray-100 text-gray-800 text-lg font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 border-none overflow-hidden">
        <CardContent className="p-10">
          <div className="flex items-start space-x-6 text-white">
            <div className="text-5xl">💡</div>
            <div>
              <div className="text-2xl font-bold mb-4">小贴士</div>
              <ul className="text-lg space-y-3 font-medium">
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>每个人的手掌大小不同，这正是个性化的优势</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>建议每餐都包含蛋白质，保持营养均衡</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>蔬菜可以多吃，有助于增加饱腹感</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>坚持规律饮食，让身体适应健康节奏</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}