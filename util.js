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

export {tweedeWoord, dag, dagVanDeWeek, getTime}
