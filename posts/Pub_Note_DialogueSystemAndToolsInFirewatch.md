---
title: Dialogue System and Tools in Firewatch
---

![alt text](image.png)
Firewatch 中的对话系统是 按下button，然后就能跟收音机对话，谈论游戏中发生了什么，或你在看什么

可以随时打断任何事情，开始一段对话

用black board存储游戏状态
扔啤酒罐时，booltest（没说过这句话）
![alt text](image-2.png)
![alt text](image-3.png)
black board：
![alt text](image-4.png)
player black board：
![alt text](image-7.png)
![alt text](image-6.png)
![alt text](image-5.png)
事件驱动的脚本：
![alt text](image-8.png)
![alt text](image-9.png)
![alt text](image-10.png)

用IMGUI做的事件系统的工具：
![alt text](image-11.png)
![alt text](image-12.png)
这是一个Event Chain, Dialogue Fire Event, Event Fire Dialogue, Dialogue Fire Event...
![alt text](image-13.png)
没有分支是预先编译的，都是在运行时决定的
不只是dialogue
![alt text](image-14.png)

![alt text](image-1.png)
