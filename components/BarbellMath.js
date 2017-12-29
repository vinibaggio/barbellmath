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

const bars = [20, 10];


export class Plate extends Component{
  render() {
    let bgColor = plateColors[this.props.plate].backgroundColor &&this.props.quantity > 0 ? {backgroundColor: plateColors[this.props.plate].backgroundColor} : {}
    let fgColor = plateColors[this.props.plate].color && this.props.quantity > 0 ? {color: plateColors[this.props.plate].color} : {color: '#fff'}

    return (
      <View style={{width: 100, marginTop:5}}>
        <Badge
          textStyle={[{ fontWeight: 'bold', fontSize: 20 }, fgColor]}
          containerStyle={[
            this.props.quantity == 0 && styles.disabledPill,
            this.props.quantity > 0 && bgColor
          ]}
          value={`${this.props.quantity} x ${this.props.plate}`}
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
  }

  updateIndex = (barIdx) => {
    this.setState({ barIdx })
  }

  updateWeight = ((newWeight) => {
    if (newWeight < 20) {
      return;
    }

    this.setState((prevState) => {
      return { ...prevState, weight: newWeight }
    })
  })

  startLongPress = (qty) => {
    this.timer = setInterval(() => this.addWeight(qty), 100);
  }

  stopLongPress = () => {
    clearInterval(this.timer)
    this.timer = null;
  }

  checkQuickPress = (qty) => {
    if (!this.timer) {
      this.addWeight(qty)
    }
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
              onPress={() => this.checkQuickPress(-1)}
              onPressIn={() => this.startLongPress(-1)}
              onPressOut={this.stopLongPress}>
            <Icon
              raised
              containerStyle={[this.state.weight == bar && {backgroundColor: '#ccc'}]}
              name='minus'
              type='font-awesome'
            />
            </TouchableWithoutFeedback>
            <View>
              <Text style={{ fontSize: 50 }}>{this.state.weight}</Text>
            </View>
            <Text style={{ fontSize: 20, color: '#666', fontVariant: ['small-caps'] }}>kg</Text>
            <TouchableWithoutFeedback
              onPress={() => this.checkQuickPress(1)}
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
        <View style={{ height: 300, alignItems: 'center'}}>
          {sortedPlates.map((plate) => (
            <Plate key={plate} quantity={plates[plate]} plate={plate} />
          ))}
        </View>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={this.state.barIdx}
          buttons={this.barButtons}
          containerStyle={styles.barPicker}
        />
      </View>
    )
  }
}

let styles = StyleSheet.create({
  'barPicker': {
    height: 40,
    padding: 0,
    marginTop: Platform.OS === 'ios' ? 0 : 15,
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
