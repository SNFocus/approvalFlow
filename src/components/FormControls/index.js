import Amount from './Amount'
import Calculation from './Calculation'
import TimeDuration from './TimeDuration'
import DateDuration from './DateDuration'
import DepTransfer from './DepTransfer'
const components = [
  Amount,
  Calculation,
  TimeDuration,
  DateDuration,
  DepTransfer
]

const install = function ( Vue ) {
  components.map( component => {
    Vue.component( component.name, component )
  } )
}

export default {
  install
}