// http://weerlive.nl/
const WEERBERICHT_TIMEOUT = 5 * 60000;
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

const DIV_TIJD = 'div_tijd';
const kaart_buien = document.getElementById('buien-kaart');
const kaart_wind = document.getElementById('windkracht-kaart');
const kaart_temp = document.getElementById('temperatuur-kaart');
const hide_legend = document.querySelector('.hide-legenda');
const weertabel = document.querySelector('.weertabel');

let actueleOptie = MENU_WIND;

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

function isVisible(element) {
    return element.style.display === 'block';
}

function nextMenuOption() {
    /* temp > buien > wind */
    if (actueleOptie === MENU_WIND) {
        return MENU_TEMP;
    } else if (actueleOptie === MENU_TEMP) {
        return MENU_BUIEN;
    } else if (actueleOptie === MENU_BUIEN) {
        return MENU_WIND;
    }
}

function prevMenuOption() {
    /* temp > buien > wind */
    if (actueleOptie === MENU_WIND) {
        return MENU_BUIEN;
    } else if (actueleOptie === MENU_BUIEN) {
        return MENU_TEMP;
    } else if (actueleOptie === MENU_TEMP) {
        return MENU_WIND;
    }
}

function onKeydown(e) {
    switch (e.key) {
        case 'ArrowRight':
            actueleOptie = nextMenuOption();
            showMenu(actueleOptie);
            break;
        case 'ArrowLeft':
            actueleOptie = prevMenuOption();
            showMenu(actueleOptie);
            break;
    }
}

function bindKeys() {
    document.body.addEventListener('keydown', onKeydown);
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

function deselectMenuOpties() {
    document.getElementById(MENU_TEMP).classList.remove('active');
    document.getElementById(MENU_BUIEN).classList.remove('active');
    document.getElementById(MENU_WIND).classList.remove('active');
}

function selectMenOption(id) {
    document.getElementById(id).classList.add('active');
}

function showMenu(id) {
    hideKaarten();
    show(hide_legend);
    show(weertabel);

    deselectMenuOpties();
    selectMenOption(id);

    switch(id) {
        case MENU_WIND:
            show(kaart_wind);
            break;
        case MENU_TEMP:
            show(kaart_temp);
            break;
        case MENU_BUIEN:
            show(kaart_buien);
            hide(hide_legend);
            hide(weertabel);
            break;
    }
}

function doMenu(e) {
    actueleOptie = e.target.getAttribute('id');
    showMenu(actueleOptie);
}

function bindMenu() {
    document.getElementById(MENU_BUIEN).addEventListener('click', doMenu);
    document.getElementById(MENU_TEMP).addEventListener('click', doMenu);
    document.getElementById(MENU_WIND).addEventListener('click', doMenu);
}

function fillZero(n) {
    if (n< 10) {
        return '0' + n;
    } else {
        return n;
    }
}

function getTime() {
    const today = new Date();
    return today.getHours() + ":" + fillZero(today.getMinutes()) + " u.";
}

function showTime() {
    document.getElementById(DIV_TIJD).innerText = getTime();
}

/**
 *
 * @param data {{alarmtxt, image}}
 */
function fillForm(data) {
    toggleAlarmtxt(data.alarmtxt);
    bindData(data);
    showIcon(data.image);
    showTime();
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
    fillForm(result.liveweer[0]);
}

function onError(error) {
    console.error(error);
}

function fetchWeather() {
    bindImg();
    bindMenu();
    bindKeys();
    showWindKrachtKaart();
    fetch(WEER_LIVE_API)
        .then(res => res.json())
        .then(getLiveweer, onError);
}

document.addEventListener('DOMContentLoaded',  () => {
    fetchWeather();
});

setInterval(() => window.location.reload(), WEERBERICHT_TIMEOUT);
