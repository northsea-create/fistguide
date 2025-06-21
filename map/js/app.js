/**
 * 主应用模块 - 应用程序的核心控制器
 * 整合所有功能模块，处理用户交互和应用程序生命周期
 */

const App = {
    // 应用程序状态
    isInitialized: false,
    currentUserData: null,
    
    /**
     * 应用程序初始化
     */
    init: function() {
        console.log('App.init: 开始初始化应用程序');
        
        try {
            // 等待DOM加载完成
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeApp());
            } else {
                this.initializeApp();
            }
        } catch (error) {
            console.error('App.init: 初始化失败', error);
            this.showError('应用程序初始化失败，请刷新页面重试');
        }
    },
    
    /**
     * 初始化应用程序核心功能
     */
    initializeApp: function() {
        console.log('App.initializeApp: 初始化核心功能');
        
        // 初始化路由系统
        Router.init();
        
        // 绑定事件监听器
        this.bindEventListeners();
        
        // 加载用户数据
        this.loadUserData();
        
        // 标记为已初始化
        this.isInitialized = true;
        
        console.log('App.initializeApp: 应用程序初始化完成');
    },
    
    /**
     * 绑定事件监听器
     */
    bindEventListeners: function() {
        console.log('App.bindEventListeners: 绑定事件监听器');
        
        // 设置页面事件
        this.bindSetupPageEvents();
        
        // 仪表板页面事件
        this.bindDashboardPageEvents();
        
        // 指南页面事件
        this.bindGuidePageEvents();
        
        // 全局事件
        this.bindGlobalEvents();
    },
    
    /**
     * 绑定设置页面事件
     */
    bindSetupPageEvents: function() {
        const setupForm = document.getElementById('setup-form');
        if (setupForm) {
            setupForm.addEventListener('submit', (event) => {
                event.preventDefault();
                this.handleSetupSubmit(event);
            });
        }
    },
    
    /**
     * 绑定仪表板页面事件
     */
    bindDashboardPageEvents: function() {
        // 重新设置按钮
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.handleResetClick();
            });
        }
        
        // 查看指南按钮
        const guideBtn = document.getElementById('guide-btn');
        if (guideBtn) {
            guideBtn.addEventListener('click', () => {
                Router.navigateTo('guide');
            });
        }
    },
    
    /**
     * 绑定指南页面事件
     */
    bindGuidePageEvents: function() {
        // 返回按钮
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                Router.navigateTo('dashboard');
            });
        }
    },
    
    /**
     * 绑定全局事件
     */
    bindGlobalEvents: function() {
        // 键盘快捷键
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardShortcuts(event);
        });
        
        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
        
        // 窗口大小变化
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });
    },
    
    /**
     * 处理设置表单提交
     */
    handleSetupSubmit: function(event) {
        console.log('App.handleSetupSubmit: 处理设置表单提交');
        
        const formData = new FormData(event.target);
        const userData = {
            goal: formData.get('goal'),
            height: parseInt(formData.get('height')),
            weight: parseInt(formData.get('weight'))
        };
        
        // 验证表单数据
        if (!this.validateSetupData(userData)) {
            this.showError('请完整填写所有信息');
            return;
        }
        
        // 显示加载状态
        this.showLoading();
        
        // 模拟异步处理（给用户反馈时间）
        setTimeout(() => {
            // 保存用户数据
            if (Storage.save(userData)) {
                this.currentUserData = userData;
                console.log('App.handleSetupSubmit: 用户数据保存成功');
                
                // 隐藏加载状态
                this.hideLoading();
                
                // 跳转到仪表板
                Router.navigateTo('dashboard');
            } else {
                this.hideLoading();
                this.showError('数据保存失败，请重试');
            }
        }, 500);
    },
    
    /**
     * 验证设置数据 - v1.1版本
     */
    validateSetupData: function(data) {
        if (!data.goal) return false;
        
        // 验证目标值
        const validGoals = ['减脂塑形', '均衡营养', '增肌增重'];
        if (!validGoals.includes(data.goal)) return false;
        
        // 验证身高范围 (140-250cm)
        if (!data.height || data.height < 140 || data.height > 250) return false;
        
        // 验证体重范围 (30-200kg)
        if (!data.weight || data.weight < 30 || data.weight > 200) return false;
        
        return true;
    },
    
    /**
     * 处理重新设置点击
     */
    handleResetClick: function() {
        const confirmed = confirm('确定要重新设置吗？这将清除您的所有数据。');
        if (confirmed) {
            Router.reset();
            this.currentUserData = null;
        }
    },
    
    /**
     * 处理键盘快捷键
     */
    handleKeyboardShortcuts: function(event) {
        // Esc键返回上一页
        if (event.key === 'Escape') {
            if (Router.getCurrentRoute() === 'guide') {
                Router.navigateTo('dashboard');
            }
        }
        
        // Ctrl+R 重新设置（仅在仪表板页面）
        if (event.ctrlKey && event.key === 'r' && Router.getCurrentRoute() === 'dashboard') {
            event.preventDefault();
            this.handleResetClick();
        }
    },
    
    /**
     * 处理页面可见性变化
     */
    handleVisibilityChange: function() {
        if (document.hidden) {
            console.log('App.handleVisibilityChange: 页面隐藏');
        } else {
            console.log('App.handleVisibilityChange: 页面显示');
            // 页面重新可见时，刷新数据
            if (Router.getCurrentRoute() === 'dashboard') {
                this.refreshDashboard();
            }
        }
    },
    
    /**
     * 处理窗口大小变化
     */
    handleWindowResize: function() {
        // 防抖处理
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            console.log('App.handleWindowResize: 窗口大小变化');
            // 这里可以添加响应式处理逻辑
        }, 250);
    },
    
    /**
     * 加载用户数据
     */
    loadUserData: function() {
        const userData = Storage.load();
        if (userData) {
            this.currentUserData = userData;
            console.log('App.loadUserData: 用户数据加载成功', userData);
        } else {
            console.log('App.loadUserData: 没有找到用户数据');
        }
    },
    
    /**
     * 刷新仪表板数据 - v1.1版本
     */
    refreshDashboard: function() {
        if (!this.currentUserData) {
            this.currentUserData = Storage.load();
        }
        
        if (!this.currentUserData) {
            console.error('App.refreshDashboard: 没有用户数据');
            Router.navigateTo('setup');
            return;
        }
        
        // 计算膳食规划
        const mealPlanResult = Calculator.calculate(
            this.currentUserData.goal,
            this.currentUserData.height,
            this.currentUserData.weight
        );
        
        // 更新页面显示
        this.updateMealPlanDisplay(mealPlanResult.mealPlan);
        
        console.log('App.refreshDashboard: 仪表板数据刷新完成');
    },
    
    /**
     * 更新分餐显示 - v1.1版本
     * 将计算结果渲染到三餐卡片
     * @param {Object} mealPlan - 分餐规划数据
     */
    updateMealPlanDisplay: function(mealPlan) {
        try {
            console.log('App.updateMealPlanDisplay: 更新分餐显示', mealPlan);
            
            // 更新早餐
            const breakfast = mealPlan.breakfast || {};
            this.updateMealElements('breakfast', breakfast);
            
            // 更新午餐
            const lunch = mealPlan.lunch || {};
            this.updateMealElements('lunch', lunch);
            
            // 更新晚餐
            const dinner = mealPlan.dinner || {};
            this.updateMealElements('dinner', dinner);
            
            console.log('App.updateMealPlanDisplay: 分餐显示更新完成');
            
        } catch (error) {
            console.error('App.updateMealPlanDisplay: 更新显示失败', error);
        }
    },

    /**
     * 更新单餐元素
     * @param {string} mealName - 餐名 (breakfast/lunch/dinner)
     * @param {Object} mealData - 餐食数据
     */
    updateMealElements: function(mealName, mealData) {
        // 蛋白质
        const proteinElement = document.getElementById(`${mealName}-protein`);
        if (proteinElement && mealData.protein !== undefined) {
            this.animateElementUpdate(proteinElement, mealData.protein);
        }
        
        // 碳水化合物
        const carbElement = document.getElementById(`${mealName}-carb`);
        if (carbElement && mealData.carb !== undefined) {
            this.animateElementUpdate(carbElement, mealData.carb);
        }
        
        // 蔬菜
        const vegetableElement = document.getElementById(`${mealName}-vegetable`);
        if (vegetableElement && mealData.vegetable !== undefined) {
            this.animateElementUpdate(vegetableElement, mealData.vegetable);
        }
        
        // 脂肪
        const fatElement = document.getElementById(`${mealName}-fat`);
        if (fatElement && mealData.fat !== undefined) {
            this.animateElementUpdate(fatElement, mealData.fat);
        }
    },

    /**
     * 带动画更新元素
     * @param {Element} element - 要更新的元素
     * @param {number} value - 新值
     */
    animateElementUpdate: function(element, value) {
        element.style.transform = 'scale(1.1)';
        element.textContent = value;
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    },
    
    /**
     * 显示加载状态
     */
    showLoading: function() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.remove('hidden');
        }
    },
    
    /**
     * 隐藏加载状态
     */
    hideLoading: function() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }
    },
    
    /**
     * 显示错误信息
     */
    showError: function(message) {
        alert(message); // 简单的错误提示，后续可以优化为更友好的UI
        console.error('App.showError:', message);
    },
    
    /**
     * 显示成功信息
     */
    showSuccess: function(message) {
        // 创建成功提示
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            z-index: var(--z-tooltip);
            animation: slideUp var(--duration-normal) var(--ease-out);
        `;
        
        document.body.appendChild(toast);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    },
    
    /**
     * 获取应用程序状态
     */
    getState: function() {
        return {
            isInitialized: this.isInitialized,
            currentRoute: Router.getCurrentRoute(),
            userData: this.currentUserData,
            timestamp: Date.now()
        };
    },
    
    /**
     * 应用程序销毁（清理资源）
     */
    destroy: function() {
        console.log('App.destroy: 开始销毁应用程序');
        
        // 清理定时器
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
        }
        
        // 销毁路由系统
        Router.destroy();
        
        // 清理应用程序状态
        this.isInitialized = false;
        this.currentUserData = null;
        
        console.log('App.destroy: 应用程序销毁完成');
    }
};

// 页面加载完成后初始化应用程序
App.init();

// 导出到全局作用域（供其他模块使用）
window.App = App;

// 导出模块（如果在模块环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
} 