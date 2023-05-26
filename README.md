# Vue 3 + TypeScript + Vite + Element Plus

## 1. 开发规范
后端统一返回状态码200的json对象：
```
{
   success: bool,
   code: string,
   message: string,
   data: any,
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
