const kaart = {
    buien: 'https://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/neerslagradar/WWWRADARBFT_loop.gif',
    wind: 'http://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/windkracht.png',
    temperatuur: 'http://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/temperatuur.png',
};

const WEER_API = 'http://weerlive.nl/api/json-data-10min.php?key=d5fce13661&locatie=zeldert';
const proxyUrl = '';  // https://cors-anywhere.herokuapp.com/';
// const apiKey = 'd5fce13661';
// https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors
// nb kwestie speelt sinds chrome update naar 85.0.4164.3

function getIcon(image) {
    return './icons/' + image + '.png';
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
        ['tmin', 'd0tmin'],
        ['tmax', 'd0tmax'],
        ['windk', 'd0windk'],
        ['windr', 'windr'],
    ];
    for (const [id, field] of bindings) {
        document.getElementById(id).innerText = data[field];
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

function fetchWeather() {
    fetch(proxyUrl + WEER_API)
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
