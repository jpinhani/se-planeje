import React, { useEffect, useCallback, useState, useRef } from 'react';

// import { Link } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux';

import Chart from "chart.js";
import { GetRequest } from '../../components/crudSendAxios/crud';
// import { SaldoConta, groupByConta, SaldoInicial } from '../../components/SaldoConta';
import { SaldoCategoria, hierarquia } from '../../components/SaldoCategoria';

import { gera_cor } from '../../components/GeraCor'

import { notification, Select, Table } from 'antd';
import moment from 'moment';

import './styles.scss'
// import { ConsoleSqlOutlined } from '@ant-design/icons';
const { Option } = Select;
let newChartInstance = null;
// let newChartInstance2 = null;
export default () => {
    const dispatch = useDispatch();
    const visionControler = useSelector(state => state.visionControler)
    const [listaDespesa, setListaDespesa] = useState([])
    // const homeReducer = useSelector(state => state.home);
    // const [contaSaldoAtual, setContaSaldoAtual] = useState([]);
    // const [lastLanc, setLastLanc] = useState([]);
    // const [nextLanc, setNextLanc] = useState([]);
    // const [itens, setItens] = useState(true);
    // const [ver, setVer] = useState(true);
    // const [spin, setSpin] = useState(true)
    // const [search, setSearch] = useState('');

    const [visions, setVisions] = useState([]);
    // const [visaoData, setVisaoData] = useState();

    const chartContainer = useRef(null);
    // const chartContainer1 = useRef(null);
    const [grafico, setGrafico] = useState(null);

    const ChartConfig = useCallback((dadosGrafico) => {
        const valorTotal = dadosGrafico.reduce((acum, atual) => acum + atual.Valor, 0)

        const dataGrafico = dadosGrafico.map((valor) => {
            return ((valor.Valor / valorTotal) * 100).toFixed(2)
        });


        const corGrafico = dadosGrafico.map((valor) => gera_cor())
        const labelsGrafico = dadosGrafico.map((valor) => valor.Categoria)
        const rs = {
            type: 'bar',
            data: {
                datasets: [{
                    barPercentage: 0.7,
                    minBarLength: 5,
                    data: dataGrafico,
                    backgroundColor: corGrafico,
                    borderColor: corGrafico,
                    borderWidth: 1,
                    label: ['Categorias'],
                }],
                labels: labelsGrafico
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,

                animation: {
                    duration: 0 // general animation time
                },
                hover: {
                    animationDuration: 0 // duration of animations when hovering an item
                },
                responsiveAnimationDuration: 0 // animation duration after a resize
            }
        }
        return rs
    }, [])

    const filterVision = async (selectVisao) => {
        dispatch({ type: 'LIST_VISIONCONTROLER', payload: selectVisao })
        console.log("ATUALIZAÇÃO")
    }

    const getvision = useCallback(async () => await GetRequest('api/visions'), [])

    const listaVisao = useCallback(async () => {
        const resultVision = await getvision();
        if (resultVision.status === 402)
            return notification.open({
                message: 'SePlaneje - Problemas Pagamento',
                duration: 20,
                description:
                    `Poxa!!! 
                        Foram identificados problemas com o pagamento da sua assinatura, acesse a página de Pagamento ou entre em contato conosco...`,
                style: {
                    width: '100%',
                    marginLeft: 335 - 600,
                },
            });

        console.log('resultVision', resultVision)

        const options = resultVision.map((desc, i) =>
            <Option key={i} value={desc.VISAO}>
                {desc.VISAO}
            </Option>
        )

        options.push(<Option key='all' value='ALL'>TODAS VISÕES</Option>)

        setVisions(options)

        // setSpin(false)

    }, [getvision])

    const requestApi = useCallback(async () => {

        try {
            const despesas = await GetRequest('api/chartDespesa');
            const receitas = await GetRequest('api/chartReceita');
            const transferencias = await GetRequest('api/transferencia');
            const cartao = await GetRequest('api/cartoes');
            const categorias = await GetRequest('api/categorias')
            const conta = await GetRequest('api/contas')


            if (despesas.status === 402 ||
                receitas.status === 402 ||
                transferencias.status === 402 ||
                cartao.status === 402 ||
                categorias.status === 402 ||
                conta.status === 402
            )
                return notification.open({
                    message: 'SePlaneje - Problemas Pagamento',
                    duration: 20,
                    description:
                        `Poxa!!! 
                        Foram identificados problemas com o pagamento da sua assinatura, acesse a página de Pagamento ou entre em contato conosco...`,
                    style: {
                        width: '100%',
                        marginLeft: 335 - 600,
                    },
                });



            console.log("visionControler", visionControler)
            const resultVision = await getvision();
            const newVision = resultVision.filter(filtro => filtro.VISAO === visionControler)

            const visaoData = [{
                DT_INICIO: newVision.length > 0 ? newVision[0].DT_INICIO : moment(),
                DT_FIM: newVision.length > 0 ? newVision[0].DT_FIM : moment(),
            }]


            const dados1 = SaldoCategoria(despesas, visaoData, 'FORECAST', cartao, categorias);
            const dados1Rec = SaldoCategoria(receitas, visaoData, 'FORECAST', cartao, categorias);

            // console.log('dados1Rec', dados1Rec)

            const somadados1 = dados1.reduce((acum, atual) => acum + atual.Valor, 0)
            const dadosNew = dados1.map((dados => {
                return {
                    ...dados, percentual: (dados.Valor / somadados1).toLocaleString('pt-BR', {
                        style: 'percent',
                        currency: 'BRL'
                    })
                }
            }))

            const somadados1Rec = dados1Rec.reduce((acum, atual) => acum + atual.Valor, 0)
            const dadosNewRec = dados1Rec.map((dados => {
                return {
                    ...dados, percentual: (dados.Valor / somadados1Rec).toLocaleString('pt-BR', {
                        style: 'percent',
                        currency: 'BRL'
                    })
                }
            }))

            const nivel3 = categorias.filter(filtro => filtro.NIVEL === 3 &&
                filtro.ENTRADA === 1 && filtro.TIPO === 1).map((data) => {
                    return { ...data, Categoria: data.DESCR_CATEGORIA }
                })

            const nivel4 = categorias.filter(filtro => filtro.NIVEL === 4 &&
                filtro.ENTRADA === 1 && filtro.TIPO === 1).map((data) => {
                    return { ...data, Categoria: data.DESCR_CATEGORIA }
                })

            const nivel5 = categorias.filter(filtro => filtro.NIVEL === 5 &&
                filtro.ENTRADA === 1 && filtro.TIPO === 1).map((data) => {
                    return { ...data, Categoria: data.DESCR_CATEGORIA }
                })

            const dadosGrafico = [...hierarquia(dadosNew, nivel3, nivel4, nivel5),
            ...dados1.filter(filtro => filtro.Idpai === 2)]

            const nivel3Rec = categorias.filter(filtro => filtro.NIVEL === 3 &&
                filtro.ENTRADA === 1 && filtro.TIPO === 2).map((data) => {
                    return { ...data, Categoria: data.DESCR_CATEGORIA }
                })

            const nivel4Rec = categorias.filter(filtro => filtro.NIVEL === 4 &&
                filtro.ENTRADA === 1 && filtro.TIPO === 2).map((data) => {
                    return { ...data, Categoria: data.DESCR_CATEGORIA }
                })

            const nivel5Rec = categorias.filter(filtro => filtro.NIVEL === 5 &&
                filtro.ENTRADA === 1 && filtro.TIPO === 2).map((data) => {
                    return { ...data, Categoria: data.DESCR_CATEGORIA }
                })


            const dadosGraficoRec = [...hierarquia(dadosNewRec, nivel3Rec, nivel4Rec, nivel5Rec),
            ...dados1.filter(filtro => filtro.Idpai === 3)]

            console.log("dadosGraficoRec", dadosGraficoRec)

            setListaDespesa(dadosGrafico)

            // const dadosGrafico = SaldoCategoria(despesas)
            if (chartContainer && chartContainer.current) {
                if (newChartInstance) newChartInstance.destroy()
                newChartInstance = new Chart(chartContainer.current, ChartConfig(dadosGrafico));
                setGrafico(newChartInstance)
            }

            // setSpin(false)

            console.log('logica de atualizacao: ')
        } catch (error) {
            console.log(error)
        };



    }, [chartContainer, ChartConfig, visionControler, getvision])


    useEffect(() => {
        requestApi()
    }, [requestApi])


    useEffect(() => {
        listaVisao()
    }, [listaVisao])

    const columns = [
        {
            title: 'CATEGORIA',
            dataIndex: 'Categoria',
            key: 'Categoria'
        },
        {
            title: 'R$',
            dataIndex: 'ValorPersonalizado',
            key: 'ValorPersonalizado'
        },
        {
            title: '% Frente ao Total',
            dataIndex: 'percentual',
            key: 'percentual'
        }
    ]

    return (
        <div>


            <div className='containerDiv1'>
                <Select style={{ width: '100%' }}
                    placeholder="Filtrar por Visão"
                    value={visionControler}
                    onSelect={(valor) => filterVision(valor)}
                >
                    {visions}
                </Select>
                <div>
                    <Table className='table table-action'
                        columns={columns}

                        dataSource={listaDespesa}
                        rowKey="Categoria"
                        pagination={{ pageSize: 100 }}
                    />
                </div>
                <center> <h1 title='Exibe o valor % Realizado conforme utiliação do sistema'>% Comportamento de Gastos</h1></center>
                <div>
                    <canvas
                        id={grafico}
                        ref={chartContainer}
                    />
                </div>
            </div>
        </div>
    )
}

