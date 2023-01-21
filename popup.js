// http://weerlive.nl/
const locatie = 'zeldert';
const apikey = 'd5fce13661';
const endpoint = 'json-data-10min.php';
const WEER_LIVE_API = `https://weerlive.nl/api/${endpoint}?key=${apikey}&locatie=${locatie}`;
const IMG_BINDINGS = [
    ['windkracht-kaart', 'https://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/windkracht.png'],
    ['temperatuur-kaart', 'https://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/temperatuur.png'],
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
    ['plaats', 'plaats']
];
const MENU_BUIEN = 'menu_buien';
const MENU_WIND = 'menu_wind';
const MENU_TEMP = 'menu_temp';
const kaart_buien = document.getElementById('buien-kaart');
const kaart_wind = document.getElementById('windkracht-kaart');
const kaart_temp = document.getElementById('temperatuur-kaart');
const hide_legend = document.querySelector('.hide-legenda');
const weertabel = document.querySelector('.weertabel');

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

/**
 *
 * @param data {{plaats}}
 */
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

function hide(element) {
    element.style.display = 'none';
}

function show(element) {
    element.style.display = 'block';
}

function hideKaarten() {
    hide(kaart_buien);
    hide(kaart_temp);
    hide(kaart_wind);
}

function doMenu(e) {
    console.log(e);
    hideKaarten();
    switch(e.target.getAttribute('id')) {
        case MENU_WIND:
            show(kaart_wind);
            show(hide_legend);
            show(weertabel);
            break;
        case MENU_TEMP:
            show(kaart_temp);
            show(hide_legend);
            show(weertabel);
            break;
        case MENU_BUIEN:
            show(kaart_buien);
            hide(hide_legend);
            hide(weertabel);
            break;
    }
}

function bindMenu() {
    document.getElementById(MENU_BUIEN).addEventListener('click', doMenu);
    document.getElementById(MENU_TEMP).addEventListener('click', doMenu);
    document.getElementById(MENU_WIND).addEventListener('click', doMenu);
}

/**
 *
 * @param data {{alarmtxt, image}}
 */
function fillForm(data) {
    toggleAlarmtxt(data.alarmtxt);
    bindData(data);
    showIcon(data.image);
}

function showWindKrachtKaart() {
    kaart_wind
        .addEventListener('load', (e) => {
            document.getElementById('wait').style.display = 'none';
            show(document.getElementById('windkracht-kaart'));
        });

}

/**
 *
 * @param result {{liveweer:[]}}
 */
function getLiveweer(result) {
    // console.log(result);
    fillForm(result.liveweer[0]);
}

function onError(error) {
    console.error(error);
}

function fetchWeather() {
    bindImg();
    bindMenu();
    showWindKrachtKaart();
    fetch(WEER_LIVE_API)
        .then(res => res.json())
        .then(getLiveweer, onError);
}

document.addEventListener('DOMContentLoaded',  () => {
    fetchWeather();
});
