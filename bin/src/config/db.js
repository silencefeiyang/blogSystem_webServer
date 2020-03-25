const env = process.env.NODE_ENV      // 环境变量
// 初始化
let MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '456a456',
    port: '3306',
    database: 'myblog'
}
let REDIS_CONFIG = {
        port: 6379,
        host: '127.0.0.1'
    }
if (env === 'env') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '456a456',
        port: '3306',
        database: 'myblog'
    }
    REDIS_CONFIG = {
        port: 6379,
        host: '127.0.0.1'
    }
}
if (env === 'production') {      // 模拟线上
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '456a456',
        port: '3306',
        database: 'myblog'
    }
    REDIS_CONFIG = {
        port: 6379,
        host: '127.0.0.1'
    }
}
module.exports = {
    MYSQL_CONF,
    REDIS_CONFIG
}