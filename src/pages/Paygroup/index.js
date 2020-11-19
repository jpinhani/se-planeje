import React, { useEffect, useState } from 'react';

import { GetRequest } from '../../components/crudSendAxios/crud';

import moment from 'moment';

import { Input, DatePicker, Checkbox } from 'antd';

const dateFormat = 'DD/MM/YYYY'
export default () => {

    const [data, setdata] = useState();

    async function requestApi() {
        const despesas = await GetRequest('api/despesas');
        const receitas = await GetRequest('api/receitas');

        const newExpense = despesas.map((data) => {
            return {
                Id: data.ID,
                Tipo: "DESPESA",
                Categoria: data.DESCR_CATEGORIA,
                Descricao: data.DESCR_DESPESA,
                DataPrevista: data.DATANOVA,
                DataReal: new Date(),
                VlPrevisto: data.VL_PREVISTO,
                VlReal: data.VL_PREVISTO2,
                PagamentoEm: 0,
                CartaoConta: 0
            }
        })

        const newRevenue = receitas.map((data) => {
            return {
                Id: data.ID,
                Tipo: "RECEITA",
                Categoria: data.DESCR_CATEGORIA,
                Descricao: data.DESCR_RECEITA,
                DataPrevista: data.DATANOVA,
                DataReal: new Date(),
                VlPrevisto: data.VL_PREVISTO,
                VlReal: data.VL_PREVISTO,
                PagamentoEm: 0,
                CartaoConta: 0
            }
        })

        const dadosFinal = [...newExpense, ...newRevenue]

        setdata(dadosFinal)
    }

    useEffect(() => {
        requestApi();
    }, [])


    return (
        <div style={{ width: '100%' }}>

            <div style={{ display: 'flex', width: '100%' }}>
                {/* <div style={{ width: '5px' }}>Id:</div> */}
                <div style={{ display: 'flex', width: '30px', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>Flag</div>
                <div style={{ display: 'flex', width: '80px', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>Tipo</div>
                <div style={{ display: 'flex', width: '150px', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>Categoria</div>
                <div style={{ display: 'flex', width: '180px', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>Descricao</div>
                <div style={{ display: 'flex', width: '130px', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>DT Prevista</div>
                <div style={{ display: 'flex', width: '130px', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>DT Real</div>
                <div style={{ display: 'flex', width: '130px', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>Vl Previsto</div>
                <div style={{ display: 'flex', width: '130px', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>Vl Real</div>
                <div style={{ display: 'flex', width: '130px', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>Crédito?</div>
                <div style={{ display: 'flex', width: '130px', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>Cartao/Conta</div>

            </div>
            {data ? data.map((dados) =>

                <div style={{ display: 'flex', alignItems: 'center', width: '100%', borderBottom: '1px solid', borderColor: 'white' }}>
                    {/* <div style={{ display: 'flex', width: '5px', alignItems: 'center' }}>{dados.Id}</div> */}
                    <div style={{ display: 'flex', width: '30px', justifyContent: 'center', fontSize: '10px' }}><Checkbox />
                    </div>
                    <div style={{ display: 'flex', width: '80px', justifyContent: 'center', fontSize: '10px' }}>{dados.Tipo}</div>
                    <div style={{ display: 'flex', width: '150px', justifyContent: 'left', fontSize: '10px' }}>{dados.Categoria}</div>
                    <div style={{ display: 'flex', width: '180px', justifyContent: 'left', fontSize: '10px' }}>{dados.Descricao}</div>
                    <div style={{ display: 'flex', width: '130px', justifyContent: 'center', fontSize: '10px' }}>{dados.DataPrevista}</div>
                    <div style={{ display: 'flex', width: '130px', justifyContent: 'center', fontSize: '10px' }}> <DatePicker
                        placeholder="Data Real"
                        defaultValue={moment()}
                        format={dateFormat}
                    /></div>
                    <div style={{ display: 'flex', width: '130px', justifyContent: 'center', fontSize: '10px' }}>{dados.VlPrevisto}</div>
                    <div style={{ display: 'flex', width: '130px', justifyContent: 'center', fontSize: '10px' }}><Input value={dados.VlReal} /></div>
                    <div style={{ display: 'flex', width: '130px', justifyContent: 'center', fontSize: '10px' }}><Checkbox /></div>
                    <div style={{ display: 'flex', width: '130px', justifyContent: 'center', fontSize: '10px' }}><Input value={dados.CartaoConta} /></div>

                </div>
            ) : "N tem"
            }

        </div >
    )
}