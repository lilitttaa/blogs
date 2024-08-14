---
title: C++ Primer 12.动态内存
---

## 内存概述

生命周期：

- 全局对象：程序启动时分配，程序结束时销毁
- 局部自动对象：进入块时分配，离开块时销毁
- 局部 static 对象：第一次使用时分配，程序结束时销毁
- 动态分配对象：显示控制分配和释放

内存空间：

- 静态内存：局部 static、类 static、任何定义在函数之外的对象
- 栈内存：函数内的非 static 对象
- 自由空间/堆内存：动态分配的对象

## 动态内存和智能指针

- 使用 new 分配内存
- 使用 delete 释放内存
- 动态分配内存容易出错：
  - 忘记释放内存
  - 释放后继续使用

为了避免这些问题，C++11 引入了智能指针(定义在头文件 memory 中)：

- shared_ptr：多个指针指向同一对象
- unique_ptr：独占对象
- weak_ptr：shared_ptr 的伴随类，是一种弱引用，指向 shared_ptr 所管理的对象。

### shared_ptr

- shared_ptr 是一种智能指针，多个 shared_ptr 可以指向同一个对象，shared_ptr 会记录有多少个 shared_ptr 共享对象。
- 当动态对象不再被使用时，shared ptr 类会自动释放动态对象，这一特性使得动态内存的使用变得非常容易。

初始化：

```cpp
shared_ptr<string> p1; // 默认初始化，保存一个空指针
shared_ptr<list<int>> p2;
shared_ptr<int> p3(new int(42)); // p3 指向一个值为 42 的 int
shared_ptr<int> p4 = make_shared<int>(42); // 使用 make_shared 初始化
shared_ptr<string> p5 = make_shared<string>(3, '9'); // 类似于emplace，make_shared 用参数来构造对象
shared_ptr<int> p6(p3); // p6 和 p3 指向相同的对象
```

拷贝和赋值：

```cpp
auto p = make_shared<int>(42);
auto q(p); // p 和 q 指向相同的对象
auto r = make_shared<int>(42);
r = q; // 递增 q 的引用计数，递减 r 的引用计数
```

其他操作：

```cpp
shared_ptr<int> p1;
if (p1){ // 检查p1是否为空
	*p1 = 42; // 解引用，如果p1为空，会出错
}
class A{
public:
	int a;
};
shared_ptr<A> p3 = make_shared<A>();
p3->a = 1; // 使用箭头运算符访问对象成员
A *p = p3.get(); // get 返回指向的指针，要注意 p3 释放后，p 会变成野指针
shared_ptr<A> p4 = make_shared<A>();
swap(p3, p4); // 交换两个智能指针
p3.swap(p4); // 交换两个智能指针
p3.unique(); // 检查是否是唯一的指针，如果是，返回 true
p3.use_count(); // 返回与 p3 共享对象的智能指针数量
```

给出一个简单的实现：

```cpp
#include <iostream>
#include <atomic>
#include <algorithm>

template<typename T>
class simple_shared_ptr {
private:
    T* ptr; // 指向管理对象的指针
    std::atomic<int>* count; // 引用计数器

public:
    simple_shared_ptr(T* p = nullptr) : ptr(p), count(new std::atomic<int>(1)) {
        if (p == nullptr) {
            *count = 0; // 对于nullptr，计数器初始化为0
        }
    }

    simple_shared_ptr(const simple_shared_ptr<T>& other) : ptr(other.ptr), count(other.count) {
        if (ptr) {
            ++(*count); // 引用计数增加
        }
    }

    simple_shared_ptr<T>& operator=(const simple_shared_ptr<T>& other) {
        if (this != &other) {
            // 减少当前对象的引用计数，并在引用计数为0时删除对象
            if (ptr && --(*count) == 0) {
                delete ptr;
                delete count;
            }
            ptr = other.ptr;
            count = other.count;
            if (ptr) {
                ++(*count); // 引用计数增加
            }
        }
        return *this;
    }

    ~simple_shared_ptr() {
        if (ptr && --(*count) == 0) {
            delete ptr;
            delete count;
        }
    }

    T& operator*() const {
        return *ptr;
    }

    T* operator->() const {
        return ptr;
    }

    operator bool() const {
        return ptr != nullptr;
    }

    int use_count() const {
        return count ? count->load() : 0;
    }
};
```

### 直接管理内存

```cpp
int* pi = new int; // 默认初始化，*pi 的值未定义
int* pi2 = new int(); // 值初始化，*pi2 的值为 0
string* ps = new string; // 默认初始化为空字符
string* ps2 = new string(); // 值初始化为空字符串
vector<int>* pv = new vector<int>; // 默认初始化，pv->size() 为 0
vector<int>* pv2 = new vector<int>{0, 1, 2, 3}; // 列表初始化
```

auto 和 new 结合使用：

```cpp
int b = 1;
auto p1 = new auto(b); // 推断出p1的类型为int*
auto p2 = new auto{1,2,3}; // 错误，括号中只能有单个初始化器
```

创建 const 对象：

```cpp
const int *pci = new const int(1024); // 指向常量的指针，必须初始化
const string *pcs = new const string; // 指向常量的空string，调用默认构造函数
```

内存耗尽：

```cpp
int *p1 = new int; // 如果内存耗尽，new 抛出 bad_alloc 异常
int *p2 = new (nothrow) int; // 如果内存耗尽，new 返回一个空指针
```

- bad_alloc 和 nothrow 都定义在头文件 new 中
- 其中 new(nothrow)的写法其实是一个 placement new 表达式，允许传递一个额外的参数。

使用 delete 释放内存，注意：

- delete 的指针必须是动态分配的内存，或者是空指针
- 不能释放同一块内存多次

```cpp
int i, *pi1 = &i, *pi2 = nullptr;
double *pd = new double(33), *pd2 = pd;

delete pd; // 正确
delete pd2; // 错误，内存已经被释放，未定义行为
delete i; // 错误，i不是指针，编译报错
delete pi1; // 错误，pi1不是动态分配的内存，编译通过，未定义行为
delete pi2; // 正确，delete 空指针是安全的
```

动态分配内存的错误：

- 忘记释放内存
- 释放后继续使用
- 释放同一块内存多次

为什么动态分配内存容易出错：

- 函数内部分配内存，函数外部释放内存容易忘记释放
- 其中一个指针释放并置空，另一个指针继续使用
- 两个指针指向同一块内存，其中一个释放后，另一个后续又释放了一次

### shared_ptr 和 new 结合使用

```cpp
shared_ptr<int> p1(new int(42)); // p1 指向一个值为 42 的 int
shared_ptr<int> p3 = make_shared<int>(42); // 推荐使用 make_shared
shared_ptr<int> p2 = new int(42); // 错误，不能将内置指针隐式转换为智能指针

shared_ptr<int> clone(int p) {
	return new int(p); // 错误，不能将内置指针隐式转换为智能指针
}
shared_ptr<int> clone(int p) {
	return shared_ptr<int>(new int(p)); // 正确，显示绑定到一个shared_ptr
}
```

定义和改变 shared_ptr 的方法
| 方法 | 说明 |
| --- | --- |
| shared_ptr<T> p(q) | p 管理指针 q 所指向的对象，q 必须指向 new 分配的内存，且呢能转为 T\* |
| shared_ptr<T> p(u) | p 管理 unique_ptr u 所指向的对象，从 u 那接管对象，u 置空 |
| shared_ptr<T> p(q, d) | p 管理指针 q 所指向的对象，用可调用对象 d 代替 delete |
| shared_ptr<T> p(p2, d) | p2 是另一个 shared_ptr，p 指向 p2 所指向的对象，用可调用对象 d 代替 delete |

reset 函数：
| 方法 | 说明 |
| --- | --- |
| p.reset() | 释放 p 持有的引用计数，如果引用计数为 0，释放对象 |
| p.reset(q) | 释放 p 持有的引用计数，p 管理指针 q 所指向的对象 |
| p.reset(q, d) | 释放 p 持有的引用计数，p 管理指针 q 所指向的对象，如果引用计数为 0，用可调用对象 d 代替 delete |

```cpp
shared_ptr<int> p(new int(42));
shared_ptr<int> q(p); // p 和 q 指向相同的对象
shared_ptr<int> r(p);
p.reset();
cout << r.use_count() << endl; // 2
q.reset(new int(41)); // q 指向新的对象
cout << r.use_count() << endl; // 1
cout << *q << endl; // 41
cout << *r << endl; // 42
```

使用 shared_ptr 和内置指针要小心：

- 不要 shared_ptr 和内置指针混合使用
  ```cpp
  void process(shared_ptr<int> ptr) {...}
  int *x = new int(1024);
  process(shared_ptr<int>(x));
  int j = *x; // x 已经被释放，未定义行为
  ```
- 不要用内置指针/get 返回的指针，初始化或 reset 多个 shared_ptr
  ```cpp
  shared_ptr<int> p(new int(42));
  shared_ptr<int> q(p.get()); // 同一块内存被释放两次
  shared_ptr<int> r;
  r.reset(p.get());
  ```
- 不要 delete get() 返回的指针
  ```cpp
  shared_ptr<int> p(new int(42));
  int *x = p.get();
  delete x; // 同一块内存被释放两次
  ```
- 使用 get 的指针时，注意是不是已经被 shared_ptr 释放了
  ```cpp
  shared_ptr<int> p(new int(42));
  int *x = p.get();
  p.reset();
  cout << *x << endl; // x 已经被释放，未定义行为
  ```

### 智能指针和异常

- 异常处理中的一大难点在于抛出时资源可能没有释放。
- 即便是程序块提前退出，局部变量也能确保被销毁。
- 因此，借助 RAII，智能指针可以很好的解决这个问题。

```cpp
void f(){
	int *p = new int;
	throw exception(); // 程序块提前退出，p 没有被释放
	delete p;
}
void f() {
	shared_ptr<int> sp(new int(42));
	throw exception(); // sp 会被销毁
}
```

### unique_ptr

- unique_ptr“拥有”它所指向的对象
- 与 shared_ptr 不同，某个时刻刻只能有一个 unique_ptr 指向一个给定对象。
- 当 unique_ptr 被销毁时，它所指向的对象也被销毁。

unique_ptr 同样支持 shared_ptr 中的部分操作：
![Alt text](image.png)

```cpp
unique_ptr<double> p1;
unique_ptr<double> p2(new double(3.14));
unique_ptr<double> p3(p2); // 错误，unique_ptr 不支持拷贝
unique_ptr<double> p4 = p2; // 错误，unique_ptr 不支持拷贝
p4 = p2; // 错误，unique_ptr 不支持赋值
swap(p2, p3); // 交换两个unique_ptr
```

- release 函数放弃对内存的控制权，返回指针
- 注意内存还没有被释放

```cpp
unique_ptr<double> p1(new double(3.14));
unique_ptr<double> p2(p1.release()); // p2 接管 p1 的内存
double *x = p2.release(); // 内存还没有被释放
delete x; // 手动释放内存

unique_ptr<double> p3(new double(3.14));
unique_ptr<double> p4(new double(3.14));
p3.reset(p4.release()); // p3 原本的内存被释放，然后 p3 接管 p4 的内存
```

不过，unique_ptr 支持移动拷贝，仅用于临时对象：

```cpp
unique_ptr<int> clone(int p) {
	return unique_ptr<int> ret(new int(p)); // 编译器知道要返回的对象要被销毁
}

unique_ptr<int> clone(int p) {
	unique_ptr<int> ret(new int(p));
	return ret; // 编译器知道要返回的对象要被销毁
}
```

### 释放其他类型资源

借助 shared_ptr 和 unique_ptr，还可以用来保证释放其他类型的资源，例如：网络连接

```cpp
struct destination; // 表明我们这在连接什么
struct connection; // 连接所需的信息
connection connect(destination*); // 打开连接
void disconnect(connection); // 关闭连接
void end_connection(connection *p) { disconnect(*p); } // 删除器
void f(destination &d) {
	connection c = connect(&d);
	shared_ptr<connection> p(&c, end_connection); // 指定删除器
	// 使用连接
}
```

unique_ptr 写法稍微有点不一样，需要手动指定类型：

```cpp
void f(destination &d) {
	connection c = connect(&d);
	unique_ptr<connection, decltype(end_connection)*> p(&c, end_connection); // 必须添加*表明这是函数指针类型
	// 使用连接
}
```

### weak_ptr

- weak_ptr 是一种不控制所指向对象生存期的智能指针
- 它指向 shared_ptr 管理的对象
- 将 weak_ptr 绑定到一个 shared_ptr 不会改变其引用计数
  | 方法 | 说明 |
  | --- | --- |
  | weak_ptr<T> w | w 是一个空 weak_ptr |
  | weak_ptr<T> w(p) | w 是 p 的 weak_ptr |
  | w = p | w 是 p 的 weak_ptr |
  | w.reset() | 释放 w 指向的对象 |
  | w.use_count() | 返回与 w 共享对象的 shared_ptr 数量 |
  | w.expired() | 如果 w.use_count() 为 0，返回 true，否则返回 false |
  | w.lock() | 如果 w.expired() 为 true，返回一个空 shared_ptr，否则返回一个指向 w 的对象的 shared_ptr |

```cpp
shared_ptr<int> p = make_shared<int>(42);
weak_ptr<int> wp(p); // wp 弱引用 p

if (shared_ptr<int> np = wp.lock()) { // 如果 np 不为空
	// 在 if 语句块内，np 与 p 共享对象
	cout << *np << endl; // 42
}

```

## 动态数组

- C++定义了另一种 new 表达式语法，可以分配并初始化个对象数组。
- 标准库中包含一个名为 allocator 的类，允许我们将分配和初始化分离。使用 allocator 通常会提供更好的性能和更灵活的内存管理能力。
- 通常应该使用标准库容器而不是动态分配的数组。使用容器更为简单、更不容易出现内存管理错误并且可能有更好的性能。

### new 和数组

- 动态数组不是数组，看上去分配数组但实际返回的类型是指针
- 因此也不能进行数组操作，例如：begin 和 end
- 不能用 auto 分配数组

```cpp
int *p1 = new int[get_size()]; // 分配的数目是整数，可以不是常量

typedef int arrT[42]; // 使用类型别名
int *p2 = new arrT; // 分配 42 个整数的数组

int *p3 = new int[10](); // 值初始化，10 个 0
int *p4 = new int[10]; // 默认初始化，10 个未定义的值
string *p5 = new string[10]; // 默认初始化，10 个空字符串
string *p6 = new string[10](); // 值初始化，10 个空字符串

int *p = new int[3]{0, 1, 2}; // 列表初始化
int *p = new int[3]{0, 1}; // {0, 1, 0}
int *p = new int[3]{0, 1, 2, 3} // bad_array_new_length异常，定义在头文件 new 中

char arr[0]; //错误，数组长度不能为 0
char *cp = new char[0]; // 正确，但不能解引用
```

释放动态数组：

- 数组中的元素按逆序销毁
- 释放一个指向数组的指针时，空方括号对是必需的，如果不加方括号，其行为是未定义的

```cpp
int *p = new int[42];
delete[] p; // 释放动态数组
```

智能指针和动态数组：

```cpp
// unique_ptr
unique_ptr<int[]> up(new int[10]); // unique_ptr支持动态数组，析构时，会自动调用 delete[]
up[0] = 1; // 使用和普通指针一样

// shared_ptr
shared_ptr<int> sp(new int[10], [](int *p) { delete[] p; }); // shared_ptr 不支持动态数组，需要自定义删除器
for (size_t i = 0; i != 10; ++i) {
	*(sp.get() + i) = i; // 不支持下标运算，需要使用 get
}
```

### allocator 类

- new 和 delete 把分配/释放内存和构造/析构对象混在一起
- 在需要分配多个对象的情况下，默认的构造是多余的，我们希望把这两个操作分开

```cpp
allocator<string> alloc; // 可以分配 string 的 allocator
auto const p = alloc.allocate(n); // 分配 n 个未初始化的 string

auto q = p; // q 指向最后构造的元素之后的位置
alloc.construct(q++); // 在q的位置构造一个空字符串
alloc.construct(q++, 3, 'c'); // 在q的位置构造一个ccc

while (q != p) {
	alloc.destroy(--q); // q为尾后指针，逆序销毁
}

alloc.deallocate(p, n); // 释放内存
```

除此之外，标准库还定义了一些拷贝和填充内存的函数：

| 方法                           | 说明                                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| uninitialized_copy(b, e, b2)   | 将迭代器范围 b 到 e 的元素拷贝到 b2 开始的未构造的内存，返回 copy 后的尾后指针，b2 必须指向足够大的空间 |
| uninitialized_copy_n(b, n, b2) | 将迭代器 b 开始的 n 个元素拷贝到 b2 开始的未构造的内存，返回 copy 后的尾后指针，b2 必须指向足够大的空间 |
| uninitialized_fill(b, e, t)    | 将迭代器范围 b 到 e 的元素填充为 t，返回填充后的尾后指针，b 必须指向足够大的空间                        |
| uninitialized_fill_n(b, n, t)  | 将迭代器 b 开始的 n 个元素填充为 t，返回填充后的尾后指针，b 必须指向足够大的空间                        |

```cpp
vector<int> v = {1, 2, 3, 4, 5};
auto p = alloc.allocate(v.size() * 2);
auto q = uninitialized_copy(v.begin(), v.end(), p); // 拷贝v到p
uninitialized_fill_n(q, v.size(), 42); // 填充后半部分为42
```
