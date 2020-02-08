import React from "react"


function Button(props){
    return (
        <button>
            {props.textoDoBotao || 'Gravar'}
        </button>
    )
} 

export default Button