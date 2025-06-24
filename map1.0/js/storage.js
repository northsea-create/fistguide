/**
 * 数据存储模块 - localStorage数据管理
 * 负责用户数据的保存、加载、清除等操作
 */

const Storage = {
    // 存储键名
    key: 'fistfuel_user_profile',
    
    /**
     * 保存用户数据到localStorage
     * @param {Object} data - 用户数据对象
     * @param {string} data.goal - 用户目标 ("减脂"|"保持健康"|"增肌"|"脑力提升")
     * @param {number} data.height - 身高 (cm)
     * @param {number} data.weight - 体重 (kg)
     * @returns {boolean} 保存是否成功
     */
    save: function(data) {
        try {
            // 数据验证
            if (!this.validate(data)) {
                console.error('Storage.save: 数据验证失败', data);
                return false;
            }
            
            // 添加时间戳
            const dataWithTimestamp = {
                ...data,
                timestamp: Date.now(),
                version: '1.1'
            };
            
            // 保存到localStorage
            const jsonString = JSON.stringify(dataWithTimestamp);
            localStorage.setItem(this.key, jsonString);
            
            console.log('Storage.save: 数据保存成功', dataWithTimestamp);
            return true;
        } catch (error) {
            console.error('Storage.save: 保存失败', error);
            return false;
        }
    },
    
    /**
     * 从localStorage加载用户数据
     * @returns {Object|null} 用户数据对象或null
     */
    load: function() {
        try {
            const jsonString = localStorage.getItem(this.key);
            
            if (!jsonString) {
                console.log('Storage.load: 没有找到用户数据');
                return null;
            }
            
            const data = JSON.parse(jsonString);
            
            // 数据验证
            if (!this.validate(data)) {
                console.error('Storage.load: 加载的数据验证失败', data);
                this.clear(); // 清除无效数据
                return null;
            }
            
            console.log('Storage.load: 数据加载成功', data);
            return data;
        } catch (error) {
            console.error('Storage.load: 加载失败', error);
            this.clear(); // 清除损坏的数据
            return null;
        }
    },
    
    /**
     * 清除localStorage中的用户数据
     * @returns {boolean} 清除是否成功
     */
    clear: function() {
        try {
            localStorage.removeItem(this.key);
            console.log('Storage.clear: 数据清除成功');
            return true;
        } catch (error) {
            console.error('Storage.clear: 清除失败', error);
            return false;
        }
    },
    
    /**
     * 检查是否存在用户数据
     * @returns {boolean} 是否存在有效数据
     */
    exists: function() {
        const data = this.load();
        return data !== null;
    },
    
    /**
     * 验证用户数据的有效性
     * @param {Object} data - 要验证的数据对象
     * @returns {boolean} 数据是否有效
     */
    validate: function(data) {
        // 基本类型检查
        if (!data || typeof data !== 'object') {
            return false;
        }
        
        // 必需字段检查
        const requiredFields = ['goal', 'height', 'weight'];
        for (const field of requiredFields) {
            if (!data.hasOwnProperty(field)) {
                console.error(`Storage.validate: 缺少必需字段 ${field}`);
                return false;
            }
        }
        
        // 目标值验证 - v1.1版本
        const validGoals = ['减脂塑形', '均衡营养', '增肌增重'];
        if (!validGoals.includes(data.goal)) {
            console.error('Storage.validate: 无效的目标值', data.goal);
            return false;
        }
        
        // 身高验证 (140-250cm)
        if (typeof data.height !== 'number' || data.height < 140 || data.height > 250) {
            console.error('Storage.validate: 无效的身高值', data.height);
            return false;
        }
        
        // 体重验证 (30-200kg)
        if (typeof data.weight !== 'number' || data.weight < 30 || data.weight > 200) {
            console.error('Storage.validate: 无效的体重值', data.weight);
            return false;
        }
        
        return true;
    },
    
    /**
     * 获取存储数据的统计信息
     * @returns {Object} 统计信息
     */
    getStats: function() {
        const data = this.load();
        if (!data) {
            return {
                exists: false,
                size: 0,
                timestamp: null
            };
        }
        
        const jsonString = localStorage.getItem(this.key);
        return {
            exists: true,
            size: jsonString ? jsonString.length : 0,
            timestamp: data.timestamp || null,
            version: data.version || 'unknown'
        };
    },
    
    /**
     * 更新用户数据的特定字段
     * @param {Object} updates - 要更新的字段
     * @returns {boolean} 更新是否成功
     */
    update: function(updates) {
        const currentData = this.load();
        if (!currentData) {
            console.error('Storage.update: 没有现有数据可更新');
            return false;
        }
        
        const updatedData = {
            ...currentData,
            ...updates
        };
        
        return this.save(updatedData);
    },
    
    /**
     * 导出用户数据为JSON字符串
     * @returns {string|null} JSON字符串或null
     */
    export: function() {
        const data = this.load();
        if (!data) {
            return null;
        }
        
        // 移除内部字段
        const exportData = {
            goal: data.goal,
            height: data.height,
            weight: data.weight,
            exportDate: new Date().toISOString()
        };
        
        return JSON.stringify(exportData, null, 2);
    },
    
    /**
     * 从JSON字符串导入用户数据
     * @param {string} jsonString - JSON字符串
     * @returns {boolean} 导入是否成功
     */
    import: function(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            // 只提取需要的字段
            const importData = {
                goal: data.goal,
                height: data.height,
                weight: data.weight
            };
            
            return this.save(importData);
        } catch (error) {
            console.error('Storage.import: 导入失败', error);
            return false;
        }
    }
};

// 导出模块（如果在模块环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
} 