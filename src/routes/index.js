import React from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import { Layout } from 'antd'

import PublicRoute from './PublicRoutes'
import PrivateRoute from './PrivateRoutes'

import Home from '../pages/Home/'
import Login from '../pages/Login/'
import Visao from '../pages/Visoes'
import SelectConta from '../pages/SelectConta'
import SelectCartao from '../pages/SelectCartao'
import SelectCategory from '../pages/SelectCategoria'
import SelectDespesaPrevista from '../pages/SelectDespesaPrevista'
import SelectDespesaRealizada from '../pages/SelectDespesaRealizada'
import SelectReceitaPrevista from '../pages/SelectReceitaPrevista'
import SelectPagarMeta from '../pages/SelectDespesaPagar'
import SelectFaturaPagar from '../pages/SelectFaturaPagar'
import SelectFaturaContabilizada from '../pages/selectFaturasContabilizadas'
import Navebar from '../pages/Navebar/index.js'
import NavebarMObile from '../pages/NavebarMobile/index.js'
import Header from '../pages/Header/index.js'
import Resumo from '../pages/Resumo'
import SelectReceitaMeta from '../pages/SelectReceitaMeta'
import SelectReceitaReal from '../pages/SelectReceitaRealizada'
import SelectTransferencia from '../pages/SelectTransferencias'
import NewPlano from '../pages/NewPlano'

const { Content } = Layout;

class routesSePlaneje extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      width: 0
    }
  }

  resolucao() {
    const width = window.screen.width;
    this.setState({ ...this.state, width: width })
  }

  componentDidMount() {
    this.resolucao()
  }

  render() {
    return (
      <BrowserRouter>
        <Layout style={{ minHeight: '100vh' }} >
          {this.state.width <= 850 ? <NavebarMObile /> : <Navebar />}
          <Layout>
            <Header />
            <Content
              style={{ padding: '30px' }}>
              <Switch name='http://localhost:3000'>
                <PublicRoute exact path='/login' component={Login} />
                <PublicRoute exact path='/novoPlano' component={NewPlano} />
                <PrivateRoute exact path='/selectconta' component={SelectConta} />
                <PrivateRoute exact path='/selectcartao' component={SelectCartao} />
                <PrivateRoute exact path='/selectcategoria' component={SelectCategory} />
                <PrivateRoute exact path='/selectdespesaprevista' component={SelectDespesaPrevista} />
                <PrivateRoute exact path='/selectdespesarealizada' component={SelectDespesaRealizada} />
                <PrivateRoute exact path='/selectreceitaprevista' component={SelectReceitaPrevista} />
                <PrivateRoute exact path='/selectPagarMeta' component={SelectPagarMeta} />
                <PrivateRoute exact path='/SelectFaturaPagar' component={SelectFaturaPagar} />
                <PrivateRoute exact path='/SelectFaturaContabilizada' component={SelectFaturaContabilizada} />
                <PrivateRoute exact path='/Resumo' component={Resumo} />
                <PrivateRoute exact path='/selectReceitaMeta' component={SelectReceitaMeta} />
                <PrivateRoute exact path='/visao' component={Visao} />
                <PrivateRoute exact path='/SelectReceitaReal' component={SelectReceitaReal} />
                <PrivateRoute exact path='/SelectTransferencia' component={SelectTransferencia} />
                <PrivateRoute component={Home} />
              </Switch>
            </Content>
          </Layout>
        </Layout >
      </BrowserRouter >)
  }
}


export default routesSePlaneje

