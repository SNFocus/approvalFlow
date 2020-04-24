import axios from 'axios'
import router from '../router'
import { Message } from 'element-ui'

let on = true;
var userId = '';
// 设置统一header
axios.interceptors.request.use( config => {
  if ( localStorage.token )
    //所有的请求都要带user_id
    userId = JSON.parse( window.atob( localStorage.token.split( '.' )[1] ) ).userId;
  // userId = json.userId;
  config.headers.Authorization = localStorage.token;
  config.headers.user_id = userId;

  return config
}, error => {
  return Promise.reject( error )
} )

//token过期处理
axios.interceptors.response.use( response => {
  if ( response.headers ) {
    localStorage.setItem( 'token', response.headers.authorization )
  }
  if ( !response.data.isOk && response.data.resCode == 888 ) {
    if ( on ) {
      on = false;//没有这个它执行两次
      Message( {
        showClose: true,
        message: '登录失效请重新登录',
        type: 'warning',
        duration: 1500
      } );

      setTimeout( () => {
        try {
          window.top.parent.ckOpenfire.closeSession();
          asyncJS.cancelEvenl();
          return;
        } catch ( error ) {
          window.top.parent.aaaago();
        }
        on = true;
      }, 2000 );
    }
  }
  return response;
},
  error => {
    const { status } = error.response;
    if ( status == 401 ) {
      Message.error( "token值无效，请重新登录" );
      // 清除token
      localStorage.removeItem( "token" );
      // 页面跳转
      router.push( "/login" );
    }

    return Promise.reject( error );
  }
);

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get ( url, params ) {
  var params = params || {};
  return new Promise( ( resolve, reject ) => {
    axios
      .get( url, { params: params } )
      .then( res => resolve( res.data ) )
      .catch( err => reject( err.data ) );
  } );
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post ( url, params ) {
  var params = params || {};
  return new Promise( ( resolve, reject ) => {
    axios
      .post( url, params )
      .then( res => resolve( res.data ) )
      .catch( err => reject( err.data ) );
  } );
}

export function postByFormEncoded ( url, params ) {
  var params = params || {};
  return axios( {
    method: 'post',
    url: url,
    data: params,
    transformRequest: [
      function ( data ) {
        let ret = '';
        for ( let it in data ) {
          ret += encodeURIComponent( it ) + '=' + encodeURIComponent( data[it] ) + '&';
        }
        if ( ret === "" ) return "";
        return ret.substring( 0, ret.length - 1 );
      }
    ],
    //设置请求头
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  } )
}

export default axios
