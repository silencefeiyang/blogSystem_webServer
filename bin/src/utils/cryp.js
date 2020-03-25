const crypto = require('crypto')
// 秘钥
const SECRET_KEY = 'WJiol_8889#'  // 随意定的
// MD5加密
function md5(content){
    let md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex')
}
// 加密函数
function genPassword(password){
    const str = `password=${password}&key=${SECRET_KEY}`  // 字符串随意拼接，只要将密码和秘钥拼接起来就好了
    return md5(str)
}
const res = genPassword(123)
console.log(res)
module.exports = {
    genPassword
}