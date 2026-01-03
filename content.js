// content.js - Final Version (Substack Link Fix)

// ==========================================
// 1. Assets & Styles
// ==========================================
const ICONS = {
    LOGO: `<span style="font-weight: 700; color: #00bc71; font-size: 20px; font-family: sans-serif;">flomo</span>`,
    SEND: `<svg width="44" height="28" viewBox="0 0 44 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;"><rect width="44" height="27.0769" rx="6" fill="#00bc71"></rect><path d="M16.0838 19.4615L30.4615 13.1154L16.0838 6.76923L16.0769 11.7051L26.3516 13.1154L16.0769 14.5256L16.0838 19.4615Z" fill="white"></path></svg>`,
    INJECT_BTN: `<svg viewBox="0 0 143 110" aria-hidden="true" style="width: 20px; height: auto; fill: currentColor;"><path d="M109.994 53.7354H36.2852V32.7094H123.687L110.909 53.2687C110.909 53.7354 110.452 53.7354 109.994 53.7354ZM129.163 21.0279H59.3314L72.1129 0.466797C72.5703 0.466797 73.026 0 73.4832 0H142.854L130.076 20.5594C130.076 21.0279 129.619 21.0279 129.161 21.0279H129.163Z" fill="currentColor"/><path d="M37.4258 109.341C16.8869 109.341 0 92.0518 0 71.0241C0 49.9963 16.8869 32.7092 37.4258 32.7092C57.9629 32.7092 74.8518 49.9963 74.8518 71.0241C74.8518 92.0518 57.9631 109.339 37.426 109.339L37.4258 109.341ZM37.4258 54.202C28.2963 54.202 20.5371 61.6778 20.5371 71.4907C20.5371 80.837 27.8406 88.7815 37.4258 88.7815C47.0092 88.7815 54.3129 81.3038 54.3129 71.4907C53.8555 61.6778 46.5537 54.2018 37.424 54.2018L37.4258 54.202Z" fill="currentColor"/></svg>`,
    CLOSE: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
};

const STYLES = `
  .flomo-inject-btn {
    border-radius: 9999px; border: none; background: transparent; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background-color 0.2s ease, color 0.2s ease;
    margin: 0; padding: 0;
  }
  .flomo-inject-btn svg { fill: currentColor; color: inherit; pointer-events: none; }
  .flomo-inject-btn:hover { background-color: rgba(0, 188, 113, 0.1) !important; color: #00bc71 !important; }
  
  /* Modal Styles */
  .flomo-card { position: absolute; width: 500px; background: white; border-radius: 8px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); border: 1px solid #e5e7eb; font-family: sans-serif; display: flex; flex-direction: column; z-index: 99999; padding: 16px; box-sizing: border-box; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; cursor: move; user-select: none; }
  .close-btn { background: none; border: none; cursor: pointer; color: #9ca3af; padding: 0; }
  .close-btn:hover { color: #4b5563; }
  .body { position: relative; width: 100%; }
  textarea { width: 100%; height: 128px; padding: 4px; border: none; outline: none; resize: none; font-size: 16px; line-height: 1.5; color: #374151; font-family: inherit; background: transparent; }
  textarea::placeholder { color: #9ca3af; }
  .suggestions-popover { position: absolute; background: white; border: 1px solid #e5e7eb; border-radius: 6px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); width: 200px; max-height: 192px; overflow-y: auto; z-index: 10000; display: none; }
  .suggestions-popover.show { display: block; }
  .tag-item { padding: 8px 12px; cursor: pointer; font-size: 14px; color: #4b5563; }
  .tag-item:hover { background: #f9fafb; }
  .tag-item.active { background: #f3f4f6; color: #00bc71; }
  .footer { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; border-top: 1px solid #f3f4f6; padding-top: 12px; }
  .btn-quote { background: white; border: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; cursor: pointer; padding: 6px 12px; border-radius: 4px; }
  .btn-quote:hover { background: #f9fafb; }
  .btn-quote.active { border-color: #00bc71; color: #00bc71; }
  .btn-save { background: transparent; border: none; cursor: pointer; display: flex; align-items: center; }
  .btn-save:hover { opacity: 0.9; }
  .api-input { width: 100%; padding: 6px; border: 1px solid #e5e7eb; border-radius: 4px; font-size: 12px; margin-bottom: 8px; display: none; }
`;

const styleTag = document.createElement('style');
styleTag.textContent = STYLES;
document.head.appendChild(styleTag);

// ==========================================
// 2. Site Configuration Strategy
// ==========================================
const SITE_CONFIGS = [
    {
        name: 'Twitter',
        domain: ['twitter.com', 'x.com'],
        baseColor: 'inherit',
        containerSelector: 'article[data-testid="tweet"]',
        
        process: (tweet, createBtnFn) => {
            const caretBtn = tweet.querySelector('button[data-testid="caret"]');
            if (!caretBtn) return false;

            let current = caretBtn.parentElement;
            let actionRow = null;
            for (let i = 0; i < 5; i++) {
                if (!current) break;
                if (current.classList.contains('r-18u37iz') && current.children.length > 1) { 
                    actionRow = current; 
                    break; 
                }
                current = current.parentElement;
            }

            if (actionRow) {
                if (actionRow.querySelector('.flomo-btn-wrapper')) return true;

                let stolenColor = null;
                const neighborIcon = actionRow.querySelector('svg');
                if (neighborIcon) stolenColor = window.getComputedStyle(neighborIcon).color;
                else {
                    const neighborText = actionRow.querySelector('[dir="ltr"]');
                    if (neighborText) stolenColor = window.getComputedStyle(neighborText).color;
                }

                const btn = createBtnFn('Twitter', stolenColor);
                if (actionRow.firstChild) actionRow.insertBefore(btn, actionRow.firstChild);
                else actionRow.appendChild(btn);
                return true;
            }
            return false;
        },

        extractData: (element) => {
            const textNode = element.querySelector('div[data-testid="tweetText"]');
            const rawText = textNode ? textNode.innerText : "";
            let link = window.location.href;
            const timeEl = element.querySelector('time');
            if (timeEl && timeEl.closest('a')) link = timeEl.closest('a').href;
            return { text: rawText, link: link };
        }
    },
    {
        name: 'Xiaohongshu',
        domain: ['xiaohongshu.com'],
        baseColor: '#333', 
        containerSelector: '#detail-title', 
        
        process: (titleEl, createBtnFn) => {
            if (!titleEl) return false;
            if (titleEl.querySelector('.flomo-btn-wrapper')) return true;

            titleEl.style.display = 'flex';
            titleEl.style.justifyContent = 'space-between';
            titleEl.style.alignItems = 'flex-start';
            
            const btnWrapper = createBtnFn('Xiaohongshu', '#333');
            btnWrapper.style.marginLeft = '12px'; 
            btnWrapper.style.marginTop = '2px';   
            btnWrapper.style.transform = 'scale(0.9)'; 
            btnWrapper.style.flexShrink = '0';    
            btnWrapper.style.cursor = 'pointer';

            titleEl.appendChild(btnWrapper);
            return true;
        },

        extractData: (element) => {
            const titleEl = document.querySelector('#detail-title');
            const descEl = document.querySelector('#detail-desc');
            
            let title = titleEl ? titleEl.innerText.replace('flomo', '').trim() : '';
            const desc = descEl ? descEl.innerText.trim() : '';
            
            let content = '';
            if (title && desc) content = `【${title}】\n${desc}`;
            else content = desc || title || document.title;

            return { text: content, link: window.location.href };
        }
    },
    {
        name: 'Substack',
        domain: ['substack.com'],
        baseColor: 'inherit',
        containerSelector: 'button[aria-label="Share"]',
        
        process: (shareBtn, createBtnFn) => {
            if (!shareBtn) return false;
            const container = shareBtn.parentElement;
            if (container.querySelector('.flomo-btn-wrapper')) return true;

            let stolenColor = '#555'; 
            const svg = shareBtn.querySelector('svg');
            if (svg) {
                const style = window.getComputedStyle(svg);
                stolenColor = style.stroke !== 'none' ? style.stroke : style.color;
            }

            const btnWrapper = createBtnFn('Substack', stolenColor);
            container.appendChild(btnWrapper);
            return true;
        },

        // --- 核心修复：Substack 的抓取逻辑 ---
// --- 核心修复：Substack 的抓取逻辑 (针对 Note 和 引用贴优化) ---
        extractData: (flomoBtn) => {
            let finalLink = window.location.href; 
            let finalContent = '';
            
            // 1. 寻找“帖子容器” (Scope)
            // 我们需要向上爬，直到找到一个既包含“按钮”又包含“时间戳/正文”的公共祖先
            let current = flomoBtn;
            let postContainer = null;

            // 增加到 15 层，因为 Substack 的 div 嵌套非常深
            for (let i = 0; i < 15; i++) {
                if (!current.parentElement) break;
                current = current.parentElement;
                
                // 判定标准：如果这个容器里有“时间戳链接”，那它就是我们要的帖子容器
                // 排除 .postAttachment... (引用卡片) 里的链接，防止抓错
                const hasTimestamp = current.querySelector('a[href*="/note/"]:not([class*="postAttachment"] a), a[href*="/p/"]:not([class*="postAttachment"] a)');
                
                if (hasTimestamp) {
                    postContainer = current;
                    break;
                }
            }

            // 如果没找到容器（比如在详情页），就默认用 document
            const searchScope = postContainer || document;

            // 2. 抓取“准确的链接”
            // 策略：找 /note/ 或 /p/ 链接，但绝对不要抓取“引用卡片”(.postAttachment)里的链接
            const linkSelector = 'a[href*="/note/"]:not([class*="postAttachment"] a), a[href*="/p/"]:not([class*="postAttachment"] a)';
            const linkEl = searchScope.querySelector(linkSelector);
            
            if (linkEl) {
                // 移除链接末尾的参数 (比如 ?utm_source...)
                finalLink = linkEl.href.split('?')[0]; 
            }

            // 3. 抓取正文
            // 优先抓取 Note 的正文 (通常在 feedCommentBody 里)
            const noteBody = searchScope.querySelector('[class*="feedCommentBody"]'); // 匹配 feedCommentBody-xxx
            const titleEl = searchScope.querySelector('h1, h2, .post-preview-title');
            
            let mainText = '';
            
            if (noteBody) {
                mainText = noteBody.innerText.trim();
            } else if (titleEl) {
                // 如果是长文章，可能抓标题
                mainText = `【${titleEl.innerText.trim()}】`;
                const descEl = searchScope.querySelector('.post-preview-description, h3.subtitle');
                if (descEl) mainText += `\n${descEl.innerText.trim()}`;
            }

            // 4. 处理引用 (P3 情况)
            // 看看有没有引用的文章卡片，如果有，把它作为补充信息加在后面
            const quotedCard = searchScope.querySelector('[class*="postAttachment"]');
            let quotedText = '';
            if (quotedCard) {
                const quotedTitle = quotedCard.querySelector('.font-text-qe4AeH.weight-medium-fw81nC'); // 尝试抓取卡片标题
                if (quotedTitle) {
                    quotedText = `\n\n(引用文章: ${quotedTitle.innerText.trim()})`;
                }
            }

            // 5. 组合最终文本
            if (mainText) {
                finalContent = mainText + quotedText;
            } else {
                // 如果实在没抓到结构化文本，尝试抓容器的所有文本，但去掉操作栏文字
                finalContent = searchScope.innerText
                    .replace(/Like\nComment\nRestack\nShare/g, '') // 清理按钮文字
                    .trim();
            }
            
            // 保底
            if (!finalContent) finalContent = document.title;

            return { text: finalContent, link: finalLink };
        }
	}
];

function getCurrentConfig() {
    const host = window.location.hostname;
    return SITE_CONFIGS.find(c => c.domain.some(d => host.includes(d) || host.endsWith(d)));
}

// ==========================================
// 3. UI Components
// ==========================================
//用于存储草稿：Key = 链接, Value = 用户编辑过的内容
const DRAFT_CACHE = {};
function createInjectButton(siteName, customColor) {
    const config = SITE_CONFIGS.find(c => c.name === siteName);
    const wrapper = document.createElement('div');
    wrapper.className = 'flomo-btn-wrapper';
    wrapper.style.cssText = 'display: flex; align-items: center; justify-content: center; cursor: pointer;';
    
    if (siteName === 'Twitter') {
        wrapper.style.marginLeft = '8px';
        wrapper.style.marginRight = '-4px';
        wrapper.style.transition = 'color 0.2s ease'; 
    }
    if (siteName === 'Substack') {
         wrapper.style.marginLeft = '8px';
         wrapper.classList.add('pencraft');
    }

    const btn = document.createElement('button');
    btn.className = 'flomo-inject-btn';
    btn.style.width = '32px';
    btn.style.height = '32px';
    btn.style.color = customColor || config.baseColor || 'inherit';

    const iconContainer = document.createElement('div');
    iconContainer.style.cssText = 'display: flex; pointer-events: none;';
    iconContainer.innerHTML = ICONS.INJECT_BTN;

    btn.appendChild(iconContainer);
    wrapper.appendChild(btn);

    btn.onclick = (e) => {
        e.stopPropagation(); e.preventDefault();
        
        // 传递当前按钮本身作为上下文
        let contextElement = btn; 
        if (siteName === 'Twitter') {
            contextElement = btn.closest(config.containerSelector);
        }

        const data = config.extractData(contextElement);
        const rect = btn.getBoundingClientRect();
        
        chrome.storage.local.get(['flomoApi', 'userTags'], (result) => {
            const api = result.flomoApi || '';
            const tags = result.userTags || ['乱翻书'];
            
            // 【关键修改】这里增加了 btn 参数，把触发按钮本身传进去
            createModal(data.text, data.link, api, tags, rect.right, rect.top, btn);
        });
    };

    return wrapper;
}
// ==========================================
// 4. Modal Logic (Enhanced)
// ==========================================
function getCaretCoordinates(element, position) {
    const div = document.createElement('div');
    const style = window.getComputedStyle(element);
    Array.from(style).forEach(prop => div.style[prop] = style.getPropertyValue(prop));
    div.style.position = 'absolute'; div.style.visibility = 'hidden'; div.style.whiteSpace = 'pre-wrap';
    div.textContent = element.value.substring(0, position);
    const span = document.createElement('span'); span.textContent = '|'; div.appendChild(span);
    document.body.appendChild(div);
    const { offsetTop, offsetLeft } = span;
    document.body.removeChild(div);
    return { top: offsetTop + 24, left: offsetLeft };
}

let isDragging = false;
let dragStartX, dragStartY;

// 【关键修改】增加了 triggerElement 参数
function createModal(originalText, link, api, savedTags, clickX, clickY, triggerElement) {
    // 1. 如果已存在窗口，先关闭（触发保存逻辑）
    const existingHost = document.getElementById('flomo-extension-root');
    if (existingHost && existingHost._closeModal) {
        existingHost._closeModal(true); // true = 保存草稿
    }

    const host = document.createElement('div');
    host.id = 'flomo-extension-root';
    const posX = Math.min(clickX, window.innerWidth - 520);
    // 初始位置
    host.style.cssText = `position: absolute; left: ${posX}px; top: ${clickY + window.scrollY + 10}px; z-index: 99999;`;
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = STYLES;
    shadow.appendChild(style);

    const container = document.createElement('div');
    container.className = 'flomo-card';
    container.innerHTML = `
        <div class="header" id="drag-header">${ICONS.LOGO}<button class="close-btn" title="关闭并清空">${ICONS.CLOSE}</button></div>
        <div style="${api ? 'display:none' : 'display:block'}"><input type="text" class="api-input" id="api-input" placeholder="配置 API: https://flomoapp.com/iwh/..." value="${api || ''}"></div>
        <div class="body"><textarea id="content-input" placeholder="输入内容..."></textarea><div class="suggestions-popover" id="tag-suggestions"></div></div>
        <div class="footer"><button class="btn-quote" id="quote-btn">填入原文</button><button class="btn-save" id="save-btn">${ICONS.SEND}</button></div>
    `;
    shadow.appendChild(container);

    // --- 元素获取 ---
    const textarea = shadow.querySelector('#content-input');
    const closeBtn = shadow.querySelector('.close-btn');
    const saveBtn = shadow.querySelector('#save-btn');
    const quoteBtn = shadow.querySelector('#quote-btn');
    const suggestionBox = shadow.querySelector('#tag-suggestions');
    const header = shadow.querySelector('#drag-header');

    // --- 核心逻辑：加载内容 (缓存 vs 新内容) ---
    // 默认内容：链接 + 换行
    let defaultContent = link + '\n';
    
    // 如果缓存里有这个链接的草稿，优先使用草稿
    if (DRAFT_CACHE[link]) {
        textarea.value = DRAFT_CACHE[link];
        // 简单判断一下引用按钮的状态：如果草稿里包含了原文，就高亮按钮
        if (textarea.value.includes(originalText)) {
            quoteBtn.classList.add('active');
            quoteBtn.innerText = "清除原文";
        }
    } else {
        textarea.value = defaultContent;
    }

    // --- 核心逻辑：关闭函数 ---
    // shouldSave: true (暂存，下次打开还在), false (清空，下次打开是新的)
    const performClose = (shouldSave) => {
        if (shouldSave) {
            DRAFT_CACHE[link] = textarea.value; // 写入缓存
        } else {
            delete DRAFT_CACHE[link]; // 删除缓存
        }

        // 清理监听器
        document.removeEventListener('mousedown', handleOutsideClick);
        if (observer && triggerElement) observer.disconnect();
        
        host.remove();
    };
    
    // 将关闭函数挂载到 host 上，方便外部调用
    host._closeModal = performClose;

    // --- 交互 1: 点击右上角 X (彻底清除) ---
    closeBtn.onclick = () => performClose(false);

// --- 交互 & 键盘逻辑 (核心修复) ---
    textarea.onkeydown = (e) => {
        const isSuggesting = suggestionBox.classList.contains('show');

        // 1. 如果正在选标签 (显示建议框时)
        if (isSuggesting) {
            // 下箭头：向下选择
            if (e.key === 'ArrowDown') {
                e.preventDefault(); // 防止光标移动
                activeTagIndex = (activeTagIndex + 1) % currentFilteredTags.length;
                renderTags();
                // 滚动到可视区域
                const activeItem = suggestionBox.children[activeTagIndex];
                if (activeItem) activeItem.scrollIntoView({ block: 'nearest' });
                return;
            }
            // 上箭头：向上选择
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                activeTagIndex = (activeTagIndex - 1 + currentFilteredTags.length) % currentFilteredTags.length;
                renderTags();
                const activeItem = suggestionBox.children[activeTagIndex];
                if (activeItem) activeItem.scrollIntoView({ block: 'nearest' });
                return;
            }
            // 回车：选中标签
            if (e.key === 'Enter') {
                e.preventDefault(); // 防止换行
                insertTag(currentFilteredTags[activeTagIndex]);
                return;
            }
        }

        // 2. ESC 键逻辑 (优先关闭建议框，再次按关闭窗口)
        if (e.key === 'Escape') {
            e.stopPropagation();
            if (isSuggesting) {
                suggestionBox.classList.remove('show'); // 先关建议
            } else {
                performClose(true); // 再关窗口
            }
        }
    };

    // --- 输入监听 (用于触发标签建议) ---
    // 注意：这里需要重置 activeTagIndex 为 0，确保每次新搜出来的列表都默认选第一个
    textarea.oninput = () => {
        const cursor = textarea.selectionStart;
        const textBeforeCursor = textarea.value.substring(0, cursor);
        // 匹配最后一个 # 后的内容
        const match = textBeforeCursor.match(/#([^\s#]*)$/);

        if (match) {
            const query = match[1].toLowerCase();
            currentFilteredTags = savedTags.filter(t => t.toLowerCase().includes(query));
            
            if (currentFilteredTags.length) { 
                // 重置高亮索引
                activeTagIndex = 0; 
                
                const coords = getCaretCoordinates(textarea, cursor);
                suggestionBox.style.top = `${coords.top}px`; 
                suggestionBox.style.left = `${coords.left}px`;
                renderTags();
            } else {
                suggestionBox.classList.remove('show');
            }
        } else {
            suggestionBox.classList.remove('show');
        }
    };

    // --- 交互 3: 点击外部 (暂存关闭) ---
    const handleOutsideClick = (e) => {
        // 如果点击的是 host 内部，或者是触发按钮本身，不关闭
        if (host.contains(e.target) || (e.target === host) || triggerElement.contains(e.target)) {
            return;
        }
        performClose(true);
    };
    // 使用 setTimeout 避免当前点击立即触发关闭
    setTimeout(() => {
        document.addEventListener('mousedown', handleOutsideClick);
    }, 100);

    // --- 交互 4: 滚动出视野 (暂存关闭) ---
    let observer;
    if (triggerElement) {
        observer = new IntersectionObserver((entries) => {
            // 如果触发按钮完全离开了视口 (ratio < 0)
            if (!entries[0].isIntersecting) {
                performClose(true);
            }
        }, { threshold: 0 }); // 只要有一点点看不见，或者完全看不见（根据需求，0表示只要不在视口内）
        
        observer.observe(triggerElement);
    }

    // --- 拖拽逻辑 (保持不变) ---
    header.onmousedown = (e) => { isDragging = true; dragStartX = e.clientX - host.offsetLeft; dragStartY = e.clientY - host.offsetTop; header.style.cursor = 'grabbing'; };
    document.onmousemove = (e) => { 
        if (isDragging) { 
            e.preventDefault(); 
            // 注意：因为有 scroll 监听，这里不需要把 scrollY 算进去，保持 absolute 即可
            // 但如果用户滚动了页面，top 值还是需要包含 scrollY 才能定位准确
            // 简单处理：保持原样
            host.style.left = `${e.clientX - dragStartX}px`; 
            host.style.top = `${e.clientY - dragStartY + window.scrollY}px`; 
        }
    };
    document.onmouseup = () => { isDragging = false; if(header) header.style.cursor = 'move'; };

    // --- 引用原文逻辑 ---
    let isQuoteActive = quoteBtn.classList.contains('active');
    quoteBtn.onclick = () => {
        if (!isQuoteActive) { 
            textarea.value += `\n${originalText}`; 
            quoteBtn.classList.add('active'); quoteBtn.innerText = "清除原文"; isQuoteActive = true; 
        } else { 
            textarea.value = textarea.value.replace(`\n${originalText}`, '').trim(); 
            quoteBtn.classList.remove('active'); quoteBtn.innerText = "填入原文"; isQuoteActive = false; 
        }
        textarea.focus();
    };

    // --- 标签建议逻辑 (保持不变) ---
    let activeTagIndex = 0; let currentFilteredTags = [];
    const renderTags = () => {
        if (currentFilteredTags.length === 0) { suggestionBox.classList.remove('show'); return; }
        suggestionBox.innerHTML = currentFilteredTags.map((tag, i) => `<div class="tag-item ${i === activeTagIndex ? 'active' : ''}">${tag}</div>`).join('');
        suggestionBox.classList.add('show');
        shadow.querySelectorAll('.tag-item').forEach((item, i) => item.onclick = () => insertTag(currentFilteredTags[i]));
    };
    const insertTag = (tag) => {
        const val = textarea.value; const cursor = textarea.selectionStart;
        const lastHash = val.substring(0, cursor).lastIndexOf('#');
        if (lastHash !== -1) textarea.value = val.substring(0, lastHash) + tag + ' ' + val.substring(cursor);
        suggestionBox.classList.remove('show'); textarea.focus();
    };
    textarea.oninput = () => {
        const match = textarea.value.substring(0, textarea.selectionStart).match(/#([^\s#]*)$/);
        if (match) {
            currentFilteredTags = savedTags.filter(t => t.toLowerCase().includes(match[1].toLowerCase()));
            if (currentFilteredTags.length) { 
                const coords = getCaretCoordinates(textarea, textarea.selectionStart);
                suggestionBox.style.top = `${coords.top}px`; suggestionBox.style.left = `${coords.left}px`;
                renderTags();
            } else suggestionBox.classList.remove('show');
        } else suggestionBox.classList.remove('show');
    };
    
    // --- 保存逻辑 ---
    saveBtn.onclick = () => {
        let currentApi = shadow.querySelector('#api-input').value.trim() || api;
        if (!currentApi.startsWith('https://')) { shadow.querySelector('#api-input').style.display='block'; return; }
        
        saveBtn.innerText = '...'; saveBtn.disabled = true;
        
        // 保存新标签
        const newTags = textarea.value.match(/#[^\s#]+/g);
        if (newTags) {
            newTags.forEach(t => { if (!savedTags.includes(t)) savedTags.push(t); });
            chrome.storage.local.set({ userTags: savedTags });
        }
        
        chrome.runtime.sendMessage({ type: 'sendToFlomo', payload: { content: textarea.value, api: currentApi }}, (res) => {
            if (res && res.success) {
                chrome.storage.local.set({ flomoApi: currentApi });
                saveBtn.innerText = '✓'; 
                // 发送成功后，彻底清除缓存并关闭
                performClose(false); 
            } else { 
                saveBtn.innerText = '×'; saveBtn.disabled = false; alert('Failed'); 
            }
        });
    };

    setTimeout(() => { textarea.focus(); textarea.setSelectionRange(textarea.value.length, textarea.value.length); }, 50);
}
// ==========================================
// 5. Main Execution
// ==========================================

function run() {
    const config = getCurrentConfig();
    if (!config) return;

    console.log(`[Flomo] Extension active on: ${config.name}`);

    const observer = new MutationObserver(() => {
        const targets = document.querySelectorAll(config.containerSelector);
        targets.forEach(target => {
            config.process(target, createInjectButton);
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
}

run();