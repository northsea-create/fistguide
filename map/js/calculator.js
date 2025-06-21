/**
 * 份量计算模块 - 根据用户目标和体型计算每日份量
 * 核心算法实现PRD中定义的规则表
 */

const Calculator = {
    /**
     * 基础规则表 - 根据目标确定基础份量
     * 数据来源：PRD中定义的核心算法规则表
     */
    rules: {
        '减脂': {
            protein: 4,      // 蛋白质(掌)
            carb: 2,         // 碳水化合物(拳)
            vegetable: 5,    // 蔬菜(捧)
            fat: 2           // 脂肪(拇指)
        },
        '保持健康': {
            protein: 3,
            carb: 3,
            vegetable: 5,
            fat: 3
        },
        '增肌': {
            protein: 5,
            carb: 4,
            vegetable: 4,
            fat: 3
        },
        '脑力提升': {
            protein: 3,
            carb: 3,
            vegetable: 4,
            fat: 4
        }
    },
    
    /**
     * 计算用户的每日份量建议
     * @param {string} goal - 用户目标
     * @param {number} height - 身高(cm)
     * @param {number} weight - 体重(kg)
     * @returns {Object} 份量建议对象
     */
    calculate: function(goal, height, weight) {
        try {
            // 参数验证
            if (!this.validateInputs(goal, height, weight)) {
                throw new Error('计算参数无效');
            }
            
            // 获取基础份量
            const basePortions = this.rules[goal];
            if (!basePortions) {
                throw new Error(`未找到目标"${goal}"对应的规则`);
            }
            
            // 根据体型调整份量
            const adjustedPortions = this.adjustForBodySize(basePortions, height, weight);
            
            // 添加计算元数据
            const result = {
                ...adjustedPortions,
                goal: goal,
                height: height,
                weight: weight,
                bmi: this.calculateBMI(height, weight),
                bodyType: this.getBodyType(height, weight),
                calculatedAt: new Date().toISOString()
            };
            
            console.log('Calculator.calculate: 计算完成', result);
            return result;
            
        } catch (error) {
            console.error('Calculator.calculate: 计算失败', error);
            // 返回默认的安全值
            return this.getDefaultPortions(goal);
        }
    },
    
    /**
     * 根据体型调整基础份量
     * 基于BMI和体重进行微调，保持MVP简单原则
     * @param {Object} basePortions - 基础份量
     * @param {number} height - 身高(cm)
     * @param {number} weight - 体重(kg)
     * @returns {Object} 调整后的份量
     */
    adjustForBodySize: function(basePortions, height, weight) {
        const bmi = this.calculateBMI(height, weight);
        let adjustmentFactor = 1.0;
        
        // 根据BMI进行微调
        if (bmi < 18.5) {
            // 偏瘦：稍微增加份量
            adjustmentFactor = 1.1;
        } else if (bmi > 28) {
            // 偏胖：稍微减少份量
            adjustmentFactor = 0.9;
        } else if (weight > 80) {
            // 体重较大：稍微增加份量
            adjustmentFactor = 1.1;
        }
        
        // 应用调整系数并四舍五入
        const adjusted = {
            protein: Math.round(basePortions.protein * adjustmentFactor),
            carb: Math.round(basePortions.carb * adjustmentFactor),
            vegetable: Math.round(basePortions.vegetable * adjustmentFactor),
            fat: Math.round(basePortions.fat * adjustmentFactor)
        };
        
        // 确保最小值
        adjusted.protein = Math.max(1, adjusted.protein);
        adjusted.carb = Math.max(1, adjusted.carb);
        adjusted.vegetable = Math.max(2, adjusted.vegetable);
        adjusted.fat = Math.max(1, adjusted.fat);
        
        // 确保最大值（安全上限）
        adjusted.protein = Math.min(8, adjusted.protein);
        adjusted.carb = Math.min(6, adjusted.carb);
        adjusted.vegetable = Math.min(8, adjusted.vegetable);
        adjusted.fat = Math.min(6, adjusted.fat);
        
        return adjusted;
    },
    
    /**
     * 计算BMI指数
     * @param {number} height - 身高(cm)
     * @param {number} weight - 体重(kg)
     * @returns {number} BMI值
     */
    calculateBMI: function(height, weight) {
        const heightInMeters = height / 100;
        return weight / (heightInMeters * heightInMeters);
    },
    
    /**
     * 获取体型分类
     * @param {number} height - 身高(cm)
     * @param {number} weight - 体重(kg)
     * @returns {string} 体型分类
     */
    getBodyType: function(height, weight) {
        const bmi = this.calculateBMI(height, weight);
        
        if (bmi < 18.5) return '偏瘦';
        if (bmi < 24) return '正常';
        if (bmi < 28) return '偏胖';
        return '肥胖';
    },
    
    /**
     * 验证输入参数
     * @param {string} goal - 目标
     * @param {number} height - 身高
     * @param {number} weight - 体重
     * @returns {boolean} 是否有效
     */
    validateInputs: function(goal, height, weight) {
        // 检查目标是否有效
        if (!this.rules.hasOwnProperty(goal)) {
            console.error('Calculator.validateInputs: 无效的目标', goal);
            return false;
        }
        
        // 检查身高范围
        if (typeof height !== 'number' || height < 100 || height > 250) {
            console.error('Calculator.validateInputs: 无效的身高', height);
            return false;
        }
        
        // 检查体重范围
        if (typeof weight !== 'number' || weight < 30 || weight > 200) {
            console.error('Calculator.validateInputs: 无效的体重', weight);
            return false;
        }
        
        return true;
    },
    
    /**
     * 获取默认份量（出错时的安全回退）
     * @param {string} goal - 目标
     * @returns {Object} 默认份量
     */
    getDefaultPortions: function(goal) {
        const defaultRules = this.rules[goal] || this.rules['保持健康'];
        
        return {
            ...defaultRules,
            goal: goal || '保持健康',
            height: 170,
            weight: 65,
            bmi: 22.5,
            bodyType: '正常',
            calculatedAt: new Date().toISOString(),
            isDefault: true
        };
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