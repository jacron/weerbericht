// http://weerlive.nl/
// const locatie = 'zeldert';
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

function tweedeWoord(s) {
    const w = s.split(' ');
    return w[1];
}

function dag(s) {
    const w = s.split('-');
    return w[0];
}

function dagVanDeWeek(s) {
    const [day, month, year] = s.split('-');
    const dayOfWeek = new Date(`${year}-${month}-${day}`).getDay();
    return ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'][dayOfWeek];
}

function makeTableCell(content) {
    const td = document.createElement('td');
    td.textContent = content;
    return td;
}

function makeTableCellR(content) {
    const td = makeTableCell(content);
    td.classList.add('numeric');
    return td;
}

const vandaagHeaders = [
    '', '', 'wind', '', 'regen', ''
];

function populateRowVandaag(tr, u) {
    tr.appendChild(makeTableCell(tweedeWoord(u.uur)));
    tr.appendChild(makeTableCellR(u.temp));
    tr.appendChild(makeTableCell(u.windr));
    tr.appendChild(makeTableCell(u.windbft));
    tr.appendChild(makeTableCellR(u.neersl));
    tr.appendChild(makeTableCell(u.image));
}

const weekHeaders = [
    'dag', '', 'max', 'min', 'wind', '', 'zon', 'regen', 'label'
];

function populateRowWeek(tr, w) {
    tr.appendChild(makeTableCell(dagVanDeWeek(w.dag)));
    tr.appendChild(makeTableCell(dag(w.dag)));
    tr.appendChild(makeTableCellR(w.max_temp));
    tr.appendChild(makeTableCellR(w.min_temp));
    tr.appendChild(makeTableCellR(w.windr));
    tr.appendChild(makeTableCell(w.windbft));
    tr.appendChild(makeTableCellR(w.zond_perc_dag));
    tr.appendChild(makeTableCellR(w.neersl_perc_dag));
    tr.appendChild(makeTableCell(w.image));
}

function makeHeaderCell(content) {
    const th = document.createElement('th');
    th.textContent = content;
    return th;
}

function headerRow(headers) {
    const tr = document.createElement('tr');
    for (const header of headers) {
        tr.appendChild(makeHeaderCell(header));
    }
    return tr;
}

function fillWeek(result) {
    const week_verwachtingen = result.wk_verw; // 5 items
    const tabel = document.getElementById("week_tabel");
    tabel.appendChild(headerRow(weekHeaders));
    for (let i = 0; i < 5; i++) {
        const tr = document.createElement('tr');
        populateRowWeek(tr, week_verwachtingen[i]);
        tabel.appendChild(tr);
    }
}

function fillVandaag(result) {
    const uur_verwachtingen = result.uur_verw;  // 24 items
    const tabel = document.getElementById("verw_tabel");
    tabel.appendChild(headerRow(vandaagHeaders));
    for (let i = 0; i < 10; i++) {
        const tr = document.createElement('tr');
        populateRowVandaag(tr, uur_verwachtingen[i]);
        tabel.appendChild(tr);
    }
}

function toggleDagVerwachtingen(result) {
    const verwachtingen = document.querySelector('.verwachtingen');
    if (verwachtingen.querySelector('tr') === null) {
        fillVandaag(result);
    }
    const display = verwachtingen.style.display;
    verwachtingen.style.display = display === 'block' ? 'none' : 'block';
}

function toggleWeekVerwachtingen(result) {
    const verwachtingen = document.querySelector('.week');
    if (verwachtingen.querySelector('tr') === null) {
        fillWeek(result);
    }
    const display = verwachtingen.style.display;
    verwachtingen.style.display = display === 'block' ? 'none' : 'block';
}

function getLiveweer(result) {
    console.log(result);
    fillForm(result);
    const btnToggleDag = document.getElementById('toggleDag');
    const btnToggleWeek = document.getElementById('toggleWeek');
    btnToggleDag.addEventListener('click', () => toggleDagVerwachtingen(result));
    btnToggleWeek.addEventListener('click', () => toggleWeekVerwachtingen(result))
}

function onError(error) {
    console.error(error);
}

function fetchWeather(locatie) {
    bindImg();
    bindMenu();
    bindKeys();
    showWindKrachtKaart();
    fetch(`${WEER_LIVE_API}${locatie}`)
        .then(res => res.json())
        .then(getLiveweer, onError);
}

function fetchFromLocation() {
    navigator.geolocation.getCurrentPosition(
        (loc) => {
            const { coords } = loc;
            let { latitude, longitude } = coords;
            fetchWeather(`${latitude},${longitude}`);
        },
        (err) => {
            console.error(err);
        }
    );
}

document.addEventListener('DOMContentLoaded',  () => {
    fetchWeather(`Hoogland`);
    // fetchFromLocation();
});

// setInterval(() => window.location.reload(), WEERBERICHT_TIMEOUT);

