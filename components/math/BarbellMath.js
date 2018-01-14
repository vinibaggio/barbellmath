import React, { Component } from 'react';
import {connect} from 'react-redux';
import { setInterval } from 'core-js/library/web/timers';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import LongPressButton from '../ui/LongPressButton'
import { calculatePlates } from '../weights/Weight';
import Plate from './Plate'

import {setUnit} from './actions'

class BarbellMath extends Component {
  constructor(props) {
    super(props)

    const unitIdx = this.props.units.indexOf(this.props.currentUnit);
    this.state = { weight: Math.max.apply(Math, this.props.bars), barIdx: 0, unitIdx: unitIdx };
  }

  componentWillReceiveProps(nextProps) {
    this._updateMinWeight(this.state.barIdx, nextProps, this.state)
  }

  updateIndex = (barIdx) => {
    this._updateMinWeight(barIdx, this.props, this.state)
  }

  _updateMinWeight = (barIdx, props, state) => {
    this.setState({ barIdx, weight: Math.max(props.bars[barIdx], state.weight) })
  }

  updateUnit = (unitIdx) => {
    this.props.dispatchSetUnit(this.props.units[unitIdx]);
    this.setState({unitIdx: unitIdx});
  }

  updateWeight = ((newWeight) => {
    if (newWeight < this.props.bars[this.state.barIdx]) {
      return;
    }

    this.setState((prevState) => {
      return { ...prevState, weight: newWeight }
    })
  })

  onLongPressTick = (tick, incr) => {
    let multiplier = 1;
    if (tick >= 30) {
      multiplier = 10;
    } else if (tick >= 20) {
      multiplier = 5;
    }

    this.addWeight(multiplier * incr);
  }

  addWeight = (weight) => {
    this.updateWeight(this.state.weight + weight);
  }

  render() {
    let bar = this.props.bars[this.state.barIdx];
    let plates = calculatePlates(this.state.weight, bar);
    let sortedPlates = Object.keys(plates).map(x => Number(x)).sort((a, b) => b-a)

    return (
      <View style={styles.container}>
        <View style={{ marginTop: 20, height: 70, alignItems: 'center' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 70 }}>{this.state.weight}</Text>
            <Text style={{ fontSize: 20, color: '#666', fontVariant: ['small-caps'] }}>{this.props.currentUnit}</Text>
          </View>
        </View>
        <View style={{ height: 350, alignItems: 'center'}}>
          {sortedPlates.map((plate) => (
            <Plate key={plate} quantity={plates[plate]} plate={plate} />
          ))}
        </View>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={this.state.barIdx}
          buttons={this.props.bars.map(this.props.humanWeight)}
          containerStyle={styles.barPicker}
          textStyle={styles.barPickerText}
          selectedBackgroundColor={"#666"}
          selectedTextStyle={{color: '#fff'}}
        />
        <ButtonGroup
          onPress={this.updateUnit}
          selectedIndex={this.state.unitIdx}
          buttons={this.props.units}
          containerStyle={styles.barPicker}
          textStyle={styles.barPickerText}
          selectedBackgroundColor={"#666"}
          selectedTextStyle={{color: '#fff'}}
        />

        <View style={{ height: 100, alignItems: 'center' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <LongPressButton
              icon='minus'
              onLongPressTick={(tick) => this.onLongPressTick(tick, -1)}
              disabled={this.state.weight == bar}
              />
            <LongPressButton
              icon='plus'
              onLongPressTick={(tick) => this.onLongPressTick(tick, 1)}
              />
          </View>
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  'barPicker': {
    height: 40,
    padding: 0,
    marginTop: 15,
    backgroundColor: '#ddd'
  },

  'barPickerText': {
    fontWeight: 'bold',
    color: '#fff'
  },

  'container': {
    padding: 10,
    flex: 1, alignItems: 'stretch', justifyContent: 'center'
  },
})


function mapStateToProps (state) {
  return {
    units: state.weights.units,
    bars: state.weights.bars,
    plates: state.weights.plates,
    currentUnit: state.gym.unit,
    gymName: state.gym.name,
    humanWeight: function(weight) {
      return `${weight}${state.gym.unit}`
    }
  }
}

function mapDispatchToProps (dispatch) {
  return {
    dispatchSetUnit: (unit) => dispatch(setUnit(unit)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BarbellMath)
