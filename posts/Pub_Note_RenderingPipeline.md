---
title: Unreal Engine Rendering Pipeline
---

![alt text](image.png)
![alt text](image-1.png)

```cpp
/** Flags to annotate a pass with when calling AddPass. */
enum class ERDGPassFlags : uint8
{
    /** Pass doesn't have any inputs or outputs tracked by the graph. This may only be used by the parameterless AddPass function. */
    None = 0,

    /** Pass uses rasterization on the graphics pipe. */
    Raster = 1 << 0,

    /** Pass uses compute on the graphics pipe. */
    Compute = 1 << 1,

    /** Pass uses compute on the async compute pipe. */
    AsyncCompute = 1 << 2,

    /** Pass uses copy commands on the graphics pipe. */
    Copy = 1 << 3,

    /** Pass (and its producers) will never be culled. Necessary if outputs cannot be tracked by the graph. */
    NeverCull = 1 << 4,

    /** Render pass begin / end is skipped and left to the user. Only valid when combined with 'Raster'. Disables render pass merging for the pass. */
    SkipRenderPass = 1 << 5,

    /** Pass accesses raw RHI resources which may be registered with the graph, but all resources are kept in their current state. This flag prevents
     *  the graph from scheduling split barriers across the pass. Any splitting is deferred until after the pass executes. The resource may not change
     *  state within the pass execution. Affects barrier performance. May not be combined with Async Compute.
     */
    UntrackedAccess = 1 << 6,

    /** Pass uses copy commands but writes to a staging resource. */
    Readback = Copy | NeverCull,

    /** Mask of flags denoting the kinds of RHI commands submitted to a pass. */
    CommandMask = Raster | Compute | AsyncCompute | Copy,

    /** Mask of flags which can used by a pass flag scope. */
    ScopeMask = NeverCull | UntrackedAccess
};
```
