import React from 'react'
import { connect } from 'react-redux'
import { updateAllUser } from '../../store/actions/userAction.js'

class Teste extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      console.log('componente!')
      this.props.updateAllUser('um novo valor!')
    }, 5000)
  }

  render() {
    return (
      <h1>{this.props.user}</h1>
    )
  }

}

const mapStateToProps = (state /*, ownProps*/) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = { updateAllUser }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Teste)