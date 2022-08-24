const WEER_API = 'http://weerlive.nl/api/json-data-10min.php?key=d5fce13661&locatie=zeldert';
const IMG_BINDINGS = [
    ['windkracht-kaart', 'http://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/windkracht.png'],
    ['temperatuur-kaart', 'http://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/temperatuur.png'],
    ['buien-kaart', 'https://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/neerslagradar/WWWRADARBFT_loop.gif'],
];
const DATA_BINDINGS = [
    ['verw', 'verw'],
    ['temp', 'temp'],
    ['sup', 'sup'],
    ['sunder', 'sunder'],
    ['tmin', 'd0tmin'],
    ['tmax', 'd0tmax'],
    ['windk', 'd0windk'],
    ['windr', 'windr'],
    ['samenv', 'samenv'],
];

function showIcon(src) {
    document.getElementById('icon').src = './icons/' + src + '.png';
}

function toggleAlarmtxt(alarmtxt) {
    if (alarmtxt.length > 0) {
        const alarmBlock = document.querySelector('.alarm');
        alarmBlock.style.display = 'block';
        document.getElementById('alarmtxt').innerText = alarmtxt;
        document.querySelector('.closer').addEventListener(
            'click', () => alarmBlock.style.display = 'none'
        )
    }
}

function bindData(data) {
    for (const [id, field] of DATA_BINDINGS) {
        document.getElementById(id).innerText = data[field];
    }
}

function bindImg() {
    for (const [id, url] of IMG_BINDINGS) {
        document.getElementById(id).src = url;
    }
}

function fillForm(data) {
    toggleAlarmtxt(data.alarmtxt);
    bindData(data);
    showIcon(data.image);
}

function showKaarten() {
    document.getElementById('wait').style.display = 'none';
    const kaarten = document.getElementsByClassName('kaart');
    for (let i = 0; i < kaarten.length; i++) {
        kaarten[i].style.visibility = 'visible';
    }
}

function fetchWeather() {
    bindImg();
    document.getElementById('windkracht-kaart')
        .addEventListener('load', showKaarten);
    fetch(WEER_API)
        .then(res => res.json())
        .then((result) => {
                fillForm(result.liveweer[0]);
            },
            (error) => {
                console.error(error)
            }
        );
}

document.addEventListener('DOMContentLoaded',  () => {
    fetchWeather();
});
