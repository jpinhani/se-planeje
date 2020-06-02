
function SomarPeriodo(valores) {
    // console.log(valores)
    const novoValor = valores.reduce((acum, atual) => {

        return {
            VL_REAL_NUMBER: atual.VL_REAL_NUMBER ?
                acum.VL_REAL_NUMBER ?
                    acum.VL_REAL_NUMBER + atual.VL_REAL_NUMBER :
                    atual.VL_REAL_NUMBER :
                0,

            VL_PREVISTO_NUMBER: atual.VL_PREVISTO_NUMBER ?
                acum.VL_PREVISTO_NUMBER ?
                    acum.VL_PREVISTO_NUMBER + atual.VL_PREVISTO_NUMBER :
                    atual.VL_PREVISTO_NUMBER :
                0,

            VL_FORECAST_NUMBER: atual.VL_FORECAST_NUMBER ?
                acum.VL_FORECAST_NUMBER ?
                    acum.VL_FORECAST_NUMBER + atual.VL_FORECAST_NUMBER :
                    atual.VL_FORECAST_NUMBER :
                acum.VL_FORECAST_NUMBER
        }
    }, {})
    return novoValor
}



export { SomarPeriodo }