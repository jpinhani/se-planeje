import { message } from 'antd'

const verifySend = (status, requisitante, descr) => {

    status === 200 ? respOk(requisitante, descr) : respError(requisitante, descr)
}

const respOk = (req, descr) => {
    switch (req) {
        case 'INSERT':
            message.success(`${descr} Inserido Com Sucesso`)
            break;
        case 'UPDATE':
            message.success(`${descr} Editado Com Sucesso`)
            break;
        case 'DELETE':
            message.success(`${descr} Excluido Com Sucesso`)
            break;
        case 'METAPAGA':
            message.success(`${descr} Contabilizado Com Sucesso`)
            break;
        case 'DELETEDESPESAREAL':
            message.success(`${descr} Excluida`)
            break;
        default:
            break;
    }
}

const respError = (req, descr) => {
    switch (req) {
        case 'INSERT':
            message.error(`Erro ao tentar Inserir ${descr}, a transação não sera salva`)
            break;
        case 'UPDATE':
            message.error(`Erro ao tentar Editar ${descr}, a transação não sera salva`)
            break;
        case 'DELETE':
            message.error(`Erro ao tentar Excluir ${descr}, a transação não sera salva`)
            break;
        case 'METAPAGA':
            message.error(`Erro ao tentar Contabilizar a Meta ${descr}, a transação não sera salva`)
            break;
        case 'DELETEDESPESAREAL':
            message.error(`Erro ao tentar excluir a despesa ${descr}, a transação não sera salva`)
            break;
        default:
            break;
    }
}

export { verifySend }