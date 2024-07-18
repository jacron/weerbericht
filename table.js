import {dag, dagVanDeWeek, tweedeWoord} from "./util.js";

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
    '', 't', 'w', '', 'regen', ''
];

function populateRowVandaag(tr, u) {
    const tdTemp = makeTableCellR(u.temp);
    tdTemp.style.color = 'red';
    tr.appendChild(makeTableCell(tweedeWoord(u.uur)));
    tr.appendChild(tdTemp);
    tr.appendChild(makeTableCell(u.windr));
    tr.appendChild(makeTableCell(u.windbft));
    tr.appendChild(makeTableCellR(u.neersl));
    tr.appendChild(makeTableCell(u.image));
}

const weekHeaders = [
    'dag', '', 'max', 'min', 'wind', '', 'zon', 'regen', 'label'
];

function populateRowWeek(tr, w) {
    const tdMax = makeTableCell(w.max_temp);
    tdMax.style.color = 'red';
    tr.appendChild(makeTableCell(dagVanDeWeek(w.dag)));
    tr.appendChild(makeTableCell(dag(w.dag)));
    tr.appendChild(tdMax);
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
        const cell = makeHeaderCell(header);
        if (header === 'max' || header === 't') {
            cell.style.color = 'red';
        }
        tr.appendChild(cell);
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

export {fillVandaag, fillWeek}
