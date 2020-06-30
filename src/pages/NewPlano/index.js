import React, { useState } from 'react';
import Cards from 'react-credit-cards';
import { Input, Button, Select, Result } from 'antd';
// import { InsertRequest } from '../../components/crudSendAxios/crud'
import { urlBackend } from '../../services/urlBackEnd'
import axios from 'axios'

import 'react-credit-cards/es/styles-compiled.css';
import './styles.scss';
// import { date } from 'yup';


const { Option } = Select;
const mensal = <div className='PlanoDetails'>
    <div className='PlanoName'><h1>Se<span>Planeje - Mensal</span></h1></div>
    <div className='PlanoRecorrencia'>Todo mês - <span>7 dias grátis</span></div>
    <div className='PlanoObs'>Perfeito para quem quer conhecer o sistema Seplaneje</div>
    <div className='PlanoValue'>R$ 15,00</div>
    <div className='PlanoDescription'>Avaliação Gratuita por 7 dias, após será cobrado o valor do
    Plano  até o final do período contratado de 30 dias. Ao final do
    período contratado o plano será cobrado novamente e será valido por
    mais 30 dias, caso o usuário não queira mais o plano o mesmo deverá
                            cancelar antes da nova cobrança</div>
</div>

const trimestral = <div className='PlanoDetails'>
    <div className='PlanoName'><h1>Se<span>Planeje - Trimestral</span></h1></div>
    <div className='PlanoRecorrencia'>A Cada 3 Meses - <span>7 dias grátis</span></div>
    <div className='PlanoObs'>Para você que esta se adaptando a gerenciar suas finanças</div>
    <div className='PlanoValue'>R$ 40,50</div>
    <div className='PlanoDescription'>Avaliação Gratuita por 7 dias, após será cobrado o valor do Plano  até o final do período contratado de 90 dias.
Ao final do período contratado o plano será cobrado novamente e será valido por mais 90 dias, caso o usuário não queira mais o plano o mesmo deverá cancelar antes da nova cobrança</div>
</div>


const Semestral = <div className='PlanoDetails'>
    <div className='PlanoName'><h1>Se<span>Planeje - Semestral</span></h1></div>
    <div className='PlanoRecorrencia'>A Cada 6 Meses - <span>7 dias grátis</span></div>
    <div className='PlanoObs'>Para você que já se acostumou com o melhor do planejamento.</div>
    <div className='PlanoValue'>R$ 72,50</div>
    <div className='PlanoDescription'>Avaliação Gratuita por 7 dias, após será cobrado o valor do Plano  até o final do período contratado de 180 dias.
Ao final do período contratado o plano será cobrado novamente e será valido por mais 180 dias, caso o usuário não queira mais o plano o mesmo deverá cancelar antes da nova cobrança</div>
</div>

const Anual = <div className='PlanoDetails'>
    <div className='PlanoName'><h1>Se<span>Planeje - Anual</span></h1></div>
    <div className='PlanoRecorrencia'>De Ano em Ano - <span>7 dias grátis</span></div>
    <div className='PlanoObs'>Para você que planeja o Longo Prazo da sua vida financeira.</div>
    <div className='PlanoValue'>R$ 126,00</div>
    <div className='PlanoDescription'>Avaliação Gratuita por 7 dias, após será cobrado o valor do Plano  até o final do período contratado de 365 dias.
Ao final do período contratado o plano será cobrado novamente e será valido por mais 365 dias, caso o usuário não queira mais o plano o mesmo deve cancelar antes da nova cobrança</div>
</div>

export default () => {

    const [cvc, setCvc] = useState('');
    const [expiry, setExpiry] = useState('');
    const [focus, setFocus] = useState('');
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [plano, setPlano] = useState(mensal);
    const [selectPlanoButton, setSelectPlanoButton] = useState('mensal');


    const [CustomerEmail, setCustomerEmail] = useState('')
    const [CustomerName, setCustomerName] = useState('')
    const [CustomerNumber, setCustomerNumber] = useState('')
    const [CustomerAddresStreet, setCustomerAddresStreet] = useState('')
    const [CustomerAddresStreetNumber, setCustomerAddresStreetNUmber] = useState('')
    const [CustomerAddresComplementary, setCustomerAddresComplementary] = useState('')
    const [CustomerAddresNeighborhood, setCustomerAddresNeighborhood] = useState('')
    const [CustomerAddresZipCode, setCustomerAddresZipCode] = useState('')
    const [CustomerPhoneDDD, setCustomerPhoneDDD] = useState('')
    const [CustomerPhoneNumber, setCustomerPhoneNumber] = useState('')
    const [CustomerSex, setCustomerSex] = useState([])
    const [CustomerBornAt, setCustomerBornAt] = useState('')



    const handleInputFocus = (e) => {

        setFocus(e.target.name);
    }



    const resultgod = <Result
        status="success"
        title="Sua Transação foi concluida com Sucesso!"
        subTitle="Em minutos você receberá detalhes da assinatura + credenciais para primeiro acesso"
        extra={
            <Button type="primary" key="console" onClick={() => window.open("https://sys.seplaneje.com")}>
                Ir para Login
        </Button>
        }
    />

    const resultbad = <Result
        status="warning"
        title="Sua Transação NÃO foi concluida!"
        subTitle="Verifique suas informações, em caso de duvida entre em contato com contato@seplaneje.com"

    />

    const handleInputChange = (e) => {

        if (!isNaN(e.target.value) === true) {
            const { value } = e.target;
            setNumber(value)
        }
    }

    const handleInputChangeFones = (e) => {

        if (!isNaN(e.target.value) === true) {
            const { value } = e.target;
            setCustomerPhoneNumber(value)
        }
    }

    const handleInputChangeFonesDDD = (e) => {

        if (!isNaN(e.target.value) === true) {
            const { value } = e.target;
            setCustomerPhoneDDD(value)
        }
    }

    const handleInputChangeCEP = (e) => {

        if (!isNaN(e.target.value) === true) {
            const { value } = e.target;
            setCustomerAddresZipCode(value)
        }
    }

    const handleInputChangeNUMENDERECO = (e) => {

        if (!isNaN(e.target.value) === true) {
            const { value } = e.target;
            setCustomerAddresStreetNUmber(value)
        }
    }

    const handleInputChangeCPF = (e) => {

        if (!isNaN(e.target.value) === true) {
            const { value } = e.target;
            setCustomerNumber(value)
        }
    }
    //setCustomerNumber

    //setCustomerAddresStreetNUmber

    const handleInputChangeName = (e) => {
        const { value } = e.target;
        setName(value)
    }

    const handleInputChangeValid = (e) => {
        const { value } = e.target;
        setExpiry(value)
    }

    const handleInputChangeCvv = (e) => {
        const { value } = e.target;
        setCvc(value)
    }

    function FormataStringData(data) {

        var dia = data.split("-")[2];
        var mes = data.split("-")[1];
        var ano = data.split("-")[0];

        return ("0" + dia).slice(-2) + '-' + ("0" + mes).slice(-2) + '-' + ano;
        // Utilizo o .slice(-2) para garantir o formato com 2 digitos.
    }

    function resultTransaction() {
        setPlano(resultgod)
        setCvc('');
        setExpiry('');
        setFocus('');
        setName('');
        setNumber('');
        setCustomerEmail('');
        setCustomerName('');
        setCustomerNumber('');
        setCustomerAddresStreet('');
        setCustomerAddresStreetNUmber('');
        setCustomerAddresComplementary('');
        setCustomerAddresNeighborhood('');
        setCustomerAddresZipCode('');
        setCustomerPhoneDDD('');
        setCustomerPhoneNumber('');
        setCustomerSex('');
        setCustomerBornAt('');
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const body = {
            PlanId: selectPlanoButton,
            CardNumber: number,
            CardName: name,
            ExpireDate: expiry,
            Cvv: cvc,
            CustomerEmail: CustomerEmail,
            CustomerName: CustomerName,
            CustomerNumber: CustomerNumber,
            CustomerAddresStreet: CustomerAddresStreet,
            CustomerAddresStreetNumber: CustomerAddresStreetNumber,
            CustomerAddresComplementary: CustomerAddresComplementary,
            CustomerAddresNeighborhood: CustomerAddresNeighborhood,
            CustomerAddresZipCode: CustomerAddresZipCode,
            CustomerPhoneDDD: CustomerPhoneDDD,
            CustomerPhoneNumber: CustomerPhoneNumber,
            CustomerSex: CustomerSex,
            CustomerBornAt: FormataStringData(CustomerBornAt)
        }

        const endpointAPI = `${urlBackend}api/pagarme/assinatura`
        const result = await axios.post(endpointAPI, body)

        if (result.data.StatusTransac === 200) {
            resultTransaction()
        } else {
            setPlano(resultbad)
        }
    }



    return (
        <div className='newPlan'>

            <form className='ContainerEstrutura' onSubmit={handleSubmit}>

                <div className='SelectPlano'>
                    <Button type={selectPlanoButton === 'mensal' ? 'danger' : 'primary'} onClick={() => {
                        setPlano(mensal)
                        setSelectPlanoButton('mensal')
                    }}>Seplaneje - Mensal</Button>
                    <Button type={selectPlanoButton === 'trimestral' ? 'danger' : 'primary'} onClick={() => {
                        setPlano(trimestral)
                        setSelectPlanoButton('trimestral')
                    }}>Seplaneje - Trimestral</Button>
                    <Button type={selectPlanoButton === 'semestral' ? 'danger' : 'primary'} onClick={() => {
                        setPlano(Semestral)
                        setSelectPlanoButton('semestral')
                    }}>Seplaneje - Semestral</Button>
                    <Button type={selectPlanoButton === 'anual' ? 'danger' : 'primary'} onClick={() => {
                        setPlano(Anual)
                        setSelectPlanoButton('anual')
                    }}>Seplaneje - Anual</Button>

                </div>

                <div className='DadosCadastrais'>


                    <div className='PlanoContainer'>
                        {plano}
                    </div>

                    <div className='DadosCliente'>
                        <h2>Dados Cadastrais</h2>

                        <Input
                            type="email"
                            required
                            name="name"
                            value={CustomerEmail}
                            className="emailUser"
                            placeholder="Informe o E-mail ex: fulano@seplaneje.com"
                            onChange={(valor) => setCustomerEmail(valor.target.value)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />

                        <Input
                            type="text"
                            required
                            name="nameUser"
                            value={CustomerName}
                            className="nameUser"
                            placeholder="Informe seu Nome"
                            onChange={(valor) => setCustomerName(valor.target.value)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />

                        <Input
                            data-ls-module="charCounter"
                            required
                            type="text"
                            maxLength={11}
                            title='Somente numeros'
                            name="cpf"
                            value={CustomerNumber}
                            className="cpf"
                            placeholder="Informe o CPF"
                            onChange={(valor) => handleInputChangeCPF(valor)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />

                        <Input
                            type="date"
                            required
                            name="Dtnasci"
                            value={CustomerBornAt}
                            className="Dtnasci"
                            placeholder="Data Nascimento"
                            onChange={(valor) => setCustomerBornAt(valor.target.value)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />

                        <Select
                            // style={{ width: '100%' }}
                            className="sex"
                            required
                            placeholder="Sexo"
                            onSelect={(valor) => setCustomerSex(valor)}
                            value={CustomerSex}>
                            <Option value="1">Masculino</Option>
                            <Option value="2">Feminino</Option>
                        </Select>

                        <h2> Dados para Contato</h2>

                        <Input
                            className="endereco"
                            required
                            type="text"
                            name="Endereco"
                            value={CustomerAddresStreet}
                            placeholder="Informe o seu endereço"
                            onChange={(valor) => setCustomerAddresStreet(valor.target.value)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />

                        <Input
                            className="numero"
                            data-ls-module="charCounter"
                            required
                            type="text"
                            name="numEndereco"
                            // maxLength={8}
                            value={CustomerAddresStreetNumber}
                            placeholder="nº"
                            onChange={(valor) => handleInputChangeNUMENDERECO(valor)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />

                        <Input
                            className="complemento"
                            required
                            type="text"
                            name="complemento"
                            value={CustomerAddresComplementary}
                            placeholder="Complemento"
                            onChange={(valor) => setCustomerAddresComplementary(valor.target.value)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />

                        <Input
                            className="bairro"
                            required
                            type="text"
                            name="Bairro"
                            value={CustomerAddresNeighborhood}
                            placeholder="Bairro"
                            onChange={(valor) => setCustomerAddresNeighborhood(valor.target.value)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />

                        <Input
                            className="cep"
                            data-ls-module="charCounter"
                            required
                            type="text"
                            name="Cep"
                            maxLength={8}
                            value={CustomerAddresZipCode}
                            placeholder="Cep Somente Números"
                            onChange={(valor) => handleInputChangeCEP(valor)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />

                        <div className='Contato'>
                            <Input className="DDD"
                                data-ls-module="charCounter"
                                required
                                type="text"
                                name="ddd"
                                maxLength={3}
                                value={CustomerPhoneDDD}
                                placeholder="DDD"
                                onChange={(valor) => handleInputChangeFonesDDD(valor)}
                                onFocus={(vlr) => handleInputFocus(vlr)}
                            />

                            <Input
                                className='fone'
                                data-ls-module="charCounter"
                                required
                                maxLength={9}
                                type="text"
                                name="fone"
                                value={CustomerPhoneNumber}
                                placeholder="Informe o telefone"
                                onChange={valor => handleInputChangeFones(valor)}
                                onFocus={(vlr) => handleInputFocus(vlr)}
                            />
                        </div >
                    </div >
                </div>

                <div id="PaymentForm" className='DadosFinanceiro'>
                    <div className='cardImage'>
                        <Cards
                            cvc={cvc}
                            expiry={expiry}
                            focused={focus}
                            name={name}
                            number={number}
                        />
                    </div>
                    <div className='cardDetails'>
                        <h2>Dados Financeiros</h2>
                        <Input
                            className='cardNumber'
                            data-ls-module="charCounter"
                            required
                            maxLength={16}
                            type="text"
                            name="number"
                            value={number}
                            placeholder="Número do Cartão de Crédito"
                            onChange={valor => handleInputChange(valor)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />

                        <Input
                            className='cardName'
                            required
                            type="name"
                            name="name"
                            value={name}
                            placeholder="Nome Igual ao do Cartão de Crédito"
                            onChange={(valor) => handleInputChangeName(valor)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />

                        <Input
                            className='cardExpire'
                            required
                            data-ls-module="charCounter"
                            maxLength={4}
                            type="tel"
                            name="expiry"
                            value={expiry}
                            placeholder="Validade do Cartão"
                            onChange={(valor) => handleInputChangeValid(valor)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />

                        <Input
                            className='cardCvc'
                            required
                            data-ls-module="charCounter"
                            maxLength={3}
                            type="tel"
                            name="cvc"
                            value={cvc}
                            placeholder="cvv"
                            onChange={(valor) => handleInputChangeCvv(valor)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />
                    </div>

                </div>
                <div className='btenviar'>
                    <Button className='bt' htmlType="submit" > Assinar</Button>
                </div>
            </form>

            <div className='detailsFornecedor'>
                <h1>Se<span>planeje</span></h1>
                <p>O site e o Aplicativo Seplaneje são oferecidos pela JBI TEC INFORMATÍCA LTDA, sociedade limitada inscrita no CNPJ sob o nº 33.917.773/0001-96</p>
                <ul>
                    <Button type='danger' onClick={() => window.open("https://www.seplaneje.com/termos-e-condicoes-de-uso", '_blank')}>Termo de Uso</Button>
                    <Button type='danger' onClick={() => window.open("https://www.seplaneje.com/politica-de-privacidade", '_blank')}>Politica de Privacidade</Button>
                </ul>
            </div>
        </div >
    );

}
