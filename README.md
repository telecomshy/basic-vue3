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

## 4. 响应式ActiveRequest类说明
项目封装了axios，提供一个响应式的ActiveRequest类。基本使用方法如下：
```typescript
import {ActiveRequest} from '@/utils/request.ts'

const arInst = new ActiveRequest(baseConfig)
const {responseData, request} = arInst.useActiveRequest(config)

request()  // 实际发起请求
```
返回的`responseData`是一个响应式的`ref`对象，以及一个`request`方法。实际发起请求时，调用`request`方法即可。
请求返回的结果会赋值给`responseData.value`。

在创建`ActiveRequest`实例，以及调用`useActiveRequest`方法时，都可以传入配置对象，`useActiveRequest`的配置
会覆盖掉`ActiveRequest`的配置。所以，应该先创建一个包含基本配置的`ActiveRequest`实例，使用`useActiveRequest`
时，再传入个性化的配置。

`config`的配置项扩展了`axiosRequestConfig`，提供了以下的额外配置：
```typescript
export interface ActiveRequestConfig extends AxiosRequestConfig {
    onMounted?: boolean  // 是否在mounted时执行request方法
    watchSources?: WatchSource  // 提供监控的对象，当对象变化时，发起request请求，watchSource同内置watch方法参数
    watchOptions?: WatchOptions  // watch选项配置，同内置watch方法参数
    defaultResponseData?: any  // 默认的responseData是ref(undefined)，某些情况下需要提供一个默认值
    authorizationKey?: string  // 提供认证头，默认是Authorization
    useToken?: () => string  // 提供一个返回token的组合式函数
    useResponseHandler?: UseResponseHandler  // 默认responseData是axios的response.data，如果要额外处理，可以传入一个useResponseHandler的组合式函数
    useErrorHandler?: UseErrorHandler  // 默认直接返回axios的Error，可以提供一个useErrorHandler的组合式函数
    deepToRaw?: boolean  // 如果request的请求参数是一个ref，默认会unref。如果要深度将参数转化为普通值，该项设置为True

    [key: string]: any  // useToken,useResponseHandler,useErrorHandler可能会添加新的配置
}
```
`ActiveRequest`还提供了几个便捷方法：`useActiveGet`,`useActivePost`以及`download`。方法签名如下：

```typescript
import {ActiveRequest} from "./request";

function useActiveGet<R>(url:string, config?: ActiveRequestConfig): {responseData: R, get} {}
function useActivePost<R>(url: string, config?: ActiveRequestConfig): {responseData: R, post} {}
function download(url:string, filename: string, method?: 'get' | 'post', dataOrParams?: any): void {}
```
另外，在某些情况下，请求的参数并不需要是响应式的，返回的`request`,`get`,`post`方法都可以接收一个临时的请求参数。
该参数会覆盖掉配置文件的`data`或者`params`选项。
