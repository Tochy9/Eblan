let balance = 0;
let currentBet = 10;

document.addEventListener('DOMContentLoaded', function() {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.enableClosingConfirmation();

    // Запрашиваем баланс при загрузке
    requestBalance();

    // Обработчик входящих сообщений от бота
    tg.onEvent('viewportChanged', () => {
        // При изменении размера окна проверяем баланс
        requestBalance();
    });
});

function requestBalance() {
    const tg = window.Telegram.WebApp;
    tg.sendData(JSON.stringify({
        action: 'get_balance'
    }));
}

// Обработчик сообщений от бота
Telegram.WebApp.onEvent('message', (eventData) => {
    try {
        const data = JSON.parse(eventData);
        if (data.action === 'update_balance') {
            updateBalance(data.balance);
        }
    } catch (e) {
        console.error('Error parsing message:', e);
    }
});

function updateBalance(newBalance) {
    balance = parseInt(newBalance) || 0;
    document.getElementById('balance').textContent = balance;

    // Обновляем максимальную ставку
    const betInput = document.getElementById('betAmount');
    const currentValue = parseInt(betInput.value) || 10;

    if (currentValue > balance) {
        betInput.value = Math.min(balance, 1000);
        currentBet = parseInt(betInput.value);
    }

    betInput.max = Math.min(balance, 1000);
}

function changeBet(amount) {
    const betInput = document.getElementById('betAmount');
    let newBet = (parseInt(betInput.value) || 10) + amount;

    newBet = Math.max(1, Math.min(newBet, balance, 1000));

    betInput.value = newBet;
    currentBet = newBet;
}

function spin() {
    if (currentBet > balance) {
        alert('Недостаточно очков для ставки!');
        return;
    }

    const spinBtn = document.getElementById('spinBtn');
    spinBtn.disabled = true;

    const slots = document.querySelectorAll('.slot');
    slots.forEach(slot => {
        slot.classList.add('spinning');
        slot.textContent = '🎰';
    });

    setTimeout(() => {
        const tg = window.Telegram.WebApp;
        tg.sendData(JSON.stringify({
            action: 'place_bet',
            amount: currentBet
        }));

        // Визуализация результата
        slots.forEach(slot => {
            slot.classList.remove('spinning');
            slot.textContent = ['⭐', '🍒', '🍋'][Math.floor(Math.random() * 3)];
        });

        spinBtn.disabled = false;
    }, 2000);
}