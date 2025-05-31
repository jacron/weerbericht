// http://weerlive.nl/
// const locatie = 'zeldert';
import {plotVandaag, plotWeek} from "./plot.js";
import {fillVandaag, fillWeek} from "./table.js";
import {getTime} from "./util.js";

const apikey = 'd5fce13661';
const endpoint = 'weerlive_api_v2.php';
const WEER_LIVE_API = `https://weerlive.nl/api/${endpoint}?key=${apikey}&locatie=`;  // ${locatie}`;
const IMG_BINDINGS = [
    ['vandaag-kaart', 'https://cdn.knmi.nl/knmi/map/current/weather/forecast/kaart_verwachtingen_Vandaag_dag.gif'],
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

const MENU_VANDAAG = 'menu_vandaag';
const MENU_BUIEN = 'menu_buien';
const MENU_WIND = 'menu_wind';
const MENU_TEMP = 'menu_temp';

const MENU_SEQUENCE = [
    MENU_VANDAAG,   // 0
    MENU_TEMP,      // 1
    MENU_BUIEN,     // 2
    MENU_WIND       // 3
];

const DIV_TIJD = 'div_tijd';
const kaart_vandaag = document.getElementById('vandaag-kaart');
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

function nextMenuOption(actueleOptie) {
    const idx = MENU_SEQUENCE.indexOf(actueleOptie);
    // idx === -1  betekent: ‘onbekende huidigeOptie’ ⇒ start opnieuw bij 0
    const nextIndex = (idx + 1) % MENU_SEQUENCE.length || 0;
    return MENU_SEQUENCE[nextIndex];
}

function prevMenuOption(actueleOptie) {
    const idx = MENU_SEQUENCE.indexOf(actueleOptie);
    const len = MENU_SEQUENCE.length;
    // Als idx -1 is, pak len-1; anders modulo-wrap naar links
    const prevIndex = (idx === -1 ? len - 1
        : (idx - 1 + len) % len);
    return MENU_SEQUENCE[prevIndex];
}

function onKeydown(e) {
    switch (e.key) {
        case 'ArrowRight':
            actueleOptie = nextMenuOption(actueleOptie);
            showMenu(actueleOptie);
            break;
        case 'ArrowLeft':
            actueleOptie = prevMenuOption(actueleOptie);
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
    hide(kaart_vandaag);
    hide(kaart_buien);
    hide(kaart_temp);
    hide(kaart_wind);
}

function getActiveKaart(id) {
    switch(id) {
        case MENU_WIND:
            return kaart_wind;
        case MENU_TEMP:
            return kaart_temp;
        case MENU_VANDAAG:
            return kaart_vandaag;
        case MENU_BUIEN:
            return kaart_buien;
        default:
            return null;
    }
}

function showMenu(id) {
    hideKaarten();

    if (id=== MENU_WIND || id === MENU_TEMP) {
        show(hide_legend);
        show(weertabel);
    } else {
        hide(hide_legend);
        hide(weertabel);
    }
    show(getActiveKaart(id));
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

function toggleDisplayVandaag(display) {
    const verwachtingenVandaag = document.querySelector('.verwachtingen-vandaag');
    const canvasWind = document.getElementById('chartWindVandaag');
    const canvasTempVandaag = document.getElementById('chartTempVandaag');
    verwachtingenVandaag.style.display = display;
    canvasWind.style.display = display;
    canvasTempVandaag.style.display = display;
}

function toggleDisplayWeek(display) {
    const verwachtingenWeek = document.querySelector('.verwachtingen-week');
    const canvasTempWeek = document.getElementById('chartTempWeek');
    const canvasWindWeek = document.getElementById('chartWindWeek');
    verwachtingenWeek.style.display = display;
    canvasTempWeek.style.display = display;
    canvasWindWeek.style.display = display;
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
    bindKeys();
    showWindKrachtKaart();
}

function getLocation(cb){          // cb({lat, lon} | null)
    const ok = pos => cb({lat:pos.coords.latitude, lon:pos.coords.longitude});
    const ko = () => fetch('https://ipapi.co/json/')
        .then(r=>r.json())
        .then(d=>{
            console.log(`Using fallback location: ${d.city}, ${d.region}, ${d.country_name}`);
            cb({lat:d.latitude, lon:d.longitude})
        })
        .catch(()=>cb(null));

    if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(ok, ko, {timeout:8000});
    } else {
        ko().then();
    }
}

function detectExtension() {
    const inExtension = location.protocol === 'chrome-extension:' || (window.chrome?.runtime?.id);
    if (inExtension) {
        document.documentElement.classList.add('ext');
    } else {
        document.documentElement.classList.remove('ext');
    }
}

document.addEventListener('DOMContentLoaded',  () => {
    init();
    getLocation((loc) => {
        if (loc) {
            fetchWeather(`${loc.lat},${loc.lon}`);
        } else {
            console.error('Could not determine location; using Hoogland as default');
            fetchWeather(`Hoogland`);
        }
    });
    detectExtension();
});

// setInterval(() => window.location.reload(), WEERBERICHT_TIMEOUT);

