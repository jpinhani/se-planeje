
import axios from 'axios'
import { urlBackend, config, userID } from '../../services/urlBackEnd'
import { logout } from '../../auth/index'


function redirect() {
    window.location.href = 'https://sys.seplaneje.com/login'
}

async function GetRequest(rota) {
    try {
        const endpoint = `${urlBackend}${rota}/${userID()}`

        const result = await axios.get(endpoint, config())
        const dados = result.data

        return dados
    } catch (error) {

    }
}


async function InsertRequest(body, rota) {

    try {
        const endpointAPI = `${urlBackend}${rota}`
        const ResultStatus = await axios.post(endpointAPI, body, config())
        return ResultStatus.data.status === 400 ? 400 : ResultStatus.status
    } catch (error) {
        logout();
        redirect();
    }
}

async function UpdateRequest(body, rota) {
    try {
        const endpointAPI = `${urlBackend}${rota}/${body.id}`
        const ResultStatus = await axios.put(endpointAPI, body, config())
        return ResultStatus.status
    } catch (error) {
        logout();
        redirect();
    }

}

async function DeleteRequest(body, rota) {
    try {
        const endpoint = `${urlBackend}${rota}/${body}`
        const ResultStatus = await axios.delete(endpoint, config())
        return ResultStatus.data.error === undefined ? ResultStatus : '400'
    } catch (error) {
        logout();
        redirect();
    }
}

function visionSerchReceita(dataVision, despesaList, selectVisao) {

    let visao = []

    if (selectVisao === 'ALL') {
        visao = despesaList
    } else {
        const novaVisao = dataVision.map((FIL) =>
            despesaList.filter((DATA) =>
                FIL.DT_FIM >= DATA.DT_REAL &&
                FIL.DT_INICIO <= DATA.DT_REAL &&
                FIL.VISAO === selectVisao
            )).filter((data) => data.length > 0)

        visao = novaVisao === undefined ? [] : novaVisao[0]
    }
    return visao
}

function visionSerchMeta(dataVision, despesaList, selectVisao) {
    let visao = []
    if (selectVisao === 'ALL') {
        visao = despesaList
    } else {
        const novaVisao = selectVisao === 'ALL' ? despesaList : dataVision.map((FIL) =>
            despesaList.filter((DATA) =>
                FIL.DT_FIM >= DATA.DT_PREVISTO &&
                FIL.DT_INICIO <= DATA.DT_PREVISTO &&
                FIL.VISAO === selectVisao
            )).filter((data) => data.length > 0)

        visao = novaVisao === undefined ? [] : novaVisao[0]
    }
    return visao
}

function visionSerch(dataVision, despesaList, selectVisao) {
    let visao = []
    if (selectVisao === 'ALL') {
        visao = despesaList
    } else {
        const novaVisao = selectVisao === 'ALL' ? despesaList : dataVision.map((FIL) =>
            despesaList.filter((DATA) =>
                FIL.DT_FIM >= DATA.DT_VISAO &&
                FIL.DT_INICIO <= DATA.DT_VISAO &&
                FIL.VISAO === selectVisao
            )).filter((data) => data.length > 0)

        visao = novaVisao === undefined ? [] : novaVisao[0]
    }

    return visao
}

function visionSerchTransferencia(dataVision, despesaList, selectVisao) {
    let visao = []
    if (selectVisao === 'ALL') {
        visao = despesaList
    } else {
        const novaVisao = selectVisao === 'ALL' ? despesaList : dataVision.map((FIL) =>
            despesaList.filter((DATA) =>
                FIL.DT_FIM >= DATA.DATA_TRANSFERENCIA &&
                FIL.DT_INICIO <= DATA.DATA_TRANSFERENCIA &&
                FIL.VISAO === selectVisao
            )).filter((data) => data.length > 0)

        visao = novaVisao === undefined ? [] : novaVisao[0]
    }

    return visao
}

export {
    GetRequest,
    InsertRequest,
    UpdateRequest,
    DeleteRequest,
    visionSerch,
    visionSerchMeta,
    visionSerchReceita,
    visionSerchTransferencia
}