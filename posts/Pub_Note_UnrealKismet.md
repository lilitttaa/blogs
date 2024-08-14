---
title: Unreal Kismet
---

## 获取选中节点 Copy 的内容

先通过Asset拿到 UBlueprint
![alt text](image-5.png)
![alt text](image.png)
然后通过 UBlueprint 获取 UEdGraph
![alt text](image-1.png)
UEdGraph 中包含所有 Nodes：
![alt text](image-2.png)
可以通过 Nodes 构建 SelectionSet：
![alt text](image-3.png)
然后就可以基于这个 SelectionSet 来 Copy 了：
![alt text](image-4.png)
