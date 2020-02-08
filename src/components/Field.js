import React from 'react'


function Field(props){
  
      return <input name={props.name} type={props.tipocampo || 'text'}/>

}

export default Field

