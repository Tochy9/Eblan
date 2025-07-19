let balance = 0;
const tg = window.Telegram.WebApp;

document.addEventListener('DOMContentLoaded', function() {
    tg.expand();
    tg.sendData(JSON.stringify({action: 'get_balance'}));

    tg.onEvent('mainButtonClicked', function() {
        tg.sendData(JSON.stringify({action: 'spin'}));
    });

    document.getElementById('spinBtn').addEventListener('click', spin);
});

function updateBalance(newBalance) {
    balance = newBalance;
    document.getElementById('balance').textContent = balance;

    if (balance < 10) {
        document.getElementById('spinBtn').disabled = true;
        document.getElementById('spinBtn').style.opacity = '0.7';
    } else {
        document.getElementById('spinBtn').disabled = false;
        document.getElementById('spinBtn').style.opacity = '1';
    }
}

function spin() {
    if (balance < 10) {
        alert('Недостаточно очков для ставки!');
        return;
    }

    const slots = document.querySelectorAll('.slot');
    slots.forEach(slot => {
        slot.classList.add('spinning');
        slot.textContent = '🎰';
    });

    setTimeout(() => {
        tg.sendData(JSON.stringify({action: 'spin'}));

        slots.forEach(slot => {
            slot.classList.remove('spinning');
            const symbols = ['⭐', '🍒', '🍋', '🍊', '🍇', '7️⃣'];
            slot.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            slot.classList.add('win-animation');
        });

        setTimeout(() => {
            slots.forEach(slot => slot.classList.remove('win-animation'));
        }, 1000);
    }, 2000);
}

// Обработка сообщений от бота
tg.onEvent('messageReceived', function(msg) {
    const data = JSON.parse(msg);
    if (data.action === 'update_balance') {
        updateBalance(data.balance);
    }
});