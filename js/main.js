ages = [
    {'s': 'SA', 'd': 'Stone Age'},
    {'s': 'BA', 'd': 'Bronze Age'},
    {'s': 'IA', 'd': 'Iron Age'},
    {'s': 'EMA', 'd': 'Early Middle Ages'},
    {'s': 'HMA', 'd': 'High Middle Ages'},
    {'s': 'LMA', 'd': 'Late Middle Ages'},
    {'s': 'CA', 'd': 'Colonial Age'},
    {'s': 'INA', 'd': 'Industrial Age'},
    {'s': 'PE', 'd': 'Progressive Era'},
    {'s': 'ME', 'd': 'Modern Era'},
    {'s': 'PME', 'd': 'Postmodern Era'},
    {'s': 'CE', 'd': 'Contemporary Era'},
    {'s': 'TE', 'd': 'Tomorrow Era'},
    {'s': 'FE', 'd': 'Future Era'},
    {'s': 'AF', 'd': 'Arctic Future'},
    {'s': 'OF', 'd': 'Oceanic Future'},
    {'s': 'VF', 'd': 'Virtual Future'},
    {'s': 'SAM', 'd': 'Space Age Mars'},
    {'s': 'SAAB', 'd': 'Space Age Asteroid Belt'},
    {'s': 'SAV', 'd': 'Space Age Venus'}
]

var worker = new Worker("js/calculate.js");

let ciel

var tocenica = 0;

let d = document.querySelector('.form-select')
ages.forEach(age => {
    node = document.createElement("option")
    node.value = age.s
    node.text = age.d
    d.appendChild(node)
})


function createResults(resultslice) {
    let resultelement = document.querySelector('#results');
    resultelement.innerHTML = '';
    if (resultslice.length == 0) {
        var resulttext = document.createElement("h2");
        resulttext.innerText = 'Nothing found';
        resultelement.appendChild(resulttext);
        return;
    }

    var resulttext = document.createElement("h2");
    resulttext.innerText = 'Results';
    resultelement.appendChild(resulttext);
    for (let resultsliceElement of resultslice) {
        var colmd8 = document.createElement("div");
        colmd8.classList.add('col-md-8');
        resultelement.appendChild(colmd8);
        var cardtextcenter = document.createElement("div");
        cardtextcenter.classList.add('card');
        cardtextcenter.classList.add('text-center');
        colmd8.appendChild(cardtextcenter);
        var cardheader = document.createElement("div");
        cardheader.classList.add('card-header');
        cardtextcenter.appendChild(cardheader);
        var cardbody = document.createElement("div");
        cardbody.classList.add('card-body');
        cardtextcenter.appendChild(cardbody);
        var table = document.createElement("table");
        table.classList.add('table');
        cardbody.appendChild(table);
        var size = 0;
        var buildings = 0;
        var coins = 0;
        var supplies = 0;
        var diamonts = 0;
        for (let i = 0; i < resultsliceElement.length; i++) {
            var thead = document.createElement("thead");
            table.appendChild(thead);
            var tbody = document.createElement("tbody");
            table.appendChild(tbody);
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            var th = document.createElement("th");
            th.textContent = i;
            th.scope = 'row';
            tr.appendChild(th);
            var na = data[resultsliceElement[i].i].na;
            var ag = data[resultsliceElement[i].i].ag;
            coins = coins + data[resultsliceElement[i].i].co;
            supplies = supplies + data[resultsliceElement[i].i].su;
            diamonts = diamonts + data[resultsliceElement[i].i].di;
            size = size + data[resultsliceElement[i].i].si;
            var agname = ages.find((f) => f.s.toUpperCase() === ag.toUpperCase());
            var tdna = document.createElement("td");
            tdna.textContent = agname.d;
            tr.appendChild(tdna);
            var tdag = document.createElement("td");
            tdag.textContent = na;
            tr.appendChild(tdag);
            var tdn = document.createElement("td");
            tdn.textContent = resultsliceElement[i].n
            buildings = buildings + resultsliceElement[i].n;
            tr.appendChild(tdn);
        }
        var cardfooter = document.createElement("div");
        cardfooter.classList.add('card-footer');
        cardfooter.classList.add('text-muted');
        cardfooter.classList.add('bg-transparent');
        cardfooter.innerHTML = '[Size ' + size + '] [Buildings ' + buildings + '] [Resources ' + coins + ' coins ' + supplies + ' supplies] [' + diamonts + ' diamonts]'
        cardtextcenter.appendChild(cardfooter);
    }
}

function drawprogressbar() {
    let resultelement = document.querySelector('#results');
    resultelement.innerHTML = '<div class="progress col-md-8"><div class="progress-bar progress-bar-striped bg-danger" id="progressbar" role="progressbar" style="width: 1%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div>';
    let button = document.querySelector('#calculatebutton');
    button.setAttribute('disabled', true);

}

function drawLimit() {
    let resultelement = document.querySelector('#results');
    resultelement.innerHTML = '';
    var resulttext = document.createElement("h2");
    resulttext.innerText = 'Difference must be less the 5000';
    resultelement.appendChild(resulttext);
}


let calculate = () => {
    var failValidation = false;
    let d = document.querySelector('.form-select')
    if (d.value == '') {
        d.classList.add('is-invalid')
        failValidation = true;
    } else {
        d.classList.remove('is-invalid')
    }
    let d1 = document.querySelector('#ActualPopulation')
    if (!/^-?\d+$/.test(d1.value)) {
        d1.classList.add('is-invalid')
        failValidation = true;
    } else {
        d1.classList.remove('is-invalid')
    }
    let d2 = document.querySelector('#TargetPopulation')
    if (!/^-?\d+$/.test(d2.value)) {
        d2.classList.add('is-invalid')
        failValidation = true;
    } else {
        d2.classList.remove('is-invalid')
    }

    if (failValidation == true) {
        return;
    }
    ciel = d2.value - d1.value;

    if (ciel == 0) {
        return;
    }

    if (ciel > 5000){
        drawLimit()
        return;
    }

    var allovedAges = []
    for (let age of ages) {
        allovedAges.push(age.s.toUpperCase());
        if (age.s.toUpperCase() === d.value.toUpperCase()) {
            break;
        }
    }

    drawprogressbar();

    worker.postMessage({
        "ciel": ciel,
        "allovedAges": allovedAges,
        "data": data,
    });
    worker.addEventListener("message", (message) =>{

        if (message.data.progress !== undefined){
            let progressbar = document.querySelector('#progressbar');
            progressbar.style.width = message.data.progress + '%'
        }
        if (message.data.result !== undefined) {
            let button = document.querySelector('#calculatebutton');
            button.removeAttribute('disabled');
            createResults(message.data.result)
        }
    }, false);
}

document.querySelector('#calculatebutton').addEventListener('click', calculate)