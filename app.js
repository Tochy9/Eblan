let balance = 0;
const tg = window.Telegram.WebApp;

document.addEventListener('DOMContentLoaded', function() {
    tg.expand();
    updateBalance(0);

    // Запрашиваем баланс у бота
    tg.sendData(JSON.stringify({action: "get_balance"}));

    // Обработчик кнопки
    document.getElementById('spinBtn').addEventListener('click', spin);
});

function updateBalance(newBalance) {
    balance = newBalance;
    document.getElementById('balance').textContent = balance;
    document.getElementById('spinBtn').disabled = balance < 10;
}

function spin() {
    if (balance < 10) {
        alert("Недостаточно звёзд для ставки!");
        return;
    }

    const slots = document.querySelectorAll('.slot');
    const spinBtn = document.getElementById('spinBtn');

    // Анимация вращения
    spinBtn.disabled = true;
    slots.forEach(slot => {
        slot.classList.add('spinning');
        slot.textContent = ['⭐', '🌕', '💎', '🔮', '✨'][Math.floor(Math.random() * 5)];
    });

    // Отправляем запрос на спин
    setTimeout(() => {
        tg.sendData(JSON.stringify({
            action: "spin",
            amount: 10
        }));

        // Визуальные эффекты
        slots.forEach(slot => {
            slot.classList.remove('spinning');
            slot.classList.add('win-animation');
        });

        setTimeout(() => {
            slots.forEach(slot => slot.classList.remove('win-animation'));
            spinBtn.disabled = balance < 10;
        }, 2000);

    }, 2000);
}

// Обработчик сообщений от бота
tg.onEvent('message', (msg) => {
    try {
        const data = JSON.parse(msg);
        if (data.action === 'update_balance') {
            updateBalance(data.balance);
        }
    } catch (e) {
        console.error('Error parsing message:', e);
    }
});