// 获取元素
const textInput = document.getElementById('text-input');
const jlptLevel = document.getElementById('jlpt-level');
const extractButton = document.getElementById('extract-button');
const wordCandidateSection = document.getElementById('word-candidate-section');
const wordCandidateTable = document.getElementById('word-candidate-table').getElementsByTagName('tbody')[0];
const addSelectedWordsButton = document.getElementById('add-selected-words');
const exportCsvButton = document.getElementById('export-csv');
const myWordbookSection = document.getElementById('my-wordbook-section');
const myWordbookList = document.getElementById('my-wordbook-list');
const clearWordbookButton = document.getElementById('clear-wordbook');
const exportWordbookButton = document.getElementById('export-wordbook');
const reviewSection = document.getElementById('review-section');
const reviewCards = document.getElementById('review-cards');
const saveProgressButton = document.getElementById('save-progress');

// 本地存储
let wordbook = JSON.parse(localStorage.getItem('wordbook')) || [];
let todayReview = JSON.parse(localStorage.getItem('todayReview')) || [];

// 显示单词本
function displayWordbook() {
    myWordbookList.innerHTML = '';
    wordbook.forEach(word => {
        const li = document.createElement('li');
        li.innerHTML = `${word.word} <button onclick="removeFromWordbook('${word.word}')">删除</button>`;
        myWordbookList.appendChild(li);
    });
}

// 显示今日背诵
function displayReview() {
    reviewCards.innerHTML = '';
    const reviewWords = todayReview.slice(0, 20);
    reviewWords.forEach(word => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <p>${word.word}</p>
            <button onclick="markAsRemembered('${word.word}')">记住</button>
            <button onclick="markAsForgotten('${word.word}')">没记住</button>
        `;
        reviewCards.appendChild(card);
    });
}

// 提取生词候选
extractButton.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (!text) {
        alert('请先粘贴日文文章');
        return;
    }

    // 模拟词汇提取
    const extractedWords = extractWords(text, jlptLevel.value);
    wordCandidateSection.style.display = 'block';
    wordCandidateTable.innerHTML = '';
    
    extractedWords.forEach(word => {
        const row = wordCandidateTable.insertRow();
        row.innerHTML = `
            <td>${word.word}</td>
            <td>${word.count}</td>
            <td>${word.example}</td>
            <td><input type="checkbox" data-word="${word.word}"></td>
        `;
    });
});

// 提取词汇的模拟函数
function extractWords(text, level) {
    // 这里模拟词汇提取逻辑
    return [
        { word: '食べる', count: 3, example: '食べることが好きです。' },
        { word: '見る', count: 2, example: '映画を見るのが好きです。' },
        // 更多示例词汇
    ];
}

// 添加到单词本
addSelectedWordsButton.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        const word = checkbox.getAttribute('data-word');
        if (!wordbook.find(w => w.word === word)) {
            wordbook.push({ word, status: 'learning' });
        }
    });

    localStorage.setItem('wordbook', JSON.stringify(wordbook));
    displayWordbook();
});

// 清空单词本
clearWordbookButton.addEventListener('click', () => {
    wordbook = [];
    localStorage.setItem('wordbook', JSON.stringify(wordbook));
    displayWordbook();
});

// 导出 CSV
exportCsvButton.addEventListener('click', () => {
    const csv = convertToCSV(wordbook);
    downloadCSV(csv);
});

// 导出单词本 CSV
exportWordbookButton.addEventListener('click', () => {
    const csv = convertToCSV(wordbook);
    downloadCSV(csv);
});

// 转换为 CSV 格式
function convertToCSV(data) {
    const header = ['word', 'status'];
    const rows = data.map(item => `${item.word},${item.status}`);
    return [header.join(','), ...rows].join('\n');
}

// 下载 CSV 文件
function downloadCSV(csv) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wordbook.csv';
    a.click();
    URL.revokeObjectURL(url);
}

// 记住/没记住
function markAsRemembered(word) {
    const wordIndex = todayReview.findIndex(w => w.word === word);
    if (wordIndex >= 0) {
        todayReview[wordIndex].status = 'remembered';
        localStorage.setItem('todayReview', JSON.stringify(todayReview));
    }
}

function markAsForgotten(word) {
    const wordIndex = todayReview.findIndex(w => w.word === word);
    if (wordIndex >= 0) {
        todayReview[wordIndex].status = 'forgotten';
        localStorage.setItem('todayReview', JSON.stringify(todayReview));
    }
}

// 从单词本中移除
function removeFromWordbook(word) {
    wordbook = wordbook.filter(w => w.word !== word);
    localStorage.setItem('wordbook', JSON.stringify(wordbook));
    displayWordbook();
}

// 初始化
displayWordbook();
displayReview();
