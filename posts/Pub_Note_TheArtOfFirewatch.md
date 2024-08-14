---
title: The Art of Firewatch
---

- [GDC](https://www.youtube.com/watch?v=SdxQ3HlhTE8)
- [技术博客中的详细解释](https://blog.camposanto.com/post/112703721804/this-blog-post-is-an-in-detail-explanation-of-part)

## 开始之前

- Unity4.5 刚过渡到 unity5
- 游戏是风格化并带有真实感的渲染风格
- 制作团队:
  ![alt text](image-5.png)
  ![alt text](image.png)
- 海报设计：
  ![alt text](image-1.png)

## 游戏特点

1. 颜色的层次
   ![alt text](image-2.png)
2. 强烈的形状
   ![alt text](image-3.png)
3. 叙事细节
   ![alt text](image-4.png)

## 实现颜色的层次

发生在户外，所以由天空决定：天空盒
开发了一个工具，生成程序化的天空盒
![alt text](image-6.png)

单纯使用纹理的天空盒的问题:

1. 高分辨率纹理占用内存
2. 不同天空之间插值，云之类的细节会出错
3. 缩放和曝光容易产生伪影

程序化天空的四个部分：

1. 三种颜色控制天空颜色的渐变（顶部、中间、底部）
2. 太阳盘选项控制太阳的颜色、大小、和衰减
3. 光晕选项控制光的光晕、雾霾、大气散射
4. 地平线光晕

![alt text](image-31.png)

使用 SkyShop 作为 Dynamic Image Based Lighting 的解决方案
![alt text](image-7.png)
使用 BoxTrigger 来改变颜色：
![alt text](image-8.png)
![alt text](image-9.png)

除了天空颜色还需要哪些层次（Fog）
![alt text](image-11.png)
![alt text](image-12.png)
使用 Color Stripe Texture：
![alt text](image-13.png)
![alt text](image-15.png)
![alt text](image-14.png)
根据不同的情感氛围，选择不同的调色
![alt text](image-17.png)
![alt text](image-18.png)
这个部分做的很早
![alt text](image-19.png)

## 强烈的形状

- Trees
  手工做的，没有 speed tree
  ![alt text](image-21.png)
  保持风格化和简单
  ![alt text](image-22.png)
  使用 Alpha Test 来简化轮廓
  ![alt text](image-23.png)
  加上 Fog：
  ![alt text](image-29.png)
- Rocks
  每个模块有趣的形状
  ![alt text](image-24.png)
  基本上没有纹理细节：
  ![alt text](image-30.png)
  基本上只是使用了少量的石头，改变 size 和 rotation，放置在不同的地方

## Narrative Details

跟物品之间的交互
![alt text](image-26.png)
充满细节的各种物品：
![alt text](image-27.png)

## Hot Tips

- 买插件节约时间
  ![alt text](image-10.png)
- 根据团队的实力开发自定义工具，并尽量减少依赖关系
  ![alt text](image-16.png)
  Color Stripe Texture 使用起来就像 PS 一样，所以美术使用起来很简单
- 在你开始全面的美术制作之前，确保你对玩家体验的概述感到满意
  ![alt text](image-20.png)

- 制作少量的模块化资源，更少的模块化资源意味着更少的数据需要管理。大多数岩石漫反射纹理是中性灰色。更容易在材料中定义不同的颜色。
  ![alt text](image-25.png)
- 优先考虑并将你的制作努力投入到能够给你带来最大玩家体验回报的资产中。
  ![alt text](image-28.png)
