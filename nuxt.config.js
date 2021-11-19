export default {
  target: 'static',

  head: {
    titleTemplate: '%s :: Alphington Skittles',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
  },

  components: true,

  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/tailwindcss',
  ],

  modules: [
    '@nuxtjs/axios',
  ],

  publicRuntimeConfig: {
    axios: {
      baseURL: process.env.NODE_ENV === 'production' ? process.env.URL || 'http://localhost:8888/' : 'http://localhost:8888/',
    },
  },
}
