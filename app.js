let balance = 0;
const tg = window.Telegram.WebApp;

document.addEventListener('DOMContentLoaded', function() {
    tg.expand();
    tg.BackButton.hide();

    // Запрашиваем баланс у бота
    tg.sendData(JSON.stringify({action: 'get_balance'}));

    document.getElementById('spinBtn').addEventListener('click', spin);
});

function updateBalance(newBalance) {
    balance = newBalance;
    document.getElementById('balance').textContent = balance;

    if (balance < 10) {
        document.getElementById('spinBtn').disabled = true;
    } else {
        document.getElementById('spinBtn').disabled = false;
    }
}

function spin() {
    if (balance < 10) {
        showMessage('Недостаточно очков для ставки!');
        return;
    }

    const slots = document.querySelectorAll('.slot');
    slots.forEach(slot => {
        slot.classList.add('spinning');
        slot.textContent = '🎰';
    });

    document.getElementById('spinBtn').disabled = true;

    // Отправляем запрос на спин
    tg.sendData(JSON.stringify({action: 'spin'}));
}

function showMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'message twinkle';
    msg.textContent = text;
    document.body.appendChild(msg);

    setTimeout(() => {
        msg.remove();
    }, 3000);
}

// Обработка сообщений от бота
function handleMessage(event) {
    try {
        const data = JSON.parse(event.data);

        if (data.action === 'update_balance') {
            updateBalance(data.balance);
        }
        else if (data.action === 'spin_result') {
            const slots = document.querySelectorAll('.slot');
            slots.forEach(slot => {
                slot.classList.remove('spinning');
                const symbols = ['⭐', '🍒', '🍋', '🍊', '🍇', '7️⃣'];
                slot.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                slot.classList.add('win-animation');
            });

            updateBalance(data.balance);
            document.getElementById('spinBtn').disabled = balance < 10;

            setTimeout(() => {
                slots.forEach(slot => slot.classList.remove('win-animation'));

                if (data.win > 0) {
                    showMessage(`Вы выиграли ${data.win} очков!`);
                } else {
                    showMessage('Попробуйте ещё раз!');
                }
            }, 1000);
        }
        else if (data.startsWith('error:')) {
            showMessage(data.substring(6));
        }
    } catch (e) {
        console.error('Error parsing message:', e);
    }
}

// Подписываемся на сообщения от бота
window.addEventListener('message', handleMessage);