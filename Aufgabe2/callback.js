function verdoppeln(zahl, callback) {
    let result = zahl * 2;
    callback(result);
}

verdoppeln(5, function(ergebnis) {
    console.log('Das Ergebnis ist:', ergebnis);
});