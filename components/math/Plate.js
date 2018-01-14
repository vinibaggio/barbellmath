import React, {Component} from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import {
  Badge
} from 'react-native-elements';

let plateColors = {
  0.25: { backgroundColor: '#666' },
  0.50: { backgroundColor: '#666' },
  1.25: { backgroundColor: '#666' },
  2.50: { backgroundColor: '#FF3333' },
  5: { backgroundColor: '#666' },
  10: { backgroundColor: '#55FF55', color: '#666' },
  15: { backgroundColor: '#ff0', color: '#666' },
  20: { backgroundColor: '#3333FF' },
  25: { backgroundColor: '#FF3333' },
}

export default class Plate extends Component{
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

let styles = StyleSheet.create({

  'disabledPill': {
    backgroundColor: '#ddd',
  },

})
