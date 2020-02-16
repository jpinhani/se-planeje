import React from 'react'
import Header from '../../components/Header/Header'
import Menu from '../../components/Menu/Menu'
import Button from '../../components/Button'
import './style.css'


function CadNatureza() {


    function handleSubmit(event) {
        event.preventDefault()
        console.log(event)
    }

    return (
        <div>
            <Header></Header>
            <div class='form-personalize'>
                <Menu></Menu>
                <form>
                    <div>
                        <label>Natureza Contábil</label><br />
                        <input name='valor' type='text' />
                    </div>
                    <div>
                        <Button>Novo</Button>
                        <Button>Pesquisar</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CadNatureza