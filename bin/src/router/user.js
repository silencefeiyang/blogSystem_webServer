
const { loginMethod } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const {redisSet} = require('../db/redis')
// 获取cookie过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d.toGMTString()    // 这个方法是一个cookie的固定格式
}
const handleUserRouter = (req, res) => {
    const method = req.method
    // 登录
    if (method === 'POST' && req.path === '/api/user/login') {
        // const data = req.body.split('&')
        // const username = data[0].split('=')[1]
        // const password = data[1].split('=')[1]
        const {username, password}  = req.body
        const result = loginMethod(username, password)
        return result.then(data => {
            if (data.username) {
                // 设置session
                req.session.username = data.username
                req.session.realname = data.realname
                // 同步到redis中
                redisSet(req.sessionId,req.session)
                return new SuccessModel()
            } else {
                return new ErrorModel('登录失败')
            }
        })
    }
}
module.exports = handleUserRouter
