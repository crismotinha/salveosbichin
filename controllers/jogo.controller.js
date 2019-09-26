module.exports = {

    numeroPessoasJogando: (callback) => {
        var sFacil, sMedio, sDif;
        var iFacil   = Math.floor(Math.random() * 50);
        var iMedio   = Math.floor(Math.random() * 25);
        var iDificil = Math.floor(Math.random() * 10);
        iFacil   == 1 ? sFacil = iFacil  + " pessoa" : sFacil = iFacil  + " pessoas";
        iMedio   == 1 ? sMedio = iMedio  + " pessoa" : sMedio = iMedio  + " pessoas";
        iDificil == 1 ? sDif   = iDificil+ " pessoa" : sDif   = iDificil+ " pessoas";

        callback.render('inovacoes/jogos-natureza', { title: 'Salve os Bichin | Jogos da natureza!', txtFacil: sFacil, txtMedio: sMedio, txtDificil: sDif });
    }

}
