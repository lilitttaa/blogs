---
title: C++ Primer 10.泛型算法
---

## 概述

- 泛型算法可以用于不同类型的元素和多种容器类型：
  - 标准库类型，如 vector 或 list
  - 内置的数组类型
  - 其他类型序列
- 大多数算法都定义在头文件 algorithm 中，数值算法定义在头文件 numeric 中。
- 泛型算法不直接操作容器，通常是遍历由两个迭代器指定的一个元素范围来进行操作。
- 使用迭代器让算法不依赖于容器类型，但大多数算法都使用了元素类型上的操作。如：find 使用==运算符来比较元素。不过大多数算法允许提供自定义的操作。
- 泛型算法不会改变容器的大小，但可能会改变容器中的元素的值。

## 初始泛型算法

### 只读算法

- find：在一个序列中查找一个值
- accumulate：累加序列中的值，指定一个初始值，元素必须要支持+运算符。accumulate 定义在头文件 numeric 中
- equal：判断两个序列是否相等，需要保证第二个序列至少和第一个序列一样长

```cpp
// find
vector<int> vec = {1, 2, 3, 4, 5};
vector<int>::iterator result = find(vec.begin(), vec.end(), 3);
vector<int>::iterator result = find(vec.begin(), vec.end(), 6);// end()

// accumulate
int sum = accumulate(vec.begin(), vec.end(), 0);

// equal
vector<int> vec1 = {1, 2, 3, 4, 5};
vector<int> vec2 = {1, 2, 3, 4, 5};
bool is_equal = equal(vec1.begin(), vec1.end(), vec2.begin());

```

注：操作两个序列的算法：

- 可以是不同的序列，例如：一个是 vector，一个是 list
- 两个序列的类型不必相同，但算法需要的操作必须要能够应用于这两种类型
- 一般参数有两种：
  - 第一个序列的迭代器范围和第二个序列的首元素迭代器（需要程序员自己保证不会访问超出第二个序列的范围）
  - 第一个序列的迭代器范围和第二个序列的迭代器范围

### 写容器元素的算法

- fill： 指定值填充容器
- fill_n：指定值填充指定数量的元素
- copy：将指定范围内的元素拷贝到另一个容器
- replace：将范围中的指定值替换为另一个值

```cpp
// fill
vector<int> vec = {1, 2, 3, 4, 5};
fill(vec.begin(), vec.end(), 0); // {0, 0, 0, 0, 0}

// fill_n
vec = {1, 2, 3, 4, 5};
fill_n(vec.begin(), 3, 0); // {0, 0, 0, 4, 5}

// copy
vec = {1, 2, 3, 4, 5};
vector<int> vec2(5);
copy(vec.begin(), vec.end(), vec2.begin()); // {1, 2, 3, 4, 5}

// replace
vec = {1, 2, 3, 4, 5};
replace(vec.begin(), vec.end(), 3, 0); // {1, 2, 0, 4, 5}

```

插入迭代器 back_inserter：每次赋值都会调用 push_back，给出一个简化的实现：

```cpp
template <typename Container>
class BackInsertIterator
{
public:
	...
    BackInsertIterator<Container> &operator=(const value_type &val)
    {
        cont_.insert(cont_.end(), val); // push_back
        return *this;
    }

    BackInsertIterator<Container> &operator*()
    {
        return *this; // 直接返回自身
    }
private:
    Container &cont_;
};
```

```cpp
vector<int> vec = {1, 2, 3, 4, 5};
vector<int> vec2;
copy(vec.begin(), vec.end(), back_inserter(vec2));
```

很多算法都提供拷贝版本：

```cpp
// replace
vec = {1, 2, 3, 4, 5};
replace(vec.begin(), vec.end(), 3, 0); // {1, 2, 0, 4, 5}
// replace_copy
vector<int> vec2(5);
replace_copy(vec.begin(), vec.end(), vec2.begin(), 3, 0); // {1, 2, 0, 4, 5} 将vec拷贝到vec2，替换3为0
```

### 重排容器元素的算法

- sort：对容器中的元素排序（默认升序），使用 < 运算符比较元素
- stable_sort：对容器中的元素排序，**保持相等元素的相对位置**
- unique：“删除”相邻的重复元素，返回指向不重复序列的尾后迭代器。unique 并不真的删除任何元素，它只是覆盖相邻的重复元素，使得不重复元素出现在序列开始部分。

  ![Alt text](image.png)
  ![Alt text](image-1.png)

```cpp
// sort
vector<int> vec = {5, 4, 3, 2, 1};
sort(vec.begin(), vec.end()); // {1, 2, 3, 4, 5}

// stable_sort
vector<tuple<int, string>> vec = {make_tuple(2, "a"), make_tuple(2, "b"), make_tuple(1, "c")};
stable_sort(vec.begin(), vec.end(), [](const tuple<int, string> &t1, const tuple<int, string> &t2) { return get<0>(t1) < get<0>(t2); });
// {(1, "c"), (2, "a"), (2, "b")}

// unique
vec = {1, 2, 2, 3, 3, 4, 5};
vector<int>::iterator end_unique = unique(vec.begin(), vec.end()); // {1, 2, 3, 4, 5, ?, ?}
cout << (end_unique - vec.begin()) << endl; // 5
```

## 定制操作

- 谓词是一个可调用的表达式，其返回结果是一个能用作条件的值。
- 标准库算法所使用的谓词分为一元谓词和二元谓词。

```cpp
bool isShorter(const string &s1, const string &s2)
{
	return s1.size() < s2.size();
}
sort(words.begin(), words.end(), isShorter);
```

### lambda 表达式

可调用对象：

- 函数
- 函数指针
- 重载 operator()的类
- lambda 表达式

有时我们希望进行的操作需要更多参数，超出了算法对谓词的限制，这时可以使用 lambda 表达式。

```cpp
void biggist(vector<string> &words, vector<string>::size_type sz)
{
	eliminateDups(words); // 按字典序排序，删除重复单词
	stable_sort(words.begin(), words.end(), [](const string &a, const string &b) { return a.size() < b.size(); });
	auto wc = find_if(words.begin(), words.end(), [sz](const string &a) { return a.size() >= sz; });
	for_each(wc, words.end(), [](const string &s) { cout << s << " "; });
}

```

lambda 表达式的一般形式如下：
![Alt text](image-4.png)

- 参数列表和返回类型是可选的
- lambda 必须使用尾置返回类型

```cpp
[](const string &a, const string &b) -> bool { return a.size() < b.size(); }
```

### lambda 捕获和返回

- lambda 捕获列表捕获局部非静态变量，局部静态变量和它所在函数外的名字可以直接使用
- 可以把 lambda 表达式理解为定义了一个拥有 operator()的新类型，当向一个函数传递一个 lambda 时，传递的参数就是这个类型的对象。
- lambda 捕获的值是在 lambda 创建时拷贝的，而不是在调用时拷贝的。
- lambda 可以值捕获和引用捕获，值捕获的前提是变量可拷贝（例如，ostream 对象不能拷贝，必须捕获引用）。

```cpp
void f()
{
	size_t v1 = 42;
	auto f = [v1] { return v1; }; // 创建时拷贝v1
	v1 = 0;
	auto j = f(); // j = 42
}
```

lambda 捕获的写法：

```cpp
[=] { ... } // 捕获所有局部变量
[&] { ... } // 捕获所有局部变量的引用
[=, &foo] { ... } // 捕获所有局部变量，但是 foo 是引用
[&, foo] { ... } // 捕获所有局部变量的引用，但是 foo 是值
[foot,&bar] { ... } // foo 是值，bar 是引用
```

可变 lambda：默认情况下，lambda 不会改变它所捕获的变量，如果想要改变，需要在参数列表后加上 mutable 关键字。

```cpp
size_t v1 = 42;
auto f = [v1] () mutable { return ++v1; };
v1 = 0;
auto j = f(); // j = 43
```

引用：

- 当以引用方式捕获变量时，必须确保在 lambda 执行时变量是存在的。

```cpp
size_t v1 = 42;
auto f = [&v1] { return ++v1; };
v1 = 0;
auto j = f(); // j = 1
```

默认情况下，如果一个 lambda 体包含 return 之外的任何语句，则编译器假定此 lambda 返回 void。

```cpp
transform(words.begin(), words.end(), words.begin(), [](const string &s) { if (s.size() > 0) return s[0]; else return '\0'; }); // 错误，编译器假定返回void
transform(words.begin(), words.end(), words.begin(), [](const string &s) -> char { if (s.size() > 0) return s[0]; else return '\0'; }); // 正确
```

### 参数绑定

- bind 可以像 lambda 一样既保证泛型算法所需的接口，又能传递额外的参数。
- bind 定义在头文件 functional 中。
- bind 需要使用占位符 \_1, \_2, ... 来表示参数位置。
- 占位符定义在命名空间 std::placeholders 中。

```cpp
#include <functional> // bind
using namespace std::placeholders; // _1, _2, ...

bool check_size(const string &s, string::size_type sz)
{
	return s.size() >= sz;
}
auto check6 = bind(check_size, _1, 6);
find_if(words.begin(), words.end(), check6); // check6(A) <-> check_size(A, 6)
```

参数重排：

```cpp
bool isShorter(const string &s1, const string &s2)
{
	return s1.size() < s2.size();
}
auto isShorter2 = bind(isShorter, _2, _1);
sort(words.begin(), words.end(), isShorter2); // isShorter2(A, B) <-> isShorter(B, A)
```

- 默认情况下，bind 对于非占位符参数是值传递的，如果需要引用传递，需要使用 ref 或者 cref（类比与 lambda 的引用捕获）。
- ref 和 cref 定义在头文件 functional 中。
- ref 引用，cref 常量引用。

```cpp
void print(ostream &os, const string &s, char c)
{
	os << s << c;
}
auto f = bind(print, ref(cout), _1, ' ');
f("hello"); // cout << "hello "
```

## 再探迭代器

### 插入迭代器

插入迭代器：

- 插入迭代器是一种迭代器适配器
- \*it = val：插入到容器前或者后
- ++it，it++，\*it：直接返回自身

```cpp
template <typename Container>
class BackInsertIterator
{
public:
	...
    BackInsertIterator<Container> &operator=(const value_type &val)
    {
        cont_.insert(cont_.end(), val); // push_back
        return *this;
    }

    BackInsertIterator<Container> &operator*()
    {
        return *this; // 直接返回自身
    }
	BackInsertIterator<Container> &operator++()
	{
		return *this; // 什么也不做，直接返回自身
	}
	BackInsertIterator<Container> &operator++(int)
	{
		return *this; // 什么也不做，直接返回自身
	}
private:
    Container &cont_;
};
```

- back_inserter：调用 push_back
- front_inserter：调用 push_front，容器必须要支持 push_front
- inserter：调用 insert，接受一个迭代器作为第二个参数

```cpp
vector<int> vec = {1, 2, 3, 4, 5};
list<int> lst1, lst2;
copy(vec.begin(), vec.end(), front_inserter(lst1)); // {5, 4, 3, 2, 1}
copy(vec.begin(), vec.end(), inserter(lst2, lst2.begin())); // {1, 2, 3, 4, 5}
```

### iostream 迭代器

- iostream 迭代器把 iostream 看作容器，使用迭代器来读写流。
- istream_iterator 从输入流读取数据，ostream_iterator 向输出流写数据。
- 定义了 >> 和 << 运算符的类型可以使用 iostream 迭代器。

istream_iterator：

- 默认构造函数表示流的尾后迭代器
- 读取时，会自动调用流的>>运算符

![Alt text](image-5.png)

```cpp
istream_iterator<int> in_iter(cin), eof; // 默认构造函数表示流的尾后迭代器
vector<int> vec(in_iter, eof); // 使用迭代器范围初始化vector

istream_iterator<int> in_iter(cin), eof;
while (in_iter != eof) // != 判断是否到达流的尾后
{
	cout << *in_iter++ << endl;
}

cout << accumulate(in_iter, eof, 0) << endl; // 使用泛型算法
```

ostream_iterator:

- 对迭代器赋值时，会自动调用流的<<运算符

![Alt text](image-6.png)

```cpp
ostream_iterator<int> out_iter(cout, " "); // 输出到cout，每个元素之间用空格分隔
for (const auto &e : vec)
{
	*out_iter++ = e;
}

// 等价于
ostream_iterator<int> out_iter(cout, " ");
for (const auto &e : vec)
{
	out_iter = e;
}
```

### 反向迭代器

- 除 forward_list 外，其他容器都有反向迭代器
- 反向迭代器需要迭代器支持--操作，所以 ostream_iterator 不支持反向迭代器

![Alt text](image-7.png)

```cpp
string s = "FIRST,MIDDLE,LAST";
auto comma = find(s.crbegin(), s.crend(), ',');
cout << string(s.crbegin(), comma) << endl; // "TSAL" 反了
cout << string(comma.base(), s.cend()) << endl; // "LAST"
```

![Alt text](image-8.png)

## 泛型算法结构

五种迭代器类型如下（层次从低到高）：
![Alt text](image-2.png)
除了输出迭代器器之外，一个高层类别的迭代器支持低层类别迭代器的所有操作。

每个算法都会指明它需要的迭代器类型，例如：

- find、accumulate 需要输入迭代器
- copy 需要输出迭代器
- replace 需要前向迭代器
- reverse 需要双向迭代器
- sort 需要随机访问迭代器

不同的容器类型支持不同的迭代器类型，例如：

- vector、string、deque 支持随机访问迭代器
- list 支持双向迭代器
- forward_list 支持前向迭代器
- istream_iterator 是输入迭代器
- ostream_iterator 是输出迭代器

### 算法形参模式

大多数算法具有如下几种模式：

- alg(beg, end, other_args);
- alg(beg, end, dest, other_args);
  - 需要保证 dest 可以接受任意数量的元素，例如：back_inserter，ostream_iterator
- alg(beg, end, beg2, other_args);
  - 需要保证 beg2 开始的序列至少能容纳 beg 到 end 的元素
- alg(beg, end, beg2, end2, other_args);
  - 需要保证 beg2 到 end2 的序列至少能容纳 beg 到 end 的元素

### 算法命名规范

一些算法使用重载来传递谓词，例如：

```cpp
unique(words.begin(), words.end()); // 默认使用==
unique(words.begin(), words.end(), comp); // 使用 comp
```

- 很多接受一个额外参数的算法，使用 \_if 后缀来表示
- 因为参数数量相同所以无法使用重载，所以使用 \_copy 后缀来表示

```cpp
find(words.begin(), words.end(), "foo");
find_if(words.begin(), words.end(), pred); // 查找第一个使得 pred 为真的元素
```

算法默认是非拷贝版本，如果需要拷贝版本，使用 \_copy 后缀：

```cpp
reverse(words.begin(), words.end());
reverse_copy(words.begin(), words.end(), dest);
```

同时提供\_if 和 \_copy 后缀的算法：

```cpp
remove_if(v1.begin(), v1.end(), [](int i) { return i % 2; });
remove_copy_if(v1.begin(), v1.end(), back_inserter(v2), [](int i) { return i % 2; });
```

## 特定容器算法

- 链表 list 和 forward_list 定义了独有的 sort、merge、remove、unique、reverse 成员函数
- sort 是因为链表不支持随机访问，所以不能使用标准库的 sort
- list 和 forward_list 的 sort 成员函数使用归并排序，时间复杂度为 O(nlogn)
- 另外一些算法则是处于性能考虑，通用算法对于链表不是最优的选择
- 链表的操作会改变链表，例如： merge 后 list2 直接接入 list

```cpp
list.merge(list2); // list 和 list2 都是有序的，将 list2 合并到 list，使用 < 运算符
list.merge(list2, comp); // 使用 comp

list.remove(val); // 调用erase删除所有等于 val 的元素
list.remove_if(pred); // 删除所有使得 pred 为真的元素

list.reverse(); // 反转链表

list.sort(); // 默认使用 < 运算符
list.sort(comp); // 使用 comp

list.unique(); // 使用erase删除相邻的重复元素，使用 == 运算符
list.unique(pred); // 使用 pred
```

链表还定义了额外的 splice 操作：

```cpp
list.splice(pos, list2); // 将 list2 移动到 pos 之前，list2不能和list是同一个链表
list.splice(pos, list2, pos2); // 将 list2 中 pos2 之后的元素移动到 pos 之前
list.splice(pos, list2, beg, end); // 将 list2 中 [beg, end) 的元素移动到 pos 之前
```

## 附录（算法列表）
