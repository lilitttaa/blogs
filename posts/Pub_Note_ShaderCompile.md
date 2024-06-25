---
title: Unreal Shader Compile
---

## Prerequisite

### 怎么才能控制使用哪个编译格式？

编译格式由 EShaderPlatform 控制，这个枚举基本上是通过下面这两函数创建的：

- ShaderFormatToLegacyShaderPlatform
- ShaderFormatNameToShaderPlatform

更根本的其实是从 ITargetPlatform::GetAllTargetedShaderFormats 这个函数里获取的。
![alt text](image-6.png)

拿 Windows 举例：
![alt text](image-7.png)
会读到 BaseEngine.ini 里的这个配置：
![alt text](image-8.png)

### Shader 的类型

![alt text](image-2.png)

## Development Environment

### 编译 Shader 的 Cmd

```
recompileshaders all
recompileshaders global
recompileshaders material
recompilshaders changed
```

这部分的调用栈：

```cpp
RecompileShaders(const wchar_t *, FOutputDevice &) ShaderCompiler.cpp:5049
[Inlined] UEngine::HandleRecompileShadersCommand(const wchar_t *, FOutputDevice &) UnrealEngine.cpp:4966
UEngine::Exec(UWorld *, const wchar_t *, FOutputDevice &) UnrealEngine.cpp:4210
UEditorEngine::Exec(UWorld *, const wchar_t *, FOutputDevice &) EditorServer.cpp:5919
UUnrealEdEngine::Exec(UWorld *, const wchar_t *, FOutputDevice &) UnrealEdSrv.cpp:697
FConsoleCommandExecutor::Exec(const wchar_t *)
```

编译 Shader 时主要考虑两种 Global 和 Material：
例如在执行命令行 RecompileShaders All 后：
![alt text](image-1.png)
首先会通过调用 RecompileGlobalShaders 编译 Global Shader，然后通过 Material->PostEditChange 编译 Material Shader

### 使用 ShaderCompileWorker 调试编译

要使用 ShaderCompileWorker，首先需要启用中间着色器转储生成调试文件：
在 ConsoleVariables.ini 中启用 r.ShaderDevelopmentMode=1 。

然后重新编译 Shader，你就能在 Saved 下找到 ShaderDebugInfo 了：
![alt text](image-3.png)

配置 ShaderCompileWorker 的 Configuration，然后用 Debug 打开：
![alt text](image-4.png)
配置参数： {FilePath} -directcompile -format={Format} -{ps/cs/vs/gs/hs/ds} -entry={EntryFunctionName}

这样你就可以在 FShaderFormatVulkan::CompileShader 函数里打断点了。
![alt text](image-5.png)

## Inside The System

### 编译的调用栈

编译最终都会走到 IShaderFormat::CompileShader

主要有两条路径：

- FShaderCompileUtilities::ExecuteShaderCompileJob
- ProcessCompilationJob

FShaderCompileUtilities::ExecuteShaderCompileJob 从 FShaderCompileThreadRunnableBase::CompilingLoop 而来

ProcessCompilationJob 的调用栈如下：

```cpp
FShaderFormatD3D::CompileShader(FName, const FShaderCompilerInput &, FShaderCompilerOutput &, const FString &) ShaderFormatD3D.cpp:50
ProcessCompilationJob(const FShaderCompilerInput &, FShaderCompilerOutput &, const FString &) ShaderCompileWorker.cpp:130
DirectCompile(const TArray<…> &) ShaderCompileWorker.cpp:863
GuardedMain(int, wchar_t **, bool) ShaderCompileWorker.cpp:986
GuardedMainWrapper(int, wchar_t **, const wchar_t *, bool) ShaderCompileWorker.cpp:1024
```

### hlslcc 模块是怎么被 ShaderCompileWorker 引用的?

ShaderCompileWorker -> ShaderCompileCommon -> hlslcc

### Compile Shader 跟 Compile Shader Pipeline 有什么区别？

FGlobalShaderTypeCompiler::BeginCompileShader
FGlobalShaderTypeCompiler::BeginCompileShaderPipeline

## Important Entities

IShaderFormat 决定了使用哪个着色器格式，也决定了是否使用 hlslcc
![alt text](image.png)
（其中 VectorVM 是 UE 中用于处理 Niagara 的后端格式）

## Reference

- [调试着色器编译过程](https://docs.unrealengine.com/4.27/zh-CN/ProgrammingAndScripting/Rendering/ShaderDevelopment/ShaderCompileProcess/)
- [HLSL 交叉编译器](https://docs.unrealengine.com/4.27/zh-CN/ProgrammingAndScripting/Rendering/ShaderDevelopment/HLSLCrossCompiler/)
- [Shader 变体大杀器：Specialization constants](https://blog.uwa4d.com/archives/USparkle_SpecializationConstants.html)
- [剖析虚幻渲染体系（08）- Shader体系](https://www.cnblogs.com/timlly/p/15092257.html)