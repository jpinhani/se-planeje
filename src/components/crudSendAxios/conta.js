import axios from 'axios'
import { urlBackend, config, userID } from '../../routes/urlBackEnd'


async function GetConta() {
    const endpoint = `${urlBackend}api/cartoes/${userID()}`

    const result = await axios.get(endpoint)

    const dados = result.data

    return dados
}

async function InsertConta(body) {
    const endpointAPI = `${urlBackend}api/cartoes`

    const ResultStatus = await axios.post(endpointAPI, body, config())

    return ResultStatus.status
}

async function UpdateConta(body) {
    const endpointAPI = `${urlBackend}api/cartoes/${body.id}`

    const ResultStatus = await axios.put(endpointAPI, body, config())

    return ResultStatus.status
}

async function DeleteConta(body) {
    const endpoint = `${urlBackend}api/cartoes/${body}`

    const ResultStatus = await axios.delete(endpoint, config())

    return ResultStatus.status
}

export { InsertConta, GetConta, UpdateConta, DeleteConta }