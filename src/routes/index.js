import React from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import { Layout, Breadcrumb } from 'antd'



// import './styles.scss'

import PublicRoute from './PublicRoutes'
import PrivateRoute from './PrivateRoutes'

import Home from '../pages/Home/'
import Login from '../pages/Login/'
import Visao from '../pages/Visoes'
import SelectConta from '../pages/SelectConta'
import SelectCartao from '../pages/SelectCartao'
import SelectCategory from '../pages/SelectCategoria'
import Teste from '../pages/Teste'

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
          </Breadcrumb>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Switch name='http://localhost:3000'>
              <PrivateRoute exact path='/teste' component={Teste} />
              <PublicRoute exact path='/login' component={Login} />
              <PrivateRoute exact path='/selectconta' component={SelectConta} />
              <PrivateRoute exact path='/selectcartao' component={SelectCartao} />
              <PrivateRoute exact path='/selectcategoria' component={SelectCategory} />
              <PrivateRoute exact path='/visao' component={Visao} />
              <PrivateRoute component={Home} />
            </Switch>
          </div>
        </Content>
      </Layout>
    </Layout >
  </BrowserRouter>