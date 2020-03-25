const http = require('http')
const port = 3000
const serverHandle = require('./app.js')

const server  = http.createServer(serverHandle)
server.listen(port,()=>{
    console.log('listening')
})