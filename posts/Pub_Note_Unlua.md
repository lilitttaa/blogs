---
title: Unlua
---

unlua vs slua
https://github.com/Tencent/UnLua/issues/324

C++、SLUA、Unreal JS、Puerts 速度对比
https://github.com/Tencent/puerts/issues/443

UE 脚本方案
https://www.reddit.com/r/unrealengine/comments/14xek72/should_i_use_unrealclr_with_blueprints_allows_c/

Skynet 用于逻辑服，例如处理联机房间、战斗结算、任务等，采用 Tcp 协议
UE 原生的联机用于战斗服，处理战斗逻辑，采用 Udp+协议

Client 通过 CallServer 进行 Rpc 调用，参数将会通过 Protobuf 序列化，然后在服务器反序列化后执行调用。

## Version

Unlua2.2.1

## Resources

- [Unlua 源码](https://github.com/Tencent/UnLua)
- [浅谈新版 UnLua 的核心改变](https://john.js.org/2022/11/04/New-Version-of-UnLua/)
- [Unlua 源码解析](https://www.zhihu.com/people/an-te-tuo-kun-bo-74/posts)
- [UnLua 解析（一）Object 绑定 lua](https://zhuanlan.zhihu.com/p/100058725)

## 通过 UE 命名空间访问 C++类型发生了什么

UE4.UKismetSystemLibrary.PrintString("hello")

## Unlua 热更
