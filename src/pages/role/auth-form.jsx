import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Tree
} from 'antd'
import menuList from '../../config/menuConfig'

const Item = Form.Item
const { TreeNode } = Tree;

/* 添加分类的form组件 */

export default class AuthForm extends Component {

  static propTypes = {
    role: PropTypes.object
  }

  constructor(props) {
    super(props)
    const { menus } = this.props.role
    this.state = {
      checkedKeys: menus
    }
  }
  /* 
  为父组件提交获取最新menus数据的方法
  */
  getMenus = () => this.state.checkedKeys


  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key} >
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      )
      return pre
    }, [])
  }
  //选中某个node的回调
  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList)
  }
  //根据新传入的role来更新checkedKeys状态
  //当组件接收到新的属性时自动调用
  componentWillReceiveProps(nextProps) {
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys: menus
    })
  }


  render() {
    const { role } = this.props
    const { checkedKeys } = this.state
    //指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 15 }
    }
    return (
      <div>

        <Item label='角色名称' {...formItemLayout}>
          <Input value={role.name} disabled />
        </Item>
        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
          <TreeNode title="平台权限 " key="all">
            {this.treeNodes}

          </TreeNode>
        </Tree>
      </div>
    )
  }
}

