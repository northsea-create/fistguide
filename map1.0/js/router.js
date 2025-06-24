/**
 * 路由管理模块 - 单页面应用路由系统
 * 负责页面之间的切换和导航管理
 */

const Router = {
    // 当前页面
    currentPage: null,
    
    // 页面元素缓存
    pages: {},
    
    // 路由配置
    routes: {
        'setup': {
            element: '#setup-page',
            title: '设置 - 一拳膳食',
            onEnter: null,
            onLeave: null
        },
        'dashboard': {
            element: '#dashboard-page',
            title: '今日规划 - 一拳膳食',
            onEnter: 'onDashboardEnter',
            onLeave: null
        },
        'guide': {
            element: '#guide-page',
            title: '使用指南 - 一拳膳食',
            onEnter: null,
            onLeave: null
        }
    },
    
    /**
     * 初始化路由系统
     */
    init: function() {
        console.log('Router.init: 初始化路由系统');
        
        // 缓存页面元素
        this.cachePageElements();
        
        // 监听浏览器前进后退
        window.addEventListener('popstate', (event) => {
            const route = event.state?.route || 'setup';
            this.navigateTo(route, false); // 不推入历史记录
        });
        
        // 根据用户数据决定初始页面
        this.determineInitialRoute();
    },
    
    /**
     * 缓存所有页面元素
     */
    cachePageElements: function() {
        for (const [route, config] of Object.entries(this.routes)) {
            const element = document.querySelector(config.element);
            if (element) {
                this.pages[route] = element;
            } else {
                console.error(`Router.cachePageElements: 未找到页面元素 ${config.element}`);
            }
        }
    },
    
    /**
     * 确定初始路由
     */
    determineInitialRoute: function() {
        // 检查用户是否已完成设置
        if (Storage && Storage.exists()) {
            console.log('Router.determineInitialRoute: 用户已设置，跳转到仪表板');
            this.navigateTo('dashboard');
        } else {
            console.log('Router.determineInitialRoute: 用户未设置，显示设置页');
            this.navigateTo('setup');
        }
    },
    
    /**
     * 导航到指定页面
     * @param {string} route - 路由名称
     * @param {boolean} pushState - 是否推入浏览器历史记录
     */
    navigateTo: function(route, pushState = true) {
        if (!this.routes[route]) {
            console.error(`Router.navigateTo: 未找到路由 ${route}`);
            return false;
        }
        
        const config = this.routes[route];
        
        try {
            // 执行当前页面的离开回调
            if (this.currentPage && this.routes[this.currentPage].onLeave) {
                const leaveCallback = this.routes[this.currentPage].onLeave;
                if (typeof window[leaveCallback] === 'function') {
                    window[leaveCallback]();
                }
            }
            
            // 隐藏所有页面
            this.hideAllPages();
            
            // 显示目标页面
            this.showPage(route);
            
            // 更新浏览器标题
            document.title = config.title;
            
            // 更新浏览器历史记录
            if (pushState) {
                const url = route === 'dashboard' ? '/' : `/#${route}`;
                history.pushState({ route }, config.title, url);
            }
            
            // 执行进入页面的回调
            if (config.onEnter && typeof window[config.onEnter] === 'function') {
                window[config.onEnter]();
            }
            
            // 更新当前页面
            this.currentPage = route;
            
            console.log(`Router.navigateTo: 成功导航到 ${route}`);
            return true;
            
        } catch (error) {
            console.error(`Router.navigateTo: 导航失败`, error);
            return false;
        }
    },
    
    /**
     * 隐藏所有页面
     */
    hideAllPages: function() {
        for (const [route, element] of Object.entries(this.pages)) {
            if (element) {
                element.classList.add('hidden');
            }
        }
    },
    
    /**
     * 显示指定页面
     * @param {string} route - 路由名称
     */
    showPage: function(route) {
        const element = this.pages[route];
        if (element) {
            element.classList.remove('hidden');
            
            // 添加淡入动画
            if (element.classList.contains('fade-in')) {
                element.classList.remove('fade-in');
            }
            
            // 强制重新计算样式，然后添加动画
            element.offsetHeight;
            element.classList.add('fade-in');
        }
    },
    
    /**
     * 返回上一页
     */
    goBack: function() {
        // 简单的返回逻辑
        if (this.currentPage === 'guide') {
            this.navigateTo('dashboard');
        } else if (this.currentPage === 'dashboard') {
            // 仪表板页面通常不允许返回，但可以重新设置
            this.navigateTo('setup');
        } else {
            // 默认跳转到仪表板
            this.navigateTo('dashboard');
        }
    },
    
    /**
     * 重新设置（清除用户数据并跳转到设置页）
     */
    reset: function() {
        if (Storage && Storage.clear()) {
            console.log('Router.reset: 用户数据已清除');
            this.navigateTo('setup');
            return true;
        } else {
            console.error('Router.reset: 清除用户数据失败');
            return false;
        }
    },
    
    /**
     * 获取当前路由
     * @returns {string} 当前路由名称
     */
    getCurrentRoute: function() {
        return this.currentPage;
    },
    
    /**
     * 检查是否为指定路由
     * @param {string} route - 路由名称
     * @returns {boolean} 是否为指定路由
     */
    isCurrentRoute: function(route) {
        return this.currentPage === route;
    },
    
    /**
     * 处理页面刷新
     */
    handlePageRefresh: function() {
        // 页面刷新时重新确定路由
        this.determineInitialRoute();
    },
    
    /**
     * 添加路由监听器
     * @param {string} route - 路由名称
     * @param {string} event - 事件类型 ('enter' | 'leave')
     * @param {Function} callback - 回调函数
     */
    addRouteListener: function(route, event, callback) {
        if (!this.routes[route]) {
            console.error(`Router.addRouteListener: 未找到路由 ${route}`);
            return false;
        }
        
        const eventKey = event === 'enter' ? 'onEnter' : 'onLeave';
        this.routes[route][eventKey] = callback;
        
        return true;
    },
    
    /**
     * 预加载页面资源（未来扩展用）
     * @param {string} route - 路由名称
     */
    preloadRoute: function(route) {
        // 预加载页面相关资源
        console.log(`Router.preloadRoute: 预加载路由 ${route}`);
        
        // 这里可以添加预加载逻辑，比如：
        // - 预加载图片资源
        // - 预请求数据
        // - 预编译模板等
    },
    
    /**
     * 获取路由历史记录长度
     * @returns {number} 历史记录长度
     */
    getHistoryLength: function() {
        return history.length;
    },
    
    /**
     * 销毁路由系统（清理事件监听器）
     */
    destroy: function() {
        // 移除事件监听器
        window.removeEventListener('popstate', this.handlePopState);
        
        // 清理页面缓存
        this.pages = {};
        this.currentPage = null;
        
        console.log('Router.destroy: 路由系统已销毁');
    }
};

/**
 * 页面进入回调函数
 * 这些函数在App模块中实现，这里只是声明
 */

/**
 * 仪表板页面进入回调
 * 刷新份量计算结果
 */
function onDashboardEnter() {
    if (window.App && typeof window.App.refreshDashboard === 'function') {
        window.App.refreshDashboard();
    }
}

// 导出模块（如果在模块环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Router;
} 