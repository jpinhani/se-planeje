import React, { useState } from 'react';
import Cards from 'react-credit-cards';
import { Input, Button, Select } from 'antd';
import { InsertRequest } from '../../components/crudSendAxios/crud'

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
        // console.log(e.target.name)
        setFocus(e.target.name);
    }



    const handleInputChange = (e) => {
        console.log(e.target.value)
        console.log(!isNaN(e.target.value))

        if (!isNaN(e.target.value) === true) {
            const { value } = e.target;
            setNumber(value)
        }

    }

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

        const result = await InsertRequest(body, 'api/pagarme/assinatura')
        console.log(result.status)
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
                            className="emailUser"
                            placeholder="Informe o E-mail ex: fulano@seplaneje.com"
                            onChange={(valor) => setCustomerEmail(valor.target.value)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />
                        <Input
                            type="text"
                            required
                            name="nameUser"
                            className="nameUser"
                            placeholder="Informe seu Nome"
                            onChange={(valor) => setCustomerName(valor.target.value)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />
                        <Input
                            type="text"
                            required
                            title='Somente numeros'
                            name="cpf"
                            className="cpf"
                            placeholder="Informe o CPF"
                            onChange={(valor) => setCustomerNumber(valor.target.value)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />

                        <Input
                            type="date"
                            required
                            name="Dtnasci"
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
                            placeholder="Informe o seu endereço"
                            onChange={(valor) => setCustomerAddresStreet(valor.target.value)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />
                        <Input
                            className="numero"
                            required
                            type="text"
                            name="numEndereco"
                            placeholder="nº"
                            onChange={(valor) => setCustomerAddresStreetNUmber(valor.target.value)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />
                        <Input
                            className="complemento"
                            required
                            type="text"
                            name="complemento"
                            placeholder="Complemento"
                            onChange={(valor) => setCustomerAddresComplementary(valor.target.value)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />
                        <Input
                            className="bairro"
                            required
                            type="text"
                            name="Bairro"
                            placeholder="Bairro"
                            onChange={(valor) => setCustomerAddresNeighborhood(valor.target.value)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />
                        <Input
                            className="cep"
                            required
                            type="text"
                            name="Cep"
                            placeholder="Cep"
                            onChange={(valor) => setCustomerAddresZipCode(valor.target.value)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />
                        <div className='Contato'>
                            <Input className="DDD"
                                required
                                type="tel"
                                name="ddd"
                                placeholder="DDD"
                                onChange={(valor) => setCustomerPhoneDDD(valor.target.value)}
                                onFocus={(vlr) => handleInputFocus(vlr)}
                            />
                            <Input className="fone"
                                required
                                type="tel"
                                name="telefone"
                                placeholder="Informe o telefone"
                                onChange={(valor) => setCustomerPhoneNumber(valor.target.value)}
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
                            placeholder="Card Number"
                            onChange={valor => handleInputChange(valor)}
                            onFocus={(vlr) => handleInputFocus(vlr)}
                        />

                        <Input
                            className='cardName'
                            required
                            type="name"
                            name="name"
                            placeholder="Name on card"
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
                            placeholder="Card expiry date"
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
                            placeholder="cvc"
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
