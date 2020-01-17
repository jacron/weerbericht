const REACT_APP_WEER_API = 'http://weerlive.nl/api/json-10min.php?locatie=zeldert';
const REACT_APP_KNMI_WINDKRACHT_KAART = 'http://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/windkracht.png';
const REACT_APP_KNMI_TEMPERATUUR_KAART = 'http://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/temperatuur.png';

function shortLocaleTime() {
    const days = [
        'Zon', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za',
    ];
    const now = new Date();
    const day = days[now.getDay()];
    const time = now.toLocaleTimeString('nl-NL');
    const nparts = time.split(':');
    return day + ' ' + nparts[0] + ':' + nparts[1] + ' u.';
}

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
    if (type === 'wind') return REACT_APP_KNMI_WINDKRACHT_KAART;
    if (type === 'temperatuur') return REACT_APP_KNMI_TEMPERATUUR_KAART;
}

function fillForm(data) {
    const bindings = [
        // ['plaats', 'plaats'],
        ['verw', 'verw'],
        ['temp', 'temp'],
        // ['d0tmin', 'd0tmin'],
        // ['d0tmax', 'd0tmax'],
        // ['winds', 'winds'],
        // ['windr', 'windr'],
        ['sup', 'sup'],
        ['sunder', 'sunder'],
    ];
    for (const [id, field] of bindings) {
        document.getElementById(id).innerText = data[field];
    }
    // document.getElementById('alarmtxt').innerText
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
    ];
    for (const [id, fun, arg] of imgBindings) {
        document.getElementById(id).src = fun(arg);
    }
    // document.getElementById('icon').src = getIcon(data.image);
}

function initForm() {
    fetch(REACT_APP_WEER_API)
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
