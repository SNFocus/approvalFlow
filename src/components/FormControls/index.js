import Amount from './Amount'
const components = [
  Amount
]

const install = function ( Vue ) {
  components.map( component => {
    Vue.component( component.name, component )
  } )
}

export default {
  install
}