const WEER_API = 'http://weerlive.nl/api/json-10min.php?key=d5fce13661&locatie=zeldert';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
// const apiKey = 'd5fce13661';
// https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors
// nb kwestie speelt sinds chrome update naar 85.0.4164.3
let weer;

function fetchWeather(sendResponse) {
    fetch(proxyUrl + WEER_API)
        .then(res => res.json())
        .then((result) => {
            // console.log('result', result);
            weer = result.liveweer[0];
            sendResponse(weer);
            chrome.runtime.sendMessage({result: weer},
                () => {}
            );
            },
            (error) => {
                console.error(error)
            }
        );
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.request) {
        switch(req.request) {
            case 'fetchWeather':
                fetchWeather(sendResponse);
                break;
            default:
                sendResponse('invalid request:' + req.request);
                break;
        }
    } else {
        sendResponse('no request handled');
    }
    return true;
    // return Promise.resolve("Dummy response to keep the console quiet");
});
