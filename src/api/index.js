/* 包含应用中所有接口请求函数的模块
每个函数的返回值都是promise
*/
import { message } from "antd";
import jsonp from "jsonp";
import ajax from "./ajax";

// const BASE = 'http://localhost:5000'
const BASE = ''

export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')

//添加用户
export const reqAddUpdateUser = (user) => ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

//获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', { parentId })

//添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', { categoryName, parentId }, 'POST')

//更新分类
export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax(BASE + '/manage/category/update', { categoryId, categoryName }, 'POST')

//获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', { categoryId })

//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', { pageNum, pageSize })

//更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'POST')

//搜索商品分页列表
// searchType:搜索的类型,productName/productDesc
export const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) => ajax(BASE + '/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]: searchName
})
//删除照片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', { name }, 'POST')

//添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')
//修改商品
//export const reqUpdateProduct=(product)=>ajax(BASE+'/manage/product/update',{product},'POST')

//获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')

//添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', { roleName }, 'POST')

export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')

//获取所有的用户列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')

//删除用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', { userId }, 'POST')



/* json 请求的接口函数 */
export const reqWeather = (city) => {
  return new Promise((resolve, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    jsonp(url, {}, (err, data) => {
      console.log('jsonp()', err, data);
      if (!err && data.status === 'success') {
        //取出需要的数据
        const { dayPictureUrl, weather } = data.results[0].weather_data[0]
        resolve({ dayPictureUrl, weather })
      } else {
        message.error('获取天气信息失败')
      }
    })
  })

}