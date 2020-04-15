import axios from 'axios'
import { urlBackend, config, userID } from '../../routes/urlBackEnd'


async function GetRequest(rota) {
    const endpoint = `${urlBackend}${rota}/${userID()}`

    const result = await axios.get(endpoint)

    const dados = result.data
    console.log(endpoint)
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
    console.log(endpointAPI)
    return ResultStatus.status
}

async function DeleteRequest(body, rota) {
    const endpoint = `${urlBackend}${rota}/${body}`
    console.log(endpoint)
    const ResultStatus = await axios.delete(endpoint, config())

    return ResultStatus.status
}

export { GetRequest, InsertRequest, UpdateRequest, DeleteRequest }