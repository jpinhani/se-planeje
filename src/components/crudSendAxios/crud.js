import axios from 'axios'
import { urlBackend, config, userID } from '../../routes/urlBackEnd'


async function GetRequest(rota) {
    const endpoint = `${urlBackend}${rota}/${userID()}`

    const result = await axios.get(endpoint)
    const dados = result.data

    return dados
}

async function InsertRequest(body, rota) {
    const endpointAPI = `${urlBackend}${rota}`
    const ResultStatus = await axios.post(endpointAPI, body, config())

    return ResultStatus.status
}

async function UpdateRequest(body, rota) {
    const endpointAPI = `${urlBackend}${rota}/${body.id}`

    const ResultStatus = await axios.put(endpointAPI, body, config())
    return ResultStatus.status
}

async function DeleteRequest(body, rota) {
    const endpoint = `${urlBackend}${rota}/${body}`
    const ResultStatus = await axios.delete(endpoint, config())
    console.log(ResultStatus)

    return ResultStatus.data.error === undefined ? ResultStatus.status : '400'
}



function visionSerchMeta(dataVision, despesaList, selectVisao) {

    console.log('dataVision', dataVision)
    console.log('despesaList', despesaList)
    console.log('selectVisao', selectVisao)

    const novaVisao = dataVision.map((FIL) =>
        despesaList.filter((DATA) =>
            FIL.DT_FIM >= DATA.DT_PREVISTO &&
            FIL.DT_INICIO <= DATA.DT_PREVISTO &&
            FIL.VISAO === selectVisao
        )).filter((data) => data.length > 0)

    console.log(novaVisao)

    return novaVisao
}


function visionSerch(dataVision, despesaList, selectVisao) {

    const novaVisao = dataVision.map((FIL) =>
        despesaList.filter((DATA) =>
            FIL.DT_FIM >= DATA.DT_VISAO &&
            FIL.DT_INICIO <= DATA.DT_VISAO &&
            FIL.VISAO === selectVisao
        )).filter((data) => data.length > 0)

    return novaVisao
}

export { GetRequest, InsertRequest, UpdateRequest, DeleteRequest, visionSerch, visionSerchMeta }