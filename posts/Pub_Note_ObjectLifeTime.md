---
title: Object Lifetime
---

有个对象的生命周期由其他地方管理，如果想要共享对象的所有权，可以直接使用 UE 的 GC 系统，或者使用 SharedPtr。定义一个新的带反射的容器或者对象即可。但如果希望对象的生命周期由其他地方管理，可以使用 TWeakObjectPtr。

可以参考下面的写法：

1. UWorld 管理了一个 StreamingLevels 的数组：

```cpp
UPROPERTY()
TArray<ULevelStreaming*> StreamingLevels;
```

2. 直接用指针创建 WeakPtr：

```cpp
for (ULevelStreaming* StreamingLevel: CurrentWorld->GetStreamingLevels())
{
    if (StreamingLevel)
    {
        TSharedPtr<FStreamingLevelModel> LevelModel = MakeShareable(new FStreamingLevelModel(*this, StreamingLevel));
        AllLevelsList.Add(LevelModel);
        AllLevelsMap.Add(LevelModel->GetLongPackageName(), LevelModel);
        PersistentLevelModel->AddChild(LevelModel);
        LevelModel->SetParent(PersistentLevelModel);
    }
}

class FStreamingLevelModel
{
    FStreamingLevelModel::FStreamingLevelModel(FStreamingLevelCollectionModel& InWorldData, ULevelStreaming* InLevelStreaming)
        : FLevelModel(InWorldData), LevelStreaming(InLevelStreaming), bHasValidPackageName(false){...}

    TWeakObjectPtr<ULevelStreaming> LevelStreaming;
    ...
}

```

3. 使用 WeakPtr 的时候，需要先检查是否有效：

```cpp
ULevelStreaming* StreamingObj = LevelStreaming.Get();
if (StreamingObj)
{
    // do something
}
```
