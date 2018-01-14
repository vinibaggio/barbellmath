import React, { Component } from 'react'
import {
  TouchableWithoutFeedback,
  View
} from "react-native";

import {
  Icon
} from 'react-native-elements';

export default class LongPressButton extends Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.delayedTimer = null;
  }

  startLongPress = (event) => {
    let times = 0;
    this.props.onLongPressTick(times);

    this.delayedTimer = setTimeout(() => {
      clearTimeout(this.delayedTimer);
      this.delayedTimer = null ;

      this.timer = setInterval(() => {
        times++;
        this.props.onLongPressTick(times);
      }, 100);
    }, 300);
  }

  stopLongPress = () => {
    clearInterval(this.timer)
    clearTimeout(this.delayedTimer);
    this.timer = null;
    this.delayedTimer = null;
  }

  render = () => {
    return (
      <View>
        <TouchableWithoutFeedback
          onPressIn={() => this.startLongPress(1)}
          onPressOut={this.stopLongPress}>
          <Icon
            raised
            containerStyle={[this.props.disabled && { backgroundColor: '#ddd' }]}
            name={this.props.icon}
            type='font-awesome'
          />
        </TouchableWithoutFeedback>
      </View>
    )
  }
}
