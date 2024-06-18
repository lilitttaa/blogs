---
title: 游戏自动化测试研究
cover: game.png
---
[TOC]

# 游戏自动化测试研究

## 分析问题

本质上是学习有哪些测试方法,以及有哪些测试工具,如何使用测试工具,如何编写测试用例

## 如何解决问题

### 用Google搜索软件测试相关资料

### 用Google搜索UE4测试相关资料

### UE4文档中关于测试部分的章节
<https://docs.unrealengine.com/4.27/zh-CN/TestingAndOptimization/Automation/>

### 知乎中关于测试的分享

关于UE4中的单元测试与简单测试:<https://zhuanlan.zhihu.com/p/158673691>

### GDC,UOD等分享中关于测试的部分

- 盗贼之海关于测试的分享(GDC2019,UE):
<https://www.youtube.com/watch?v=KmaGxprTUfI>
<https://www.gdcvault.com/play/1026366/Automated-Testing-of-Gameplay-Features>
- 使命召唤关于测试的分享(GDC2018):<https://www.youtube.com/watch?v=8d0wzyiikXM&t=161s>
- 网易关于AI测试的分享(GDC2020):<https://www.youtube.com/watch?v=ohuNWkFjd7E>
- 战地关于AI测试的分享(GDC2019):<https://www.youtube.com/watch?v=s1JOSbUR6KE>
- Kythera AI谈论了如何用自动化测试加速项目开发(GDC2021 AI Summit):<https://www.youtube.com/watch?v=IW5i9DjKT3U>
- 龙缘自走棋关于CI/CD的分享:<https://www.bilibili.com/video/BV1db4y1f7CL/>
在论坛中找相关的帖子
- 地平线的QA分享(GDC2018):<https://www.youtube.com/watch?v=2VDlX3Dqm0w>
- EA有多个关于自动化测试的研究:
  - Imitation Learning to Inform the Design of Computer Games:<https://www.youtube.com/watch?v=nhOfsZk51IQ>
  - Towards Advanced Game Testing With AI:<https://www.youtube.com/watch?v=E8N01hsatFg>
  - CoG 2021: Improving Playtesting Coverage via Curiosity-Driven Reinforcement Learning Agents:<https://www.youtube.com/watch?v=UmoJQT-gEM8>
  - Re•Work 2021: Augmenting Automated Game Testing with Deep Reinforcement Learning:<https://www.youtube.com/watch?v=NkhrqiOVA64>
  - CoG 2020: Augmenting Automated Game Testing with Deep Reinforcement Learning:<https://www.youtube.com/watch?v=2n8Tjz0S2rs>
 <https://ubm-twvideo01.s3.amazonaws.com/o1/vault/gdc2023/Slides/AI+for+Testing_Gillberg_Jonas.pdf>
- 圣莫妮卡:<https://sms.playstation.com/media/documents/GOWR_Ben_Hines_AutomatedTesting_GDC23.pdf>

### Paper

- Playing Doom with SLAM-Augmented Deep Reinforcement Learning:<https://arxiv.org/abs/1612.00380>
- Deep Reinforcement Learning for Navigation in AAA Video Games:<https://arxiv.org/abs/2011.04764>
- CCPT: Automatic Gameplay Testing and Validation with Curiosity-Conditioned Proximal Trajectories:<https://arxiv.org/abs/2202.10057>
- BeTAIL: Behavior Transformer Adversarial Imitation Learning from Human Racing Gameplay:<https://arxiv.org/abs/2402.14194>
- Automated Play-Testing Through RL Based Human-Like Play-Styles Generation:<https://arxiv.org/abs/2211.17188>

## 问题

### 有哪些常用的软件测试方法?

![Alt text](image-3.png)
测试方法有很多,关注不同的方面会得到不同的测试方法

#### 以测试的关注点划分

- 黑盒测试:只从功能的角度出发,不关心内部实现,只关心输入和输出
- 白盒测试:从内部实现的角度出发,关心内部实现,关心输入和输出
一般来说QA测试都是使用黑盒测试,而开发人员使用白盒测试

#### 以测试的范围划分

- UnitTest:单元测试,测试最小的可测试单元,一般是一个函数或者一个类
- FunctionalTest:功能测试,测试一个功能是否正常,比如一个需求是否正常
- IntegrationTest:集成测试,测试多个模块之间的交互是否正常,比如两个功能对接之间有没有冲突,尤其关注不同功能间组合的情况
- ScenarioTest:场景测试,测试一个用户场景是否正常,比如防御本,序章流程是否正常
- SystemTest:系统测试,测试整个系统是否正常,比如游戏是否能正常运行

#### 非功能性测试

- 性能测试:测试性能指标,比如FPS,CPU,GPU,Memory,Network等
- 压力测试:测试系统在超过正常负载的情况下是否正常
- 安全性测试:测试系统的安全性

#### 按测试发生的阶段划分

冒烟测试:新build出来的版本,测试基本功能是否正常,是一种预测试
回归测试:新build出来的版本,用之前的测试用例测试,测试是否有新的bug
Alpha测试:测试人员在真实用户场景下测试,一般是内部测试
Beta测试:玩家在真实用户场景下测试,一般是公测

### 如何构造测试用例?

等价类
边界值
因果图
决策表
正交试验
场景法
状态迁移
错误推测法

### 什么是CI/CD?

### 什么是DevOps?

### 盗贼之海

#### 测试流程是怎样的?

![Alt text](image-11.png)

- 每次提交必须编写自动化测试用例
- 每次提交前需要先进行本地自动化测试保证通过才能提交,如果涉及到一些画面和音频最好手动测试
(他们创建一些独立的自动化测试工具可以在引擎之外使用.)
- 通过Pre Commit进行远程自动化测试,成功后才会真正Commit.
- 远程定期执行自动化测试
- 如果远程测试失败,会停止所有其他的提交
- 每天构建一个内部预览版本,安排QA进行手动测试,产出Player feedback和report
- 每过一段时间(两周,或者添加重要功能)进行一次全面测试,包括性能测试,ScreenShot对比测试等,如果build失败,选择上一次成功的build面向玩家.
- QA手动测试时基本上能保证没有阻塞性bug

面对偶现bug:
![Alt text](image-28.png)

#### 有哪些测试类型?

- Unit
针对函数测试,最小的测试单元
- Map
Integration测试,在关卡蓝图中编写
- Actor
最常用的测试类型,用来处理主要的Gameplay逻辑
- Asset audit
资产审核,配置审核
- Screenshot comparison
用来做渲染上的对比
- Perform test
性能测试
![Alt text](image-9.png)
按照每条测试单独计算,他们总共进行了超过10万次自动化测试!
![Alt text](image-29.png)
这是他们采用自动化测试前后两个项目之间的对比,前一个项目最多的时候每月超过3000个bug,然后他们花了6个月来集中把bug数降到比较低的水平,而采用自动化测试后bug数一直保持在很低的水平.
![Alt text](image-5.png)

#### 如何编写自动化测试?

按照 设置环境->执行操作->验证结果 的方式编写测试

- UnitTest
![Alt text](image-30.png)
UnitTest平均0.2s
- MapTest(IntegrationTest)
![Alt text](image-31.png)
IntegrationTest能发现UnitTest本身的问题.
使用关卡蓝图来编写Map Test
这是一个玩家与轮船操作转盘交互的测试代码
![Alt text](image-33.png)
![Alt text](image-34.png)
异步测试(直到动画播完才进行结果检查)
![Alt text](image-35.png)
MapTest平均20s
- Networked Integration Test
![Alt text](image-36.png)
- ActorTest
见下文

#### 如何加快自动化测试?

MapTest 20s太慢了,花费了大量的时间用于加载,所以引入了一种新的类型

- ActorTest
看上去就像UnitTest一样
![Alt text](image-38.png)
怎么选择使用ActorTest还是MapTest?
![Alt text](image-37.png)
- 将多个IntegrationTest整合一起测(避免每次测试都要加载)
![Alt text](image-39.png)
- 将Player保持为持久化数据
![Alt text](image-40.png)

#### 自动化测试有什么好处?

- 更快,更精确,可以测试到函数层级
- 减少手动测试,QA可以将更多的时间用于探索性测试和可玩性测试
- 减少bug(几乎没有阻塞性bug)
- 长期监测项目信息,可以快速定位问题(bug,性能问题,渲染问题,资源问题等).
- 大量的Integration测试可以整理出清晰的配置环境,新功能的开发也能更快搭建.
- 将项目压力平均到日常,而不是每次提交前.
- 助于编写更好的OOP代码.
- **减少加班**
![Alt text](image-8.png)

#### 哪些功能难以由自动化测试代替?

![Alt text](image-7.png)

- 画面和音频
- 探索性测试(强化学习可以在一定程度上承担)
- 游戏可玩性体验

#### 自动化测试的缺点有哪些?

- creation time
需要花费时间编写测试用例
- running time
自动化测试需要花费时间,盗贼之海团队pre commit后执行远程自动化测试到允许commit之间时间超过1h
- 自动化测试不完全可靠,需要不停改进

### 使命召唤

#### 使命召唤团队的CI/CD流程有哪些启发?

700个VM或者物理电脑(每台4-20个core)(壕气)
![Alt text](image-20.png)
![Alt text](image-22.png)
自动化测试中获取的监测信息(ex.shader assets数量):
![Alt text](image-23.png)

- 自动化测试不仅用于排除流程上的bug,更重要是的创建了一套对于项目的长期监测机制.可以看到包括测试通过率,测试中性能指标,测试中抓帧对比等信息.
- 可以通过Web UI看到任何一次提交对于游戏的影响.例如,美术某次提交的模型三角形面过多,导致下一次自动化测试时这个地图内存开销显著增加,美术能自己通过看提交后的测试分析发现问题.QA也能通过这些记录将问题直接定位到某次提交.(如果添加某些系统的信息到自动化测试报告中,比如风场,刷怪点等,策划也能自行定位问题)
![Alt text](image-24.png)
- 图形程序能获取到自动化测试中的抓帧,第一时间发现渲染上的问题.
- 出现bug时,程序能直接从web上获取bug的log,crash的符号信息.

### 地平线

#### 地平线团队关于测试的分享有哪些启发?

他们测试团队很小,人数很少(开始只有3个人),其中测试的方式80-90%是手动探索性测试,剩下的10-20%是自动化测试.

- 测试团队使用的Debug工具很清晰,通过Debug工具可以看到很多内部状态,比如AI视锥,导航路径等.
![Alt text](image-26.png)
- 另外在跑测过程中遇到bug,会提交一份说明,说明中有详细的描述,log,截图,视频,复现步骤等.他们是开放世界游戏,所有的bug都标记在地图上.
![Alt text](image-25.png)
![Alt text](image-27.png)
- 用20个全天运行的AI(感觉是强化学习?)来进行简单的测试,比如寻路到某个位置,触发某个事件,进行简单攻击等.

### 易水寒

#### 易水寒团队的自动化测试流程有哪些启发?

- 他们前期用lua编写测试脚本来进行自动化测试,需要为各个任务编写专门的测试脚本.需要编写大量的测试脚本,而且测试脚本的维护成本很高.
![Alt text](image-14.png)
![Alt text](image-13.png)
- 后面改用了强化学习: MCTS(Monte Carlo Tree Search) + UCB(Upper Confidence Bound)算法进行自动化测试.
测试报告:
![Alt text](image-17.png)

#### 强化学习带来的好处

- 减少了写测试脚本的成本
![Alt text](image-18.png)
- 能够找出流程中难以被发现的阻塞
1.比如一个地图下去后发现没法上来了.
2.某个对话分支没有后续了.
3.测试数值设计上的不平衡.
![Alt text](image-19.png)

#### 如何加快自动化测试效率?

- 通过一些状态的剔除来缩小强化学习的动作空间,比如uiopen为false,就不进行跟ui相关的动作.
![Alt text](image-15.png)
- NLP从任务剧情获取相关信息生成动作
这是使用NLP对测试加速后的结果,快了3倍
![Alt text](image-16.png)

### 龙缘自走棋中自动化测试有什么启发?

- UI测试
遍历所有界面元素测试

### 有哪些编写测试的实践方法?

- Test behavior, not implementation
只针对行为进行测试,不要针对实现进行测试,也方便后续重构.可以先把接口写好,然后针对接口编写测试用例,之后再完成实现.
- Mocking out dependencies
当一个函数(模块或类)依赖于其他函数(函数模块或类)时,可以使用Mocking来模拟依赖的函数,这样就可以只测试当前函数的行为,而不用关心依赖函数的行为.
这一点也助于本身基于接口编写,而不是基于实现编写.

``` cpp
// 文件管理器接口
class FileManager {
public:
    virtual std::string readFile(const std::string& filepath) const = 0;
};

// 实际的文件管理器实现
class RealFileManager : public FileManager {
public:
    std::string readFile(const std::string& filepath) const override {
        // 使用实际的文件读取逻辑
        // ...
    }
};

// 模拟的文件管理器，用于测试
class MockFileManager : public FileManager {
public:
    std::string readFile(const std::string& filepath) const override {
        // 返回预定的字符串，而无需实际读取文件
        return "Mock file content";
    }
};

// 在代码中使用FileManager
class MyFileProcessor {
private:
    FileManager& fileManager;
public:
    MyFileProcessor(FileManager& fm) : fileManager(fm) {}

    void processFile(const std::string& filepath) {
        std::string content = fileManager.readFile(filepath);
        // 处理文件内容的逻辑
        // ...
    }
};

// 在测试中使用MockFileManager模拟FileManager的行为
void testMyFileProcessor() {
    MockFileManager mockFileManager;
    MyFileProcessor fileProcessor(mockFileManager);

    // 执行测试并验证代码是否按预期工作
    // ...
}
```

- Orthogonality(正交性)
尽可能让一个模块保持黑盒,模块本身提供对外的接口,而不是直接访问模块内部的数据或数据的结构.
例如,一个联盟模块用来管理玩家的联盟信息,模块需要支持一些查询服务,获取所有联盟名列表.

第一种:

``` cpp
IAllianceModule* allianceModule = GetModule<IAllianceModule>();
TArray<FAllianceInfo*> allianceInfos = allianceModule->GetAllianceInfos();
TArray<FString> allianceNames;
for (FAllianceInfo* allianceInfo : allianceInfos) {
    // 获取联盟名
}
```

第二种:

``` cpp
IAllianceModule* allianceModule = GetModule<IAllianceModule>();
TArray<FString> allianceNames = allianceModule->GetAllianceNames();
```

推荐第二种
第一种中提供了灵活性给外部,第二种中,则是限制了这种灵活,但是使得**外部使用者**无需关心联盟信息的具体结构,只需要调用相关接口.
另外对于**维护测试**来说,联盟信息结构的更改也不会影响到测试用例.因此按照这种方式暴露接口有助于编写更好的OOP代码.
在项目中保持**足够克制的封装**可以避免外部模块对于内部信息的错误使用.

### UE4中提供了哪些测试工具?

简单测试
复杂测试
延迟测试
Session frontend面板
命令行

### UE4中的可供参考的测试代码有?

### 拼接关如何组织自动化测试?

### 如何衡量测试覆盖率?

### 如何修改当前代码结构以满足自动化测试的要求?

### 不同类型的测试都是由谁来写的?

## Reference
- 测试相关概念：https://www.zhihu.com/question/24821702
- 盗贼之海关于测试的分享(GDC2019,UE)：
  - https://www.youtube.com/watch?v=KmaGxprTUfI
  - https://www.gdcvault.com/play/1026366/Automated-Testing-of-Gameplay-Features
- 使命召唤关于测试的分享(GDC2018)：https://www.youtube.com/watch?v=8d0wzyiikXM&t=161s
- 网易关于AI测试的分享(GDC2020)：https://www.youtube.com/watch?v=ohuNWkFjd7E
- 战地关于AI测试的分享(GDC2019)：https://www.youtube.com/watch?v=s1JOSbUR6KE
- Kythera AI谈论了如何用自动化测试加速项目开发(GDC2021 AI Summit)：https://www.youtube.com/watch?v=IW5i9DjKT3U
- 龙缘自走棋关于CI/CD的分享：https://www.bilibili.com/video/BV1db4y1f7CL/
- 地平线的QA分享(GDC2018)：https://www.youtube.com/watch?v=2VDlX3Dqm0w