import axios from 'axios'
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get ( url, params ) {
  params = params || {}
  return new Promise( ( resolve, reject ) => {
    axios
      .get( url, {
        params: params
      } )
      .then( res => {
        resolve( res.data )
      } )
      .catch( err => {
        reject( err.data )
      } )
  } )
}
export default axios
