---
title: Unreal Engine Game Framework
---

https://www.youtube.com/watch?v=IaU2Hue-ApI

## 启动

![alt text](image.png)
![alt text](image-5.png)
![alt text](image-7.png)
![alt text](image-8.png)
![alt text](image-9.png)
![alt text](image-10.png)
![alt text](image-11.png)
![alt text](image-12.png)

### PreInit

![alt text](image-13.png)
![alt text](image-14.png)

#### Loading Order

![alt text](image-15.png)

#### What happens when your module is loaded?

1. Reflection System 调用构造函数创建 cdo，cdo 对象会在对象构造时被传递进去作为 template 使用
   ![alt text](image-16.png)
   因此，cdo 构造函数中不应该包含 Gameplay 代码
2. StartupModule() 被调用
   ![alt text](image-17.png)

### Init

![alt text](image-18.png)
![alt text](image-19.png)
![alt text](image-20.png)
![alt text](image-21.png)
![alt text](image-22.png)
![alt text](image-23.png)

### LoadMap

![alt text](image-24.png)
![alt text](image-25.png)
![alt text](image-26.png)
![alt text](image-27.png)
![alt text](image-28.png)
![alt text](image-29.png)
UPrimitiveComponent:![alt text](image-30.png)
![alt text](image-32.png)
![alt text](image-31.png)
![alt text](image-33.png)
![alt text](image-34.png)
![alt text](image-35.png)
![alt text](image-36.png)
![alt text](image-37.png)
Engine Object 的 LifeTime 是超过 World 的，而 Game Object 的 LifeTime 是在 World 之内：
![alt text](image-38.png)
![alt text](image-39.png)
![alt text](image-40.png)
![alt text](image-41.png)
![alt text](image-42.png)
![alt text](image-43.png)
![alt text](image-44.png)
![alt text](image-45.png)
![alt text](image-46.png)
![alt text](image-47.png)
![alt text](image-48.png)
![alt text](image-49.png)

![alt text](image-50.png)
![alt text](image-51.png)
![alt text](image-52.png)
![alt text](image-53.png)
![alt text](image-54.png)
![alt text](image-55.png)
![alt text](image-57.png)
![alt text](image-56.png)
![alt text](image-58.png)
![alt text](image-59.png)

![alt text](image-60.png)

![alt text](image-61.png)
![alt text](image-62.png)

Delegates: 
![alt text](image-63.png)

Subsystems:
![alt text](image-64.png)
## 目录

![alt text](image-1.png)
![alt text](image-2.png)
![alt text](image-3.png)

## 架构

![alt text](image-4.png)

![alt text](image-6.png)
