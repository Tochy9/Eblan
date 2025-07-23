let balance = 0;

Telegram.WebApp.ready();
Telegram.WebApp.expand();

// Получаем баланс
function getBalance() {
    Telegram.WebApp.sendData(JSON.stringify({ action: 'get_balance' }));
}

// Обработчик ответов
Telegram.WebApp.onEvent('message', (event) => {
    try {
        const data = JSON.parse(event);
        if (data.balance !== undefined) {
            balance = data.balance;
            document.getElementById('balance').textContent = balance;
        }
    } catch (e) {
        console.error('Error:', e);
    }
});

// Ставка
function placeBet(amount) {
    if (balance >= amount) {
        Telegram.WebApp.sendData(JSON.stringify({
            action: 'place_bet',
            amount: amount
        }));
    } else {
        alert('Недостаточно очков!');
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', getBalance);