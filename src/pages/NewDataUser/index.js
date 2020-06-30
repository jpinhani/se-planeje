import React, { useState } from 'react';

import { Input, Button, Select, Result } from 'antd';

// import { urlBackend } from '../../services/urlBackEnd'
// import axios from 'axios'

import 'react-credit-cards/es/styles-compiled.css';
import './styles.scss';

const { Option } = Select;

export default () => {


    const Logo = <div className='PlanoDetails'>
        <div className='PlanoLogo'><h1>Se<span>Planeje</span></h1></div>
        <div className='PlanoRecorrencia'>Complete o Cadastro para criar a Sua Conta.</div>
    </div>

    const [plano, setPlano] = useState(Logo);
    // const [focus, setFocus] = useState('');
    const [psw, setPsw] = useState('');
    const [psw2, setPsw2] = useState('');
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



    const resultgod = <Result
        status="success"
        title="Seu Cadastrado foi Efetuado, no entanto é necessário confirmar seu E-MAIL!"
        subTitle="Em minutos você receberá um email do SEPLANEJE, por favor clicar no link do E-mail enviado para confirmar seu EMAIL, Após você sera redirecionado para escolha do Plano"
    />

    const resultbad = <Result
        status="warning"
        title="Sua Transação NÃO foi concluida!"
        subTitle="Verifique suas informações, em caso de duvida entre em contato com contato@seplaneje.com"

    />

    function FormataStringData(data) {

        var dia = data.split("-")[2];
        var mes = data.split("-")[1];
        var ano = data.split("-")[0];

        return ("0" + dia).slice(-2) + '-' + ("0" + mes).slice(-2) + '-' + ano;
        // Utilizo o .slice(-2) para garantir o formato com 2 digitos.
    }

    function resultTransaction() {
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
        setPlano(resultgod);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const body = {
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


        const result = 200;

        if (result === 200) {
            resultTransaction()
        } else {
            setPlano(resultbad)
        }
    }

    return (
        <div className='newPlan'>

            <form className='ContainerEstrutura' onSubmit={handleSubmit}>
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
                        // onFocus={(vlr) => handleInputFocus(vlr)}
                        />
                        <Input
                            type="password"
                            required
                            name="pswUser"
                            value={psw}
                            className="nameUser"
                            placeholder="Informe a Senha"
                            onChange={(valor) => setPsw(valor.target.value)}
                        // onFocus={(vlr) => handleInputFocus(vlr)}
                        />
                        <Input
                            type="password"
                            required
                            name="pswUserConfirm"
                            value={psw2}
                            className="nameUser"
                            placeholder="Informe a Senha"
                            onChange={(valor) => setPsw2(valor.target.value)}
                        // onFocus={(vlr) => handleInputFocus(vlr)}
                        />
                        <Input
                            type="text"
                            required
                            name="nameUser"
                            value={CustomerName}
                            className="nameUser"
                            placeholder="Informe seu Nome"
                            onChange={(valor) => setCustomerName(valor.target.value)}
                        // onFocus={(vlr) => handleInputFocus(vlr)}
                        />
                        <Input
                            type="text"
                            required
                            title='Somente numeros'
                            name="cpf"
                            value={CustomerNumber}
                            className="cpf"
                            placeholder="Informe o CPF"
                            onChange={(valor) => setCustomerNumber(valor.target.value)}
                        // onFocus={(vlr) => handleInputFocus(vlr)}
                        />

                        <Input
                            type="date"
                            required
                            name="Dtnasci"
                            value={CustomerBornAt}
                            className="Dtnasci"
                            placeholder="Data Nascimento"
                            onChange={(valor) => setCustomerBornAt(valor.target.value)}
                        // onFocus={(vlr) => handleInputFocus(vlr)}
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
                        // onFocus={(vlr) => handleInputFocus(vlr)}
                        />
                        <Input
                            className="numero"
                            required
                            type="text"
                            name="numEndereco"
                            value={CustomerAddresStreetNumber}
                            placeholder="nº"
                            onChange={(valor) => setCustomerAddresStreetNUmber(valor.target.value)}
                        // onFocus={(vlr) => handleInputFocus(vlr)}
                        />
                        <Input
                            className="complemento"
                            required
                            type="text"
                            name="complemento"
                            value={CustomerAddresComplementary}
                            placeholder="Complemento"
                            onChange={(valor) => setCustomerAddresComplementary(valor.target.value)}
                        // onFocus={(vlr) => handleInputFocus(vlr)}
                        />
                        <Input
                            className="bairro"
                            required
                            type="text"
                            name="Bairro"
                            value={CustomerAddresNeighborhood}
                            placeholder="Bairro"
                            onChange={(valor) => setCustomerAddresNeighborhood(valor.target.value)}
                        // onFocus={(vlr) => handleInputFocus(vlr)}
                        />
                        <Input
                            className="cep"
                            required
                            type="text"
                            name="Cep"
                            value={CustomerAddresZipCode}
                            placeholder="Cep"
                            onChange={(valor) => setCustomerAddresZipCode(valor.target.value)}
                        // onFocus={(vlr) => handleInputFocus(vlr)}
                        />
                        <div className='Contato'>
                            <Input className="DDD"
                                required
                                type="tel"
                                name="ddd"
                                value={CustomerPhoneDDD}
                                placeholder="DDD"
                                onChange={(valor) => setCustomerPhoneDDD(valor.target.value)}
                            // onFocus={(vlr) => handleInputFocus(vlr)}
                            />
                            <Input className="fone"
                                required
                                type="tel"
                                name="telefone"
                                value={CustomerPhoneNumber}
                                placeholder="Informe o telefone"
                                onChange={(valor) => setCustomerPhoneNumber(valor.target.value)}
                            // onFocus={(vlr) => handleInputFocus(vlr)}
                            />
                        </div >
                    </div >
                </div>


                <div className='btenviar'>
                    <Button className='bt' htmlType="submit" > Cadastrar Usuário </Button>
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
