import React from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import { Layout, Breadcrumb } from 'antd'



// import './styles.scss'

import PublicRoute from './PublicRoutes'
import PrivateRoute from './PrivateRoutes'

import Home from '../pages/Home/'
import Login from '../pages/Login/'
import Categoria from '../pages/Categoria'
import Conta from '../pages/Conta'
import Cartao from '../pages/Cartao'
import Visao from '../pages/Visoes'
import SelectConta from '../pages/SelectConta'
import SelectCartao from '../pages/SelectCartao'
import Navebar from '../pages/Navebar/index.js'
import Header from '../pages/Header/index.js'


const { Content } = Layout;

export default () =>
  <BrowserRouter>
    <Layout style={{ minHeight: '100vh' }}>
      <Navebar />
      <Layout>
        <Header />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>

            {/* <Switch name='http://localhost:3000'>
              <PublicRoute exact path='/login' component={Login} />
              <PublicRoute exact path='/categoria' component={Categoria} />
              <PublicRoute exact path='/conta' component={Conta} />
              <PublicRoute exact path='/cartao' component={Cartao} />
              <PublicRoute exact path='/visao' component={Visao} />
              <PrivateRoute component={Home} />
            </Switch> */}

          </Breadcrumb>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Switch name='http://localhost:3000'>
              <PublicRoute exact path='/login' component={Login} />
              <PublicRoute exact path='/categoria' component={Categoria} />
              <PublicRoute exact path='/selectconta' component={SelectConta} />
              <PublicRoute exact path='/selectcartao' component={SelectCartao} />
              <PublicRoute exact path='/conta' component={Conta} />
              <PublicRoute exact path='/cartao' component={Cartao} />
              <PublicRoute exact path='/visao' component={Visao} />
              <PrivateRoute component={Home} />
            </Switch>
          </div>
        </Content>
      </Layout>
    </Layout >
  </BrowserRouter>