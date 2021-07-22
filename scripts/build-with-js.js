const { compile } = require('nexe')

compile({
  input: 'index.js',
  build: true
  
}).then(() => {
  console.log('success')
})