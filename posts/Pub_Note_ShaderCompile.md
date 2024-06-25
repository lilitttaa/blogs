---
title: Unreal Shader Compile
---

- [调试着色器编译过程](https://docs.unrealengine.com/4.27/zh-CN/ProgrammingAndScripting/Rendering/ShaderDevelopment/ShaderCompileProcess/)
- [HLSL 交叉编译器](https://docs.unrealengine.com/4.27/zh-CN/ProgrammingAndScripting/Rendering/ShaderDevelopment/HLSLCrossCompiler/)
- [Shader 变体大杀器：Specialization constants](https://blog.uwa4d.com/archives/USparkle_SpecializationConstants.html)

## hlslcc 模块是怎么被 ShaderCompileWorker 引用的?

ShaderCompileWorker -> ShaderCompileCommon -> hlslcc

## Compile Shader 跟 Compile Shader Pipeline 有什么区别？

FGlobalShaderTypeCompiler::BeginCompileShader
FGlobalShaderTypeCompiler::BeginCompileShaderPipeline

## 怎么才能控制使用哪个编译格式？

## 编译 Shader 的 Cmd

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

Shader 分为 Global 和 Material 两种
例如在执行命令行 RecompileShaders All 后：
![alt text](image-1.png)
首先会通过调用 RecompileGlobalShaders 编译 Global Shader，然后通过 Material->PostEditChange 编译 Material Shader

## 编译的调用栈

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
## Shader 的类型
![alt text](image-2.png)

## 调试 ShaderCompileWorker

## 重要类

IShaderFormat 决定了使用哪个着色器格式，也决定了是否使用 hlslcc
![alt text](image.png)
（其中 VectorVM 是 UE 中用于处理 Niagara 的后端格式）

## Shader Platform 是怎么确定的？
ITargetPlatform::GetAllTargetedShaderFormats