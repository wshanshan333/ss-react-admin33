import React, { Component } from 'react'
import {
  Card,
  Table,
  Button,
  Icon,
  message,
  Modal,
} from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqUpdateCategory, reqAddCategory } from '../../api'
import AddForm from './add-form'
import UpdateFrom from './update-form '

/* 商品分类路由
 */
export default class Category extends Component {
  state = {
    loading: false,
    categorys: [],//一级分类列表
    subCategorys: [], //二级分类列表
    parentId: '0', //当前需要显示的分类列表的父分类ID
    parentName: '', //当前需要显示的分类列表的父分类名称
    showStatus: 0,    //标识添加/更新的确认框是否显示
  }
  /* 初始化Table所有的数组 */
  initColumns = () => {
    this.columns = [
      {
        title: '分类的名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        width: 300,
        render: (category) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(category)} >修改分类</LinkButton>
            {this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}

          </span>
        )
      }
    ]
  }

  /* 异步获取一级/二级分类列表显示 */
  getCategorys = async (parentId) => {

    //在发请求前,显示loading
    this.setState({ loading: true })
    parentId = parentId || this.state.parentId
    //发送ajax请求,获取数据
    const reslut = await reqCategorys(parentId)
    // 在请求完成后,隐藏loading
    this.setState({ loading: false })

    if (reslut.status === 0) {
      //取出分类数组(可能是一级的也可能是二级的)
      const categorys = reslut.data
      if (parentId === '0') {
        //更新一级分类的状态
        this.setState({
          categorys
        })
      } else {
        //更新二级分类的状态
        this.setState({
          subCategorys: categorys
        })
      }
    } else {
      message.error('获取分类列表失败')
    }
  }
  /* 
  显示指定一级分类对象的子对象
   */
  showSubCategorys = (category) => {
    //更新状态
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => {  //在状态且重新render()后执行\
      console.log('parentId', this.state.parentId);
      //获取二级分类列表
      this.getCategorys()
    })
    // console.log('parentId', this.state.parentId);
  }

  showCategorys = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }

  /* 响应点击去取消:隐藏确定框 */
  handleCancel = () => {
    //清除输入数据
    this.form.resetFields()
    //隐藏确认框
    this.setState({
      showStatus: 0,
    })
  }
  /* 显示添加的确认框 */
  showAdd = () => {
    this.setState({
      showStatus: 1
    })
  }

  /* 添加分类 */
  addCategory = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        //隐藏确认框
        this.setState({
          showStatus: 0
        })
        //搜集数据,并提交添加分类请求
        const { parentId, categoryName } = values
        //清除输入数据
        this.form.resetFields()
        const result = await reqAddCategory(categoryName, parentId)
        if (result.status === 0) {

          //添加的分类就是当前分类列表 
          if (parentId === this.state.parentId) {
            //重新获取当前分类列表显示
            this.getCategorys()
          } else if (parentId === '0') { //在二级分类列表下添加一级分类,重新获取一级分类列表,但不需要显示一级分类列表
            this.getCategorys('0')
          }
        }
      }


    })
  }



  /* 显示修改的确认框 */
  showUpdate = (category) => {
    //保存分类对象
    this.category = category
    //更新状态
    this.setState({
      showStatus: 2
    })
  }

  /* 更新分类 */
  updateCategory = () => {

    //进行表单验证,只有通过了才处理
    this.form.validateFields(async (err, values) => {
      if (!err) {
        //1.隐藏确定框
        this.setState({
          showStatus: 0
        })
        //准备数据
        const categoryId = this.category._id
        const { categoryName } = values
        //清除输入数据
        this.form.resetFields()

        //2. 发请求更新分类
        const result = await reqUpdateCategory({ categoryId, categoryName })
        if (result.status === 0) {
          //3.重新显示列表
          this.getCategorys()
        }
      }
    })



  }

  /* 为第一次render()准备数据 */
  componentWillMount() {
    this.initColumns()
  }
  //执行异步任务:发异步ajax请求
  componentDidMount() {
    //获取一级分类
    this.getCategorys()
  }


  render() {

    // 读取状态数据
    const { categorys, subCategorys, parentId, parentName, loading, showStatus } = this.state
    //读取指定的分类
    const category = this.category || {}

    //card的左侧
    /* const title = '一级分类列表' */
    const title = parentId === '0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <Icon type='arrow-right' style={{ marginRight: 5 }} />
        <span>{parentName}</span>
      </span>
    )
    //card的右侧
    const extra = (
      <Button type='primary' onClick={this.showAdd}>
        <Icon type='plus' />
        添加
      </Button>
    )

    return (
      <Card title={title} extra={extra} >
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={parentId === '0' ? categorys : subCategorys}
          columns={this.columns}
          pagination={{ defaultPageSize: 5, showQuickJumper: true }}
        />

        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
            categorys={categorys}
            parentId={parentId}
            setForm={(form) => { this.form = form }}
          />
        </Modal>

        <Modal
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateFrom
            categoryName={category.name}
            setForm={(form) => this.form = form}
          />

        </Modal>
      </Card>
    )
  }
}
