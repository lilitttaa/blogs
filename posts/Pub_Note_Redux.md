---
title: Redux 简单教程
cover: web_design.png
---
[TOC]

注:文档中涉及到大量的高阶函数，在观看此文档前有必要先熟悉一下JS的连续箭头函数语法。
JS中箭头函数是一种简化的函数的写法，它的语法如下：
```javascript
//普通函数
function add(a, b) {
  return a + b;
}
//箭头函数
const add = (a, b) => a + b;
```
连续箭头函数: 函数的返回值为另一个函数
```javascript
const add = a => b => a + b;
//等价于
function add(a) {
  return function(b) {
    return a + b;
  };
}
```

### Redux基础
Redux是一个状态管理库，它用于管理应用中的状态，使得状态的变化更加可控，更加容易维护。
- 不同于一般情况下的状态管理，在Redux中你无法直接修改状态，而是必须通过派发一个action来修改。
- 而且Redux中的状态是单一的，即整个应用只有顶层的一个状态,而不是多个状态，这样避免了在UI树中需要不断提升状态层级的问题.另外Redux使用了React中useContext可以在任何地方访问状态，避免了状态向下层层传递的问题。
![Alt text](Redux.png)
![Alt text](Redux2.png)

#### Redux哲学
为了直观的理解Redux到底是什么，我首先展示一个Redux应用的Debug工具，它能够展示出Redux到底带来了什么：
![](image-2.png)
左边是用户的每次的操作，右边是操作执行后应用的状态树。
你可以查看**任何一次**操作前后的**所有状态**。这很棒对吧，这就使得整个应用是完全可控，可预测，可追踪的。

而要实现这样一个工具，首先需要保存应用运行过程中的**所有状态备份**，然后需要把**所有的行为**都记录下来,同时应用的状态需要保持为一个**单一的树**。
- 所有状态备份: 为了将所有状态备份,需要用到一种叫**Immutable结构**的技术。
- 所有行为: 要能记录所有行为，Redux中的状态只能通过**派发Action**来修改，这样所有改变状态的行为都是统一的,可控的。同时因为**Action和UI的事件处理函数分离**了，逻辑的复用性也会提升。
- 单一的树: Redux中状态不是分散到各个组件，而是统一存储在**顶层的一个状态树**中，一方面使得状态更容易调试,也避免了状态提升的问题。

然而Immutable会导致额外的问题，**数据同步问题**：Immutable数据总是创建一个新的数据，如果在应用中有重复状态，尤其是类似于Nodes数组和SelectedNodes数组这样的情况,那么当你修改其中一个数组时，另一个数组也需要修改。

因此在Redux中，我们需要使用**范式化数据**来解决这个问题：
真正的数据实体'Entity'只有一份，其他的都是持有实体id的引用。

除此以外，要使得行为(Action)作用于状态(State)是**可预测**的，Redux中真正的更新状态都是通过Reducer函数来实现，而Reducer函数是纯函数，它的输入和输出都是确定的，这样就使得状态的变化是可预测的。

#### Redux流程
**UI->事件处理函数->dispatch(action)->middleware->store(reducer)->UI**
UI通过事件处理函数来派发一个action,action会经过middleware做一些中间处理(记录log,异步函数,请求api等),最终到达store,store会调用reducer来修改状态,状态的变化会触发UI的重新渲染.
![Alt text](image-1.png)

#### Redux核心概念
- Action:action是一个普通的JavaScript对象,它是改变state的唯一途径,它描述了发生了什么,包含两个属性:type和payload,playload传递reducer需要的参数
```javascript
const action = {
  type: 'ADD_TODO',
  payload: 'Buy milk'
};
```
- Reducer:reducer是一个纯函数,它接收旧的state和action,返回新的state.
```javascript
function todosReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.payload];
    default:
      return state;
  }
}
```
- Store:store用于封装state和reducer,它提供了一些API来访问state,派发action,添加监听器.
```javascript
import { createStore } from 'redux';
const store = createStore(reducer);
```
- Dispatch:dispatch用于从外部将action派发到store,触发state的变化.
```javascript
store.dispatch({ type: 'ADD_TODO', payload: 'Buy milk' });
```
- Subscribe:subscribe是一个函数,它用于添加一个监听器,当state发生变化时,会触发监听器.
```javascript
const unsubscribe = store.subscribe(() => console.log(store.getState()));
//取消监听
unsubscribe();
```
- Selector:selector是一个函数,它用于从state中获取数据.随着应用变得越来越大,会遇到应用程序的不同部分需要读取相同的数据,selector 可以避免重复这样的读取逻辑：
```javascript
const todos = state => state.todos;
```
- StoreEnhancer:storeEnhancer用来增强store的功能,接收createStore作为参数,返回一个新的createStore.
例如下面的storeEnhancer用来在dispatch前后打印日志.
```javascript
const storeEnhancer = createStore => (reducer, preloadedState, enhancer) => {
  const store = createStore(reducer, preloadedState, enhancer);
  const originalDispatch = store.dispatch;
  store.dispatch = action => {
    console.log('dispatching', action);
    let result = originalDispatch(action);
    console.log('next state', store.getState());
    return result;
  };
  return store;
};
```
- Middleware:用于增强store的功能,能够在dispatch一个action和reducer之间执行一些额外的操作.它是storeEnhancer的一种应用方式.applyMiddleware的返回值就是一个storeEnhancer.
```javascript
const loggerMiddleware = store => next => action => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
};
```
- ThunkMiddleware:thunkMiddleware是middleware的一种,它用于处理异步操作.
```javascript
const thunkMiddleware = store => next => action => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};
```
这样当你dispatch一个函数时,thunkMiddleware会将dispatch和getState作为参数来执行这个函数
```javascript
const exampleThunkFunction = (dispatch, getState) => {
  const stateBefore = getState()
  console.log(`Counter before: ${stateBefore.counter}`)
  dispatch(increment())
  const stateAfter = getState()
  console.log(`Counter after: ${stateAfter.counter}`)
}
```

另外Redux中还存在一些概念用于更便捷的编写Redux代码:
- ActionCreator:用于创建action.
```javascript
const addTodo = todo => ({
  type: 'ADD_TODO',
  payload: todo
});
```
Dispatch使用ActionCreator
```javascript
store.dispatch(addTodo('Buy milk'));
```
- ThunkActionCreator:用于创建thunkAction.
```javascript
const incrementAsync = amount => dispatch => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount))
  }, 1000)
}
```
这样异步逻辑使用起来跟普通action一样
```javascript
store.dispatch(incrementAsync(10))
```
总的来说,前几个概念:action,dispatch,store,selector,sbuscribe用于在限制下的对于状态的访问,修改,监听.
而后面的storyeEnhancer,middleware,thunkMiddleware用于在限制外提供了一些灵活性.

#### Redux核心简单实现
```javascript
function createStore(reducer) {
  let state;
  let listeners = [];
  const getState = () => state;
  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };
  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    }
  };
  return { getState, dispatch, subscribe };
}
function appReducer(state = {}, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.todo]
      };
    default:
      return state;
  }
}
```
#### Redux基础API
- createStore(reducer, [preloadedState], [enhancer]):创建一个Redux store来存放应用中所有的state,应用中应有且仅有一个store.
```javascript
import { createStore } from 'redux';
const store = createStore(reducer);
```
- store.getState():获取当前的state.
```javascript
const state = store.getState();
```
- store.dispatch(action):派发一个action,触发state的变化.
```javascript
store.dispatch({ type: 'ADD_TODO', todo: 'Buy milk' });
```
- store.subscribe(listener):添加一个监听器,当state发生变化时,会触发监听器.
```javascript
const unsubscribe = store.subscribe(() => console.log(store.getState()));
//取消监听
unsubscribe();
```
- combineReducers(reducers):将多个reducer合并成一个reducer.
```javascript
import { combineReducers } from 'redux';
const rootReducer = combineReducers({
  todos: todosReducer,
  visibilityFilter: visibilityFilterReducer
});
//等价于
function rootReducer(state = {}, action) {
  return {
    todos: todosReducer(state.todos, action),
    visibilityFilter: visibilityFilterReducer(state.visibilityFilter, action)
  };
}
```
- applyMiddleware(...middlewares):使用中间件来增强store的功能,返回一个storeEnhancer.
```javascript
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';
const loggerMiddleware = createLogger();
const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
);
```
### React-Redux
React-Redux库是一个React的UI绑定库,它将Redux和React连接起来
#### React-ReduxAPI
- Provider:Provider是一个React组件,它接收一个store作为props,并将其存储在context中,使得子组件可以直接访问store.
```javascript
import { Provider } from 'react-redux';
import store from './store';
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```
- useSelector(selector, equalityFn):useSelector用来从store中获取部分数据,它接收一个selector函数和一个equalityFn函数,返回selector函数的返回值.
重要的是要注意每当 useSelector 返回的值为新引用时，组件就会重新渲染。所以组件应始终尝试从 store 中选择它们需要的尽可能少的数据，这将有助于确保它仅在实际需要时才渲染。
```javascript
import { useSelector } from 'react-redux';
const todos = useSelector(state => state.todos);
```
- useDispatch():useDispatch是一个React Hook,它返回store的dispatch方法.
```javascript
import { useDispatch } from 'react-redux';
const dispatch = useDispatch();
dispatch({ type: 'ADD_TODO', todo: 'Buy milk' });
```
### Redux-Toolkit
Redux-Toolkit是一个官方推荐的Redux工具包,它提供了一些工具函数来简化Redux的使用.事实上官方更推荐使用Redux-Toolkit来编写Redux代码而不是使用基础Redux.
#### Redux-ToolkitAPI
创建Store:
##### configureStore(options)
configureStore接收一个options对象,返回一个Redux store.
```javascript
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
const store = configureStore({
  reducer: rootReducer
});
```
在复杂应用中通常会构建多个reducer分别负责不同的部分,configureStore可以接收一个reducer,也可以接收一个reducer对象,它会自动调用combineReducers来合并reducer.
```javascript
const store = configureStore({
  reducer: {
    todos: todosReducer,
    visibilityFilter: visibilityFilterReducer
  }
});
```
创建Reducer和Action:
##### createSlice(options)
createSlice用于创建一个reducer和action,它
接收一个options对象,返回一个包含reducer和action的对象.
```javascript
import { createSlice } from '@reduxjs/toolkit';
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push(action.payload);
    }
  }
});
const { addTodo } = todosSlice.actions; 
const todosReducer = todosSlice.reducer;
```
createSlice也支持定义ActionCreator
```typescript
const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postsAdded: {
            reducer(state, action) {
                state.push(action.payload);
            },
            prepare(title, content) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content,
                    }
                }
            }
        },
    },
});
```
createSlice中可以添加extraReducers,它可以用来处理其他的action,例如处理createAsyncThunk中生成的action.
```javascript
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
  },
  extraReducers: (builder) => {
        builder.addCase(fetchPosts.pending, (state, action) => {
            state.status = 'loading';
        });
        builder.addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = 'idle';
            state.items = state.items.concat(action.payload);
        });
        builder.addCase(fetchPosts.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message? action.error.message : 'Error';
        });
    }
});
```

##### createReducer(initialState, builderCallback)
createReducer用于创建一个reducer,它接收一个initialState和一个builderCallback,返回一个reducer.
```javascript
import { createReducer } from '@reduxjs/toolkit';
const todosReducer = createReducer([], {
  addTodo: (state, action) => {
    state.push(action.payload);
  }
});
```
在createReducer中使用了Immer库,它允许你用直接修改state的方式去编写Immutable代码,而createSlice中使用了createReducer,所以createSlice也支持Immer.

创建异步Action:
```
export const incrementAsync = amount => dispatch => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount))
  }, 1000)
}
```
要使用incrementAsync,需要在store中支持thunkMiddleware,这样就能像使用普通action一样使用异步action了.
store.dispatch(incrementAsync(10))
这里再展示一下thunkMiddleware的实现,以便能更清晰的理解它们是如何一起工作的.
```javascript
const thunkMiddleware = store => next => action => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};
```
##### createAsyncThunk(typePrefix, payloadCreator, options)
createAsyncThunk用于创建一个异步action,它接收一个typePrefix,一个payloadCreator和一个options,返回一个异步action.

如何发起一个异步请求?
- 在请求之前 dispatch 请求“开始”的 action，以指示请求正在进行中。这可用于跟踪加载状态以允许跳过重复请求或在 UI 中显示加载中提示。
- 发出异步请求
- 根据请求结果，异步逻辑 dispatch 包含结果数据的“成功” action 或包含错误详细信息的 “失败” action。在这两种情况下，reducer 逻辑都会清除加载状态，并且要么展示成功案例的结果数据，要么保存错误值并在需要的地方展示。
  
通常我们会写成下面的形式:
```javascript
const getRepoDetailsStarted = () => ({
  type: 'repoDetails/fetchStarted'
})
const getRepoDetailsSuccess = repoDetails => ({
  type: 'repoDetails/fetchSucceeded',
  payload: repoDetails
})
const getRepoDetailsFailed = error => ({
  type: 'repoDetails/fetchFailed',
  error
})
const fetchIssuesCount = (org, repo) => async dispatch => {
  dispatch(getRepoDetailsStarted())
  try {
    const repoDetails = await getRepoDetails(org, repo)
    dispatch(getRepoDetailsSuccess(repoDetails))
  } catch (err) {
    dispatch(getRepoDetailsFailed(err.toString()))
  }
}
```
createAsyncThunk可以帮助我们简化这个过程,它接收一个typePrefix,一个payloadCreator和一个options,返回一个异步action.
```javascript
const fetchIssuesCount = createAsyncThunk(
  'repoDetails/fetch', // 用来生成action的type
  async (repo, thunkAPI) => {
    const repoDetails = await getRepoDetails(repo)
    return repoDetails
  }
)
```
repo是action的payload,thunkAPI是一个对象,包含dispatch,getState等方法.

Thunk 可以返回 promise。 具体对于createAsyncThunk，你可以await dispatch(someThunk()).unwrap()来处理组件级别的请求成功或失败。
```javascript
try {
  setAddRequestStatus('pending')
  await dispatch(addNewPost({ title, content, user: userId })).unwrap()
  setTitle('')
  setContent('')
  setUserId('')
} catch (err) {
  console.error('Failed to save the post: ', err)
} finally {
  setAddRequestStatus('idle')
}
```
##### createSelector(selectors, selectorCreator)
createSelector用于创建记忆化的selector,它接收一个selectors数组和一个selectorCreator,返回一个selector.常用于性能优化.
``` js
  const postsForUser = useSelector(state => {
    const allPosts = selectAllPosts(state)
    return allPosts.filter(post => post.user === userId)
  })
```
上面这段函数调用了filter,这使得每次返回的一定是一个新的数组,哪怕数组中的元素没有发生变化,也会导致重新渲染.
事实上只要posts和users如果没有发生变化,那么postsForUser就不会发生变化.
``` js
export const selectAllPosts = state => state.posts.posts

export const selectPostById = (state, postId) =>
  state.posts.posts.find(post => post.id === postId)

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter(post => post.user === userId)
)
```
只有在第一个数组中的元素发生变化时才会重新计算结果


##### createEntityAdapter(options)
createEntityAdapter用来范式化数据,它接收一个options对象,返回一个entityAdapter对象.

1. 范式化数据
在Redux中所有状态都是immutable的,如果存在重复状态,那么当你修改其中一个状态时,另一个状态也需要修改,这就是数据同步问题.
范式化数据的目的就是为了解决这个问题,它将真正的数据实体'Entity'只有一份,其他的都是持有实体id的引用.
```javascript
const initialState = {
  posts: {
    ids: ['1', '2'],
    entities: {
      '1': { id: '1', title: 'First Post', content: 'Hello!' },
      '2': { id: '2', title: 'Second Post', content: 'More text' }
    }
  }
}
```
createEntityAdapter用来辅助创建范式化数据,它接收一个options对象,返回一个entityAdapter对象.

createEntityAdapter 接受一个选项对象，该对象可能包含一个 sortComparer 函数，该函数将用于通过比较两个项目来保持项目 id 数组的排序(工作方式与 array.sort() 相同)。
```javascript
import { createEntityAdapter } from '@reduxjs/toolkit'
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})
```
adapter 对象有一个 getInitialState 函数,可以添加额外的数据
```typescript
const postsAdapter = createEntityAdapter({
    sortComparer: (a: IPostItem, b: IPostItem) => b.date.localeCompare(a.date)
})

const testState = postsAdapter.getInitialState({
    status: 'idle',
    error: null
})
console.log("testState", testState)
```
![Alt text](image-3.png)

adapter对象提供了一些预定义的reducer函数
![Alt text](image-4.png)

adapter 对象也有一个 getSelectors 函数。你可以传入一个 selector，它从 Redux 根 state 返回这个特定的 state slice，它会生成类似于 selectAll 和 selectById 的选择器。
```js
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)
```
![Alt text](image-5.png)

### Redux实现Redo/Undo
通过直接包装reducer函数实现
```javascript
import { Action, AnyAction, Reducer } from "@reduxjs/toolkit";

export function undoable<S = any, A extends Action = AnyAction>(reducer: Reducer<S, A>) {
    let initialState = reducer(undefined, { type: '' } as A);
    let historyQueue: any[] = [initialState];
    let historyIndex = 0;
    // 返回处理撤消和重做的 reducer
    return function (state = initialState, action: AnyAction): S {
        switch (action.type) {
            case 'UNDO':
                console.log(historyQueue)
                return historyIndex === 0 ? historyQueue[0] : historyQueue[--historyIndex];
            case 'REDO':
                console.log(historyQueue)
                return historyIndex === historyQueue.length - 1 ? historyQueue[historyQueue.length - 1] : historyQueue[++historyIndex];
            default:
                // 代理传给 reducer 的 action
                const newState = reducer(state, action as A)
                // 抛弃所有Index之后的历史记录
                historyQueue = historyQueue.slice(0, historyIndex + 1);
                if (action?.payload?.recordInHistory === true) { //根据action中的标志位判断是否记录历史
                    historyQueue.push(newState);
                    historyIndex = historyQueue.length - 1;
                    console.log(historyQueue)
                    return newState;
                }
                else {
                    console.log(historyQueue)
                    return newState;
                }
        }
    }
};

export function undo() {
    return { type: 'UNDO' };
}

export function redo() {
    return { type: 'REDO' };
}

```
### RTK Query
……
### Redux Typscript
导出dispatch 类型
导出state 类型
```typescript
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
```
导出useDispatch,useSelector
```typescript
export const useAppDispatch:()=>AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```
createSlice中使用prepare需要指定Action类型
```typescript
const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postsAdded: {
            reducer(state, action: PayloadAction<{ id: string, title: string, content: string }>) {
                state.push(action.payload);
            },
            prepare(title:string, content:string) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content,
                    },
                    type: 'posts/postsAdded',
                }
            }
        },
    },
});
```


### Reference
- https://www.youtube.com/watch?v=9boMnm5X9ak&list=PLC3y8-rFHvwheJHvseC3I0HuYI2f46oAK&index=1
- https://cn.redux.js.org/
- https://blog.isquaredsoftware.com/2018/03/presentation-reactathon-redux-fundamentals/