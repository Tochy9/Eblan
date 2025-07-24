let balance = 0;
let user_id = null;

// Инициализация WebApp
Telegram.WebApp.ready();
Telegram.WebApp.expand();

// Получаем user_id из параметров запуска
user_id = Telegram.WebApp.initDataUnsafe.user?.id;

// Функция для запроса баланса
function getBalance() {
    if (user_id) {
        Telegram.WebApp.sendData(JSON.stringify({
            action: 'get_balance',
            user_id: user_id
        }));
    }
}

// Обработчик ответов от бота
Telegram.WebApp.onEvent('message', (event) => {
    try {
        const data = JSON.parse(event);
        if (data.action === 'update_balance' && data.balance !== undefined) {
            balance = data.balance;
            document.getElementById('balance').textContent = balance;
        }
        else if (data.action === 'spin_result') {
            // Обновляем баланс
            balance = data.balance;
            document.getElementById('balance').textContent = balance;

            // Анимация слотов
            const slots = document.querySelectorAll('.slot');
            slots.forEach((slot, i) => {
                slot.textContent = data.slots[i];
                slot.classList.add('spinning');
                setTimeout(() => {
                    slot.classList.remove('spinning');
                }, 1000);
            });

            // Уведомление о результате
            if (data.result === 'win') {
                alert(`Вы выиграли ${data.win_amount} очков!`);
                document.querySelector('.slot-machine').classList.add('win-animation');
                setTimeout(() => {
                    document.querySelector('.slot-machine').classList.remove('win-animation');
                }, 2000);
            } else {
                alert('Повезёт в следующий раз!');
                document.querySelector('.slot-machine').classList.add('lose-animation');
                setTimeout(() => {
                    document.querySelector('.slot-machine').classList.remove('lose-animation');
                }, 1000);
            }
        }
    } catch (e) {
        console.error('Error:', e);
    }
});

// Функция для изменения ставки
function changeBet(amount) {
    const betInput = document.getElementById('betAmount');
    let currentBet = parseInt(betInput.value);
    currentBet += amount;
    if (currentBet < 1) currentBet = 1;
    if (currentBet > 1000) currentBet = 1000;
    betInput.value = currentBet;
}

// Функция для запуска слота
function spin() {
    const betAmount = parseInt(document.getElementById('betAmount').value);

    if (balance < betAmount) {
        alert('Недостаточно очков!');
        return;
    }

    // Анимация вращения
    const slots = document.querySelectorAll('.slot');
    slots.forEach(slot => {
        slot.classList.add('spinning');
    });

    // Отправляем запрос на списание очков и получение результата
    Telegram.WebApp.sendData(JSON.stringify({
        action: 'spin',
        user_id: user_id,
        bet_amount: betAmount
    }));
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', getBalance);