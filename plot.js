import {dagVanDeWeek, tweedeWoord} from "./util.js";

function drawWindVandaag(tijdstippen, windkracht, windrichting) {
    const ctx = document.getElementById('chartWindVandaag').getContext('2d');
    const chartWindVandaag = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tijdstippen,
            datasets: [
                {
                    label: 'Windkracht',
                    data: windkracht,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Windkracht (BFT)'
                    },
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        generateLabels: function(chart) {
                            return [{
                                text: '',
                                fillStyle: 'rgba(75, 192, 192, .1)',
                                hidden: false,
                                lineCap: 'butt',
                                lineDash: [],
                                lineDashOffset: 0,
                                lineJoin: 'miter',
                                lineWidth: 1,
                                strokeStyle: 'rgba(75, 192, 192, .1)',
                                pointStyle: 'circle',
                                rotation: 0
                            }]
                        }
                    }
                },
                datalabels: {
                    align: 'top',
                    anchor: 'end',
                    formatter: function (value, context) {
                        return windrichting[context.dataIndex];
                    },
                    color: 'black'
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

function drawWindWeek(dagen, windkracht, windrichting) {
    const ctx = document.getElementById('chartWindWeek').getContext('2d');
    const chartWindWeek = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dagen,
            datasets: [
                {
                    label: 'Windkracht',
                    data: windkracht,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Windkracht (BFT)'
                    },
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        generateLabels: function(chart) {
                            return [{
                                text: '',
                                fillStyle: 'rgba(75, 192, 192, .1)',
                                hidden: false,
                                lineCap: 'butt',
                                lineDash: [],
                                lineDashOffset: 0,
                                lineJoin: 'miter',
                                lineWidth: 1,
                                strokeStyle: 'rgba(75, 192, 192, .1)',
                                pointStyle: 'circle',
                                rotation: 0
                            }]
                        }
                    }
                },
                datalabels: {
                    align: 'top',
                    anchor: 'end',
                    formatter: function (value, context) {
                        return windrichting[context.dataIndex];
                    },
                    color: 'black'
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

function drawTempVandaag(tijdstippen, temperaturen) {
    const ctx = document.getElementById('chartTempVandaag').getContext('2d');
    const chartTempVandaag = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tijdstippen,
            datasets: [
                {
                    label: 'Temperatuur (°C)',
                    data: temperaturen,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Temperatuur (°C)'
                    },
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function drawTempWeek(dagen, temperaturen) {
    const ctx = document.getElementById('chartTempWeek').getContext('2d');
    const chartTempWeek = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dagen,
            datasets: [
                {
                    label: 'Temperatuur (°C)',
                    data: temperaturen,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Temperatuur (°C)'
                    },
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function plotVandaag(result) {
    const uur_verwachtingen = result.uur_verw;  // 24 items
    const tijdstippen = [];
    const temperaturen = [];
    const windkracht = [];
    const windrichting = [];
    for (let i = 0; i < 10; i++) {
        const verw = uur_verwachtingen[i];
        tijdstippen.push(tweedeWoord(verw.uur));
        windkracht.push(verw.windbft);
        windrichting.push(verw.windr);
        temperaturen.push(verw.temp);
    }
    drawWindVandaag(tijdstippen, windkracht, windrichting);
    drawTempVandaag(tijdstippen, temperaturen);
}

function plotWeek(result) {
    const week_verwachtingen = result.wk_verw;  // 24 items
    const dagen = [];
    const temperaturen = [];
    const windkracht = [];
    const windrichting = [];
    for (let i = 0; i < 5; i++) {
        const verw = week_verwachtingen[i];
        dagen.push(dagVanDeWeek(verw.dag));
        windkracht.push(verw.windbft);
        windrichting.push(verw.windr)
        temperaturen.push(verw.max_temp);
    }
    drawWindWeek(dagen, windkracht, windrichting);
    drawTempWeek(dagen, temperaturen);
}

export {plotVandaag, plotWeek}
