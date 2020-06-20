import React, { useEffect, useCallback, useState } from 'react';
import { GetRequest } from '../../components/crudSendAxios/crud';
import { SaldoCategoria, hierarquia } from '../../components/ResumoCategoriaDespesa'
import { SaldoCategoriaReceita, hierarquiaReceita } from '../../components/ResumoCategoriaReceita'
import { Table, Select } from 'antd';

import './styles.scss'

const { Option } = Select;
export default (props) => {


    const [data, setData] = useState([]);
    const [dataRevenue, setDataRevenue] = useState([]);
    const [visao, setVisao] = useState([]);
    const [cartao, setCartao] = useState([]);
    const [categorias, setCategoria] = useState([]);
    const [tree, setTree] = useState([]);
    const [cenario, setCenario] = useState([])

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

        const dados1 = SaldoCategoria(data, visao, cenario, cartao, categorias);
        const treeCategoryExpense = hierarquia(dados1, nivel3, nivel4, nivel5)

        const dados2 = SaldoCategoriaReceita(dataRevenue, visao, cenario, categorias);
        const treeCategoryRevenue = hierarquiaReceita(dados2, nivel3, nivel4, nivel5)
        // setTreeRevenue(treeCategoryRevenue)

        const Lucro = [...treeCategoryExpense, ...treeCategoryRevenue].filter(filtro => filtro.Idpai === 1)
        const SomaLucro = Lucro.reduce((acum, atual) => acum + (atual.Categoria === 'DESPESA' ? atual.Valor * (-1) : atual.Valor), 0)
        const LucroInicial = [{
            Categoria: 'LUCRO - PREJUIZO',
            IdCategoria: 1,
            Idpai: 0,
            children: Lucro,
            Valor: SomaLucro,
            ValorPersonalizado: SomaLucro.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
        }]

        setTree(LucroInicial)

    }, [data, dataRevenue, visao, cartao, categorias, cenario])

    useEffect(() => {
        requestApi()
    }, [requestApi])


    return (
        <div>
            <div className='Cenario'>
                <Select
                    className='SelectCenario'
                    showSearch
                    // style={{ width: '90%', marginBottom: '3px', marginTop: '3px' }}
                    placeholder="Selecione o Cenário Desejado"
                    optionFilterProp="children"
                    filterOption={(input, option) => (
                        option.props.children.toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                    )}
                    onSelect={valor => setCenario(valor)}
                >
                    <Option value='PREVISTO'>Previsto</Option>
                    <Option value='REAL'>Real</Option>
                    <Option value='FORECAST'>Forecast</Option>
                </Select>
            </div>
            <Table name='CategoryTable' className='table table-action'
                columns={columns}
                dataSource={[...tree]}
                rowKey="Categoria"
            />
        </div>
    )
}