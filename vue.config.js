const path = require( 'path' )

function resolve ( dir ) {
  return path.join( __dirname, dir )
}

module.exports = {
  runtimeCompiler: true,
  publicPath: '/approvalflow/',
  devServer: {
    port: 8088
  },
  css: {
    loaderOptions: {
      // 给 stylus-loader 传递选项
      stylus: {
        import: '~@/assets/style/global.styl'
      }
    }
  },
  chainWebpack ( config ) {
    // set svg-sprite-loader
    config.module
      .rule( 'svg' )
      .exclude.add( resolve( 'src/components/DynamicForm/icons' ) )
      .end()
    config.module
      .rule( 'icons' )
      .test( /\.svg$/ )
      .include.add( resolve( 'src/components/DynamicForm/icons' ) )
      .end()
      .use( 'svg-sprite-loader' )
      .loader( 'svg-sprite-loader' )
      .options( {
        symbolId: 'icon-[name]'
      } )
      .end()
  }
}
