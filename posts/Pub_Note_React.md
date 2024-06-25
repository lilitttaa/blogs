---
title: React 学习笔记
cover: web_design.png
---

[TOC]

### 基础概念:

#### 组件

React 中组件是构建 UI 的基本单位,组件接收参数 props,返回 React 元素

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>
}
function MyButton() {
  return <button>Click Me</button>
}
```

- React 应用本身构成了一个**组件树**,组件与组件之间通过嵌套关系组成.
- 组件树的**根节点**是 ReactDOM.render()方法渲染的组件
- 组件树的**叶子节点**是原生 DOM 节点
- 组件树的**中间节点**是 React 组件

```js
export default function App() {
  return (
    <div className='App'>
      <Welcome name='Sara' />
      <MyButton />
    </div>
  )
}
```

```js
ReactDOM.render(<App />, document.getElementById('root'))
```

React 组件的名称必须以**大写字母**开头,React 会将以小写字母开头的组件视为原生 DOM 标签

#### props

props 是组件的参数,父组件通过 props 将数据传递给子组件,可以分别传递 props,也可以传递 props 对象

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>
}
```

```js
function App() {
  return (
    <div className='App'>
      <Welcome props={{ name: 'Sara' }} /> //传递props对象
      <Welcome name='Cahal' /> //分别传递props
    </div>
  )
}
```

props 中可以传递 DOM 和 React 组件

```js
function Welcome({ children }) {
  return <div>{children}</div>
}
function App() {
  return (
    <div className='App'>
      <Welcome>
        <h1>Hello, Sara</h1> //传递DOM
      </Welcome>
    </div>
  )
}
```

#### state

React 如果你直接声明一个变量,这个变量会在下次渲染时被重置,无法正确的保留状态

``` js
export default function App() {
  let count = 0; //每次渲染都会重置为0
  function handleClick() {
    count++;
  }
  return (
    <div className="App">
      <p>You clicked {count} times</p>
      <button onClick={handleClick}>
        Click me
      </button>
    </div>
  );
}
```

需要通过 Hook 函数 useState 来管理组件的状态,函数返回'state'和'setState'

```js
export default function App() {
  const [count, setCount] = useState(0)
  return (
    <div className='App'>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
```

#### 生命周期

- 当 props 或 state 发生变化时,组件会重新渲染(render,不同于游戏中的图形渲染,这里指的是 Dom 树的更新,实际的渲染是由浏览器来完成),组件函数中的代码会在每次 render 时执行
- 在渲染完成后会执行 useEffect 中的函数,useEffect 中可以实现生命周期的功能,**挂载阶段,更新阶段,卸载阶段**

```js
export defaut function TodoAPP(){
  //每次渲染都会执行
  useEffect(()->{
      //挂载阶段
      return ()=>{
          //卸载阶段
      }
  },[])//第二个参数为空数组,只会在挂载阶段执行
  useEffect(()->{
      //更新阶段
  })//第二个参数不传,每次渲染都会执行
  useEffect(()->{
      //value发生变化时执行
  },[value1,value2,...])//第二个参数为数组,数组中有值发生变化(浅层判断相等)时执行
}

```

#### 事件处理

React 中的事件处理和原生事件处理类似,通过 onXxx 属性来绑定事件处理函数

```js
function App() {
  function handleClick(e) {
    e.preventDefault()
    console.log('The link was clicked.')
  }
  return (
    <a href='#' onClick={handleClick}>
      Click me
    </a>
  )
}
```

React 中事件是从下往上传递,可以通过 e.stopPropagation()来阻止事件冒泡

```js
function Button({ onClick, children }) {
  return (
    <button
      onClick={e => {
        e.stopPropagation()
        onClick()
      }}
    >
      {children}
    </button>
  )
}
```

某些浏览器事件具有默认行为,例如表单的提交事件,可以通过 e.preventDefault()来阻止默认行为

```js
function Form() {
  function handleSubmit(e) {
    e.preventDefault()
    console.log('You clicked submit.')
  }
  return (
    <form onSubmit={handleSubmit}>
      <button type='submit'>Submit</button>
    </form>
  )
}
```

#### 条件渲染

React 中可以通过 if 语句来判断是否渲染组件

```js
export default function Greeting(props) {
  if (props.isLoggedIn) {
    return <UserGreeting />
  }
  return <GuestGreeting />
}
```

使用三元运算符来判断是否渲染组件

```js
export default function Greeting(props) {
  return <div>{props.isLoggedIn ? <UserGreeting /> : <GuestGreeting />}</div>
}
```

使用逻辑与运算符来判断是否渲染组件

```js
export default function Greeting(props) {
  return <div>{props.isLoggedIn && <UserGreeting />}</div>
}
```

#### 列表和 Key

React 中需要给列表元素添加 key 属性,用来标识列表元素,当列表元素发生变化时,React 会根据 key 来判断哪些元素发生了变化,从而减少 DOM 操作
通过 map()方法来遍历数组,并返回一个新的数组

```js
export default function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React' },
    { id: 2, text: 'Learn Vue' },
    { id: 3, text: 'Learn Angular' }
  ])
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  )
}
```

使用 filter()方法来过滤数组

```js
export default function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React' },
    { id: 2, text: 'Learn Vue' },
    { id: 3, text: 'Learn Angular' }
  ])
  return (
    <ul>
      {todos
        .filter(todo => todo.id > 1)
        .map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
    </ul>
  )
}
```

一些常用于数组方法

- map()方法,遍历数组,返回一个新的数组
- filter()方法,过滤数组,返回一个新的数组
- every()方法,判断数组中的每个元素是否满足条件,返回一个布尔值
- some()方法,判断数组中是否有元素满足条件,返回一个布尔值
- find()方法,查找数组中满足条件的元素,返回第一个满足条件的元素

``` js
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled); //[2, 4, 6, 8, 10]
const filtered = numbers.filter((number) => number > 3);
console.log(filtered); //[4, 5]
const every = numbers.every((number) => number > 3);
console.log(every); //false
const some = numbers.some((number) => number > 3);
console.log(some); //true
const find = numbers.find((number) => number > 3);
console.log(find); //4
```

#### 表单

React 中的表单和原生表单类似,通过 onChange 事件来监听表单的变化,通过 value 属性来设置表单的值

```js
export default function NameForm() {
  const [value, setValue] = useState('')
  function handleChange(event) {
    setValue(event.target.value)
  }
  function handleSubmit(event) {
    alert('A name was submitted: ' + value)
    event.preventDefault()
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type='text' value={value} onChange={handleChange} />
      </label>
      <input type='submit' value='Submit' />
    </form>
  )
}
```

#### 状态提升

当一个状态需要被多个组件共享时,可以将状态提升到共同的父组件中

```js
export default function TodoApp() {
  const [todos, setTodos] = useState([])
  function addTodo() {
    setTodos([...todos, { id: 1, text: 'Learn React' }])
  }
  return (
    <div>
      <TodoInfo todos={todos} />
      <TodoList todos={todos} setTodos={setTodos} />
    </div>
  )
}
```

#### 导入导出

React 中导入导出组件和原生导入导出类似,可以使用 export default 导出组件,也可以使用 export 导出组件
export default 导出

``` js
export default function TodoList(){
    return (
        <div>
        </div>
    )
}
```

export default 导入

``` js
import TodoList from './TodoList'
```

export 导出

``` js
export function TodoList(){
    return (
        <div>
        </div>
    )
}
```

export 导入

``` js
import {TodoList} from './TodoList'
```

### React 哲学

#### 纯函数

React 组件中的函数应当是纯函数

- 只负责自己的任务。它不会更改在该函数调用前就已存在的对象或变量。
- 输入相同的参数，它就会返回相同的结果。

为什么要使用纯函数?
非纯函数会导致组件的不可预测性,当组件的状态发生变化时,组件会重新渲染,如果组件中的函数是非纯函数,那么组件的渲染结果就是不可预测的

```js
let guest = 0
function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1
  return <h2>Tea cup for guest #{guest}</h2>
}
export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  )
}
```

不过 React 中只有渲染需要遵循这个原则,而其他的变动,例如事件处理函数,网络请求,定时器等都不需要遵循这个原则.
你通常可以使用 useEffect 来处理这些变动,React 会在渲染之后执行 useEffect 中的函数,这样就不会影响到渲染的结果

#### React 应用构建流程

首先我们拥有一个 APP 的设计原型(从设计者那拿到),以及数据 API(从后端那拿到) 1.第一步,将设计原型拆解为组件层级结构 2.第二步,用 React 构建一个静态版本
可以在顶层用 Html 编写一个静态版本(没有交互,也没有状态)
然后根据组件层级结构提取其中的代码,将其转换为 React 组件 3.第三步,确定 state 和 state 的位置

- React 中 state 需要遵循最小化原则,即这个 state 不能被其他 state 或 props 计算出来,它必须是这个组件的最小 state
- 另外 React 是单向数据流,数据只能从父组件流向子组件,所以当有多个组件需要共享同一个 state 时,这个 state 应该被提升到这些组件的公共父(祖先)组件中.

  4.第四步,添加反向控制流
  当需要对父组件 state 进行修改时,需要从子组件调用从父组件传递过来修改函数,从而修改父组件的 state.
  从下往上的调用构成了一个反向控制流

### JSX

#### 基础语法

JSX 是一种 JavaScript 的语法扩展,让我们用类似于编写 Html 的方式编写 JS.
可以在 JSX 中使用 JavaScript 表达式,JSX 会被 babel 编译器转换为 React.createElement()方法

```js
export default function TodoApp() {
  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        <li>Learn React</li>
        <li>Learn Vue</li>
        <li>Learn Angular</li>
      </ul>
    </div>
  )
}
```

等价于

```js
export default function TodoApp() {
  return React.createElement(
    'div',
    null,
    React.createElement('h1', null, 'Todo List'),
    React.createElement(
      'ul',
      null,
      React.createElement('li', null, 'Learn React'),
      React.createElement('li', null, 'Learn Vue'),
      React.createElement('li', null, 'Learn Angular')
    )
  )
}
```

JSX 中可以用{}来嵌入 JavaScript 表达式,只有在**标签内部**和**属性值**中可以使用 JavaScript 表达式

```js
<div style={{ color: 'red' }}>{1 + 1}</div>
```

```js
export default function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React' },
    { id: 2, text: 'Learn Vue' },
    { id: 3, text: 'Learn Angular' }
  ])
  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  )
}
```

另外组件返回的元素必须是单个根元素,可以使用<>...</>或 React.Fragment 来包裹多个元素

```js
export default function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React' },
    { id: 2, text: 'Learn Vue' },
    { id: 3, text: 'Learn Angular' }
  ])
  return (
    <>
      <h1>Todo List</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  )
}
```

返回时如果有多行需要用()包裹

``` js
return (
    <div>
    </div>
)
return <div></div>
```

驼峰式命名,因为 JS 中变量名不能包含-,所以在 JSX 中所有属性使用驼峰式命名

``` js
<img
    src={user.avatarUrl}
    alt={user.name}
    className="avatar"
/>
```

### React 原理

#### React 中渲染是如何发生的

注:这里所说的渲染跟我们通常理解的游戏中的渲染不同,React 的渲染是指将 React 元素转换为 DOM 元素,并将 DOM 元素添加到 DOM 树中.然后浏览器会将 DOM 树真正绘制为屏幕上的像素点.

- React 中渲染会在第一次手动触发(root.render()),之后会在 state 或 props 发生变化时自动触发(在 setState 函数里会调用 updateDOM)
- React 在渲染某个组件时,会依次渲染返回的组件
- 初次渲染,React 会将所有创建的 DOM,后续渲染,React 会根据属性变化选择性的更新 DOM

#### 什么是声明式编程

- 与之对应的是**命令式编程**,需要通过一个个命令来告诉计算机如何执行任务,而声明式编程则是告诉计算机需要完成什么任务,而不是如何完成任务.
- 命令式编程需要判断各种情况下应该如何响应命令.而声明式编程则是你给定不同的选项就会给出对应的结果.
- React 是声明式编程,你只需要告诉 React 你想要的 UI 是什么样的,React 会根据你的描述来渲染 UI,而不需要你去自己操作 DOM,选择删除这个元素,添加那个元素.
- React 会自己根据两次 state 的差异计算需要更新的 DOM,而不需要你去手动计算.

#### 虚拟 DOM

#### Diff 算法

### Hooks

Hook 是 React 中仅在渲染时运行的函数,只能在组件或自定义 Hook 顶层调用,不能在循环,条件或嵌套函数中调用.

#### 用 useState 管理状态

- useState 实现原理:
  React 会在组件里保持一个数组和索引,数组中保存了所有的 state,索引保存了当前 state 的位置
  当调用 useState 时,React 会将 state 保存到数组中,并返回当前 state 和修改 state 的函数

```js
let componentHooks = [];
let currentHookIndex = 0;
function useState(initialState){
    let pair = componentHooks[currentHookIndex];
    if(pair){
        currentHookIndex++;
        return pair;
    }
    pair = [initialState,setState];
    function setState(newState){
        pair[0] = newState;
        updateDOM(); //每次修改state后都会重新渲染
    }
    componentHooks[currentHookIndex++] = pair;
    return pair;
}

export default function App(){
    const [index,setIndex] = useState(0);
    const [show,setShow] = useState(false);
    ...
}
```

- useState 使用注意事项:
  事实上当使用 setState 修改 state 时,React 不会立即修改 state,而是将修改的 state 保存到一个队列中,等到事件处理函数结束后再处理更新队列,这样可以减少不必要的渲染

```js
export default function Counter() {
  const [number, setNumber] = useState(0)

  return (
    <>
      <h1>{number}</h1>
      <button
        onClick={() => {
          setNumber(number + 1)
          setNumber(number + 1)
          setNumber(number + 1)
        }}
      >
        +3
      </button>
    </>
  )
}
```

上面的代码会将 number 加 3 次,但是最终只会加 1 次.
因为每次调用 setNumber(number + 1)时使用的都是之前保存的 state(React 中保存的 state 快照),进行了 3 次 setNumber(0+1)
要想解决这个问题,可以使用函数式更新

```js
export default function Counter() {
  const [number, setNumber] = useState(0)

  return (
    <>
      <h1>{number}</h1>
      <button
        onClick={() => {
          setNumber(number => number + 1)
          setNumber(number => number + 1)
          setNumber(number => number + 1)
        }}
      >
        +3
      </button>
    </>
  )
}
```

- Immutable Data(不可变数据)
  React 中的 state 应当是 Immutable 的,即 state 不能被直接修改,而是应当通过 setState 来修改.这样 React 才能正确的判断 state 是否发生了变化,从而减少不必要的渲染,也避免因为修改 React 中保存的 state 快照而导致的问题.

```js
setPerson({
  firstName: e.target.value, // 从 input 中获取新的 first name
  lastName: person.lastName,
  email: person.email
})
```

使用对象展开语法可以简化代码

```js
setPerson({
  ...person,
  firstName: e.target.value
})
```

有时候嵌套的对象会让代码变得复杂,可以使用 immer 库来简化代码

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg'
  }
})
setPerson({
  ...person, // 复制其它字段的数据
  artwork: {
    // 替换 artwork 字段
    ...person.artwork, // 复制之前 person.artwork 中的数据
    city: 'New Delhi' // 但是将 city 的值替换为 New Delhi！
  }
})
```

```js
import { useImmer } from 'use-immer'
const [person, setPerson] = useImmer({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg'
  }
})
setPerson(draft => {
  draft.artwork.city = 'New Delhi'
})
```

#### 使用 useReducer 管理状态更新

##### 什么叫 reducer?

reducer 被认为是一个函数,它接受当前状态返回新的状态.

##### 使用 reducer 更新状态的流程如下:

- 通过 dispatch 函数传递 action(action 中包含更新所必要的数据)到 reducer 函数
- reducer 函数根据不同的 action 对状态进行更新(Immutable),返回新的状态

##### useState 和 useReducer 的不同:

```js
const [tasks, setTasks] = useState(initialTasks)
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false
    }
  ])
}
```

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'add':
      return [
        ...tasks,
        {
          id: nextId++,
          text: action.text,
          done: false
        }
      ]
    default:
      return tasks
  }
}
function handleAddTask(text) {
  dispatch({
    type: 'added',
    id: nextId++,
    text: text
  })
}
```

##### 一个完整的例子:

```js
import { useReducer } from 'react'
export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks)

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text
    })
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    })
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    })
  }

  return (
    <>
      <h1>布拉格的行程安排</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  )
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false
        }
      ]
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task
        } else {
          return t
        }
      })
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id)
    }
    default: {
      throw Error('未知 action: ' + action.type)
    }
  }
}

let nextId = 3
const initialTasks = [
  { id: 0, text: '参观卡夫卡博物馆', done: true },
  { id: 1, text: '看木偶戏', done: false },
  { id: 2, text: '打卡列侬墙', done: false }
]
```

useReducer 传递一个 reducer 和初始状态,返回当前状态和 dispatch 函数

##### useReducer 的好处

useReducer 将**状态更新函数**和**事件处理函数**给分开,使得在组件间传递的是状态更新函数,将不同的组件的相同状态更新合并起来,避免了因为大量的事件处理函数导致状态更新难以跟踪的问题.

#### 使用 useContext 共享状态

##### useContext 的使用

```js

```

##### 什么时候使用 useContext

#### useRef

##### 避免重新渲染

##### 控制 DOM

#### 使用 useEffect

### 状态管理

#### 状态管理的一些 Tips

React 中声明状态遵循一些原则可以让你的应该更加容易维护

- 合并关联的 state
  当不同的 state 总是同时发生变化时,可以将这些 state 合并为一个 state,避免忘记对其中一个进行更新

```js
const [x, setX] = useState(0)
const [y, setY] = useState(0)
```

- 最小化 state
  当某个 state 可以由其他 state 或 props 计算出来时,这个 state 就不应该被声明.可以避免不正确的更新导致的错误.

```js
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const fullName = firstName + ' ' + lastName
```

- 避免矛盾的 state
  有时候会遇到很多需要判断的状态,你会不断的引入 bool 值,随着状态的增多,很容易导致矛盾的状态,这时候就应该考虑是否可以将这些状态合并为一个枚举状态(或者字符串)
- 避免重复的 state
  React 对象是 Immutable 的,这就导致如果你同时保存了两个相同的对象,很容易因为没有同时更新,导致这两个对象变得不同.最好是只保存一个对象,另外一个对象可以通过标识 id 来获取.
  当 items 发生更新时,selectedItem 并没有更新,这样就会导致 selectedItem 不是 items 中的元素

```js
const [items, setItems] = useState(initialItems)
const [selectedItem, setSelectedItem] = useState(items[0])
```

- 避免深层嵌套的 state
  在 Immutable 结构中,深层嵌套的 state 更新起来总是十分困难.
  所以在设计 state 时,应当尽量避免深层嵌套的 state,将其扁平化.例如,可以把深层嵌套的树状(或图)结构,转为扁平的数组,然后通过 id 来指向子元素.

``` js
{
    id:1,
    text:'Learn React',
    children:[
        {
            id:2,
            text:'Learn Vue',
            children:[
                {
                    id:3,
                    text:'Learn Angular',
                    children:[]
                }
            ]
        }
    ]
}
```

``` js
[
    {
        id:1,
        text:'Learn React',
        children:[2]
    },
    {
        id:2,
        text:'Learn Vue',
        children:[3]
    },
    {
        id:3,
        text:'Learn Angular',
        children:[]
    }
]
```

工具:
Lint,Prettier,Chrome 开发工具

#### Prettier

怎么在 vscode 里边能够格式化 react typescript 代码?
在 VSCode 中，要格式化 React TypeScript 代码，你可以按照以下步骤进行操作：

1. 首先，确保你已经在 VSCode 中安装了"Prettier - Code formatter"插件。你可以在扩展市场中搜索并安装它。

2. 确保你的项目中有正确的`.prettierrc`或`.prettierrc.json`文件，其中包含了你希望应用的代码格式化规则。你可以根据自己的项目需求进行配置，或者使用默认的规则。

3. 在 VSCode 中打开 React TypeScript 文件。

4. 要格式化整个文件，可以使用快捷键`Shift + Alt + F`（在 Windows 和 Linux 上）或者`Shift + Option + F`（在 Mac 上）。你也可以通过右键点击代码编辑器或者命令面板（`Ctrl + Shift + P`或`Cmd + Shift + P`）中的"Format Document"选项来进行格式化。

5. 如果你只想格式化选定的代码片段，可以先选择代码片段，然后使用快捷键`Shift + Alt + F`（在 Windows 和 Linux 上）或者`Shift + Option + F`（在 Mac 上）进行格式化。

在进行格式化时，Prettier 插件将自动根据你在`.prettierrc`文件中定义的规则来调整代码格式。
