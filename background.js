const WEER_API = 'http://weerlive.nl/api/json-10min.php?locatie=zeldert';

let weer;

function fetchWeather() {
    fetch(WEER_API)
        .then(res => res.json())
        .then((result) => {
            weer = result.liveweer[0];
            chrome.runtime.sendMessage({result: weer},
                () => {});
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
                sendResponse({data: fetchWeather()});
                break;
            case 'getWeather':
                sendResponse({data: weer});
                break;
            default:
                sendResponse('invalid request:' + req.request);
                break;
        }
    } else {
        sendResponse('no request handled');
    }
});
