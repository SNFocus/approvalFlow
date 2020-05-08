import Amount from './Amount'
import Calculation from './Calculation'
import TimeDuration from './TimeDuration'
import DateDuration from './DateDuration'
const components = [
  Amount,
  Calculation,
  TimeDuration,
  DateDuration
]

const install = function ( Vue ) {
  components.map( component => {
    Vue.component( component.name, component )
  } )
}

export default {
  install
}