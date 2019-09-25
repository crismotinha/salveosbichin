module.exports = {

    numeroPessoasJogando: (callback) => {
        var nFacil   = Math.floor(Math.random() * 50);
        var nMedio   = Math.floor(Math.random() * 25);
        var nDificil = Math.floor(Math.random() * 10);

        callback.render('inovacoes/jogos-natureza', { title: 'Salve os Bichin | Jogos da natureza!', numFacil: nFacil, numMedio: nMedio, numDificil: nDificil });
    }

}
