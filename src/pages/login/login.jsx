import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Form, Icon, Input, Button, message } from 'antd';
import './login.less'
import logo from '../../assets/images/logo.png'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

const Item = Form.Item // 不能写在import之前

/* 登录的路由组件 */
class Login extends Component {
  handleSubmit = (event) => {
    event.preventDefault()

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { username, password } = values
        const result = await reqLogin(username, password)
        if (result.status === 0) {
          message.success('登录成功')

          const user = result.data
          memoryUtils.user = user
          storageUtils.saveUser(user)

          this.props.history.replace('/')

        } else {
          message.error(result.mag)
        }
      } else {
        console.log('检验失败');
      }
    });
  }

  /* 对密码进行自定义验证 */
  validatePwd = (rule, value, callback) => {
    console.log('validatePwd', rule, value);
    if (!value) {
      callback('密码必须输入')
    } else if (value.length < 4) {
      callback('密码长度不能小于4位')
    } else if (value.length > 12) {
      callback('密码长度不能大于12位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须是英文、数字或下划线组成')
    } else {
      callback()
    }
  }

  render() {
    ///如果用户已登录,自动跳转到管理界面
    const user = memoryUtils.user
    if (user && user._id) {
      return <Redirect to='/' />
    }

    const form = this.props.form
    const { getFieldDecorator } = form;

    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登陆</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {
                /*
              用户名/密码的的合法性要求
                1). 必须输入
                2). 必须大于等于4位
                3). 必须小于等于12位
                4). 必须是英文、数字或下划线组成
               */
              }
              {
                getFieldDecorator('username', { // 配置对象: 属性名是特定的一些名称
                  // 声明式验证: 直接使用别人定义好的验证规则进行验证
                  rules: [
                    { required: true, whitespace: true, message: '用户名必须输入' },
                    { min: 4, message: '用户名至少4位' },
                    { max: 12, message: '用户名最多12位' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
                  ],
                  initialValue: 'admin', // 初始值
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="用户名"
                  />
                )
              }
            </Item>
            <Form.Item>
              {
                getFieldDecorator('password', {
                  rules: [
                    {
                      validator: this.validatePwd
                    }
                  ]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                  />
                )
              }

            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登陆
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}


//如果用户已经登录,自动跳转到管理页面





const WrapLogin = Form.create()(Login)
export default WrapLogin
/* 
1. 高阶函数
    1) 一类特别的函数
       a. 接收函数类型的函数
       b. 返回值是函数
    2)常见
     a. 定时器: setTimeout() /setInterval()
     b.Promise: Promise(()=>{}) then(vslue=>{},reason=>{})
     c. 数组遍历相关方法: forEach()/filer()/map()/reduce()/find()/findIndex()
     d.函数对象的bind()
    3) 高阶函数更新动态,更加具有扩展性

2.高阶组件
  1).本质是一个函数
  2).接收一个组件(被包装组件),返回的一个新的组件(包装组件),包装组件会像被包装组件传入特定属性
  3),作用:扩展组件的功能
  4).高阶组件也是高阶函数:接收一个组件函数,返回的是一个新的组件函数


async 和await
1. 作用?
    简化promise对象的作用:不在使用then()来指定成功/失败的回调函数
    以同步编码(没有回调函数了)方式实现异步流程
2.哪里写await?
  在返回promise的表达式左侧写await:不想要promise,想要promise异步执行的=成功的value数据
3. 哪里写async?
   await所在函数(最近的)定义的左侧写async

 
 
 

*/

