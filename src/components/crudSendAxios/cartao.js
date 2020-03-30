import axios from 'axios'
import { urlBackend, config, userID } from '../../routes/urlBackEnd'


async function GetCard() {
    const endpoint = `${urlBackend}api/cartoes/${userID()}`

    const result = await axios.get(endpoint)

    const dados = result.data

    return dados
}

async function InsertCard(body) {
    const endpointAPI = `${urlBackend}api/cartoes`

    const ResultStatus = await axios.post(endpointAPI, body, config())

    return ResultStatus.status
}

async function UpdateCard(body) {
    const endpointAPI = `${urlBackend}api/cartoes/${body.id}`

    const ResultStatus = await axios.put(endpointAPI, body, config())

    return ResultStatus.status
}

async function DeleteCard(body) {
    const endpoint = `${urlBackend}api/cartoes/${body}`

    const ResultStatus = await axios.delete(endpoint, config())

    return ResultStatus.status
}

export { InsertCard, GetCard, UpdateCard, DeleteCard }