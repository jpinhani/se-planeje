import moment from 'moment';
let vet = 0;

const SaldoCategoriaReceita = (listaArray, visao, tipo, categorias) => {

    const dados = listaArray.reduce((acum, atual, i) => {
        let objeto = acum
        objeto[i] = {
            Conta: atual.DESCR_CONTA,
            IdCategoria: atual.ID_CATEGORIA,
            Categoria: atual.DESCR_CATEGORIA,
            ValorReal: atual.VL_REAL,
            DataReal: atual.DT_REAL,
            ValorPrevisto: atual.VL_PREVISTO,
            DataPrevisto: atual.DT_PREVISTO,
            Status: atual.STATUS
        }
        return objeto
    }, [])

    let rs = []
    if (visao.length > 0) {
        if (tipo === 'PREVISTO') {
            rs = groupByCategoria(
                TrataPrevisto(dados, visao[0].DT_INICIO, visao[0].DT_FIM),
                tipo)

        } else if (tipo === 'REAL') {
            rs = groupByCategoria(
                TrataReal(dados, visao[0].DT_INICIO, visao[0].DT_FIM),
                tipo)

        } else if (tipo === 'FORECAST') {
            rs = groupByCategoria(
                TrataForecast(dados, visao[0].DT_INICIO, visao[0].DT_FIM),
                tipo)
        }
    };



    return preparadados(rs, categorias)
}


function preparadados(arrayCategoria, categorias) {
    return arrayCategoria.map((dados) => {
        const rs = categorias.filter((filtro) => dados.IdCategoria === filtro.ID)
        if (rs.length > 0)
            return { ...dados, Idpai: rs[0].IDPAI }

        return { ...dados }
    })
}


function groupByCategoria(ArrayCategoria, tipo) {
    vet = 0;
    let GroupFinal = []
    if (tipo === 'REAL') {

        GroupFinal = ArrayCategoria.reduce((acum, gaveta, i, dados) => {
            let novoArray = acum
            if (novoArray.filter((ary) => ary.Categoria === gaveta.Categoria).length === 0) {
                const Categoria = gaveta.Categoria
                const Saldo = dados.filter((ary) =>
                    ary.Categoria === gaveta.Categoria).reduce((acum, valores) => acum + valores.ValorReal, 0)
                const idCategoria = gaveta.IdCategoria
                novoArray[vet] = {
                    IdCategoria: idCategoria,
                    Categoria: Categoria,
                    Valor: Saldo,
                    ValorPersonalizado: Saldo.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })
                }
                vet = vet + 1
            }
            return novoArray
        }, []);

    } else if (tipo === 'PREVISTO') {
        GroupFinal = ArrayCategoria.reduce((acum, gaveta, i, dados) => {
            let novoArray = acum
            if (novoArray.filter((ary) => ary.Categoria === gaveta.Categoria).length === 0) {
                const Categoria = gaveta.Categoria
                const Saldo = dados.filter((ary) =>
                    ary.Categoria === gaveta.Categoria).reduce((acum, valores) => acum + valores.ValorPrevisto, 0)
                const idCategoria = gaveta.IdCategoria
                novoArray[vet] = {
                    IdCategoria: idCategoria,
                    Categoria: Categoria,
                    Valor: Saldo,
                    ValorPersonalizado: Saldo.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })
                }
                vet = vet + 1
            }
            return novoArray
        }, []);


    } else if (tipo === 'FORECAST') {

        GroupFinal = ArrayCategoria.reduce((acum, gaveta, i, dados) => {
            let novoArray = acum
            if (novoArray.filter((ary) => ary.Categoria === gaveta.Categoria).length === 0) {

                const Categoria = gaveta.Categoria

                const Saldo = dados.filter((ary) =>
                    ary.Categoria === gaveta.Categoria).reduce((acum, valores) =>
                        acum + (valores.ValorReal ? valores.ValorReal : valores.ValorPrevisto), 0)

                const idCategoria = gaveta.IdCategoria
                novoArray[vet] = {
                    IdCategoria: idCategoria,
                    Categoria: Categoria,
                    Valor: Saldo,
                    ValorPersonalizado: Saldo.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })
                }
                vet = vet + 1
            }
            return novoArray
        }, []);
    }

    return GroupFinal
}


function previsto(array, dtInicio, dtFim) {
    return array.filter((dados) =>
        (dados.Status === 'Esperando Pagamento') &&
        (moment(dados.DataPrevisto).format("YYYY/MM/DD") >= moment(dtInicio).format("YYYY/MM/DD") &&
            moment(dados.DataPrevisto).format("YYYY/MM/DD") <= moment(dtFim).format("YYYY/MM/DD")))
}


function TrataPrevisto(dados, dtInicio, dtFim) {

    const conta = previsto(dados, dtInicio, dtFim)
    const contareal = real(dados, dtInicio, dtFim)
    return [...conta, ...contareal]
}

function real(array, dtInicio, dtFim) {
    return array.filter((dados) =>
        (dados.Status === 'Pagamento Realizado') &&
        (dados.DataReal >= dtInicio &&
            dados.DataReal <= dtFim))
}

function TrataReal(dados, dtInicio, dtFim) {

    const conta = real(dados, dtInicio, dtFim)

    return [...conta]
}

// function forecast(array, dtInicio, dtFim) {
//     return array.filter((dados) =>
//         ((dados.Status === 'Esperando Pagamento' ||
//             dados.Status === 'Pagamento Realizado') &&
//             ((dados.DataPrevisto >= dtInicio &&
//                 dados.DataPrevisto <= dtFim) ||
//                 (dados.DataReal >= dtInicio &&
//                     dados.DataReal <= dtFim)))
//     )
// }

function TrataForecast(dados, dtInicio, dtFim) {

    const conta = previsto(dados, dtInicio, dtFim)
    const contareal = real(dados, dtInicio, dtFim)

    return [...conta, ...contareal]
}


/* ############################################################################################# */

function hierarquiaReceita(dados1, nivel3, nivel4, nivel5) {
    console.log('dados1', dados1)
    const prepNivel5 = nivel5.map((n5) => {
        const dadosnivel = dados1.filter(filtro => filtro.Idpai === n5.ID)
        const somanivel = dadosnivel.reduce((acum, atual) => acum + atual.Valor, 0)
        if (dadosnivel.length > 0)
            return {
                ...n5,
                Valor: somanivel,
                ValorPersonalizado: somanivel.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                children: dadosnivel
            }

        return { ...n5, Valor: 0 }
    })

    const prepNivel4 = nivel4.map((n4) => {
        const dadosnivel = dados1.filter(filtro => filtro.Idpai === n4.ID)
        const somanivel = dadosnivel.reduce((acum, atual) => acum + atual.Valor, 0)
        if (dadosnivel.length > 0)
            return {
                ...n4,
                Valor: somanivel,
                ValorPersonalizado: somanivel.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                children: dadosnivel
            }

        return { ...n4, Valor: 0 }
    })

    const prepNivel3 = nivel3.map((n3) => {
        const dadosnivel = dados1.filter(filtro => filtro.Idpai === n3.ID)
        const somanivel = dadosnivel.reduce((acum, atual) => acum + atual.Valor, 0)
        if (dadosnivel.length > 0)
            return {
                ...n3,
                Valor: somanivel,
                ValorPersonalizado: somanivel.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                children: dadosnivel
            }

        return { ...n3, Valor: 0 }
    })

    const agrupa4 = prepNivel4.map((prep4) => {
        const dadosnivel = prepNivel5.filter(filtro => filtro.IDPAI === prep4.ID)
        const somanivel = dadosnivel.reduce((acum, atual) => acum + atual.Valor, 0)
        if (dadosnivel.length > 0)
            return {
                ...prep4,
                Valor: somanivel,
                ValorPersonalizado: somanivel.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                children: [...dadosnivel, prep4.children]
            }

        return { ...prep4 }
    })

    const agrupa3 = prepNivel3.map((prep3) => {
        const dadosnivel = agrupa4.filter(filtro => filtro.IDPAI === prep3.ID)
        const somanivel = dadosnivel.reduce((acum, atual) => acum + atual.Valor, 0)
        if (dadosnivel.length > 0)
            return {
                ...prep3,
                Valor: somanivel,
                ValorPersonalizado: somanivel.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                children: [...dadosnivel, prep3.children]
            }

        return { ...prep3 }
    })

    const filtraValor = agrupa3.filter((filtro) => {
        return filtro.Valor > 0
    })

    const receitaInputNivel3 = dados1.filter(filtro => filtro.Idpai === 3)
    const somaInputNivel3 = receitaInputNivel3.reduce((acum, atual) => acum + atual.Valor, 0)
    const receitaInicial = [{
        Categoria: 'RECEITA',
        IdCategoria: 3,
        Idpai: 1,
        children: receitaInputNivel3,
        Valor: somaInputNivel3,
        ValorPersonalizado: somaInputNivel3.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
    }]

    const totalReceita = receitaInicial.map((listExpense) => {
        const dadosnivel = filtraValor.filter(filtro => filtro.IDPAI === listExpense.IdCategoria)
        const somanivel = dadosnivel.reduce((acum, atual) => acum + atual.Valor, 0)
        if (dadosnivel.length > 0)
            return {
                ...listExpense,
                Valor: somanivel + listExpense.Valor,
                ValorPersonalizado: (somanivel + listExpense.Valor).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                children: [...dadosnivel, ...listExpense.children]
            }

        return { ...listExpense }
    })

    return totalReceita
}

export { SaldoCategoriaReceita, hierarquiaReceita }