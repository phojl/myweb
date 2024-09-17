// 照片轮播功能
function setupCarousel() {
    const images = document.querySelectorAll('.carousel img');
    let currentIndex = 0;

    function showNextImage() {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    }

    // 初始化：显示第一张图片
    images[0].classList.add('active');

    setInterval(showNextImage, 5000); // 每5秒切换一次图片
}

// 滚动动画
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    
    function checkScroll() {
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top <= windowHeight * 0.75) {
                el.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // 初始检查
}

// AI 对话功能
function setupAIChat() {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    let conversationHistory = [];

    function addMessage(message, isUser) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(isUser ? 'user-message' : 'ai-message');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatInput.value = '';
            
            // 添加用户消息到对话历史
            conversationHistory.push({ role: "user", content: message });

            try {
                const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer 55a4867d73dd44622981b150a22f6a6a.VFQOYMPpZH7LpBWP'
                    },
                    body: JSON.stringify({
                        model: "glm-4",
                        messages: conversationHistory,
                        stream: false
                    })
                });

                if (!response.ok) {
                    throw new Error('API请求失败');
                }

                const data = await response.json();
                const aiResponse = data.choices[0].message.content;
                
                // 添加AI回复到对话历史
                conversationHistory.push({ role: "assistant", content: aiResponse });
                
                addMessage(aiResponse, false);
            } catch (error) {
                console.error('Error:', error);
                addMessage("抱歉，发生了错误。请稍后再试。", false);
            }
        }
    }

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    setupCarousel();
    handleScrollAnimations();
    setupAIChat();
});