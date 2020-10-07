module.exports = {
  transpileDependencies: ["vuetify"],
  chainWebpack: config => {
    config
    .devServer.disableHostCheck(true)
  }
};
