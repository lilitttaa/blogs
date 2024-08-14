---
title: UE4 从main到BeginPlay
---

## Reference

- https://www.youtube.com/watch?v=IaU2Hue-ApI
- https://docs.unrealengine.com/4.27/zh-CN/InteractiveExperiences/Framework/GameFlow/
- https://www.cnblogs.com/shiroe/p/15547566.html
- https://www.zhihu.com/column/c_1687212815599853569

从 Editor 下按下 Play Button 的调用栈如下：

```cpp
AActor::BeginPlay() Actor.cpp:3562
AActor::DispatchBeginPlay(bool) Actor.cpp:3538
AWorldSettings::NotifyBeginPlay() WorldSettings.cpp:247
AGameStateBase::HandleBeginPlay() GameStateBase.cpp:204
AGameModeBase::StartPlay() GameModeBase.cpp:185
UWorld::BeginPlay() World.cpp:4384
UGameInstance::StartPlayInEditorGameInstance(ULocalPlayer *, const FGameInstancePIEParameters &) GameInstance.cpp:476
UEditorEngine::CreateInnerProcessPIEGameInstance(FRequestPlaySessionParams &, const FGameInstancePIEParameters &, int) PlayLevel.cpp:2943
UEditorEngine::OnLoginPIEComplete_Deferred(int, bool, FString, FPieLoginStruct) PlayLevel.cpp:1502
UEditorEngine::CreateNewPlayInEditorInstance(FRequestPlaySessionParams &, const bool, EPlayNetMode) PlayLevel.cpp:1750
UEditorEngine::StartPlayInEditorSession(FRequestPlaySessionParams &) PlayLevel.cpp:2709
UEditorEngine::StartQueuedPlaySessionRequestImpl() PlayLevel.cpp:1103
UEditorEngine::StartQueuedPlaySessionRequest() PlayLevel.cpp:1015
UEditorEngine::Tick(float, bool) EditorEngine.cpp:1628
UUnrealEdEngine::Tick(float, bool) UnrealEdEngine.cpp:423
FEngineLoop::Tick() LaunchEngineLoop.cpp:4881
[Inlined] EngineTick() Launch.cpp:60
GuardedMain(const wchar_t *) Launch.cpp:179
```

**注**：有一点需要注意，我这里是直接使用的 AGameModeBase，如果你使用的 GameMode 继承自 AGameMode，为了满足多人匹配的机制，它会在等待匹配后再做后续的调用。
![alt text](image.png)

```cpp
void AGameMode::HandleMatchIsWaitingToStart()
{
    // ...
    if (!ReadyToStartMatch())
    {
        GetWorldSettings()->NotifyBeginPlay();
    }
}
```

```cpp
AActor::BeginPlay() Actor.cpp:3562
AActor::DispatchBeginPlay(bool) Actor.cpp:3538
AWorldSettings::NotifyBeginPlay() WorldSettings.cpp:247
AGameStateBase::HandleBeginPlay() GameStateBase.cpp:204
AGameModeBase::StartPlay() GameModeBase.cpp:185
UWorld::BeginPlay() World.cpp:4384
UEngine::LoadMap(FWorldContext &, FURL, UPendingNetGame *, FString &) UnrealEngine.cpp:12606
UEngine::Browse(FWorldContext &, FURL, FString &) UnrealEngine.cpp:12226
UGameInstance::StartGameInstance() GameInstance.cpp:517
UGameEngine::Start() GameEngine.cpp:1162
FEngineLoop::Init() LaunchEngineLoop.cpp:3919
EngineInit() Launch.cpp:48
GuardedMain(const wchar_t *) Launch.cpp:91
```

```cpp
int32 GuardedMain(const TCHAR* CmdLine)
{
    int32 ErrorLevel = EnginePreInit(CmdLine);
    if (ErrorLevel != 0 || IsEngineExitRequested())
    {
        return ErrorLevel;
    }
    ErrorLevel = EngineInit();
    while (!IsEngineExitRequested())
     {
        EngineTick();
    }
    EngineExit();
    return ErrorLevel;
}
```

## 平台入口

## PreInit

- PreInitPreStartupScreen
- PreInitPostStartupScreen

### PreInitPreStartupScreen

- LLM(FLowLevelMemTracker::Get().ProcessCommandLine(CmdLine));
- IFileManager::Get().ProcessCommandLineOptions();
- FPlatformFileManager::Get().InitializeNewAsyncIO();
- GIsGameThreadIdInitialized = true;
- IProjectManager::Get().LoadProjectFile(FPaths::GetProjectFilePath())
- FTaskGraphInterface::Startup(FPlatformMisc::NumberOfCores());
- LoadCoreModules()
- GThreadPool = FQueuedThreadPool::Allocate();
- LoadPreInitModules();
- AppInit();
- IPlatformFeaturesModule::Get();
- InitGamePhys();
- FPlatformSplash::Show();
- RHIInit(bHasEditorToken);
- RenderUtilsInit();
- FShaderCodeLibrary::InitForRuntime(GMaxRHIShaderPlatform);
- GetRendererModule();
- InitializeShaderTypes();
- CompileGlobalShaderMap(false);
- FModuleManager::Get().LoadModuleChecked<ISlateNullRendererModule>("SlateNullRenderer").CreateSlateNullRenderer() / FModuleManager::Get().GetModuleChecked<ISlateRHIRendererModule>("SlateRHIRenderer").CreateSlateRHIRenderer();
- FSlateApplication& CurrentSlateApp = FSlateApplication::Get();
- IProjectManager::Get().LoadModulesForProject(ELoadingPhase::PostSplashScreen)
- IPluginManager::Get().LoadModulesForEnabledPlugins(ELoadingPhase::PostSplashScreen)

从模块的角度看:
...
- LoadCoreModules()
...
- LoadPreInitModules();
- AppInit();
...
- IPlatformFeaturesModule::Get();
...
- GetRendererModule();
...
- FModuleManager::Get().LoadModuleChecked<ISlateNullRendererModule>("SlateNullRenderer").CreateSlateNullRenderer() / FModuleManager::Get().GetModuleChecked<ISlateRHIRendererModule>("SlateRHIRenderer").CreateSlateRHIRenderer();
...
- IProjectManager::Get().LoadModulesForProject(ELoadingPhase::PostSplashScreen)
- IPluginManager::Get().LoadModulesForEnabledPlugins(ELoadingPhase::PostSplashScreen)


## StartModule

```cpp
/**
 * Phase at which this module should be loaded during startup.
 */
namespace ELoadingPhase
{
enum Type
{
    /** As soon as possible - in other words, uplugin files are loadable from a pak file (as well as right after PlatformFile is set up in case pak files aren't used) Used for plugins needed to read files (compression formats, etc) */
    EarliestPossible,
    /** Loaded before the engine is fully initialized, immediately after the config system has been initialized.  Necessary only for very low-level hooks */
    PostConfigInit,
    /** The first screen to be rendered after system splash screen */
    PostSplashScreen,
    /** Loaded before coreUObject for setting up manual loading screens, used for our chunk patching system */
    PreEarlyLoadingScreen,
    /** Loaded before the engine is fully initialized for modules that need to hook into the loading screen before it triggers */
    PreLoadingScreen,
    /** Right before the default phase */
    PreDefault,
    /** Loaded at the default loading point during startup (during engine init, after game modules are loaded.) */
    Default,
    /** Right after the default phase */
    PostDefault,
    /** After the engine has been initialized */
    PostEngineInit,
    /** Do not automatically load this module */
    None,
    // NOTE: If you add a new value, make sure to update the ToString() method below!
    Max
}
};
```

EarliestPossible 在 AppInit 里加载


![alt text](image-1.png)