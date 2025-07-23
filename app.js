let balance = 0;
let currentBet = 10;

document.addEventListener('DOMContentLoaded', function() {
    const tg = window.Telegram.WebApp;
    tg.expand();

    // Запрашиваем баланс у бота
    tg.sendData(JSON.stringify({
        action: 'get_balance'
    }));

    // Слушаем ответы от бота
    tg.onEvent('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.action === 'update_balance') {
                updateBalance(data.balance);
            }
        } catch (e) {
            console.error('Error parsing message:', e);
        }
    });
});

function updateBalance(newBalance) {
    balance = newBalance;
    document.getElementById('balance').textContent = balance;

    // Обновляем максимальную ставку
    const betInput = document.getElementById('betAmount');
    if (parseInt(betInput.value) > balance) {
        betInput.value = balance;
        currentBet = balance;
    }
    betInput.max = balance;
}

function changeBet(amount) {
    const betInput = document.getElementById('betAmount');
    let newBet = parseInt(betInput.value) + amount;

    if (newBet < 1) newBet = 1;
    if (newBet > balance) newBet = balance;
    if (newBet > 1000) newBet = 1000;

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
        // Отправляем данные о ставке в бота
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