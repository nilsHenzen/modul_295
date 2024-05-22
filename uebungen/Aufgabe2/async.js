async function simuliereVerzoegerung(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

async function addiereNachVerzögerung(a,b, ms) {
    await simuliereVerzoegerung(ms);
    const sum = a + b ;
    console.log("Das Ergebnis ist:", sum);
}

addiereNachVerzögerung(3, 7, 2000);