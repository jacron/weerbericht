const kaart = {
    buien: 'https://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/neerslagradar/WWWRADARBFT_loop.gif',
    wind: 'http://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/windkracht.png',
    temperatuur: 'http://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/temperatuur.png',
};

function getIcon(image) {
    return './icons/' + image + '.png';
}

function getAlarm(data) {
    const alarmText = document.querySelector('.warning');
    if (data.alarm === '1') {
        alarmText.style.display = 'block';
        return data.alarmtxt;
    } else {
        alarmText.style.display = 'none';
        return null;
    }
}

function getKaart(type) {
    return kaart[type];
}

function fillForm(data) {
    const bindings = [
        ['verw', 'verw'],
        ['temp', 'temp'],
        ['sup', 'sup'],
        ['sunder', 'sunder'],
    ];
    for (const [id, field] of bindings) {
        document.getElementById(id).innerText = data[field];
    }
    const funBindings = [
        // ['created', shortLocaleTime, null],
        ['alarm-text', getAlarm, data],
    ];
    for (const [id, fun, arg] of funBindings) {
        document.getElementById(id).innerText = fun(arg);
    }
    const imgBindings = [
        ['icon', getIcon, data.image],
        ['windkracht-kaart', getKaart, 'wind'],
        ['temperatuur-kaart', getKaart, 'temperatuur'],
        ['buien-kaart', getKaart, 'buien'],
    ];
    for (const [id, fun, arg] of imgBindings) {
        document.getElementById(id).src = fun(arg);
    }
    document.querySelector('.closer').addEventListener(
        'click', () =>
            document.querySelector('.warning').style.display = 'none'
    )
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.result) {
        // console.log(req.result);
        fillForm(req.result);
    } else {
        sendResponse('no request handled');
    }
});

function initForm() {
    chrome.runtime.sendMessage({request: 'fetchWeather'},
        () => { });
}

document.addEventListener('DOMContentLoaded',  () => {
    initForm();
});
