---
title: Unreal 自动化测试源码分析
cover: game.png
---
[TOC]

# Unreal Test

## 分析问题

熟悉Unreal中的Test框架,并在这个基础上进行修改和扩展

## 如何解决问题

阅读源码

## 思考

1. 测试框架主要的结构分为两个部分
   1. 一个是测试实际执行部分,前端(入口是FAutomationWorkerModule)
   2. 另一个是测试的外面的触发和展示部分,后端(测试条目,通过Message派发Worker,结果展示,UI)
   3. 因此重要类也分为三类,通用,前端,后端
2. 测试条目在前端是以ReportRoot表示的树状结构进行存储的,其中每个叶子节点是一个测试条目, 前端的主要行为很大程度上都是对这个树状结构的操作
3. 自动化测试中的延迟测试的机制是, 每次只会检查头部命令, 如果头部命令没有完成,则不会执行下一个命令.
## 问题

### 测试条目是怎么注册上去的?

FAutomationTestBase::GetTests

FAutomationControllerManager::RequestTests

ReportManager.ResetForExecution(NumTestPasses);
这个函数收集的当前需要的测试条目?

### 测试有哪些触发入口?

1. ```TSharedRef< SWidget > SAutomationWindow::MakeAutomationWindowToolBar( const TSharedRef<FUICommandList>& InCommandList )```
    1. 最终会调用到```FAutomationControllerManager::RunTests```
2. FAutomationExecCmd

### 从入口到具体某个测试开始是怎么调用的?

1. 前端: ```FAutomationControllerManager::ExecuteNextTask```通过```TSharedPtr< IAutomationReport > NextTest = ReportManager.GetNextReportToExecute(bAllTestsCompleted, ClusterIndex, CurrentTestPass, NumDevicesInCluster);```获取测试信息,然后发送Message```MessageEndpoint->Send(new FAutomationWorkerRunTests(ExecutionCount, AddressIndex, NextTest->GetCommand(), NextTest->GetDisplayName(), bSendAnalytics), DeviceAddress);```到后端

2. 后端:```FAutomationWorkerModule::HandleRunTestsMessage```->```FAutomationTestFramework::InternalStartTest```->```bTestSuccessful = CurrentTest->RunTest(Parameters);```

### 功能性测试是怎么开始的?

1. 在```FClientFunctionalTestingMapsBase::RunTest```中通过
```ADD_LATENT_AUTOMATION_COMMAND(FStartFTestsOnMap());```添加了一个延迟测试命令
2. ```FAutomationWorkerModule::Tick```会调用命令Update,然后会执行到```IFunctionalTestingModule::Get().RunTestOnMap``` -> ```UFunctionalTestingManager::RunAllFunctionalTests``` -> ```Manager->TriggerFirstValidTest();``` -> ```TestToRun->RunTest(TestParams)```

### 测试是怎么结束的?

1. 前端的结果是通过```FAutomationReport::SetResults```获取的

2. 测试有三种结束方式，前两种正常情况,都是走到```FAutomationWorkerModule::ReportTestComplete```.
   1. 第一种在FAutomationWorkerModule::Tick里所有```bool bAllLatentCommandsComplete  = ExecuteLatentCommands();```执行完后，调用```FAutomationWorkerModule::ReportTestComplete```,
   2. 第二种手动点击停止测试按钮，调用```FAutomationWorkerModule::HandleStopTestsMessage```中的```FAutomationWorkerModule::ReportTestComplete```
   3. ```FAutomationWorkerModule::ReportTestComplete``` 会先```bool bSuccess = FAutomationTestFramework::Get().StopTest(ExecutionInfo);```停止所有测试,然后向前端发送消息```FAutomationControllerManager::HandleRunTestsReplyMessage``` -> ```Report->SetResults(ClusterIndex, CurrentTestPass, TestResults);```
   4. 最后一种前端检查超时把后端关闭了,```FAutomationControllerManager::UpdateTests```
3. 测试结果怎么显示的
   UI是通过获取```FAutomationControllerManager::GetReports```函数拿到测试结果,

### 测试的错误信息是怎么传递出来的?

1. ```FAutomationWorkerModule::HandleStopTestsMessage```接收到停止测试的消息,然后调用```FAutomationWorkerModule::ReportTestComplete```,进一步
```bool bSuccess = FAutomationTestFramework::Get().StopTest(ExecutionInfo);```

2. 错误是通过```FAutomationTestBase::AddEvent```添加的

### 测试的成功和失败是在哪决定的?

FAutomationTestFramework::InternalStopTest
``` bTestSuccessful = bTestSuccessful && !CurrentTest->HasAnyErrors() && CurrentTest->HasMetExpectedErrors(); ```

### 功能测试的地图是在哪创建的?

```FClientFunctionalTestingMapsBase::AutomationOpenMap```

### 外部系统的错误是在哪添加到测试中的?

1. 从```UE_LOG``` -> ```FMsg::Logf_Internal``` -> ```FAutomationTestMessageFilter::Serialize``` -> ```FAutomationTestOutputDevice::Serialize``` -> ```CurTest->AddError(FString(V), STACK_OFFSET);```
2. ```FAutomationTestOutputDevice::Serialize```中调用```GetAutomationLogLevel```,其中```if (CurrentTest->SuppressLogErrors() ||  bSuppressLogErrors)```决定是否将其作为测试中的Error

### FAutomationExecCmd支持运行时测试吗, 具体是咋用的?

## 重要类/宏

### 通用

#### FAutomationTestBase

1. 所有测试的基类

#### UAutomationTestSettings

1. 相关配置

### IMPLEMENT_SIMPLE_AUTOMATION_TEST
### IMPLEMENT_COMPLEX_AUTOMATION_TEST

### 前端

#### FAutomationControllerManager

1. 前端的入口类和管理类
   1. RequestTests
      1. 更新所有的测试条目(不是当前勾选的, 而是所有)
      2. 最后会走到 ```ReportManager.EnsureReportExists(TestInfo[TestIndex], DeviceClusterIndex, NumTestPasses);```
   2. RunTests
   3. 向FAutomationWorkerModule发送Message

#### FAutomationWorkerSingleTestReply和FAutomationTestInfo

1. 每条测试的元信息

#### FAutomationReport

1. 维护了当前所需的测试的树形结构
2. 其中的```TArray< TArray<FAutomationTestResults> > Results;``` 存储了测试的结果

#### FAutomationReportManager

1. 存储了RootReport

### FAutomationDeviceClusterManager

### 后端

#### FAutomationTestExecutionInfo

1. 主要存储测试的Error和Warning消息

#### FAutomationWorkerModule

1. 接收ControllerManager发送的Message

#### FFunctionalTestingModule

#### UFunctionalTestingManager

1. 让FunctionalTest一个又一个的执行

#### FAutomationTestFramework

1. 真正测试执行的接口类
2. TestCommand也是在这使用的

#### FStartFTestOnMap->FTriggerFTests/FTriggerFTest

1. 功能性测试的TestCommand

#### FClientFunctionalTestingMapsRuntime/FClientFunctionalTestingMapsEditor

1. 功能性测试继承自FAutomationTestBase的类
2. RunTests的时候重新创建的Map```bCanProceed = AutomationOpenMap(MapPackageName);```

## 关于阅读代码的思考

1. 当你想要理解代码做了什么, 首先要尽可能的先熟悉功能的使用. 然后在一个有着Debug的环境下再去看, 这样会高效得多.
2. 使用IDE的工具
    1. 查看文件中公共接口和字段
    2. 查看类和函数的继承关系
    3. 查看函数的InComingCall
