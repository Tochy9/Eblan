let balance = 0;
let currentBet = 10;

document.addEventListener('DOMContentLoaded', function() {
    const tg = window.Telegram.WebApp;
    tg.expand();

    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        updateBalance(1000); // Временное значение, замените на реальный запрос к боту
    }

    document.getElementById('betAmount').value = currentBet;
});

function updateBalance(newBalance) {
    balance = newBalance;
    document.getElementById('balance').textContent = balance;

    // Синхронизация с Telegram
    const tg = window.Telegram.WebApp;
    tg.sendData(JSON.stringify({
        action: 'update_balance',
        balance: balance
    }));
}

function changeBet(amount) {
    const betInput = document.getElementById('betAmount');
    let newBet = parseInt(betInput.value) + amount;

    if (newBet < 1) newBet = 1;
    if (newBet > 1000) newBet = 1000;
    if (newBet > balance) newBet = balance;

    betInput.value = newBet;
    currentBet = newBet;
}

function spin() {
    if (currentBet > balance) {
        alert('Недостаточно звёзд для ставки!');
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
            action: 'bet',
            amount: currentBet
        }));

        updateBalance(balance - currentBet);

        slots.forEach(slot => {
            slot.classList.remove('spinning');
            slot.textContent = ['⭐', '🍒', '🍋'][Math.floor(Math.random() * 3)];
        });

        spinBtn.disabled = false;
    }, 2000);
}