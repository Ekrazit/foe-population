self.addEventListener("message", go);

var riesenia = [];
var moznosti = [];
var ciel = 0;

function go(message) {
    ciel = message.data.ciel;
    var allovedAges = message.data.allovedAges;
    var data = message.data.data;

    console.log("calculate - go " + ciel);
    console.log(data);

    var result = calculation(allovedAges,data,ciel) ;

    self.postMessage({
        "result": result,
    });
}


let subweb = (moznost, hlbka) => {
    for (let mx of moznosti) {

        var temp = mx.v + moznost.v
        var t = moznost.t
        var tx = mx.t
        var text = t.concat(tx)
        if (temp == ciel) {
            riesenia.push(text);
            continue;
        }
        hlbka = hlbka - 1;
        if (hlbka < 0) {
            continue;
        }

        subweb({'v': temp, 't': text}, hlbka)
    }
}

let calculation = (allovedAges,data) => {
    riesenia = [];
    moznosti = [];
    var koeficinet = 2
    var nasobitel = 1
    for (let i = 0; i < data.length;
         i++
    ) {
        var temp = 0;
        var oby = data[i].p;
        if (!allovedAges.includes(data[i].ag.toUpperCase())) {
            continue;
        }
        while (Math.abs(ciel) * koeficinet > Math.abs(temp)) {
            temp = oby * nasobitel
            moznosti.push({'v': temp, 't': [{'b': oby, 'n': nasobitel, 'i': i}]})
            nasobitel += 1
        }
        temp = 0
        nasobitel = 1
    }

    for (let i = 0; i < moznosti.length; i++){

         self.postMessage({
          'progress' : Math.round((i / moznosti.length) * 100)
         })

        let moznost = moznosti[i];
        if (moznost.v > ciel)
            continue;
        if (moznost.v == ciel) {
            riesenia.push(moznost)
            continue;
        }
        subweb(moznost, 2)
    }

    riesenia.sort((a, b) => {
        if (Array.isArray(a))
            aaa = a.reduce((a, b) => ({n: b.n + a.n}))
        else
            aaa = a
        if (Array.isArray(b))
            bbb = b.reduce((a, b) => ({n: b.n + a.n}))
        else
            bbb = b

        return aaa.n - bbb.n;
    })

    return (riesenia.slice(0,10));

}