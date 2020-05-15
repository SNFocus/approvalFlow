import Amount from './Amount'
import Calculation from './Calculation'
import TimeDuration from './TimeDuration'
import DateDuration from './DateDuration'
import OrgTransfer from './OrgTransfer'
import OrgSelect from './OrgSelect'
import InputTable from './InputTable'
const components = [
  Amount,
  Calculation,
  TimeDuration,
  DateDuration,
  OrgTransfer,
  OrgSelect,
  InputTable
]

const install = function ( Vue ) {
  components.map( component => {
    Vue.component( component.name, component )
  } )
}

export default {
  install
}