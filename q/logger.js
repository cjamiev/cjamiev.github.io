let logger = loadFromLocalStorage('logger');
let currentDay = new Date();
const options = { year: 'numeric', month: 'long', day: 'numeric' };

function saveLogger() {
    saveToLocalStorage('logger', logger);
}

function addLogger() {
    const valueInput = document.getElementById('valueInput');
    const value = valueInput.value.trim();

    const log = {
        id: getCurrentDate(),
        value
    };

    const matched = logger.find(l => l.id == log.id)
    if (matched) {
        logger = logger.map(l => {
            if (l.id == log.id) {
                return log;
            } else {

                return l
            }
        });
    } else {
        logger.push(log);
    }

    saveLogger();
}

function previousDate() {
    currentDay.setDate(currentDay.getDate() - 1);
    renderCurrentDate();
}

function nextDate() {
    currentDay.setDate(currentDay.getDate() + 1);
    renderCurrentDate();
}

function getCurrentDate() {
    return currentDay.toLocaleDateString('en-US', options);
}

function renderCurrentDate() {
    const id = getCurrentDate();
    document.getElementById('current-date').innerHTML = id;
    const matched = logger.find(l => l.id == id);
    if(matched) {
        document.getElementById('valueInput').value = matched.value;
    } else {
        document.getElementById('valueInput').value = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderCurrentDate();
});
