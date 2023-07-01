# Vue 3 + TypeScript + Vite + Element Plus

## 1. 规范说明
后端统一返回状态码200的json对象，正常返回的json对象结构为：
```typescript
{
   success: true
   message: string
   data: any
}
```
异常返回的json对象结构为：
```typescript
{
    success: false
    code: string
    message: string
    detail: any
}
```

## 2. 错误代码：
除ERR_999意外，其它应与后端保持一致
- ERR_001: 数据验证错误
- ERR_002: 用户已经存在
- ERR_003: 用户名不存在
- ERR_004: 密码不正确
- ERR_005: 验证码错误
- ERR_006: token过期或解析失败
- ERR_999: 网络故障或服务器内部错误


## 3. 权限设计和菜单说明
所有用户权限应该为`[action]_[scope]`的结构，其中`action`表示动作，`scope`表示可操作域，
或者操作对象，比如`create_user`，表示可以创建用户。  
用户登陆以后，后端应返回的数据结构为：
```js
{
    username: "username"
    token: "token"
    scope: ["scope1", "scope2"]
}
```
并使用pinia保存在`authStore`里。  
封装了element plus的`ElMenuItem`->`ElMenuItemScopes`和`ElSubMenu`->`ElSubMenuScopes`。使用时，`ElMenuItemScopes`接受一个`require_scopes`属性，可传入字符串或者数组，表示该菜单
要求用户应具备的scope域。如果用户权限中包含所有`require_scopes`指定的域，则会显示，反之不显示。  
`ElSubMenuScopes`和`ElSubMenu`使用完全一样，只不过如果不包含任何`ElMenuItemScopes`菜单条目时，
不会显示。  
这样，只需要设计好用户的权限即可，不需要再额外设计用户的菜单权限。

## 4. 响应式request组合式函数说明
