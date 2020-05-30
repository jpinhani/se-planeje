import React, { useState } from 'react';

// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Login from '../../pages/Login';
import Home from '../Home/';
import { Button } from 'antd';

import './styles.scss'
require('dotenv/config')
function Site() {
  const [body, setBody] = useState(<Home />);


  return (
    <div className='Site'>
      <div className='SiteHeader'>
        {/* <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true} transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
          <h1>
            <span>Se</span>
            Planeje
          </h1>
        </ReactCSSTransitionGroup> */}
        <div className='Bheader'>
          <div className='Blogar'>
            <Button className='BlogarContato'><p> Contato</p> </Button>
            <Button className='BlogarPlanos'><p> Planos</p> </Button>
            <Button onClick={() => setBody(<Login />)}><p> Entrar</p> </Button>
          </div>
        </div>
      </div >
      <div className='SiteBody'>
        {body}
      </div>
    </div >
  )
}

export default Site