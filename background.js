// background.js - V3 Optimized

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'sendToFlomo') {
        handleSendToFlomo(request.payload, sendResponse);
        return true; 
    }
});

async function handleSendToFlomo(payload, sendResponse) {
    const { content, tag, api } = payload;

    if (!api) {
        sendResponse({ success: false, error: "未配置 API 链接" });
        return;
    }

    // 组合逻辑：
    // 如果 content 输入框里已经包含了 #tag，其实 Flomo 也会识别。
    // 这里我们把 tag 输入框里的内容加在最上面。
    let finalContent = content;
    
    if (tag && tag.trim() !== "") {
        const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
        finalContent = `${formattedTag}\n${content}`;
    }

    try {
        const response = await fetch(api, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: finalContent })
        });

        const data = await response.json();
        
        if (response.ok && data.code === 0) {
            sendResponse({ success: true, message: data.message });
        } else {
            sendResponse({ success: false, error: data.message || "发送失败" });
        }
    } catch (err) {
        sendResponse({ success: false, error: "网络请求错误" });
    }
}