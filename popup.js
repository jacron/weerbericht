const WEER_API = 'http://weerlive.nl/api/json-10min.php?locatie=zeldert';
const kaart = {
    buien: 'https://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/neerslagradar/WWWRADARBFT_loop.gif',
    wind: 'http://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/windkracht.png',
    temperatuur: 'http://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/temperatuur.png',
};

function getIcon(image) {
    return './icons/' + image + '.png';
}

function getAlarm(data) {
    if (data.alarm === '1') {
        document.getElementById('alarmtxt').style.display = 'block';
        return data.alarmtxt;
    } else {
        document.getElementById('alarmtxt').style.display = 'none';
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
        ['alarmtxt', getAlarm, data],
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
}

function initForm() {
    fetch(WEER_API)
        .then(res => res.json())
        .then((result) => {
            fillForm(result.liveweer[0])
            },
            (error) => {
                console.error(error)
            }
        )
}

document.addEventListener('DOMContentLoaded',  () => {
    initForm();
});
