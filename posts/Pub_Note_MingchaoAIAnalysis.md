---
title: "MingchaoAI" Analysis
---

- [视频演示](https://www.bilibili.com/video/BV1tH4y1c79f/?spm_id_from=333.788&vd_source=cd7009b0abbbb6871d07c0746573ce80)
- [仓库](https://gitee.com/LanRenZhiNeng/ming-chao-ai)

## Usage

### 小地图模式

1. 截取传送 UI 的图片
   ![alt text](image-9.png)
   ![alt text](image-10.png)
2. 录制 UI 传送操作
   ![alt text](image-11.png)
3. 录制寻路，生成地图路径（也可以自己画）
   ![alt text](image-12.png)
   ![alt text](image-13.png)
4. 自动寻路，打怪
   ![alt text](image-14.png)

### 大地图模式

大地图模式需要在一些拐角区域按下 M 键截取地图
![alt text](image-15.png)
最后会得到一个带有关键点的地图
![alt text](image-16.png)
大地图模式运行时，会自动按下 M 看地图。

### 寻路实现原理

- 小地图模式是通过图片匹配的方式在地图上找到当前的位置，然后根据路径计算出方向向量。
- 大地图模式同样是根据两个地图之间的匹配来计算出当前的位置，然后根据路径点计算出方向向量。

### 打印

使用过程中的一些打印：
![alt text](img_v3_02d9_4d425517-2825-4949-bbb9-771c781d0dcg.jpg)
![alt text](image-17.png)
![alt text](image-18.png)

## Source Code

代码总行数：9849

核心是使用 Yolo 来检测出特定的图片：
![alt text](image.png)
需要一些图片用于 yolo 的半监督学习：
![alt text](image-1.png)
相关的一些状态值：
![alt text](image-2.png)
![alt text](image-3.png)
具体的一些策略，采用硬编码：
![alt text](image-4.png)
UI 相关点击：
![alt text](image-5.png)
使用图像模板匹配来获取坐标：
![alt text](image-6.png)
随机执行其他赶路技能或者操作：
![alt text](image-26.png)

### 寻路的实现

小地图模式寻路：
预先需要截一张大地图
![alt text](image-7.png)
然后会不断的截取小地图与大地图进行匹配，计算 offset：
![alt text](image-8.png)

代码入口：
![alt text](image-20.png)

### 操作录制

传送 UI 点击录制：
![alt text](image-27.png)
战斗录制：
![alt text](image-28.png)

### 战斗、交互

![alt text](image-19.png)
战斗中捡东西：
![alt text](image-21.png)
战斗部分的处理：
![alt text](image-22.png)
挖矿：
![alt text](image-23.png)

### 异常判断

![alt text](image-24.png)

### 距离计算

![alt text](image-25.png)
