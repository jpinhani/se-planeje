import React from 'react';

function Title(props) {
  return (
      <h1>{props.text || 'Informar Texto'}</h1>
  )
}

export default Title;
