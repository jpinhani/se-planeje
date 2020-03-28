import React from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import { Layout, Breadcrumb } from 'antd'

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
import SelectTabDespesa from '../pages/SelectTabDespesa'
import Navebar from '../pages/Navebar/index.js'
import Header from '../pages/Header/index.js'
import testGrafico from '../components/TestGrafico'


const { Content } = Layout;

export default () =>
  <BrowserRouter>
    <Layout style={{ minHeight: '100vh' }}>
      <Navebar />
      <Layout>
        <Header />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
          </Breadcrumb>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Switch name='http://localhost:3000'>
              <PublicRoute exact path='/login' component={Login} />
              <PrivateRoute exact path='/selectconta' component={SelectConta} />
              <PrivateRoute exact path='/selectcartao' component={SelectCartao} />
              <PrivateRoute exact path='/selectcategoria' component={SelectCategory} />
              <PrivateRoute exact path='/selectdespesaprevista' component={SelectDespesaPrevista} />
              <PrivateRoute exact path='/selectdespesarealizada' component={SelectDespesaRealizada} />
              <PrivateRoute exact path='/selectreceitaprevista' component={SelectReceitaPrevista} />
              <PrivateRoute exact path='/grafico' component={testGrafico} />
              <PrivateRoute exact path='/selecttabdespesa' component={SelectTabDespesa} />
              <PrivateRoute exact path='/visao' component={Visao} />
              <PrivateRoute component={Home} />
            </Switch>
          </div>
        </Content>
      </Layout>
    </Layout >
  </BrowserRouter>