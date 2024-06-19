---
title: Lightmass Source Code Analyis
---

## Questions?

1. LightMap与ShadowMap的分离是什么情况下的？静态还是动态物体？
2. Stationary灯现在看上去已经支持ShadowMap了

## 思路

### 将光源视角shadowmap导入stationary光照渲染流程思路

1. movable灯在FDeferredShadingSceneRenderer::RenderShadowProjections中会使用光源视角的shadowmap。可以从这里入手，在staionary的build流程中构建这张shadowmap，然后在渲染流程中使用。
2. Lightmass会构建CompletedStaticShadowDepthMaps，确定这张图是不是光源视角的shadowmap，是否可以直接使用。

## Prerequisite

### 灯光相关使用

- <https://zhuanlan.zhihu.com/p/137414102>

### 什么是Static, Stationary, Movable光?

- <https://docs.unrealengine.com/4.27/zh-CN/BuildingWorlds/LightingAndShadows/LightMobility/>
- [UE4光源移动性类型浅析](https://zhuanlan.zhihu.com/p/447812762)

Static：

- 直接光，间接光，直接阴影，间接阴影全都存在LightMap里
- 不支持动态物体，虽然不能为动态物体提供阴影，但是可以通过VLM为动态物体提供间接光

Stationary：

- 间接光，间接阴影存在LightMap里
- 直接光实时计算
- 直接阴影存在ShadowMap里，使用距离场阴影（Distance Field Shadows），比Static更清晰。
  - 生成距离场阴影贴图，应用到静态不透明表面。
  - 生成阴影深度贴图，应用于半透明静态表面。
  - 对于动态物体来说，需要从距离场贴图中集成环境世界的静态阴影。每个动态物体创建两个动态阴影，一个是处理静态世界到动态物体的阴影，另一个是处理动态物体到静态世界的阴影。因此，当动态物体太多时，开销甚至会超过Movable类型。
  - 另外，对于定向固定光源，可以使用Cascaded Shadow Maps（CSM）作为远距离的静态阴影，降低开销。

Movable：

- 全运行时计算
- 光源保持不动时可以使用阴影贴图缓存进行优化

| \ | Static | Stationary | Movable |
| --- | --- | --- | --- |
| 静态物体直接光 | LightMap | 实时计算 | 实时计算 |
| 静态物体直接阴影 | LightMap | ShadowMap | 实时计算 |
| 静态物体间接光和阴影 | LightMap | LightMap or **VLM** | ？ |
| 动态物体直接光 | 无 | 实时计算 | 实时计算
| 动态物体直接阴影 | 无 | ShadowMap + 实时计算 | 实时计算
| 动态物体间接光和阴影 | VLM | VLM | ？ |

### Quad压缩

- <https://zhuanlan.zhihu.com/p/609148647>

### Probe与LightMap

- <https://zhuanlan.zhihu.com/p/54995217>

### VLM（Volumetric Lightmap）是用来干什么的，什么时候会使用？

- LightMap可以表示出静态物体的间接光，当然也包含直接光
- Volumetric Lightmap用来展示动态物体的间接光

<https://docs.unrealengine.com/4.27/zh-CN/RenderingAndGraphics/Lightmass/VolumetricLightmaps/>

在构建时将所有点（球体，也就是Probe，使用三阶球谐函数存储所有方向传来的光照）的预计算光照存储在Volumetric Lightmap中，然后在运行时用于动态Object的间接光照的插值。

### 什么是PreShadow?
PreShadow 是per object shadow，用于处理静态环境对动态物体的投射。

### ShadowMap有哪些类型？

## Inside The Source Code

### FLightmassProcessor

Lightmass 统计数据，场景数据的导入导出，导出会调用FLightmassExporter

### FLightmassExporter

Lightmass 统计数据，场景数据导出

### FStaticLightingManager

- 入口类
- 管理众多FStaticLightingSystem

### FStaticLightingSystem

- 每个Level一个FStaticLightingSystem

```
> UEditorEngine::BuildLighting
> FStaticLightingManager::CreateStaticLightingSystem
> bool bSuccess = ActiveStaticLightingSystem->BeginLightmassProcess();
```

```
> UEditorEngine::UpdateBuildLighting
> 首先执行ActiveStaticLightingSystem->UpdateLightingBuild();
如果当前ActiveStaticLightingSystem执行完成，会更新ActiveStaticLightingSystem并调用
> ActiveStaticLightingSystem->BeginLightmassProcess();
```

### 写入光照贴图相关统计数据，场景数据

FLightmassExporter::WriteLights

调用栈：

``` cpp
FLightmassExporter::WriteToChannel(FLightmassStatistics &, FGuid &) Lightmass.cpp:692
FLightmassProcessor::InitiateExport() Lightmass.cpp:2896
FStaticLightingSystem::InitiateLightmassProcessor() StaticLightingSystem.cpp:2196
FStaticLightingSystem::BeginLightmassProcess() StaticLightingSystem.cpp:768
FStaticLightingManager::CreateStaticLightingSystem(const FLightingBuildOptions &) StaticLightingSystem.cpp:310
UEditorEngine::BuildLighting(const FLightingBuildOptions &) StaticLightingSystem.cpp:2514
```

### 启动Lightmass.exe的流程

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="606px" viewBox="-0.5 -0.5 606 612" content="&lt;mxfile&gt;&lt;diagram id=&quot;iv_ffmkda9DXmKsruvzv&quot; name=&quot;Page-1&quot;&gt;&lt;mxGraphModel dx=&quot;730&quot; dy=&quot;1867&quot; grid=&quot;1&quot; gridSize=&quot;10&quot; guides=&quot;1&quot; tooltips=&quot;1&quot; connect=&quot;1&quot; arrows=&quot;1&quot; fold=&quot;1&quot; page=&quot;1&quot; pageScale=&quot;1&quot; pageWidth=&quot;850&quot; pageHeight=&quot;1100&quot; math=&quot;0&quot; shadow=&quot;0&quot;&gt;&lt;root&gt;&lt;mxCell id=&quot;0&quot;/&gt;&lt;mxCell id=&quot;1&quot; parent=&quot;0&quot;/&gt;&lt;mxCell id=&quot;10&quot; value=&quot;&quot; style=&quot;edgeStyle=none;html=1;&quot; edge=&quot;1&quot; parent=&quot;1&quot; source=&quot;6&quot; target=&quot;7&quot;&gt;&lt;mxGeometry relative=&quot;1&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;6&quot; value=&quot;&amp;lt;div style=&amp;quot;background-color:#262626;color:#d0d0d0&amp;quot;&amp;gt;&amp;lt;pre style=&amp;quot;font-family:'JetBrains Mono',monospace;font-size:10.5pt;&amp;quot;&amp;gt;&amp;lt;span style=&amp;quot;color:#39cc9b;&amp;quot;&amp;gt;BuildStaticLighting&amp;lt;/span&amp;gt;&amp;lt;/pre&amp;gt;&amp;lt;/div&amp;gt;&quot; style=&quot;text;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;185&quot; y=&quot;210&quot; width=&quot;190&quot; height=&quot;70&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;7&quot; value=&quot;&amp;lt;div style=&amp;quot;background-color:#262626;color:#d0d0d0&amp;quot;&amp;gt;&amp;lt;pre style=&amp;quot;font-family:'JetBrains Mono',monospace;font-size:10.5pt;&amp;quot;&amp;gt;&amp;lt;span style=&amp;quot;color:#c191ff;&amp;quot;&amp;gt;FSwarmInterface&amp;lt;/span&amp;gt;::&amp;lt;span style=&amp;quot;color:#39cc9b;&amp;quot;&amp;gt;Initialize&amp;lt;/span&amp;gt;&amp;lt;/pre&amp;gt;&amp;lt;/div&amp;gt;&quot; style=&quot;text;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;185&quot; y=&quot;330&quot; width=&quot;260&quot; height=&quot;70&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;9&quot; value=&quot;&quot; style=&quot;edgeStyle=none;html=1;&quot; edge=&quot;1&quot; parent=&quot;1&quot; source=&quot;8&quot; target=&quot;6&quot;&gt;&lt;mxGeometry relative=&quot;1&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;8&quot; value=&quot;Lightmass.exe&quot; style=&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;60&quot; y=&quot;140&quot; width=&quot;100&quot; height=&quot;30&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;12&quot; style=&quot;edgeStyle=none;html=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;&quot; edge=&quot;1&quot; parent=&quot;1&quot; source=&quot;11&quot; target=&quot;7&quot;&gt;&lt;mxGeometry relative=&quot;1&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;11&quot; value=&quot;&amp;lt;div style=&amp;quot;background-color:#262626;color:#d0d0d0&amp;quot;&amp;gt;&amp;lt;pre style=&amp;quot;font-family:'JetBrains Mono',monospace;font-size:10.5pt;&amp;quot;&amp;gt;&amp;lt;span style=&amp;quot;color:#39cc9b;&amp;quot;&amp;gt;CreateLightmassProcessor&amp;lt;/span&amp;gt;&amp;lt;/pre&amp;gt;&amp;lt;/div&amp;gt;&quot; style=&quot;text;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;410&quot; y=&quot;120&quot; width=&quot;240&quot; height=&quot;70&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;14&quot; value=&quot;&quot; style=&quot;edgeStyle=none;html=1;&quot; edge=&quot;1&quot; parent=&quot;1&quot; source=&quot;13&quot; target=&quot;11&quot;&gt;&lt;mxGeometry relative=&quot;1&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;13&quot; value=&quot;&amp;lt;div style=&amp;quot;background-color:#262626;color:#d0d0d0&amp;quot;&amp;gt;&amp;lt;pre style=&amp;quot;font-family:'JetBrains Mono',monospace;font-size:10.5pt;&amp;quot;&amp;gt;&amp;lt;span style=&amp;quot;color:#39cc9b;&amp;quot;&amp;gt;BeginLightmassProcess&amp;lt;/span&amp;gt;&amp;lt;/pre&amp;gt;&amp;lt;/div&amp;gt;&quot; style=&quot;text;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;425&quot; y=&quot;-70&quot; width=&quot;210&quot; height=&quot;70&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;18&quot; value=&quot;&quot; style=&quot;edgeStyle=none;html=1;&quot; edge=&quot;1&quot; parent=&quot;1&quot; source=&quot;17&quot; target=&quot;13&quot;&gt;&lt;mxGeometry relative=&quot;1&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;17&quot; value=&quot;&amp;lt;div style=&amp;quot;background-color:#262626;color:#d0d0d0&amp;quot;&amp;gt;&amp;lt;pre style=&amp;quot;font-family:'JetBrains Mono',monospace;font-size:10.5pt;&amp;quot;&amp;gt;&amp;lt;span style=&amp;quot;color:#c191ff;&amp;quot;&amp;gt;UEditorEngine&amp;lt;/span&amp;gt;::&amp;lt;span style=&amp;quot;color:#39cc9b;&amp;quot;&amp;gt;BuildLighting&amp;lt;/span&amp;gt;&amp;lt;/pre&amp;gt;&amp;lt;/div&amp;gt;&quot; style=&quot;text;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;395&quot; y=&quot;-210&quot; width=&quot;270&quot; height=&quot;70&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;20&quot; value=&quot;&quot; style=&quot;edgeStyle=none;html=1;&quot; edge=&quot;1&quot; parent=&quot;1&quot; source=&quot;19&quot; target=&quot;8&quot;&gt;&lt;mxGeometry relative=&quot;1&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;19&quot; value=&quot;&amp;lt;div style=&amp;quot;background-color:#262626;color:#d0d0d0&amp;quot;&amp;gt;&amp;lt;pre style=&amp;quot;font-family:'JetBrains Mono',monospace;font-size:10.5pt;&amp;quot;&amp;gt;&amp;lt;span style=&amp;quot;color:#66c3cc;&amp;quot;&amp;gt;Swarm&amp;lt;/span&amp;gt;&amp;lt;span style=&amp;quot;color:#bdbdbd;&amp;quot;&amp;gt;.&amp;lt;/span&amp;gt;&amp;lt;span style=&amp;quot;color:#39cc9b;&amp;quot;&amp;gt;BeginJobSpecification&amp;lt;/span&amp;gt;&amp;lt;/pre&amp;gt;&amp;lt;/div&amp;gt;&quot; style=&quot;text;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;120&quot; y=&quot;40&quot; width=&quot;260&quot; height=&quot;70&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;23&quot; value=&quot;&quot; style=&quot;edgeStyle=none;html=1;&quot; edge=&quot;1&quot; parent=&quot;1&quot; source=&quot;21&quot; target=&quot;19&quot;&gt;&lt;mxGeometry relative=&quot;1&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;21&quot; value=&quot;&amp;lt;div style=&amp;quot;background-color:#262626;color:#d0d0d0&amp;quot;&amp;gt;&amp;lt;pre style=&amp;quot;font-family:'JetBrains Mono',monospace;font-size:10.5pt;&amp;quot;&amp;gt;&amp;lt;span style=&amp;quot;color:#c191ff;&amp;quot;&amp;gt;FLightmassProcessor&amp;lt;/span&amp;gt;::&amp;lt;span style=&amp;quot;color:#39cc9b;&amp;quot;&amp;gt;BeginRun&amp;lt;/span&amp;gt;&amp;lt;/pre&amp;gt;&amp;lt;/div&amp;gt;&quot; style=&quot;text;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;110&quot; y=&quot;-90&quot; width=&quot;280&quot; height=&quot;70&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;25&quot; value=&quot;&quot; style=&quot;edgeStyle=none;html=1;&quot; edge=&quot;1&quot; parent=&quot;1&quot; source=&quot;24&quot; target=&quot;21&quot;&gt;&lt;mxGeometry relative=&quot;1&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;24&quot; value=&quot;&amp;lt;div style=&amp;quot;background-color:#262626;color:#d0d0d0&amp;quot;&amp;gt;&amp;lt;pre style=&amp;quot;font-family:'JetBrains Mono',monospace;font-size:10.5pt;&amp;quot;&amp;gt;&amp;lt;span style=&amp;quot;color:#c191ff;&amp;quot;&amp;gt;UEditorEngine&amp;lt;/span&amp;gt;::&amp;lt;span style=&amp;quot;color:#39cc9b;&amp;quot;&amp;gt;UpdateBuildLighting&amp;lt;/span&amp;gt;&amp;lt;/pre&amp;gt;&amp;lt;/div&amp;gt;&quot; style=&quot;text;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;90&quot; y=&quot;-210&quot; width=&quot;320&quot; height=&quot;70&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;/root&gt;&lt;/mxGraphModel&gt;&lt;/diagram&gt;&lt;/mxfile&gt;" onclick="(function(svg){var src=window.event.target||window.event.srcElement;while (src!=null&amp;&amp;src.nodeName.toLowerCase()!='a'){src=src.parentNode;}if(src==null){if(svg.wnd!=null&amp;&amp;!svg.wnd.closed){svg.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&amp;&amp;evt.source==svg.wnd){svg.wnd.postMessage(decodeURIComponent(svg.getAttribute('content')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);svg.wnd=window.open('https://viewer.diagrams.net/?client=1&amp;page=0&amp;edit=_blank');}}})(this);" style="cursor:pointer;max-width:100%;max-height:612px;"><defs/><g><path d="M 230.21 490 L 243.01 533.89" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 244.48 538.93 L 239.16 533.19 L 243.01 533.89 L 245.88 531.23 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><rect x="125" y="420" width="190" height="70" fill="none" stroke="none" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 188px; height: 1px; padding-top: 427px; margin-left: 127px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><div style="background-color:#262626;color:#d0d0d0"><pre style="font-family:'JetBrains Mono',monospace;font-size:10.5pt;"><span style="color:#39cc9b;">BuildStaticLighting</span></pre></div></div></div></div></foreignObject><text x="127" y="439" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">BuildStaticLighting</text></switch></g><rect x="125" y="540" width="260" height="70" fill="none" stroke="none" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 258px; height: 1px; padding-top: 547px; margin-left: 127px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><div style="background-color:#262626;color:#d0d0d0"><pre style="font-family:'JetBrains Mono',monospace;font-size:10.5pt;"><span style="color:#c191ff;">FSwarmInterface</span>::<span style="color:#39cc9b;">Initialize</span></pre></div></div></div></div></foreignObject><text x="127" y="559" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">FSwarmInterface::Initialize</text></switch></g><path d="M 78.33 380 L 148.26 417.02" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 152.9 419.48 L 145.08 419.29 L 148.26 417.02 L 148.35 413.11 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><rect x="0" y="350" width="100" height="30" fill="none" stroke="none" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 1px; height: 1px; padding-top: 365px; margin-left: 50px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: nowrap;">Lightmass.exe</div></div></div></foreignObject><text x="50" y="369" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px" text-anchor="middle">Lightmass.exe</text></switch></g><path d="M 427 400 L 259.94 535.98" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 255.87 539.29 L 259.09 532.16 L 259.94 535.98 L 263.51 537.59 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><rect x="350" y="330" width="240" height="70" fill="none" stroke="none" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 238px; height: 1px; padding-top: 337px; margin-left: 352px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><div style="background-color:#262626;color:#d0d0d0"><pre style="font-family:'JetBrains Mono',monospace;font-size:10.5pt;"><span style="color:#39cc9b;">CreateLightmassProcessor</span></pre></div></div></div></div></foreignObject><text x="352" y="349" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">CreateLightmassProcessor</text></switch></g><path d="M 470 210 L 470 323.63" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 470 328.88 L 466.5 321.88 L 470 323.63 L 473.5 321.88 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><rect x="365" y="140" width="210" height="70" fill="none" stroke="none" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 208px; height: 1px; padding-top: 147px; margin-left: 367px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><div style="background-color:#262626;color:#d0d0d0"><pre style="font-family:'JetBrains Mono',monospace;font-size:10.5pt;"><span style="color:#39cc9b;">BeginLightmassProcess</span></pre></div></div></div></div></foreignObject><text x="367" y="159" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">BeginLightmassProcess</text></switch></g><path d="M 470 70 L 470 133.63" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 470 138.88 L 466.5 131.88 L 470 133.63 L 473.5 131.88 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><rect x="335" y="0" width="270" height="70" fill="none" stroke="none" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 268px; height: 1px; padding-top: 7px; margin-left: 337px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><div style="background-color:#262626;color:#d0d0d0"><pre style="font-family:'JetBrains Mono',monospace;font-size:10.5pt;"><span style="color:#c191ff;">UEditorEngine</span>::<span style="color:#39cc9b;">BuildLighting</span></pre></div></div></div></div></foreignObject><text x="337" y="19" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">UEditorEngine::BuildLighting</text></switch></g><path d="M 128.75 320 L 81.78 346.84" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 77.22 349.45 L 81.56 342.93 L 81.78 346.84 L 85.03 349.01 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><rect x="60" y="250" width="260" height="70" fill="none" stroke="none" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 258px; height: 1px; padding-top: 257px; margin-left: 62px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><div style="background-color:#262626;color:#d0d0d0"><pre style="font-family:'JetBrains Mono',monospace;font-size:10.5pt;"><span style="color:#66c3cc;">Swarm</span><span style="color:#bdbdbd;">.</span><span style="color:#39cc9b;">BeginJobSpecification</span></pre></div></div></div></div></foreignObject><text x="62" y="269" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">Swarm.BeginJobSpecification</text></switch></g><path d="M 190 190 L 190 243.63" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 190 248.88 L 186.5 241.88 L 190 243.63 L 193.5 241.88 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><rect x="50" y="120" width="280" height="70" fill="none" stroke="none" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 278px; height: 1px; padding-top: 127px; margin-left: 52px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><div style="background-color:#262626;color:#d0d0d0"><pre style="font-family:'JetBrains Mono',monospace;font-size:10.5pt;"><span style="color:#c191ff;">FLightmassProcessor</span>::<span style="color:#39cc9b;">BeginRun</span></pre></div></div></div></div></foreignObject><text x="52" y="139" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">FLightmassProcessor::BeginRun</text></switch></g><path d="M 190 70 L 190 113.63" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 190 118.88 L 186.5 111.88 L 190 113.63 L 193.5 111.88 Z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/><rect x="30" y="0" width="320" height="70" fill="none" stroke="none" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow: visible; text-align: left;"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe flex-start; justify-content: unsafe flex-start; width: 318px; height: 1px; padding-top: 7px; margin-left: 32px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: left;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><div style="background-color:#262626;color:#d0d0d0"><pre style="font-family:'JetBrains Mono',monospace;font-size:10.5pt;"><span style="color:#c191ff;">UEditorEngine</span>::<span style="color:#39cc9b;">UpdateBuildLighting</span></pre></div></div></div></div></foreignObject><text x="32" y="19" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12px">UEditorEngine::UpdateBuildLighting</text></switch></g></g><switch><g requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"/><a transform="translate(0,-5)" xlink:href="https://www.diagrams.net/doc/faq/svg-export-text-problems" target="_blank"><text text-anchor="middle" font-size="10px" x="50%" y="100%">Text is not SVG - cannot display</text></a></switch></svg>

### 启动Lightmass.exe

FLightmassProcessor::BeginRun 会将Lightmass相关执行信息，包括执行路径，参数等封装传递给Swarm执行

Swarm会在job.cs文件中的StartJobExecution函数中调用Lightmass.exe

``` cs
Process TaskProcess = new Process();
TaskProcess.StartInfo.FileName = FullExecutableName;
TaskProcess.StartInfo.Arguments = SpecificationParameters;
TaskProcess.StartInfo.WorkingDirectory =JobSpecificFolder;
TaskProcess.StartInfo.CreateNoWindow = true;
```

### Debug Lightmass

Lightmass是一个独立于UE4的单独的程序，并且是通过Swarm来间接启动的，调试需要开启lightmassdebug，并attach到Lightmass进程上，具体参考下面：

<https://ikrima.dev/ue4guide/graphics-development/lightmass-lightmapping/debugging-lightmass/>

### Build入口

在FStaticLightingSystem中的MultithreadProcess函数中，调用栈如下：

``` cpp
Lightmass::FStaticLightingSystem::MultithreadProcess() LightingSystem.cpp:607
Lightmass::FStaticLightingSystem::FStaticLightingSystem(const Lightmass::FLightingBuildOptions &, Lightmass::FScene &, Lightmass::FLightmassSolverExporter &, int) LightingSystem.cpp:571
Lightmass::BuildStaticLighting(const FGuid &, int, bool) CPUSolver.cpp:201
Lightmass::LightmassMain(int, char **) UnrealLightmass.cpp:238
```

MultithreadProcess中会启动FMappingProcessingThreadRunnable线程，

``` cpp
FMappingProcessingThreadRunnable* ThreadRunnable = new FMappingProcessingThreadRunnable(this, ThreadIndex, StaticLightingTask_ProcessMappings);
```

线程的调用栈

``` cpp
Lightmass::FStaticLightingSystem::ThreadLoop(bool, int, Lightmass::FThreadStatistics &, float &) LightingSystem.cpp:1789
Lightmass::FMappingProcessingThreadRunnable::Run() LightingSystem.cpp:1532
```

在ThreadLoop中会根据任务类型的不同调用不同的函数

- ProcessTextureMapping: 处理光照贴图
- CalculateAdaptiveVolumetricLightmap：计算VLM
- CalculateStaticShadowDepthMap：计算ShadowMap
- ……

执行的结果，保存到

- CompleteTextureMappingList
- CompleteVolumetricLightmapTaskList
- CompletedStaticShadowDepthMaps
- ……

最后会进行导出，例如

``` cpp
CompleteTextureMappingList.ApplyAndClear( *this );
```

### 光照贴图Build

Build核心部分主要是这几个函数:
- CalculateDirectLightingTextureMappingFiltered: 直接光计算
- CalculateDirectAreaLightingTextureMapping: 直接区域光计算
- CalculateDirectSignedDistanceFieldLightingTextureMappingTextureSpace: 直接距离场阴影计算
- CalculateDirectLightingTextureMappingPhotonMap: 用direct photon map评估直接光，ForDebug
- CalculateIndirectLightingTextureMapping: 间接光计算

在CalculateDirectLightingTextureMappingFiltered中

- 首先计算ShadowMapData
- 然后Filter得到FilteredShadowMapData
- 最后根据条件决定使用ShadowMap还是LightMap

### 导出

导出部分的Ext如下：

``` cpp
static const TCHAR LM_TEXTUREMAPPING_EXTENSION[] = TEXT("tmap");
static const TCHAR LM_VOLUMESAMPLES_EXTENSION[]  = TEXT("vols");
static const TCHAR LM_VOLUMEDEBUGOUTPUT_EXTENSION[] = TEXT("vold");
static const TCHAR LM_VOLUMETRICLIGHTMAP_EXTENSION[] = TEXT("irvol");
static const TCHAR LM_PRECOMPUTEDVISIBILITY_EXTENSION[] = TEXT("vis");
static const TCHAR LM_DOMINANTSHADOW_EXTENSION[] = TEXT("doms");
static const TCHAR LM_MESHAREALIGHTDATA_EXTENSION[] = TEXT("arealights");
static const TCHAR LM_DEBUGOUTPUT_EXTENSION[]  = TEXT("dbgo");
```

### 导入LightMap

首先会在FLightmassProcessor::ImportStaticLightingTextureMapping中执行ImportTextureMapping将数据写入到ImportedMappings中，调用栈如下：

``` cpp
FLightmassProcessor::ImportTextureMapping(int, FLightmassProcessor::FTextureMappingImportHelper &) Lightmass.cpp:4636
FLightmassProcessor::ImportStaticLightingTextureMapping(const FGuid &, bool) Lightmass.cpp:4133
FLightmassProcessor::ImportMapping(const FGuid &, bool) Lightmass.cpp:4279
[Inlined] FLightmassProcessor::ImportMappings(bool) Lightmass.cpp:3510
FLightmassProcessor::CompleteRun() Lightmass.cpp:3449
FStaticLightingSystem::FinishLightmassProcess() StaticLightingSystem.cpp:2237
```

然后在FLightmassProcessor::ProcessMapping中使用ImportedMappings这个数据，然后分别进入到BSP，StaticMesh，Landscape的Apply函数中。

以StaticMesh为例会调用，调用栈如下：

``` cpp
FLightMap2D::AllocateLightMap(UObject *, FQuantizedLightmapData *&, const TMap<…> &, const FBoxSphereBounds &, ELightMapPaddingType, ELightMapFlags) LightMap.cpp:1992
FStaticMeshStaticLightingTextureMapping::Apply(FQuantizedLightmapData *, const TMap<…> &, ULevel *) StaticMeshLight.cpp:250
FLightmassProcessor::ProcessMapping(const FGuid &) Lightmass.cpp:4329
```

AllocateLightMap会返回一个记录LightMap使用光照的GUID的FLightMap，并将相关Raw数据写入到

``` cpp
static TArray<FLightMapAllocationGroup> PendingLightMaps;
```

PendingLightMaps会参与到后续的FLightMap2D::EncodeTextures中去

### 展示Lightmap

展示Lightmap时，会先根据生成的数据创建ULightMapTexture2D

``` cpp
auto Texture               = NewObject<ULightMapTexture2D>(Outer, GetLightmapName(GLightmapCounter, CoefficientIndex));
```

调用栈

``` cpp
FLightMapPendingTexture::CreateUObjects() LightMap.cpp:1206
FLightMap2D::EncodeTextures(UWorld *, ULevel *, bool, bool) LightMap.cpp:2511
FStaticLightingSystem::EncodeTextures(bool) StaticLightingSystem.cpp:1244
FStaticLightingSystem::FinishLightmassProcess() StaticLightingSystem.cpp:2253
FStaticLightingManager::ProcessLightingData() StaticLightingSystem.cpp:170
FStaticLightingSystem::UpdateLightingBuild() StaticLightingSystem.cpp:2383
FStaticLightingManager::UpdateBuildLighting() StaticLightingSystem.cpp:347
UEditorEngine::UpdateBuildLighting() StaticLightingSystem.cpp:2519
FEngineLoop::Tick() LaunchEngineLoop.cpp:4881
```

对应的UShadowMapTexture2D会在FShadowMap2D::EncodeTextures中创建

UI展示时会调用函数UWorld::GetLightMapsAndShadowMaps
访问所有LightMapTexture2D和ShadowMapTexture2D

``` cpp
GetObjectsOfClass(ULightMapTexture2D::StaticClass(), Objects);
GetObjectsOfClass(UShadowMapTexture2D::StaticClass(), Objects);
GetObjectsOfClass(ULightMapVirtualTexture2D::StaticClass(), Objects);
```

调用栈

``` cpp
UWorld::GetLightMapsAndShadowMaps(ULevel *, TArray<…> &) World.cpp:7311
FLightmapCustomNodeBuilder::RefreshLightmapItems() WorldSettingsDetails.cpp:380
FLightmapCustomNodeBuilder::GenerateChildContent(IDetailChildrenBuilder &) WorldSettingsDetails.cpp:197
FDetailCustomBuilderRow::OnGenerateChildren(TArray<…> &) DetailCustomBuilderRow.cpp:64
FDetailItemNode::GenerateChildren(bool) DetailItemNode.cpp:385
TMulticastDelegate::Broadcast() DelegateSignatureImpl.inl:955
FStaticLightingManager::ProcessLightingData() StaticLightingSystem.cpp:172
FStaticLightingSystem::UpdateLightingBuild() StaticLightingSystem.cpp:2383
FStaticLightingManager::UpdateBuildLighting() StaticLightingSystem.cpp:347
UEditorEngine::UpdateBuildLighting() StaticLightingSystem.cpp:2519
```

### Lightmass.exe是怎么知道要执行的任务信息的？

首先会在

``` cpp
FLightmassSwarm::PrefetchTasks()
```

中向Swarm请求任务

``` cpp
SendMessage( NSwarm::FMessage( NSwarm::MESSAGE_TASK_REQUEST ) );
```

然后触发回调

``` cpp
FLightmassSwarm::SwarmCallback( NSwarm::FMessage* CallbackMessage, void* UserParam )
```

将获取到的任务添加到TaskQueue中

执行下一个任务时调用

``` cpp
FStaticLightingSystem::ThreadGetNextMapping
```

该函数会执行到

``` cpp
FLightmassSwarm::RequestTask( FGuid& TaskGuid, uint32 WaitTime )
```

从TaskQueue中获取TaskGuid

### StaticShadowDepthMap的导入与导出
导出调用栈
``` cpp
Lightmass::FLightmassSolverExporter::ExportStaticShadowDepthMap(const FGuid &, const Lightmass::FStaticShadowDepthMap &) Exporter.cpp:81
Lightmass::FStaticLightingSystem::ExportNonMappingTasks() LightingSystem.cpp:781
Lightmass::FStaticLightingSystem::MultithreadProcess() LightingSystem.cpp:699
Lightmass::FStaticLightingSystem::FStaticLightingSystem(const Lightmass::FLightingBuildOptions &, Lightmass::FScene &, Lightmass::FLightmassSolverExporter &, int) LightingSystem.cpp:571
Lightmass::BuildStaticLighting(const FGuid &, int, bool) CPUSolver.cpp:201
```

导入调用栈
``` cpp
FLightmassProcessor::ImportStaticShadowDepthMap(ULightComponent *) Lightmass.cpp:4238
FLightmassProcessor::ImportMapping(const FGuid &, bool) Lightmass.cpp:4288
[Inlined] FLightmassProcessor::ImportMappings(bool) Lightmass.cpp:3511
FLightmassProcessor::CompleteRun() Lightmass.cpp:3450
FStaticLightingSystem::FinishLightmassProcess() StaticLightingSystem.cpp:2237
```

在导入之后，ShadowDepthMap会被写入到FLightComponentMapBuildData中
``` cpp
FLightComponentMapBuildData& CurrentLightData = CurrentRegistry->FindOrAllocateLightBuildData(Light->LightGuid, true);
Lightmass::FStaticShadowDepthMapData ShadowMapData;
Swarm.ReadChannel(Channel, &ShadowMapData, sizeof(ShadowMapData));
BeginReleaseResource(&Light->StaticShadowDepthMap);
CurrentLightData.DepthMap.Empty();
CurrentLightData.DepthMap.WorldToLight = ShadowMapData.WorldToLight;
CurrentLightData.DepthMap.ShadowMapSizeX = ShadowMapData.ShadowMapSizeX;
CurrentLightData.DepthMap.ShadowMapSizeY = ShadowMapData.ShadowMapSizeY;
```

那么这些数据是在哪传递到渲染线程的呢？

在ULightComponent::InitializeStaticShadowDepthMap中将FLightComponentMapBuildData传递到ULightComponent::StaticShadowDepthMap


### LightSpace Depth Map

![alt text](image.png)
这个CachedShadowDepthMap是从哪来的呢

- 在FSceneRenderer::AllocateCachedSpotlightShadowDepthTargets将相应的空间分配给了FSceneRenderer::SortedShadowsForShadowDepthPass
- 在FSceneRenderer::AllocateSpotShadowDepthTargets中将VisibleLightInfo.AllProjectedShadows中的FProjectedShadowInfo添加到SortedShadowsForShadowDepthPass中
  ``` cpp
  FSceneRenderer::AllocateSpotShadowDepthTargets(FRHICommandListImmediate &, TArray<…> &) ShadowSetup.cpp:4188
  FSceneRenderer::AllocateShadowDepthTargets(FRHICommandListImmediate &) ShadowSetup.cpp:4147
  FSceneRenderer::InitDynamicShadows(FRHICommandListImmediate &, FGlobalDynamicIndexBuffer &, FGlobalDynamicVertexBuffer &, FGlobalDynamicReadBuffer &) ShadowSetup.cpp:5031
  FDeferredShadingSceneRenderer::InitViewsPossiblyAfterPrepass(FRHICommandListImmediate &, FILCUpdatePrimTaskData &) SceneVisibility.cpp:4518
  ```
  同时也会添加到VisibleLightInfo.ShadowsToProject中去

最终Shader是从VisibleLightInfo.ShadowsToProject获取到的FProjectedShadowInfo
``` cpp
// FSceneRenderer::RenderShadowProjections
for (int32 ShadowIndex = 0; ShadowIndex < VisibleLightInfo.ShadowsToProject.Num(); ShadowIndex++)
    {
        const FProjectedShadowInfo* ProjectedShadowInfo = VisibleLightInfo.ShadowsToProject[ShadowIndex];
        if (ProjectedShadowInfo->bRayTracedDistanceField)
        {
            DistanceFieldShadows.Add(ProjectedShadowInfo);
        }
        else
        {
            NormalShadows.Add(ProjectedShadowInfo);
        }
    }
```
调用栈

``` cpp
BindShaderShaders<…>(FRHICommandList &, FGraphicsPipelineStateInitializer &, int, const FViewInfo &, const FHairStrandsVisibilityData *, const FProjectedShadowInfo *) ShadowRendering.cpp:450
BindShadowProjectionShaders(int, FRHICommandList &, FGraphicsPipelineStateInitializer, int, const FViewInfo &, const FHairStrandsVisibilityData *, const FProjectedShadowInfo *, bool) ShadowRendering.cpp:646
FProjectedShadowInfo::RenderProjection(FRHICommandListImmediate &, int, const FViewInfo *, const FSceneRenderer *, bool, bool, const FHairStrandsVisibilityData *, const FHairStrandsMacroGroupDatas *) ShadowRendering.cpp:1115
FSceneRenderer::RenderShadowProjections(FRHICommandListImmediate &, const FLightSceneProxy *, const FHairStrandsRenderingData *, TArrayView<…>, bool, bool) ShadowRendering.cpp:1742
```

在ShadowProjectionPixelShader.usf中

- LightSpacePixelDepthForOpaque代表LightSpace的场景深度，由ScreenToShadowMatrix计算得到
- ShadowDepthTexture代表ShadowMap的深度

**ShadowInfo怎么添加到VisibleLightInfo.AllProjectedShadows中去的？**
VisibleLightInfo.AllProjectedShadows.Add(ProjectedShadowInfo);
``` cpp
FSceneRenderer::CreateWholeSceneProjectedShadow(FLightSceneInfo *, unsigned int &, unsigned int &) ShadowSetup.cpp:3104
FSceneRenderer::InitDynamicShadows(FRHICommandListImmediate &, FGlobalDynamicIndexBuffer &, FGlobalDynamicVertexBuffer &, FGlobalDynamicReadBuffer &) ShadowSetup.cpp:4959
```

### Movable SpotLight的LightSpaceDepthMap创建到显示的过程
在FSceneRenderer::InitDynamicShadows中会先执行
``` cpp
FSceneRenderer::CreateWholeSceneProjectedShadow
```
该函数会将初始化的ProjectedShadowInfo(此时RT还是空的)添加到VisibleLightInfo.AllProjectedShadows中去。

然后会调用
``` cpp
FSceneRenderer::AllocateShadowDepthTargets
```
在这个函数中会

- 将VisibleLightInfo.AllProjectedShadows中的ProjectedShadowInfo添加到VisibleLightInfo.ShadowsToProject中

- 进一步调用
  ``` cpp
    FSceneRenderer::AllocateSpotShadowDepthTargets
  ```
  在这个函数中，会为ProjectedShadowInfo附上默认的RT，同时将ProjectedShadowInfo添加到SortedShadowsForShadowDepthPass.ShadowMapAtlases.Last().Shadows中
