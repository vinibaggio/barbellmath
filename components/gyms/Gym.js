import { Component } from 'react';
import { connect } from 'react-redux';

class Gym extends Component {
  render = () => {
    return (
      <View><Text>Oi</Text></View>
    )
  }
}

function mapStateToProps (state) {
  return {
    name: state.gym.name
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchSetName: (name) => dispatch(setName(name))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BarbellMath)
