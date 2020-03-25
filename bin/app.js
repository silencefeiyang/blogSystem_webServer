const querystring = require('querystring')
const { access}  = require('./src/utils/log')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const { redisSet, redisGet } = require('./src/db/redis')
// session数据
// const SESSION_DATA = {}
// 设置cookie
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d.toGMTString()    // 这个方法是一个cookie的固定格式
}

// 用于处理POST DATA
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method != 'POST') {
            resolve({})
            return
        }
        // console.log(req.headers)
        if (req.headers['content-type'] != 'application/json;charset=UTF-8') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
            // postData = JSON.stringify(postData)
        })
        req.on('end', () => {
            if (!postData) {      // 如果数据为空，做处理
                resolve({})
                return
            }
            resolve(JSON.parse(postData))
        })
    })
    return promise
}
const serverHandle = (req, res) => {
    // 记录access log
    // access(`
    //     ${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}
    // `)

    // 设置返回格式
    res.setHeader('Content-type', 'application/json')
    const url = req.url
    req.path = url.split('?')[0]
    // 解析query
    req.query = querystring.parse(url.split('?')[1])
    // 解析cookie
    // console.log(req.headers)
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if (!item) return
        const arr = item.split('=');
        const key = arr[0]
        const value = arr[1]
        req.cookie[key] = value
    })
    // // 解析session
    // let needSetCookie = false
    // let userId = req.cookie.userid
    // if (userId) {
    //     if (!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {}
    //     }
    // } else {
    //     needSetCookie = true
    //     userId = `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]

    // 使用redis解析session
    let needSetCookie = false
    let userId = req.cookie.userid
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化redis中的session值
        redisSet(userId,{})
    }
    // 获取session
    req.sessionId = userId
    redisGet(req.sessionId).then(sessionData=>{
        if(sessionData === null){
            // 初始化redis中的session值
            redisSet(req.sessionId,{})
            // 设置session
            req.session = {}
        }else{
            req.session = sessionData
        }
    })

    // 处理post请求的 postdata
    getPostData(req).then(postData => {
        req.body = postData
        // 处理blog路由
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                if (blogData) {
                    if (needSetCookie) {
                        res.setHeader('Set-Cookie', `userId='${userId}';path:/;httpOnly;expires=${getCookieExpires()}`)  // path:/ 针对所有的路由生效
                    }
                    res.end(
                        JSON.stringify(blogData)
                    )
                }
            })
            return
        }
        // 处理user路由
        const userResult = handleUserRouter(req, res)
        if (userResult) {
            if (needSetCookie) {
                res.setHeader('Set-Cookie', `userId='${userId}';path:/;httpOnly;expires=${getCookieExpires()}`)  // path:/ 针对所有的路由生效
            }
            userResult.then(userData => {
                res.end(
                    JSON.stringify(userData)
                )
            })
            return
        }
        // 未命中路由
        res.writeHead(404, { "Content-Type": 'text-plain' })
        res.write('404 not found')
        res.end()
    })

}

module.exports = serverHandle