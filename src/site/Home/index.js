import React from 'react';
// import Carousel from '../Carousel/'


// import ContaImg from '../../Imagens/Sados.png';
// import CategoriaImg from '../../Imagens/Categoria.png';

import './styles.scss'

export default () => {

    return (
        <div className='ContainerHome'>
            <div className='ContainerMarca'>
                <h1>
                    <span>Se</span>
            Planeje
          </h1>
                <strong>Gerencie o seu dinheiro para você se Planejar Melhor!</strong>

                <div className='ListaSeplaneje'>
                    <li>Controle todas as suas Contas</li>
                    <li>Controle o Cartão de Crédito</li>
                    <li>Faça Metas de Despesas e Receitas</li>
                    <li>Contabilize Metas e despesas não Previsitas</li>
                    <li>Controle de visão e muito Mais</li>
                </div>
            </div>
            {/* <img style={{ width: '100%' }} src={ContaImg} alt='Site' /> */}
            {/* <> No SePlaneje você será capaz:</> */}

            {/*

            <div className='Container2'>
                <div className='Container2_1'>
                    Gerenciar todas as suas contas em um unico lugar!
                </div>
                <div className='Container2_2'>
                    <img styele={{ width: '100%' }} src={ContaImg} alt={'Conta'} />
                </div>
            </div>
           
            
            <div className='Container3'>
                <div className='Container3_2'>
                    <img src={CategoriaImg} alt={'Conta'} />
                </div>
                <div className='Container3_1'>
                    Gerenciar seu própio plano de Categorias de Receitas e Despesas, no sistema de maneira intuitiva será possivel cadastrar uma hierarquia de categorias até 5 niveis.
                </div>
            </div>

            <div className='Container2'>
                <div className='Container2_1'>Gerenciar todos os cartões de crédito.</div>
                <div className='Container2_2'>
                    <img src={CategoriaImg} alt={'Conta'} />
                </div>
            </div>
            <div className='Container3'>
                <div className='Container3_2'>
                    <img src={CategoriaImg} alt={'Conta'} />
                </div>
                <div className='Container3_1'>Gerenciar todas as contas bancárias e fontes de renda, inclusive o dinheiro em caixa, na carteira ou em mão.</div>
            </div>

            <div>
                <div className='Container2_1'>
                    <p>Gerenciar visões especificas que são condizentes com cada familia, muitas vezes para uma familia não é interessante ter a visão por Mês das despesas / receitas, mas sim ter a visão
                condizente refente a caixa do dia do pagamento até o dia que antecede o próximo pagamento, dessa maneira quem decide a visão das informações consolidadas no sitema é você!.</p></div>
                <div className='Container2_2'>
                    foto
                 </div>
            </div>

            <div>
                <div className='Container2_1'>
                    <p>Planejar Despesas(Metas) e Receitas(Metas), para quantos meses quiser, Isso te garantira a visão de quanto dinheiro você ja tem empenhado para honrar mesmo antes de ter o proprio dinheiro</p>
                </div>
                <div className='Container2_2'>
                    foto
                 </div>
            </div>

            <div>
                <div className='Container2_1'>
                    <p>
                        ...Contabilizar as Despesas que realmente eram metas e tambem as que não foram previstas.
                         </p>
                    <p> ...Contabilizar as Receitas que realmente eram metas e tambem as que não foram previstas.</p>
                    <p>...Controlar as Faturas de Cartão de crédito</p>
                    <p>...Controlar as transferencias, saques depositos que acontecerão no decorrer dos periodos.
                    </p>
                </div>
                <div className='Container2_2'>
                    foto
                 </div>
            </div>



                ...Analisar de maneira consolidada como ocorreu aquela visão, ou periodo especifico que quiser, você solicita a visão ou periodo e o sistema consolida as informações de Despesas x Receitas
    gerando uma poderosa ferramenta de fluxo de caixa que consolidara as informações e exibirá da seguinte maneira:

                ** Despesas consolidadas no periodo, previstas não previstas, Cartões de Crédito e faturas.
                ** Receitas consolidadas no periodo, previstas não previstas.
                ** Transferencias, Depositos, Saques ocorridos no mês.
                ** Plano de Categorias gerado no formato de hierarquia conforme cadastrado pelo usuário.
                ** Saldo de cada Conta para o periodo informado.
                ** Graficos para melhor analise.


    Nosso sistema Gerenciador de Finanças consta ainda com um menu referente a ajuda, ajuda para você de como extrair o melhor com essa poderosa ferramenta. */}

        </div >
    )
}
