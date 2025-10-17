// Ключ для хранения в LocalStorage
const STORAGE_KEY = 'discord-messages';

// Загрузка сообщений из LocalStorage
function loadMessages() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
}

// Сохранение сообщений в LocalStorage
function saveMessages() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

// Хранилище сообщений (загружаем из сохраненных)
let messages = loadMessages();

// Отправка сообщения
function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (text === '') return;
    
    // Создаем сообщение
    const message = {
        id: Date.now(),
        user: 'Ты',
        text: text,
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString()
    };
    
    // Добавляем в массив
    messages.push(message);
    
    // Сохраняем в LocalStorage
    saveMessages();
    
    // Очищаем поле ввода
    input.value = '';
    
    // Показываем сообщение
    displayMessages();
}

// Показ сообщений
function displayMessages() {
    const container = document.getElementById('messages');
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Добавляем каждое сообщение
    messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.innerHTML = `
            <div class="message-header">
                <strong class="message-user">${msg.user}</strong>
                <span class="message-time">${msg.time} • ${msg.date}</span>
            </div>
            <div class="message-text">${msg.text}</div>
        `;
        container.appendChild(messageDiv);
    });
    
    // Прокручиваем вниз
    container.scrollTop = container.scrollHeight;
}

// Очистка истории
function clearHistory() {
    if (confirm('Очистить всю историю сообщений?')) {
        messages = [];
        saveMessages();
        displayMessages();
    }
}

// Добавляем кнопку очистки в интерфейс
function addClearButton() {
    const chatHeader = document.querySelector('.chat-header');
    if (chatHeader) {
        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Очистить историю';
        clearBtn.onclick = clearHistory;
        clearBtn.style.marginLeft = '10px';
        clearBtn.style.padding = '5px 10px';
        clearBtn.style.background = '#ed4245';
        clearBtn.style.border = 'none';
        clearBtn.style.borderRadius = '3px';
        clearBtn.style.color = 'white';
        clearBtn.style.cursor = 'pointer';
        chatHeader.appendChild(clearBtn);
    }
}

// Экспорт сообщений в файл
function exportMessages() {
    const dataStr = JSON.stringify(messages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'discord-chat-backup.json';
    link.click();
}

// Импорт сообщений из файла
function importMessages(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedMessages = JSON.parse(e.target.result);
            messages = importedMessages;
            saveMessages();
            displayMessages();
            alert('Сообщения успешно импортированы!');
        } catch (error) {
            alert('Ошибка при импорте файла');
        }
    };
    reader.readAsText(file);
}

// Добавляем кнопки экспорта/импорта
function addExportImportButtons() {
    const chatHeader = document.querySelector('.chat-header');
    if (chatHeader) {
        // Кнопка экспорта
        const exportBtn = document.createElement('button');
        exportBtn.textContent = 'Экспорт';
        exportBtn.onclick = exportMessages;
        exportBtn.style.marginLeft = '10px';
        exportBtn.style.padding = '5px 10px';
        exportBtn.style.background = '#5865f2';
        exportBtn.style.border = 'none';
        exportBtn.style.borderRadius = '3px';
        exportBtn.style.color = 'white';
        exportBtn.style.cursor = 'pointer';
        chatHeader.appendChild(exportBtn);
        
        // Кнопка импорта
        const importBtn = document.createElement('input');
        importBtn.type = 'file';
        importBtn.accept = '.json';
        importBtn.style.display = 'none';
        importBtn.onchange = importMessages;
        document.body.appendChild(importBtn);
        
        const importLabel = document.createElement('button');
        importLabel.textContent = 'Импорт';
        importLabel.onclick = () => importBtn.click();
        importLabel.style.marginLeft = '10px';
        importLabel.style.padding = '5px 10px';
        importLabel.style.background = '#57f287';
        importLabel.style.border = 'none';
        importLabel.style.borderRadius = '3px';
        importLabel.style.color = 'white';
        importLabel.style.cursor = 'pointer';
        chatHeader.appendChild(importLabel);
    }
}

// Отправка по Enter
document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Загрузка при старте
document.addEventListener('DOMContentLoaded', function() {
    displayMessages();
    addClearButton();
    addExportImportButtons();
    
    // Показываем информацию о сохранениях
    console.log('Сообщений в истории:', messages.length);
    console.log('Данные сохранены в LocalStorage');
});