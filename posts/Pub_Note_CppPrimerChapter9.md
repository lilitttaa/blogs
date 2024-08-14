---
title: C++ Primer 9. 顺序容器
---

## 容器概述

- 所有容器类都共享公共的接口，不同容器按不同方式对其进行扩展。
- 每种容器都提供了不同的性能和功能的权衡。
- 现代 C++ 程序应该使用标准库容器，而不是更原始的数据结构，如内置数组。
- 通常容器定义的头文件与容器类名相同，如 vector 定义在头文件 vector 中。

## 顺序容器概述

顺序容器类型如下:
![Alt text](image.png)

如何选择容器类型:

- 除非有特殊需求，应该使用 vector。
- 如果小元素很多，且在意内存开销，则尽量不要使用 list 和 forward_list。
- 要求随机访问，使用 vector 或 deque。
- 要求在中间插入或删除，使用 list 或 forward_list。
- 只在两端插入或删除，使用 deque。
- 可以在程序中只使用 vector 和 list 公共的操作：使用迭代器，不使用下标操作，避免随机访问。在必要时可以切换。
- 如果一定要在中间插入，又要随机访问，可能考虑先用 list，然后再转换为 vector。

## 容器库概览

容器操作分为三类：

1. 针对所有容器的操作。
2. 针对顺序/关联/无序容器的操作。
3. 针对某个特定容器的操作。

### 迭代器

- forward_list 不支持逆向迭代器和 --运算符。
- 迭代器的范围是左闭右开的，即 [begin, end)。
- 迭代器的算术运算只能应用于随机访问迭代器：string、vector、deque 和 array 的迭代器。

| 获取迭代器   | 说明                                          |
| ------------ | --------------------------------------------- |
| c.begin();   | 返回指向 c 中第一个元素的迭代器               |
| c.end();     | 返回指向 c 中尾元素的下一个位置的迭代器       |
| c.cbegin();  | 返回指向 c 中第一个元素的常量迭代器           |
| c.cend();    | 返回指向 c 中尾元素的下一个位置的常量迭代器   |
| c.rbegin();  | 返回指向 c 中尾元素的逆向迭代器               |
| c.rend();    | 返回指向 c 中首元素上一个位置的逆向迭代器     |
| c.crbegin(); | 返回指向 c 中尾元素的常量逆向迭代器           |
| c.crend();   | 返回指向 c 中首元素上一个位置的常量逆向迭代器 |

```cpp
whlie (begin != end) {
	*begin = val;
	++begin;
}
vector<int> v{1,2,3,4};
vector<int>::iterator rb = v.begin();
```

### 容器类型成员

| 类型别名               | 说明                                       |
| ---------------------- | ------------------------------------------ |
| iterator               | 此容器的迭代器类型                         |
| const_iterator         | 此容器的常量迭代器类型                     |
| reverse_iterator       | 逆向迭代器类型                             |
| const_reverse_iterator | 常量逆向迭代器类型                         |
| size_type              | 无符号整数类型，足以表示容器的最大可能大小 |
| value_type             | 容器保存的元素类型                         |
| difference_type        | 两个迭代器之间的距离                       |
| reference              | 与元素类型相同的引用类型                   |
| const_reference        | 与元素类型相同的常量引用类型               |

使用方式如下：

```cpp
vector<int> ivec;
vector<int>::size_type cnt = ivec.size();
vector<int>::difference_type diff = ivec.end() - ivec.begin();
```

### begin 和 end 成员

- 可以将一个普通的 iterator 转换为对应的 const iterator
  但反之不行。

```cpp
list<string> a = {"Milton", "Shakespeare", "Austen"};
auto it1 = a.begin(); // iterator
auto it2 = a.cbegin(); // const_iterator
auto it3 = a.rbegin(); // reverse_iterator
auto it4 = a.crbegin(); // const_reverse_iterator
list<string>::const_iterator it5 = a.begin(); // const_iterator
```

### 容器定义和初始化

| 构造函数              | 说明                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| C c;                  | 默认构造函数，创建一个空容器，因为 array 大小固定不变，所以其中的值按默认初始化，std::array<int,3> arr; |
| C c(c2); 或 C c = c2; | 构造 c2 的拷贝，两者类型必须完全相同，array 大小也得相同 c1                                             |
| C c(b, e);            | c 是迭代器 b 和 e 定义的元素的副本，array 不适用                                                        |
| C c{a, b, c};         | 列表初始化，array 元素数目必须小于等于 array 大小，剩下的值按值初始化                                   |

| 构造函数（仅顺序容器） | 说明                                                                         |
| ---------------------- | ---------------------------------------------------------------------------- |
| C c(n);                | 创建 c，包含 n 个元素，每个元素都是值初始化的对象，不适用于 string，explicit |
| C c(n, val);           | 创建 c，包含 n 个元素，每个元素都是 val 的拷贝                               |

```cpp
vector<int> ivec; // 空 vector
vector<int> ivec2(ivec); // ivec 的拷贝
vector<int> ivec3 = ivec; // ivec 的拷贝
list<int> ilist{1, 2, 3, 4}; // 4 个元素，值分别是 1, 2, 3, 4
vector<int> ivec4(ilist.begin(), list.begin()+2); // 1, 2
vector<int> ivec5(4); // 4 个元素，值都是 0
vector<string> svec(10, "hi"); // 10 个元素，值都是 "hi"
```

两种拷贝构造：

- C c1(c2) 要求 c1 和 c2 的类型完全相同。
- C c(b, e) 只要求 b 和 e 的元素类型能够转换为 c 的元素类型。

```cpp
vector<const char*> articles = {"a", "an", "the"};
vector<string> articles(articles.begin(), articles.end()); // 正确：可以转换
vector<string> articles(articles); // 错误：不能拷贝不同类型的容器
```

内置数组不支持赋值和拷贝，但 array 可以

```cpp
array<int, 10> a1 = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9}; // size也是类型的一部分
array<int, 10> a2(a1);
array<int, 10> a3 = a1;
```

### 赋值和 swap

| 赋值与 swap     | 说明                                      |
| --------------- | ----------------------------------------- |
| c1 = c2;        | 将 c2 的拷贝赋给 c1                       |
| c1 = {a, b, c}; | 将列表初始化的元素赋给 c1，不适用于 array |
| c1.swap(c2);    | 交换 c1 和 c2 的内容，通常比拷贝快得多    |
| swap(c1, c2);   | 同上，建议使用这个                        |

assign 操作（不适用于 array 和关联容器）：
| assign 操作 | 说明 |
| ---------------- | -------------------------------------------------------------- |
| c1.assign(b, e); | 用迭代器 b 和 e 定义的元素赋给 c1，b 和 e 不能指向 c1 中的元素 |
| c1.assign(n, t); | 用 n 个值为 t 的元素赋给 c1 |
| c1.assign(il); | 用 il 中的元素赋给 c1，il 是一个初始化列表 |

- 赋值操作会导致迭代器、引用和指针失效。
- swap 操作元素本身并未交换，内部的数据结构交换了，复杂度为 O(1)。
- swap 操作不会导致迭代器、引用和指针失效。
- array 的 swap 不一样，因为 array 的数据直接存在栈上，而不是动态分配的，所以 array 只能逐个交换元素，所以 array 的 swap 是 O(N)的。
- 非成员版本的 swap 在泛型编程中是非常重要的。统一使用非成员版本的 swap 是一个好习惯。

```cpp
vector<string> svec(10);
vector<string> v = {"a", "an", "the"};
swap(v, svec); // 交换 v 和 svec 的内容，元素本身并未交换，内部的数据结构交换了
```

```cpp
list<string> names;
vector<const char*> oldstyle = {"a", "an", "the"};
names.assign(oldstyle.cbegin(), oldstyle.cend()); // 正确：可以转换
names.assign(10, "hi");
```

### 容器大小操作

| 大小与容量    | 说明                                     |
| ------------- | ---------------------------------------- |
| c.size();     | 返回 c 中元素的数目，forward_list 不支持 |
| c.max_size(); | 返回 c 可以容纳的元素数目的最大值        |
| c.empty();    | 如果 c 为空，则返回 true                 |

### 关系运算符

| 关系运算符   | 说明                                             |
| ------------ | ------------------------------------------------ |
| c1 == c2     | 如果 c1 和 c2 的所有元素相等，则返回 true        |
| c1 != c2     | 存在不相等的元素，或长度不同，则返回 true        |
| <, >, <=, >= | 依次比较 c1 和 c2 中的元素，直到找到不相等的元素 |

- 如果元素类型不支持所需运算符，那么容器就不能使用相应的关系运算。

```cpp
vector<int> v1 = {1, 2, 3, 4};
vector<int> v2 = {1, 2, 3, 5};
vector<int> v3 = {1, 2, 9};
vector<int> v4 = {1, 2, 3, 4, 5};
vector<int> v5 = {1, 2, 3, 4};
v2 > v1; // true
v3 > v1; // true
v4 > v1; // true
v5 == v1; // true
v4 != v1; // true
v4 == v1 // false
```

## 顺序容器操作

- 顺序容器可以保存几乎任何类型，但某些容器操作对元素类型有其自己的特殊要求。可以为这些类型定义容器，但只能使用那些没有特殊要求的容器操作。

```cpp
// noDefault 是一个没有默认构造函数的类
vector<noDefault> v1(10, init); // 正确：提供了初始化器
vector<noDefault> v2(10); // 错误
```

### 向顺序容器添加元素

- array 大小固定，以下操作不适用于 array
- forward_list 的操作不一样，后续另外说明
- vector、string 不适用与 front 相关操作
- 向 vector、string、deque 添加元素时，可能会使所有指向容器的迭代器、引用和指针失效。

| 添加元素操作           | 说明                                                                            |
| ---------------------- | ------------------------------------------------------------------------------- |
| c.push_back(t);        | 将 t 添加到 c 的尾部，返回 void                                                 |
| c.emplace_back(args);  | 使用 args 在 c 的尾部直接构造一个元素，返回 void                                |
| c.push_front(t);       | 将 t 添加到 c 的首部，返回 void                                                 |
| c.emplace_front(args); | 使用 args 在 c 的首部直接构造一个元素，返回 void                                |
| c.insert(p, t);        | 将 t 插入到 p 指向的元素之前，返回指向新元素的迭代器                            |
| c.emplace(p, args);    | 使用 args 在 p 指向的元素之前直接构造一个元素，返回指向新元素的迭代器           |
| c.insert(p, n, t);     | 将 t 插入到 p 指向的元素之前，n 次，返回指向第一个新元素的迭代器                |
| c.insert(p, b, e);     | 将迭代器 b 和 e 定义的元素插入到 p 指向的元素之前，返回指向第一个新元素的迭代器 |
| c.insert(p, il);       | 将初始化列表 il 中的元素插入到 p 指向的元素之前，返回指向第一个新元素的迭代器   |

```cpp
class Foo {
public:
	Foo(int i) : val(i) {}
private:
	int val;
};
list<Foo> fList;
fList.push_back(Foo(42)); // 拷贝临时对象
fList.emplace_back(42); // 直接构造
fList.push_front(Foo(42));
fList.emplace_front(42);
auto newBegin = fList.insert(fList.begin(), Foo(42));
auto newBegin = fList.emplace(fList.begin(), 42);
auto newBegin = fList.insert(fList.begin(), 10, Foo(42));
auto newBegin = fList.insert(fList.begin(), {Foo(42), Foo(42)});
vector<Foo> fVec{Foo(42), Foo(42)};
auto newBegin = fList.insert(fList.begin(), fVec.begin(), fVec.end());
```

## vector 对象是如何增长的

- vector 和 string 中元素是连续存储的，如果没有足够的空间存储新元素，它们会重新分配内存。
- 通常会分配比新的空间需求更大的内存空间。预留这些空间作为备用。
- 虽然每次重新分配内存空间时都要移动所有元素，但使用策略后，其扩张操作通常比 list 和 deque 还要快。
- 具体会分配多少额外空间则视标准库具体实现而定。
- reserve 并不改变容器中元素的数量，它仅影响 vector 预先分配多大的空间。
- resize 改变 vector 中元素的数量。
- shrink_to_fit 具体实现可能会忽略这个请求。

![Alt text](image-1.png)

```cpp
vector<int> ivec;
ivec.reserve(4); // 分配至少能容纳 4 个元素的内存空间
for (vector<int>::size_type ix = 0; ix != 24; ++ix) {
	ivec.push_back(ix);
}
cout << ivec.size() << endl; // 24
cout << ivec.capacity() << endl; // 32
ivec.shrink_to_fit(); // 将 capacity降低到 size
cout << ivec.size() << endl; // 24
cout << ivec.capacity() << endl; // 24
ivec.resize(32); // 将 size 调整为 32，新增元素执行值初始化
ivec.resize(16); // 将 size 调整为 16，删除多余元素
```

### 访问元素

- 每个顺序容器都支持 front，除了 forward_list 都支持 back。
- 随机访问容器支持下标运算符（vector、deque、array、string）。
- 下标运算不检查下标是否越界，如果越界，会导致未定义行为。
- at 成员函数检查下标是否越界，如果越界，会抛出一个 out_of_range 异常。

```cpp
vector<int> ivec = {1, 2, 3, 4, 5};
cout << ivec.front() << endl; // 1
ivec.front() = 42;
cout << ivec.front() << endl; // 42
cout << ivec.back() << endl; // 5
cout << ivec[0] << endl; // 42
```

### 删除元素

| 删除元素操作   | 说明                                                |
| -------------- | --------------------------------------------------- |
| c.pop_back();  | 删除 c 的尾元素，返回 void                          |
| c.pop_front(); | 删除 c 的首元素，返回 void                          |
| c.erase(p);    | 删除 p 指向的元素，返回指向被删元素之后元素的迭代器 |
| c.erase(b, e); | 删除迭代器 b 和 e 定义的元素，返回指向 e 的迭代器   |
| c.clear();     | 删除 c 中所有元素，返回 void                        |

```cpp
list<int> ilist = {1, 2, 3, 4, 5, 6, 7, 8, 9};
auto it = ilist.begin();
while (it != ilist.end()) {
	if (*it % 2) {
		it = ilist.erase(it); // 删除奇数元素
	} else {
		++it;
	}
}
```

### 特殊的 forward_list 操作

因为 forward_list 是单向链表，需要改变删除/添加元素的前一个元素的指针，所以基本的顺序容器操作逻辑是不适用的。

| 操作                     | 说明                                                                          |
| ------------------------ | ----------------------------------------------------------------------------- |
| c.before_begin();        | 返回指向首元素之前的元素的迭代器，不支持解引用                                |
| c.insert_after(p, t);    | 在 p 指向的元素之后插入 t，返回指向新元素的迭代器                             |
| c.insert_after(p, n, t); | 在 p 指向的元素之后插入 n 个 t，返回指向第一个新元素的迭代器                  |
| c.insert_after(p, b, e); | 在 p 指向的元素之后插入迭代器 b 和 e 定义的元素，返回指向第一个新元素的迭代器 |
| c.erase_after(p);        | 删除 p 指向的元素之后的元素，返回指向被删元素之后元素的迭代器                 |
| c.erase_after(b, e);     | 删除迭代器 b 和 e 定义的元素，返回指向 e 的迭代器                             |

### 改变容器大小

- resize 大于当前大小，新增元素到容器尾部
- 小于当前大小，删除尾部元素。
- 对于 vector、string、deque 来说 resize 增大可能导致重新分配内存。
- 减少大小不会导致内存重新分配，但会使尾部迭代器、引用和指针失效。

```cpp
vector<int> ivec{1, 2, 3};
ivec.resize(5); // 1, 2, 3, 0, 0 值初始化
ivec.resize(2); // 1, 2 删除 3
ivec.resize(5, 42); // 1, 2, 42, 42, 42
```

### 容器操作可能使迭代器失效

- 使用改变容器的操作可能会使迭代器失效，尤其是循环的情况下很容易出错。
- insert 和 erase 操作可以使用返回的迭代器
- 不要使用缓存的 end()，因为常常会失效，所以最好经常调用 end()成员函数来获取容器最新的尾后迭代器。标准库获取 end()的效率很高。

vector 和 string：

- 添加后，有内存重新分配，所有指向容器的迭代器、引用和指针都会失效。
- 添加后，没有内存重新分配，只有添加元素之后的迭代器、引用和指针会失效。
- 删除后，删除元素之后的迭代器、引用和指针会失效，包括 end()。

deque：

- 插入和删除到首尾外的位置，所有迭代器、引用和指针都会失效。
- 插入和删除到首尾位置，只有首尾迭代器、引用和指针会失效。

list 和 forward_list：

- 添加和删除元素后，都不会使迭代器失效。

## 额外的 string 操作

### 构造 string 的其他方法

```cpp
const char *cp = "hello world";
char noNull[] = {'H', 'i'};
string s1(cp); // "hello world" 拷贝直到遇到空字符
string s2(noNull, 2); // "Hi" 拷贝 noNull 的前两个字符
string s3(noNull); // 未定义，noNull 不是以空字符结尾的
string s4(cp + 6, 5); // "world" 从 cp 的第 6 个字符开始拷贝 5 个字符

string s5(s1, 6, 5); // "world" 从 s1 的第 6 个字符开始拷贝 5 个字符
string s6(s1, 6); // "world" 从 s1 的第 6 个字符开始拷贝到结尾
string s7(s1, 6, 20); // "world" 从 s1 的第 6 个字符开始直到结尾或者 20 个字符
string s8(s1, 20); // out_of_range 异常

string s9 = s1.substr(0, 5); // "hello" 从 s1 的第 0 个字符开始拷贝 5 个字符
```

### 改变 string 的其他方法

下标版本：

```cpp
string s("hello world");
s.insert(s.size(), 5, '!'); // "hello world!!!!!" 在最后插入 5 个 '!'
s.erase(s.size() - 5, 5); // "hello world" 删除最后 5 个字符
```

append 和 replace：
![Alt text](image-2.png)
![Alt text](image-3.png)

```cpp
string s("C++ Primer")
s.append(" 4th Ed."); // "C++ Primer 4th Ed."
s.replace(11, 3, "5th"); // "C++ Primer 5th Ed."
```

### string 搜索操作

![Alt text](image-4.png)
![Alt text](image-5.png)

```cpp
string numbers("0123456789"), name("r2d2");
auto pos = name.find_first_of(numbers); // pos = 1

```

### compare 函数

### 数值转换

## 容器适配器

- 适配器（ adaptor）是一种机制，能使某种事物的行为看起来像另外一种事物一样。
- 容器、迭代器和函数都有适配器。
- 容器适配器接受一种已有的容器类型，使其行为看起来像一种不同的类型。

所有容器适配器都支持的操作和类型：
| 名字 | 说明 |
|----------------------|---------------------------------------------|
| size_type | 无符号整数类型，足以保存当前对象的最大可能大小 |
| value_type | 元素类型 |
| container_type | 适配器使用的基础容器类型 |
| A a; | 创建一个名为 a 的空适配器 |
| A a(c); | 创建适配器 a，带有容器 c 的拷贝 |
| ==, !=, <, <=, >, >= | 返回容器的比较结果 |
| a.empty(); | 如果适配器为空，则返回 true |
| a.size(); | 返回适配器中元素的数目 |
| a.swap(b); | 交换 a 和 b 的内容 |
| swap(a, b); | 交换 a 和 b 的内容 |

顺序容器适配器：
| 名字 | 说明 | 头文件 |
|----------------------|---------------------------------------------|----------------------|
| stack | 默认容器为 deque，也可以用 list、vector 不支持 forward_list 和 array | stack |
| queue | 默认容器为 deque，也可以用 list 不支持 vector、forward_list 和 array | queue |
| priority_queue | 默认容器为 vector，也可以用 deque 不支持 list、forward_list 和 array | queue |

stack 是一种后进先出（LIFO）的数据结构，只能从栈顶添加或删除元素。stack 不支持遍历元素。

```cpp
stack<int> intStack;
for (size_t ix = 0; ix != 10; ++ix) {
	intStack.push(ix);
}
while (!intStack.empty()) {
	int value = intStack.top(); // 获取栈顶元素
	intStack.pop();
}

// emplace
stack<string> strStack;
strStack.emplace("hello"); // 等价于 strStack.push(string("hello"));
```

queue 是一种先进先出（FIFO）的数据结构，只能从队尾添加元素，从队首删除元素。queue 不支持遍历元素。

```cpp
queue<int> intQueue;
for (size_t ix = 0; ix != 10; ++ix) {
	intQueue.push(ix);
	int value = intQueue.back(); // 获取队尾元素
	cout << value << endl; // 0 1 2 3 4 5 6 7 8 9
}
while (!intQueue.empty()) {
	int value = intQueue.front(); // 获取队首元素
	cout << value << endl; // 0 1 2 3 4 5 6 7 8 9
	intQueue.pop();
}

// emplace
queue<string> strQueue;
strQueue.emplace("hello"); // 等价于 strQueue.push(string("hello"));
```

priority_queue 是一种优先级队列，元素按照优先级排序。默认情况下，元素按照降序排序，即最大的元素排在队首。priority_queue 不支持遍历元素。

```cpp
vector<int> ivec = {2, 3, 1, 4, 5};
priority_queue<int> ipq(ivec.cbegin(), ivec.cend());
ipq.push(0);
while (!ipq.empty()) {
	cout << ipq.top() << endl; // 5 4 3 2 1 0
	ipq.pop();
}

// emplace
priority_queue<string> strPq;
strPq.emplace("hello"); // 等价于 strPq.push(string("hello"));
```
