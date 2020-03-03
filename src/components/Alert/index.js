import React from 'react'
import ReactDOM from 'react-dom'
import { Icon } from 'antd'
import './styles.scss'

export default props => {
  const closeAlert = () => {
    setTimeout(() => {
      props.onCancel()
    }, props.expireIn * 1000 || 5000);
  }

  const renderAlert = () => {
    closeAlert()

    return (
      ReactDOM.createPortal(
        <span className='alert'>
          <div>
            {props.message || 'Alert'}
            <Icon type='close' onClick={props.onCancel} />
          </div>
        </span>,
        document.getElementById('alert-container')
      )
    )
  }

  return props.visible === true ? renderAlert() : null
}