// http://weerlive.nl/
// const locatie = 'zeldert';
import {plotVandaag, plotWeek} from "./plot.js";
import {fillVandaag, fillWeek} from "./table.js";
import {getTime} from "./util.js";

const apikey = 'd5fce13661';
const endpoint = 'weerlive_api_v2.php';
const WEER_LIVE_API = `https://weerlive.nl/api/${endpoint}?key=${apikey}&locatie=`;  // ${locatie}`;
const IMG_BINDINGS = [
    ['windkracht-kaart', 'https://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/windkracht.png'],
    ['temperatuur-kaart', 'https://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/temperatuur.png'],
    ['buien-kaart', 'https://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/neerslagradar/WWWRADARBFT_loop.gif'],
];
const LIVEWEER_DATA_BINDINGS = [
    ['verw', 'verw'],
    ['temp', 'temp'],
    ['sup', 'sup'],
    ['sunder', 'sunder'],
    ['samenvatting', 'samenv'],
    ['plaats', 'plaats']
];
const VERWACHTING_DATA_BINDINGS = [
    ['windk', 'windbft'],
    ['windr', 'windr'],
    ['tmin', 'min_temp'],
    ['tmax', 'max_temp'],
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
let liveweerResult = null;
let weekOfVandaag = '';

function showIcon(src) {
    document.getElementById('icon').src = './icons/' + src + '.png';
}

function toggleAlarmtxt(liveweer) {
    if (liveweer.alarm === '1') {
        document.querySelector('.alarm').style.display = 'block';
        document.getElementById('alarmheader').innerText = liveweer.lkop;
        document.getElementById('alarmtxt').innerText = liveweer.ltekst;
        document.querySelector('.closer').addEventListener(
            'click', () => alarmBlock.style.display = 'none'
        )
    }
}

function bind(data, bindings) {
    for (const [id, field] of bindings) {
        document.getElementById(id).innerText = data[field];
    }
}

function bindImg() {
    for (const [id, url] of IMG_BINDINGS) {
        document.getElementById(id).src = url;
    }
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
    // console.log(e.key)
    switch (e.key) {
        case 'ArrowRight':
            actueleOptie = nextMenuOption();
            showMenu(actueleOptie);
            break;
        case 'ArrowLeft':
            actueleOptie = prevMenuOption();
            showMenu(actueleOptie);
            break;
        case 'v':
            toggleVandaagVerwachtingen();
            break;
        case 'w':
            toggleWeekVerwachtingen();
            break;
        case 'Escape':
            if (hideVandaagVerwachtingen()) {
                e.preventDefault();
            }
            if (hideWeekVerwachtingen()) {
                e.preventDefault();
            }
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

function showTime() {
    document.getElementById(DIV_TIJD).innerText = getTime();
}

function fillForm(result) {
    const liveweer = result.liveweer[0];
    const verwachtingVandaag = result.wk_verw[0];
    bind(verwachtingVandaag, VERWACHTING_DATA_BINDINGS);
    bind(liveweer, LIVEWEER_DATA_BINDINGS);
    toggleAlarmtxt(liveweer);
    showIcon(liveweer.image);
    showTime();
}

function showWindKrachtKaart() {
    kaart_wind
        .addEventListener('load', () => {
            document.getElementById('wait').style.display = 'none';
            show(document.getElementById('windkracht-kaart'));
        });
}

function markButtons() {
    const btnToggleDag = document.getElementById('btnToggleDag');
    const btnToggleWeek = document.getElementById('btnToggleWeek');
    btnToggleDag.style.fontWeight = weekOfVandaag === 'vandaag' ? 'bold' : 'normal';
    btnToggleWeek.style.fontWeight = weekOfVandaag === 'week' ? 'bold' : 'normal';
}

function toggleDisplayVandaag(display) {
    const verwachtingenVandaag = document.querySelector('.verwachtingen-vandaag');
    const canvasWind = document.getElementById('chartWindVandaag');
    const canvasTempVandaag = document.getElementById('chartTempVandaag');
    verwachtingenVandaag.style.display = display;
    canvasWind.style.display = display;
    canvasTempVandaag.style.display = display;
    markButtons();
}

function toggleDisplayWeek(display) {
    const verwachtingenWeek = document.querySelector('.verwachtingen-week');
    const canvasTempWeek = document.getElementById('chartTempWeek');
    const canvasWindWeek = document.getElementById('chartWindWeek');
    verwachtingenWeek.style.display = display;
    canvasTempWeek.style.display = display;
    canvasWindWeek.style.display = display;
    markButtons();
}

function hideVandaagVerwachtingen() {
    const verwachtingenVandaag = document.querySelector('.verwachtingen-vandaag');
    const curDisplay = verwachtingenVandaag.style.display;
    if (curDisplay && curDisplay === 'block') {
        toggleDisplayVandaag('none');
        return true;
    }
    return false;
}

function hideWeekVerwachtingen() {
    const verwachtingenWeek = document.querySelector('.verwachtingen-week');
    const curDisplay = verwachtingenWeek.style.display;
    if (curDisplay && curDisplay === 'block') {
        toggleDisplayWeek('none');
        return true;
    }
    return false;
}

function toggleVandaagVerwachtingen(result) {
    if (!result) result = liveweerResult;
    const verwachtingenVandaag = document.querySelector('.verwachtingen-vandaag');
    const curDisplay = verwachtingenVandaag.style.display;
    if (!curDisplay || curDisplay === 'none') {
        if (verwachtingenVandaag.querySelector('tr') === null) {
            fillVandaag(result);
            plotVandaag(result);
        }
        weekOfVandaag = 'vandaag';
        toggleDisplayVandaag('block');
        toggleDisplayWeek('none');
    } else {
        weekOfVandaag = '';
        toggleDisplayVandaag('none');
    }
}

function toggleWeekVerwachtingen(result) {
    if (!result) result = liveweerResult;
    const verwachtingenWeek = document.querySelector('.verwachtingen-week');
    if (verwachtingenWeek.querySelector('tr') === null) {
        fillWeek(result);
        plotWeek(result);
    }
    const display = verwachtingenWeek.style.display;
    if (display === 'block') {
        weekOfVandaag = '';
        toggleDisplayWeek('none');
    } else {
        weekOfVandaag = 'week';
        toggleDisplayWeek('block');
        toggleDisplayVandaag('none');
    }
}

function getLiveweer(result) {
    console.log(result);
    liveweerResult = result;
    fillForm(result);
    const btnToggleDag = document.getElementById('btnToggleDag');
    const btnToggleWeek = document.getElementById('btnToggleWeek');
    btnToggleDag.addEventListener('click', () => {
        toggleVandaagVerwachtingen(result);
    });
    btnToggleWeek.addEventListener('click', () => {
        toggleWeekVerwachtingen(result);
    })
}

function onError(error) {
    console.error(error);
}

function fetchWeather(locatie) {
    fetch(`${WEER_LIVE_API}${locatie}`)
        .then(res => res.json())
        .then(getLiveweer, onError);
}

function init() {
    bindImg();
    bindMenu();
    bindKeys();
    showWindKrachtKaart();
}

// function fetchFromLocation() {
//     navigator.geolocation.getCurrentPosition(
//         (loc) => {
//             const { coords } = loc;
//             let { latitude, longitude } = coords;
//             fetchWeather(`${latitude},${longitude}`);
//         },
//         (err) => {
//             console.error(err);
//         }
//     );
// }

document.addEventListener('DOMContentLoaded',  () => {
    init();
    fetchWeather(`Hoogland`);
    // fetchFromLocation();
});

// setInterval(() => window.location.reload(), WEERBERICHT_TIMEOUT);

