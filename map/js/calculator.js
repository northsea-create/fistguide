/**
 * 膳食计算模块 - v1.1
 * 实现基于身高体重的个性化计算和分餐规划
 * 
 * 算法逻辑：
 * 1. 计算基础热量值：BaseValue = (10 * 体重) + (6.25 * 身高) - 150
 * 2. 根据目标计算总热量：应用目标系数
 * 3. 换算为营养素份数：按40%蛋白质、40%碳水、20%脂肪分配
 * 4. 分餐规划：按3:4:3比例分配到早中晚三餐
 */

const Calculator = {
    /**
     * 目标系数配置 - 根据PRD v1.1定义
     */
    goalMultipliers: {
        '减脂塑形': 1.1,
        '均衡营养': 1.3,
        '增肌增重': 1.5
    },

    /**
     * 营养素热量配置（每份热量）
     */
    nutrientCalories: {
        protein: 150,    // 蛋白质每份150卡
        carb: 150,       // 碳水每份150卡
        fat: 100         // 脂肪每份100卡
    },

    /**
     * 营养素分配比例
     */
    nutrientRatios: {
        protein: 0.4,    // 蛋白质40%
        carb: 0.4,       // 碳水40%
        fat: 0.2         // 脂肪20%
    },

    /**
     * 三餐分配比例 (早:中:晚 = 3:4:3)
     */
    mealRatios: {
        breakfast: 0.3,  // 早餐30%
        lunch: 0.4,      // 午餐40%
        dinner: 0.3      // 晚餐30%
    },
    
    /**
     * 主计算方法 - v1.1版本
     * 根据用户输入计算完整的膳食规划
     * @param {string} goal - 用户目标
     * @param {number} height - 身高(cm)
     * @param {number} weight - 体重(kg)
     * @returns {Object} 完整的膳食规划
     */
    calculate: function(goal, height, weight) {
        try {
            console.log('开始计算膳食规划:', { goal, height, weight });

            // 参数验证
            if (!this.validateInputs(goal, height, weight)) {
                throw new Error('计算参数无效');
            }

            // 第一步：计算基础热量值
            const baseValue = this.calculateBaseValue(height, weight);

            // 第二步：计算总热量
            const totalCalories = this.calculateTotalCalories(baseValue, goal);

            // 第三步：换算为营养素份数
            const dailyPortions = this.calculateNutrientPortions(totalCalories);

            // 第四步：分配到三餐
            const mealPlan = this.distributeMealPortions(dailyPortions);

            // 返回完整结果
            const result = {
                baseValue,
                totalCalories,
                dailyPortions,
                mealPlan,
                userData: { goal, height, weight },
                calculatedAt: new Date().toISOString()
            };

            console.log('膳食规划计算完成:', result);
            return result;
            
        } catch (error) {
            console.error('Calculator.calculate: 计算失败', error);
            // 返回默认的安全值
            return this.getDefaultMealPlan(goal);
        }
    },
    
    /**
     * 计算基础热量值
     * 基于简化的热量计算公式
     * @param {number} height - 身高（厘米）
     * @param {number} weight - 体重（公斤）
     * @returns {number} 基础热量值
     */
    calculateBaseValue: function(height, weight) {
        // PRD v1.1 公式：BaseValue = (10 * 体重) + (6.25 * 身高) - 150
        const baseValue = (10 * weight) + (6.25 * height) - 150;
        
        console.log(`基础热量计算: (10 * ${weight}) + (6.25 * ${height}) - 150 = ${baseValue}`);
        
        return Math.max(baseValue, 800); // 设置最小值防止异常
    },

    /**
     * 根据目标计算总热量
     * @param {number} baseValue - 基础热量值
     * @param {string} goal - 目标类型
     * @returns {number} 总热量
     */
    calculateTotalCalories: function(baseValue, goal) {
        const multiplier = this.goalMultipliers[goal];
        if (!multiplier) {
            throw new Error(`不支持的目标类型: ${goal}`);
        }

        const totalCalories = baseValue * multiplier;
        
        console.log(`总热量计算: ${baseValue} * ${multiplier} = ${totalCalories}`);
        
        return totalCalories;
    },

    /**
     * 将热量换算为营养素份数
     * @param {number} totalCalories - 总热量
     * @returns {Object} 营养素份数对象
     */
    calculateNutrientPortions: function(totalCalories) {
        const portions = {};

        // 计算各营养素份数
        portions.protein = (totalCalories * this.nutrientRatios.protein) / this.nutrientCalories.protein;
        portions.carb = (totalCalories * this.nutrientRatios.carb) / this.nutrientCalories.carb;
        portions.fat = (totalCalories * this.nutrientRatios.fat) / this.nutrientCalories.fat;

        console.log('营养素份数计算（四舍五入前）:', portions);

        // 四舍五入到最接近的0.5
        portions.protein = this.roundToHalf(portions.protein);
        portions.carb = this.roundToHalf(portions.carb);
        portions.fat = this.roundToHalf(portions.fat);

        console.log('营养素份数计算（四舍五入后）:', portions);

        return portions;
    },

    /**
     * 四舍五入到最接近的0.5
     * 例如：2.3 -> 2.5, 2.1 -> 2.0, 2.7 -> 2.5
     * @param {number} value - 要处理的数值
     * @returns {number} 四舍五入后的数值
     */
    roundToHalf: function(value) {
        return Math.round(value * 2) / 2;
    },

    /**
     * 按比例分配营养素到三餐
     * @param {Object} dailyPortions - 每日总份数
     * @returns {Object} 三餐分配结果
     */
    distributeMealPortions: function(dailyPortions) {
        const mealPlan = {
            breakfast: {},
            lunch: {},
            dinner: {}
        };

        // 分配蛋白质和脂肪到三餐
        ['protein', 'fat'].forEach(nutrient => {
            const total = dailyPortions[nutrient];
            
            mealPlan.breakfast[nutrient] = this.roundToHalf(total * this.mealRatios.breakfast);
            mealPlan.lunch[nutrient] = this.roundToHalf(total * this.mealRatios.lunch);
            mealPlan.dinner[nutrient] = this.roundToHalf(total * this.mealRatios.dinner);
        });

        // 碳水只分配到早餐和午餐（按PRD v1.1线框图）
        const totalCarb = dailyPortions.carb;
        mealPlan.breakfast.carb = this.roundToHalf(totalCarb * 0.375); // 早餐占37.5%
        mealPlan.lunch.carb = this.roundToHalf(totalCarb * 0.625);     // 午餐占62.5%
        mealPlan.dinner.carb = 0; // 晚餐不显示碳水

        // 蔬菜固定配置（不参与热量计算）
        mealPlan.breakfast.vegetable = 0;  // 早餐不显示蔬菜
        mealPlan.lunch.vegetable = 2;      // 午餐固定2份
        mealPlan.dinner.vegetable = 2;     // 晚餐固定2份

        console.log('三餐分配结果:', mealPlan);

        return mealPlan;
    },
    
    /**
     * 获取支持的目标列表
     * @returns {Array} 目标列表
     */
    getSupportedGoals: function() {
        return Object.keys(this.goalMultipliers);
    },
    
    /**
     * 验证输入参数 - v1.1版本
     * @param {string} goal - 目标
     * @param {number} height - 身高
     * @param {number} weight - 体重
     * @returns {boolean} 是否有效
     */
    validateInputs: function(goal, height, weight) {
        // 检查目标是否有效
        if (!this.goalMultipliers.hasOwnProperty(goal)) {
            console.error('Calculator.validateInputs: 无效的目标', goal);
            return false;
        }
        
        // 检查身高范围 (140-250cm合理范围)
        if (typeof height !== 'number' || height < 140 || height > 250) {
            console.error('Calculator.validateInputs: 无效的身高', height);
            return false;
        }
        
        // 检查体重范围 (30-200kg合理范围)
        if (typeof weight !== 'number' || weight < 30 || weight > 200) {
            console.error('Calculator.validateInputs: 无效的体重', weight);
            return false;
        }
        
        return true;
    },
    
    /**
     * 获取默认膳食规划（出错时的安全回退）
     * @param {string} goal - 目标
     * @returns {Object} 默认膳食规划
     */
    getDefaultMealPlan: function(goal) {
        // 使用默认值计算
        const defaultGoal = goal || '均衡营养';
        const defaultHeight = 170;
        const defaultWeight = 65;
        
        try {
            // 尝试用默认值重新计算
            return this.calculate(defaultGoal, defaultHeight, defaultWeight);
        } catch (error) {
            console.error('获取默认膳食规划失败，返回硬编码安全值:', error);
            
            // 硬编码的安全回退值
            return {
                baseValue: 1500,
                totalCalories: 1950,
                dailyPortions: {
                    protein: 5,
                    carb: 5,
                    fat: 4
                },
                mealPlan: {
                    breakfast: { protein: 1.5, carb: 2, vegetable: 0, fat: 1 },
                    lunch: { protein: 2, carb: 3, vegetable: 2, fat: 1.5 },
                    dinner: { protein: 1.5, carb: 0, vegetable: 2, fat: 1.5 }
                },
                userData: { goal: defaultGoal, height: defaultHeight, weight: defaultWeight },
                calculatedAt: new Date().toISOString(),
                isDefault: true
            };
        }
    },
    
    /**
     * 获取所有可用的目标选项
     * @returns {Array} 目标选项数组
     */
    getAvailableGoals: function() {
        return Object.keys(this.rules);
    },
    
    /**
     * 获取目标的描述信息
     * @param {string} goal - 目标
     * @returns {Object} 目标描述
     */
    getGoalDescription: function(goal) {
        const descriptions = {
            '减脂': {
                title: '减脂',
                icon: '🔥',
                description: '减少体脂，塑造身形',
                focus: '高蛋白，低碳水',
                tips: ['增加蛋白质摄入', '控制碳水化合物', '多吃蔬菜纤维']
            },
            '保持健康': {
                title: '保持健康',
                icon: '💚',
                description: '均衡营养，维持健康',
                focus: '营养均衡',
                tips: ['营养搭配均衡', '适量各类营养', '坚持规律饮食']
            },
            '增肌': {
                title: '增肌',
                icon: '💪',
                description: '增加肌肉，强化体能',
                focus: '高蛋白，适量碳水',
                tips: ['充足蛋白质', '适量碳水补充', '配合力量训练']
            },
            '脑力提升': {
                title: '脑力提升',
                icon: '🧠',
                description: '增强认知，提升专注',
                focus: '健康脂肪，稳定血糖',
                tips: ['优质脂肪酸', '稳定血糖', '充足蔬菜营养']
            }
        };
        
        return descriptions[goal] || descriptions['保持健康'];
    },
    
    /**
     * 计算总卡路里估算（仅用于参考）
     * @param {Object} portions - 份量对象
     * @returns {number} 估算卡路里
     */
    estimateCalories: function(portions) {
        // 简化的卡路里估算（每种营养素的大致卡路里）
        const caloriesPerPortion = {
            protein: 120,    // 一掌蛋白质约120卡
            carb: 100,       // 一拳碳水约100卡
            vegetable: 25,   // 一捧蔬菜约25卡
            fat: 80          // 一拇指脂肪约80卡
        };
        
        return (
            portions.protein * caloriesPerPortion.protein +
            portions.carb * caloriesPerPortion.carb +
            portions.vegetable * caloriesPerPortion.vegetable +
            portions.fat * caloriesPerPortion.fat
        );
    },
    
    /**
     * 生成份量建议的文字描述
     * @param {Object} portions - 份量对象
     * @returns {string} 文字描述
     */
    generateDescription: function(portions) {
        return `每日建议：蛋白质${portions.protein}掌，碳水${portions.carb}拳，蔬菜${portions.vegetable}捧，脂肪${portions.fat}拇指。总热量约${this.estimateCalories(portions)}卡路里。`;
    }
};

// 导出模块（如果在模块环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calculator;
} 