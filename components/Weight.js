#!/usr/bin/env node

let platesAvailable = [
  25,
  20,
  15,
  10,
  5,
  2.5,
  1.25,
  0.5,
  0.25,
]

export function calculatePlates(totalWeight, barWeight) {
  const weightMinusBar =  totalWeight - barWeight;
  const sideWeight = weightMinusBar / 2.0;

  let remaining = sideWeight;

  return platesAvailable.reduce((qtys, val) => {
    let divis = Math.floor(remaining / val)
    qtys[val] = divis

    if (divis > 0) {
      remaining = remaining % val
    }

    return qtys
  }, {})
}

export function cleanUnusedPlates(plateQtys) {
  return Object.keys(plateQtys).reduce((qtys, plateNo) => {
    if (plateQtys[plateNo] > 0) {
      qtys[plateNo] = plateQtys[plateNo]
    }

    return qtys
  }, {})
}

export function humanWeight(totalWeight) {
  return `${totalWeight}kg`
}

export function platesForWeight(totalWeight, barWeight) {
  return cleanUnusedPlates(calculatePlates(totalWeight, barWeight))
}

/*
console.log(20, platesForWeight(20, 20))
console.log(30, platesForWeight(30, 20))
console.log(40, platesForWeight(40, 20))
console.log(50, platesForWeight(50, 20))
console.log(53, platesForWeight(53, 20))
console.log(55, platesForWeight(55, 20))
console.log(57, platesForWeight(57, 20))
console.log(59, platesForWeight(59, 20))
console.log(60, platesForWeight(60, 20))
console.log(80, platesForWeight(80, 20))
*/
