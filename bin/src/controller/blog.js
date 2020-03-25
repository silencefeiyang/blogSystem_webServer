const { exec } = require('../db/mysql')
// const {SuccessModel,ErrorModel} = require('../model/resModel')
const getList = (author,keyword) => {
    let sql = `select * from blogs where 1=1 `      // where 1=1是一种技巧，防止author、keyword为空语句出错
    if(author){
        sql+= `and author='${author}' `
    }
    if(keyword){
        sql+=`and title like'%${keyword}%' `
    }
    sql+= `order by createtime desc`
    return exec(sql)
}
const getDetail = (id)=>{
    const sql = `select * from blogs where id='${id}'`
    return exec(sql).then(rows=>{
        return rows[0]
    })
}
/*
* blogData是一个博客对象,包含title,content 属性
*/
const newBlog = (blogData = {})=>{
    // blogData是一个博客对象，包含title,content，author 属性
    // console.log('newblog',blogData)
    const {title,content,author} = blogData
    const createtime = Date.now()
    const sql =`insert into blogs (title,content,author,createtime) values ('${title}','${content}','${author}',${createtime});`
    return exec(sql).then(res=>{
        return {
            id:res.insertId
        }
    })
}
/*
* blogData是一个博客对象,包含title,content 属性
* id 就是要更新博客的 id
*/
const updateBlog = (id, blogData = {}) =>{
    const {title,content} = blogData
    const sql = `update blogs set title='${title}',content='${content}' where id=${id};`
    return exec(sql).then(update=>{
        if(update.affectedRows > 0){   // 这个是固定的返回格式
            return true
        }
        return false
    })
}
/*
* id 要删除博客的 id
*/
const deleteBlog = (id,author)=>{
    console.log('删除博客',id)
    const sql = `delete from blogs where id='${id}' and author='${author}';`
    return exec(sql).then(delData=>{
        if(delData.affectedRows > 0){
            return true
        }
        return false
    })
}
module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}