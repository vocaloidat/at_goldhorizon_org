// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initSmoothScrolling();
    initParallaxEffects();
    initLanguageSelector();
    // 移除打字机效果
    // initTypingEffect();
});

// 导航栏功能
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');

    // 移动端菜单切换
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // 点击菜单项后关闭菜单
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 滚动时导航栏效果
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滚动时隐藏导航栏
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动时显示导航栏
            navbar.style.transform = 'translateY(0)';
        }
        
        // 滚动时改变导航栏背景透明度
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// 滚动动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // 数字计数动画（仅保留非项目统计数字）
                if (entry.target.classList.contains('stat-number')) {
                    animateNumber(entry.target);
                }
                
                // 项目统计数字动画已移除
                // if (entry.target.classList.contains('project-stat-number')) {
                //     animateNumber(entry.target);
                // }
                
                // 项目卡片动画已移除，直接显示
                // if (entry.target.classList.contains('project-card')) {
                //     animateProjectCard(entry.target);
                // }
            }
        });
    }, observerOptions);

    // 观察需要动画的元素（移除项目卡片的滚动动画）
    const animateElements = document.querySelectorAll('.service-card, .tech-card, .stat-item, .contact-form, .contact-info');
    animateElements.forEach(el => {
        observer.observe(el);
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
    });
    
    // 让项目卡片直接显示，不添加动画
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        
        // 移除数字动画，直接显示最终值
        // const statNumbers = card.querySelectorAll('.project-stat-number');
        // statNumbers.forEach((statElement, index) => {
        //     setTimeout(() => {
        //         animateNumber(statElement);
        //     }, 500 + index * 200); // 稍作延迟，让数字动画错开
        // });
    });
}

// 数字计数动画
function animateNumber(element) {
    const originalText = element.textContent.trim();
    
    // 特殊情况处理：对于“无限”等非数字文本，不做动画
    if (originalText === '无限' || originalText.includes('无限')) {
        return;
    }
    
    // 匹配纯数字、数字+K、数字+%、数字+万等格式
    const patterns = [
        /^(\d+(?:\.\d+)?)\s*([K%+]*)$/,  // 10K, 95%, 50K+
        /^(\d+(?:\.\d+)?)\s*万$/,      // 100万
        /^(\d+(?:\.\d+)?)$/             // 纯数字 12
    ];
    
    let match = null;
    let targetNumber = 0;
    let suffix = '';
    
    for (const pattern of patterns) {
        match = originalText.match(pattern);
        if (match) {
            targetNumber = parseFloat(match[1]);
            suffix = match[2] || '';
            
            // 处理万的情况
            if (originalText.includes('万')) {
                suffix = '万';
            }
            
            break;
        }
    }
    
    // 如果没有匹配到数字格式，直接返回
    if (!match || isNaN(targetNumber)) {
        return;
    }
    
    const duration = 2000; // 2秒
    const step = targetNumber / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= targetNumber) {
            current = targetNumber;
            clearInterval(timer);
        }
        
        // 格式化数字显示
        let displayNumber;
        
        if (suffix === '%') {
            // 百分比格式
            displayNumber = Math.floor(current * 10) / 10; // 保留一位小数
            element.textContent = displayNumber + '%';
        } else if (suffix === '万') {
            // 万位数格式
            displayNumber = Math.floor(current);
            element.textContent = displayNumber + '万';
        } else if (suffix.includes('K')) {
            // K格式
            displayNumber = Math.floor(current);
            element.textContent = displayNumber + 'K' + (suffix.includes('+') ? '+' : '');
        } else {
            // 纯数字
            displayNumber = Math.floor(current);
            element.textContent = displayNumber + suffix;
        }
    }, 16);
}

// 项目卡片动画已移除
// function animateProjectCard(element) {
//     const delay = Array.from(element.parentNode.children).indexOf(element) * 150;
//     
//     setTimeout(() => {
//         element.style.opacity = '1';
//         element.style.transform = 'translateY(0)';
//         
//         // 动画项目统计数据
//         const statNumbers = element.querySelectorAll('.project-stat-number');
//         statNumbers.forEach((statElement, index) => {
//             setTimeout(() => {
//                 animateNumber(statElement);
//             }, 300 + index * 100);
//         });
//     }, delay);
// }

// 联系表单处理
function initContactForm() {
    const form = document.querySelector('.contact-form form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // 显示提交效果
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = '发送中...';
            submitButton.disabled = true;
            
            // 模拟发送过程
            setTimeout(() => {
                submitButton.textContent = '发送成功！';
                submitButton.style.background = '#4CAF50';
                
                // 显示成功消息
                showNotification('消息发送成功！我们会尽快回复您。', 'success');
                
                // 重置表单
                form.reset();
                
                // 恢复按钮状态
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.background = '';
                }, 2000);
            }, 1500);
        });
        
        // 实时表单验证
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearValidation);
        });
    }
}

// 字段验证
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // 移除之前的错误状态
    field.classList.remove('error');
    
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = '此字段为必填项';
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = '请输入有效的邮箱地址';
        }
    }
    
    if (!isValid) {
        field.classList.add('error');
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// 清除验证状态
function clearValidation(e) {
    const field = e.target;
    field.classList.remove('error');
    hideFieldError(field);
}

// 显示字段错误
function showFieldError(field, message) {
    hideFieldError(field); // 先清除现有错误
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ff6b6b';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.5rem';
    
    field.parentNode.appendChild(errorDiv);
}

// 隐藏字段错误
function hideFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 样式
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '10px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        minWidth: '250px'
    });
    
    // 根据类型设置颜色
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #2196F3, #0b7dda)';
    }
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 平滑滚动
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // 考虑导航栏高度
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 视差效果
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-visual, .stars-bg');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.5;
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// 打字机效果已移除
// function initTypingEffect() {
//     const heroTitle = document.querySelector('.hero-title');
//     
//     if (heroTitle) {
//         const text = heroTitle.textContent;
//         heroTitle.textContent = '';
//         heroTitle.style.opacity = '1';
//         
//         let i = 0;
//         const typeWriter = () => {
//             if (i < text.length) {
//                 heroTitle.innerHTML += text.charAt(i);
//                 i++;
//                 setTimeout(typeWriter, 100);
//             } else {
//                 // 添加闪烁光标效果
//                 const cursor = document.createElement('span');
//                 cursor.textContent = '|';
//                 cursor.className = 'typing-cursor';
//                 cursor.style.animation = 'blink 1s infinite';
//                 heroTitle.appendChild(cursor);
//             }
//         };
//         
//         // 延迟开始打字效果
//         setTimeout(typeWriter, 1000);
//     }
// }

// 添加CSS动画类
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .field-error {
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    .typing-cursor {
        color: var(--primary-color);
        font-weight: normal;
    }
    
    .contact-form input.error,
    .contact-form select.error,
    .contact-form textarea.error {
        border-color: #ff6b6b;
        box-shadow: 0 0 10px rgba(255, 107, 107, 0.3);
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
    
    .service-card {
        cursor: pointer;
    }
    
    .tech-card {
        cursor: pointer;
    }
    
    /* 鼠标悬停时的粒子效果 */
    .btn:hover {
        position: relative;
        overflow: hidden;
    }
    
    .btn:hover::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        animation: shimmer 1.5s infinite;
    }
    
    @keyframes shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
    }
`;

document.head.appendChild(style);

// 页面性能优化
window.addEventListener('load', function() {
    // 图片懒加载（如果有图片的话）
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// 错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
    // 可以添加错误报告功能
});

// 调试模式（开发时使用）
if (window.location.search.includes('debug=true')) {
    console.log('GoldHorizon 网站调试模式已启用');
    
    // 添加调试信息显示
    const debugInfo = document.createElement('div');
    debugInfo.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        background: rgba(0,0,0,0.8);
        color: #fff;
        padding: 10px;
        font-family: monospace;
        font-size: 12px;
        border-radius: 5px;
        z-index: 9999;
    `;
    
    function updateDebugInfo() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollPercent = Math.round((scrollY / (documentHeight - windowHeight)) * 100);
        
        debugInfo.innerHTML = `
            滚动位置: ${scrollY}px<br>
            滚动百分比: ${scrollPercent}%<br>
            窗口尺寸: ${window.innerWidth} x ${window.innerHeight}
        `;
    }
    
    document.body.appendChild(debugInfo);
    window.addEventListener('scroll', updateDebugInfo);
    window.addEventListener('resize', updateDebugInfo);
    updateDebugInfo();
}

// 语言切换功能
function initLanguageSelector() {
    const languageSelect = document.getElementById('languageSelect');
    
    // 翻译数据已移至 translations.js 文件
    
    // 设置默认语言为英语
    let currentLanguage = 'en';
    
    // 初始化时设置英语
    if (languageSelect) {
        languageSelect.value = 'en';
        updateLanguage('en');
        
        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            currentLanguage = selectedLanguage;
            updateLanguage(selectedLanguage);
        });
    }
    
    function updateLanguage(lang) {
        // 处理导航链接
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const originalText = link.getAttribute('data-original') || link.textContent.trim();
            if (!link.getAttribute('data-original')) {
                link.setAttribute('data-original', originalText);
            }
            
            if (translations[lang] && translations[lang][originalText]) {
                link.textContent = translations[lang][originalText];
            } else if (lang === 'zh') {
                link.textContent = originalText;
            }
        });
        
        // 处理具有data-translate属性的元素
        const translatableElements = document.querySelectorAll('[data-translate]');
        translatableElements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const originalText = element.getAttribute('data-original');
            
            if (!originalText) {
                element.setAttribute('data-original', element.innerHTML);
            }
            
            if (translations[lang] && translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            } else if (lang === 'zh') {
                element.innerHTML = element.getAttribute('data-original');
            }
        });
        
        // 处理表单占位符
        const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            const originalPlaceholder = element.getAttribute('data-original-placeholder');
            
            if (!originalPlaceholder) {
                element.setAttribute('data-original-placeholder', element.placeholder);
            }
            
            if (translations[lang] && translations[lang][key]) {
                element.placeholder = translations[lang][key];
            } else if (lang === 'zh') {
                element.placeholder = element.getAttribute('data-original-placeholder');
            }
        });
        
        // 更新页面标题
        if (translations[lang] && translations[lang]['page-title']) {
            document.title = translations[lang]['page-title'];
        }
    }
}