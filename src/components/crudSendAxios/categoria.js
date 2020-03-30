import axios from 'axios'
import { urlBackend, config, userID } from '../../routes/urlBackEnd'


async function GetCategoria() {
    const endpoint = `${urlBackend}api/cartoes/${userID()}`

    const result = await axios.get(endpoint)

    const dados = result.data

    return dados
}

async function InsertCategoria(body) {
    const endpointAPI = `${urlBackend}api/cartoes`

    const ResultStatus = await axios.post(endpointAPI, body, config())

    return ResultStatus.status
}

async function UpdateCategoria(body) {
    const endpointAPI = `${urlBackend}api/cartoes/${body.id}`

    const ResultStatus = await axios.put(endpointAPI, body, config())

    return ResultStatus.status
}

async function DeleteCategoria(body) {
    const endpoint = `${urlBackend}api/cartoes/${body}`

    const ResultStatus = await axios.delete(endpoint, config())

    return ResultStatus.status
}

export { InsertCategoria, GetCategoria, UpdateCategoria, DeleteCategoria }