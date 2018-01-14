import React, { Component } from 'react';
import {connect} from 'react-redux';
import { setInterval } from 'core-js/library/web/timers';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native';
import { Slider, ButtonGroup, Button, Badge, Icon } from 'react-native-elements';
import { calculatePlates } from '../weights/Weight';
import Plate from './Plate'

import {setUnitKG, setUnitLB} from './actions'

class BarbellMath extends Component {
  constructor(props) {
    super(props)

    const unitIdx = this.props.units.indexOf(this.props.currentUnit);
    this.state = { weight: Math.max.apply(Math, this.props.bars), barIdx: 0, unitIdx: unitIdx },
    this.timer = null;
    this.delayedTimer = null;
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
    if (this.props.units[unitIdx] == 'kg') {
      this.props.dispatchSetKG();
    } else {
      this.props.dispatchSetLB();
    }
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

  startLongPress = (qty) => {
    let times = 0;
    let incr = 0;
    const threshold = 20;
    const increments = [1, 5, 10];

    this.addWeight(increments[incr] * qty);

    this.delayedTimer = setTimeout(() => {
      clearTimeout(this.delayedTimer);
      this.delayedTimer = null ;

      this.timer = setInterval(() => {
        times++;
        if (times > threshold) {
          times = 0;
          incr = Math.min(increments.length-1, incr+1);
        }
        this.addWeight(increments[incr] * qty);
      }, 100);
    }, 300);
  }

  stopLongPress = () => {
    clearInterval(this.timer)
    clearTimeout(this.delayedTimer);
    this.timer = null;
    this.delayedTimer = null;
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
            <TouchableWithoutFeedback
              onPressIn={() => this.startLongPress(-1)}
              onPressOut={this.stopLongPress}>
            <Icon
              raised
              containerStyle={[this.state.weight == bar && {backgroundColor: '#ddd'}]}
              name='minus'
              type='font-awesome'
            />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPressIn={() => this.startLongPress(1)}
              onPressOut={this.stopLongPress}>
              <Icon
                raised
                name='plus'
                type='font-awesome'
              />
            </TouchableWithoutFeedback>
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
    currentUnit: state.weights.currentUnit,
    humanWeight: function(weight) {
      return `${weight}${state.weights.currentUnit}`
    }
  }
}

function mapDispatchToProps (dispatch) {
  return {
    dispatchSetLB: () => dispatch(setUnitLB()),
    dispatchSetKG: () => dispatch(setUnitKG()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BarbellMath)
