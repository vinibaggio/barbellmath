import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import { Slider, ButtonGroup, Button, Badge, Icon } from 'react-native-elements';
import { humanWeight, platesForWeight, calculatePlates } from './Weight';
import { setInterval } from 'core-js/library/web/timers';

const bars = [20, 15];

export class Plate extends Component{
  render() {
    let bgColor = plateColors[this.props.plate].backgroundColor &&this.props.quantity > 0 ? {backgroundColor: plateColors[this.props.plate].backgroundColor} : {}
    let fgColor = plateColors[this.props.plate].color && this.props.quantity > 0 ? {color: plateColors[this.props.plate].color} : {color: '#fff'}

    return (
      <View style={{width: 110, marginTop:5}}>
        <Badge
          textStyle={[{ fontWeight: 'bold', fontSize: 20 }, fgColor]}
          containerStyle={[
            this.props.quantity == 0 && styles.disabledPill,
            this.props.quantity > 0 && bgColor
          ]}
          value={`${this.props.quantity} ✕ ${this.props.plate}`}
        />
      </View>
    )
  }
}

export default class BarbellMath extends Component {
  constructor(props) {
    super(props)
    this.state = { weight: 20, barIdx: 0, adder: 0}
    this.barButtons = bars.map((bar) => humanWeight(bar))
    this.timer = null;
    this.delayedTimer = null;
  }

  updateIndex = (barIdx) => {
    this.setState({ barIdx, weight: Math.max(bars[barIdx], this.state.weight) })
  }

  updateWeight = ((newWeight) => {
    if (newWeight < bars[this.state.barIdx]) {
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
    let bar = bars[this.state.barIdx];
    let plates = calculatePlates(this.state.weight, bar);
    let sortedPlates = Object.keys(plates).map(x => Number(x)).sort((a, b) => b-a)

    return (
      <View style={styles.container}>
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
              <Text style={{ fontSize: 50 }}>{this.state.weight}</Text>
            <Text style={{ fontSize: 20, color: '#666', fontVariant: ['small-caps'] }}>kg</Text>
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
        <View style={{ height: 350, alignItems: 'center'}}>
          {sortedPlates.map((plate) => (
            <Plate key={plate} quantity={plates[plate]} plate={plate} />
          ))}
        </View>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={this.state.barIdx}
          buttons={this.barButtons}
          containerStyle={styles.barPicker}
          textStyle={styles.barPickerText}
          selectedBackgroundColor={"#666"}
          selectedTextStyle={{color: '#fff'}}
        />
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

  'disabledPill': {
    backgroundColor: '#ddd',
  },
  'container': {
    padding: 10,
    flex: 1, alignItems: 'stretch', justifyContent: 'center'
  },
})

let plateColors = {
  0.25: { backgroundColor: '#666' },
  0.50: { backgroundColor: '#666' },
  1.25: { backgroundColor: '#666' },
  2.50: { backgroundColor: '#666' },
  5: { backgroundColor: '#666' },
  10: { backgroundColor: '#55FF55', color: '#666' },
  15: { backgroundColor: '#ff0', color: '#666' },
  20: { backgroundColor: '#3333FF' },
  25: { backgroundColor: '#FF3333' },
}
