const redis = require('redis')
const { REDIS_CONFIG } = require('../config/db')
const redisClient = redis.createClient(REDIS_CONFIG.port, REDIS_CONFIG.host)
redisClient.on('error', (error) => {
    // console.log(error)
})
function redisSet(key, val) {
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, val)
}
function redisGet(key) {
    const promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            if(val === null){
                resolve(null)
            }
            // 在这是为了兼容JSON的转换格式
            try{
                resolve(JSON.parse(val))
            }catch(ex){
                resolve(val)
            }

        })
    })
    return promise
}

module.exports = {
    redisSet,
    redisGet
}