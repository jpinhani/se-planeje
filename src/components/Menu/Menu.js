import React from "react"
import './style.css'


function Menu() {
    return (
        <nav>
            <ul class="menubar">
                <li>
                    <input class="input01" id="check01" type="checkbox" name="menu" />
                    <label for="check01">Cadastros</label>
                    <ul class="submenu">
                        <li><a href="#">Cartões</a></li>
                        <li><a href="#">Contas</a></li>
                        <li><a href="#">Naturezas</a></li>
                        <li><a href="#">Visões</a></li>
                    </ul>
                </li>
                <li>
                    <input id="check02" type="checkbox" name="menu" />
                    <label for="check02">Previsto</label>
                    <ul class="submenu">
                        <li><a href="#">Despesas</a></li>
                        <li><a href="#">Receitas</a></li>
                    </ul>
                </li>
                <li>
                    <input id="check03" type="checkbox" name="menu" />
                    <label for="check03">Realizado</label>
                    <ul class="submenu">
                        <li><a href="#">Despesas</a></li>
                        <li><a href="#">Faturas</a></li>
                        <li><a href="#">Receita</a></li>
                        <li><a href="#">Tranferências</a></li>
                    </ul>
                </li>
                <li>
                    <input id="check04" type="checkbox" name="menu" />
                    <label for="check04">Resumo</label>
                    <ul class="submenu">
                        <li><a href="#">Fluxo de Caixa</a></li>
                        <li><a href="#">Previsto x Realizado</a></li>
                        <li><a href="#">Outros</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
    )
}

export default Menu