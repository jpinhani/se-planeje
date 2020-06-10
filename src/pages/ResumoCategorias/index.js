import React, { useEffect, useCallback, useState } from 'react';
import { GetRequest } from '../../components/crudSendAxios/crud';
import { SaldoCategoria, hierarquia } from '../../components/ResumoCategoriaDespesa'
import { SaldoCategoriaReceita, hierarquiaReceita } from '../../components/ResumoCategoriaReceita'
import { Table } from 'antd';

// const { TreeNode } = Tree;

export default (props) => {


    const [data, setData] = useState([]);
    const [dataRevenue, setDataRevenue] = useState([]);
    const [visao, setVisao] = useState([]);
    const [cartao, setCartao] = useState([]);
    const [categorias, setCategoria] = useState([]);
    const [treeExpense, setTreeExpense] = useState([]);
    const [treeRevenue, setTreeRevenue] = useState([]);

    const columns = [
        {
            title: 'Categoria',
            dataIndex: 'Categoria',
            key: 'Categoria'
        },
        {
            title: 'Valor',
            dataIndex: 'ValorPersonalizado',
            key: 'ValorPersonalizado'
        }];

    useEffect(() => {
        setData(props.data)
    }, [props.data])

    useEffect(() => {
        setVisao(props.visao)
    }, [props.visao])

    useEffect(() => {
        setCartao(props.cartao)
    }, [props.cartao])

    useEffect(() => {
        setDataRevenue(props.dataRevenue)
    }, [props.dataRevenue])

    const novosDados = useCallback(async () => {
        const cat = await GetRequest('api/categorias')
        setCategoria(cat);
    }, [])


    useEffect(() => {
        novosDados()
    }, [novosDados])


    const requestApi = useCallback(async () => {

        const nivel3 = categorias.filter(filtro => filtro.NIVEL === 3 &&
            filtro.ENTRADA === 1).map((data) => {
                return { ...data, Categoria: data.DESCR_CATEGORIA }
            })

        const nivel4 = categorias.filter(filtro => filtro.NIVEL === 4 &&
            filtro.ENTRADA === 1).map((data) => {
                return { ...data, Categoria: data.DESCR_CATEGORIA }
            })

        const nivel5 = categorias.filter(filtro => filtro.NIVEL === 5 &&
            filtro.ENTRADA === 1).map((data) => {
                return { ...data, Categoria: data.DESCR_CATEGORIA }
            })

        const dados1 = SaldoCategoria(data, visao, 'PREVISTO', cartao, categorias);
        const treeCategoryExpense = hierarquia(dados1, nivel3, nivel4, nivel5)
        setTreeExpense(treeCategoryExpense)

        const dados2 = SaldoCategoriaReceita(dataRevenue, visao, 'PREVISTO', categorias);
        const treeCategoryRevenue = hierarquiaReceita(dados2, nivel3, nivel4, nivel5)
        setTreeRevenue(treeCategoryRevenue)

    }, [data, dataRevenue, visao, cartao, categorias])

    useEffect(() => {
        requestApi()
    }, [requestApi])


    return (
        <div>
            <Table name='CategoryTable' className='table table-action'
                columns={columns}
                dataSource={[...treeExpense, ...treeRevenue]}
                rowKey="Categoria"
            />
        </div>
    )
}