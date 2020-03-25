// 先使用假数据
const {exec, escape} = require('../db/mysql')
const {genPassword} = require('../utils/cryp')
const loginMethod = (username,password)=>{
    username = escape(username)
    // 生成加密密码
    password = genPassword(password)
    password = escape(password)
    const sql = `select username, realname from users where username=${username} and password=${password}`
    return exec(sql).then(data=>{
        // console.log(data)
        return data[0] || {}
    })
}
module.exports = {
    loginMethod
}