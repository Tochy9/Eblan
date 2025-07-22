document.addEventListener('DOMContentLoaded', function() {
    const tg = window.Telegram.WebApp;
    tg.expand();

    // Элементы интерфейса
    const balanceElement = document.getElementById('balance');
    const spinBtn = document.getElementById('spinBtn');
    const slots = [
        document.getElementById('slot1'),
        document.getElementById('slot2'),
        document.getElementById('slot3')
    ];

    let balance = 0;

    // Инициализация
    updateBalance(0);
    requestBalance();

    // Обработчик кнопки
    spinBtn.addEventListener('click', function() {
        if (balance < 10) {
            showMessage('Недостаточно очков для ставки!');
            return;
        }

        startSpinAnimation();
        sendSpinRequest();
    });

    // Функции
    function updateBalance(newBalance) {
        balance = newBalance;
        balanceElement.textContent = balance;
        spinBtn.disabled = balance < 10;
    }

    function requestBalance() {
        tg.sendData(JSON.stringify({
            action: 'get_balance'
        }));
    }

    function startSpinAnimation() {
        spinBtn.disabled = true;
        slots.forEach(slot => {
            slot.classList.add('spinning');
            slot.textContent = '🎰';
        });
    }

    function sendSpinRequest() {
        tg.sendData(JSON.stringify({
            action: 'spin'
        }));
    }

    function stopSpinAnimation(winAmount) {
        slots.forEach(slot => {
            slot.classList.remove('spinning');
            const symbols = ['⭐', '🍒', '🍋', '🍊', '🍇', '7️⃣'];
            slot.textContent = symbols[Math.floor(Math.random() * symbols.length)];

            if (winAmount > 0) {
                slot.classList.add('win-animation');
            }
        });

        if (winAmount > 0) {
            setTimeout(() => {
                slots.forEach(slot => slot.classList.remove('win-animation'));
            }, 1000);
        }
    }

    function showMessage(text) {
        const message = document.createElement('div');
        message.className = 'message';
        message.textContent = text;
        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    // Обработчик сообщений от бота
    tg.onEvent('webAppDataReceived', function(event) {
        try {
            const data = JSON.parse(event.data);

            if (data.action === 'balance') {
                updateBalance(data.balance);
            }
            else if (data.action === 'spin_result') {
                stopSpinAnimation(data.win);
                updateBalance(data.balance);
                showMessage(data.win > 0 ? `Вы выиграли ${data.win} очков!` : 'Попробуйте ещё раз!');
            }
            else if (data.error) {
                showMessage(data.error);
                slots.forEach(slot => {
                    slot.classList.remove('spinning');
                    slot.textContent = '⭐';
                });
                spinBtn.disabled = balance < 10;
            }
        } catch (e) {
            console.error('Error parsing data:', e);
        }
    });
});