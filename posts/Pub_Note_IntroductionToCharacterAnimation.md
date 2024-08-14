---
title: Games105 1.Introduction To Character Animation
---

## 3D Computer Animation

![alt text](image-3.png)
电影中的一个个运动的角色涉及到三个领域：
![alt text](image.png)

1. 建模
2. 动画
3. 渲染

动画描述了一帧到下一帧是该怎么生成的这样的一个关系

基本上可以分为两类：
![alt text](image-1.png)

1. Simulation：主要是关注物理客观的一些现象，比如刚体、软体、流体的仿真，以及烟、火等……可以通过精确的数学描述把仿真的现象给建立起来。
2. Character Animation：是行为上的建模，比如人的动作、动物的动作等……通常还是找各种统计的方法把模型给建立起来。

![alt text](image-2.png)
它们之间的关系可以看作，Simutation + Control = Character Animation

## 为什么研究角色动画

角色动画的创建是一个劳动密集型的过程，而角色动画的研究目的就是把这样一个过程变成计算密集型：
![alt text](image-4.png)

## 角色动画 Pipeline

![alt text](image-5.png)
模型绑定到骨骼上，然后通过蒙皮，让骨骼带动模型或者说皮套进行形变。

## 现实中动作是怎么生成的

![alt text](image-6.png)
神经信号 -> 肌肉纤维的收缩 -> 受物理约束 -> 身体姿态

根据是否使用物理，角色动画分为两类：

1. Keyframe-based Animation
   ![alt text](image-7.png)
   忽略上面的部分，直接去更新角色的姿态。
2. Physics-based Animation
   ![alt text](image-8.png)
   忽略神经和肌肉的部分，通过物理仿真的方式来生成动作。

- Low-level control：直接控制每个关节
  ![alt text](image-9.png)
- High-level control：移动到某个位置
  ![alt text](image-10.png)

![alt text](image-11.png)

## Keyframe Animation

![alt text](image-12.png)
Keyframe Animation 在过去很长的一段时间都是靠动画师一帧一帧画出来的
参考：[Disney’s 12 Principles of Animation](https://the12principles.tumblr.com/)

而到了计算机图形学的时代，3D 动画的制作则是在关键帧上去调整角色姿态，然后通过插值的方式去生成中间的帧。参考：[How to Animate 3D Characters in 1 Minute](https://www.youtube.com/watch?v=TjJLIuFKA20)
![alt text](image-13.png)

里边涉及到的一些概念：

- Forward Kinematics：给定每个关节的旋转，计算出末端的位置
- Inverse Kinematics：给定末端的位置，计算出每个关节的旋转

## Motion Capture

动捕需要使用专业的设备，通过一些方法来捕捉动作，例如在身上贴标记点、惯性动捕、视觉动捕等……
![alt text](image-14.png)

## Motion Retargeting

有时我们需要把一个角色的动作应用到另一个角色上，这就需要 Motion Retargeting
![alt text](image-15.png)

## Motion Graphs/State Machines

使用 Motion Graphs 可以根据不同的控制输入在不同的动作状态间切换：
![alt text](image-16.png)
还可以训练一个 AI 在 MotionGraphs 里选择合适的边进行切换：
![alt text](image-17.png)
但 Motion Graphs 会随着动作的增多变得非常复杂
![alt text](image-18.png)

## Motion Matching

Motion Graphs 本质上是在动作这个层面进行切换，而 Motion Matching 把动作进一步的切片，在每一帧上去做匹配。每帧结束的时候去搜索一个新的姿态，既要满足控制输入的目标，又要尽量保持连续性。因此很大程度上是一个工程上的实现，即怎么去设计这样一个函数。参考：[https://www.gdcvault.com/play/1023280/Motion-Matching-and-The-Road](https://www.gdcvault.com/play/1023280/Motion-Matching-and-The-Road)
![alt text](image-19.png)

## Generative Model

Generative Model 可以用大量的动作数据去训练一个模型，比如可以录一两个小时的动作，然后直接丢给模型。而这一点对于 Motion Matching 来说是困难的，在动作库很大的情况下其效果会变差。
![alt text](image-20.png)
参考：[[SIGGRAPH 2020] Local Motion Phases for Learning Multi-Contact Character Movements](https://www.youtube.com/watch?v=Rzj3k3yerDk)

## Cross-Modal Motion Synthesis

根据 Music、Speech、Text 等不同的输入去生成动作：
![alt text](image-21.png)

## Problems of Kinematic Methods

像前面说的这种 Keyframe-based/kinematic approach，它的问题在于：

- 物理合理性差
- 不能很好的处理与环境的交互

接下来我们开始谈论 Physics-based approaches

## Ragdoll Simulation

Ragdoll Simulation 常用于处理角色死亡或失去意识，当然也不只是这些，也可以用于突发事件，例如：被绊了一下 0.2s 左右反应过来。参考：[RagDoll Realistic - Unreal engine 4](https://www.youtube.com/watch?v=4pWBtoGzwwE)

## Physics-based Animation

Physics-based Animation 的一些应用：
![Alt text](image-22.png)
![Alt text](image-23.png)

## Keyframe Control

要将一个人的整个神经系统、肌肉系统建模出来是很困难的：
![Alt text](image-24.png)
通常会使用简化的模型来表达：
![Alt text](image-25.png)
我们使用关节力矩来描述肌肉对骨骼的作用：
![Alt text](image-26.png)
其中 Proporational-Derivative (PD) 控制是常用的一种控制方法：
![Alt text](image-27.png)
比如说我想把我的手从这个高度举到这个高度，那我需要给我的关节上加多少力呢？这就是 PD 控制要解决的问题。
早期的 Physics-based Animation 通常就会使用这种方法，例如给出一个目标高度的轨迹，采用 PD 控制，就可以生成对每个关节的力矩。
![Alt text](image-28.png)
不过，这种方法控制是相当困难的，可以查看这个小游戏：[QWOP](https://www.youtube.com/watch?v=YbYOsE7JyXs)
![Alt text](image-29.png)

## Trajectory Optimization

让计算机通过运算的方式来算出比较合适的控制的轨迹：[Guided Learning of Control Graphs for Physics-based Characters (SIGGRAPH 2016)](https://www.youtube.com/watch?v=QJbCfhRkcyg)
这种方法可以添加一些其他的变量，映射到新的虚拟角色上：
![Alt text](image-30.png)
还可以指定脚的落点：[Optimal gait and form for animal locomotion](https://dl.acm.org/doi/10.1145/1531326.1531366)

但这种方法的问题在于需要求解一个非常高维的非线性函数，非常难解也非常耗时。
![Alt text](image-31.png)

## Abstract Methods

在机器人领域，会使用非常简化的模型来把想要的动作描述出来，然后利用这个简化模型来指导角色该怎么控制：
![Alt text](image-32.png)
这种方法的缺点在于针对每个动作都需要深入的做研究。

## Reinforcement Learning

RL 的方法让一个 Agent 不断的跟环境进行交互学习
![Alt text](image-33.png)
![Alt text](image-34.png)
只要给他一个参考的运动数据，他就可以学到这段动作。
参考：[SIGGRAPH 2018: DeepMimic paper (main video)](https://www.youtube.com/watch?v=vppFvq2quQ0)

这种方法本质上还是在一个物理仿真的环境下实现对运动数据的复现。

类似的，我们可以在这个基础上引入 Motion Graphs 或者 Motion Matching，例如：角色撞到障碍物后自己选择动作来调整平衡。
![Alt text](image-35.png)
参考：[Learning to Schedule Control Fragments for Physics-Based Characters Using Deep Q-Learning](https://dl.acm.org/doi/10.1145/3072959.3083723)

## Generative Control Policies

不同于 Keyframe-based 的 Generative 方法，因为 Physics-based 的方法是不能直接控制姿态，所以这个 Model 实际上是在猜测在这样的数据下，它怎么去控制这个角色，输出怎么样的力矩。
![Alt text](image-36.png)
![Alt text](image-37.png)
