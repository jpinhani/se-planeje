import React from "react"


function Button(props) {
    return (
        <button>
            {props.children || 'Gravar'}
        </button>
    )
}

export default Button