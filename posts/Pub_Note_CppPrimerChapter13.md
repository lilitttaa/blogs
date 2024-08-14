---
title: C++ Primer 13.拷贝控制
---

## 概述

- 控制该类型对象拷贝、赋值、移动或销毁时做什么：
  - 拷贝构造函数
  - 移动构造函数
  - 拷贝赋值运算符
  - 移动赋值运算符
  - 析构函数
- 如果一个类没有定义所有这些拷贝控制成员，编译器会自动为它定义缺失的操作。

## 拷贝、赋值与销毁

### 拷贝构造函数

- 如果一个构造函数的第一个参数是自身类类型的引用，且任何额外参数都有默认值,则此构造函数是拷贝构造函数。
- 拷贝构造函数第一个参数通常都是 const 的。
- 拷贝构造函数通常不应该是 explicit，因为其在几种情况下都会被隐式地使用
- 如果没有定义拷贝构造函数（即便有别的构造函数），编译器会自动生成一个合成拷贝构造函数。

合成拷贝构造函数：

- 类类型的成员，会使用其拷贝构造函数来拷贝
- 内置类型的成员则直接拷贝
- 数组元素会逐元素地拷贝

```cpp
class Sales_data {
public:
	Sales_data() = default;
	Sales_data(const Sales_data& rhs);
private:
	std::string bookNo;
	unsigned units_sold = 0;
	double revenue = 0.0;
};

Sales_data::Sales_data(const Sales_data& rhs) :
	bookNo(rhs.bookNo), units_sold(rhs.units_sold), revenue(rhs.revenue){}

Sales_data item1;
Sales_data item2 = item1; // 调用拷贝构造函数
Sales_data item3(item1); // 调用拷贝构造函数
```

初始化：

- 直接初始化：编译器使用普通的函数匹配
- 拷贝初始化：编译器将右侧运算对象拷贝到正在创建的对象中，必要时会进行类型转换

```cpp
string dots(10, '.'); // 直接初始化
string s(dots); // 直接初始化
string s2 = dots; // 拷贝初始化
string null_book = "9-999-99999-9"; // 拷贝初始化
string nines = string(100, '9'); // 拷贝初始化
```

什么时候发生拷贝初始化：

- 将对象实参传递给非引用类型的形参（这也是为什么拷贝构造函数必须是引用的原因，否则就无限循环了）
- 从返回类型为非引用类型的函数返回一个对象
- 用花括号列表初始化一个数组中的元素或一个聚合类中的成员
- 某些类型会对它们分配的对象进行拷贝初始化，如： vector 的 insert

```cpp
vector<int> v1(10); // 直接初始化
vector<int> v2 = v1; // 错误，size作为参数的构造函数是explicit的

void f(vector<int>);
f(10); // 错误
f(vector<int>(10)); // 正确
```

### 拷贝赋值运算符

- 赋值运算符就是一个名为 operator=的函数
- 运算符重载既可以是成员函数，也可以是非成员函数
- 某些运算符，包括赋值运算符，必须定义为成员函数
- 赋值运算符通常返回一个指向其左侧运算对象的引用
- 标准库通常要求保存在容器中的类型要具有赋值运算符
- 如果一个类未定义自己的拷贝赋值运算符，编译器会为它生成一个合成拷贝赋值运算符.

```cpp
class Foo{
public:
	Foo& operator=(const Foo&);
};
```

什么时候调用：

```cpp
Sales_data trans, accum;
trans = accum; // 调用拷贝赋值运算符
```

合成拷贝赋值运算符：

```cpp
// 等价于
Sales_data& Sales_data::operator=(const Sales_data& rhs)
{
	bookNo = rhs.bookNo;
	units_sold = rhs.units_sold;
	revenue = rhs.revenue;
	return *this;
}
```

### 析构函数

- 析构函数释放对象使用的资源并销毁对象的非 static 数据成员。
- 析构函数没有返回值，也不接受参数。
- 先执行函数体，再按照成员定义的逆序销毁成员。
- 隐式销毁一个内置指针类型的成员不会 delete 它所指向的对象。

```cpp
class HasPtr {
public:
	~HasPtr() { delete ps; }
private:
	std::string *ps;
};
```

什么是调用析构函数：

- 变量在离开其作用域时被销毁
- 当一个对象被销毁时，其成员被销毁
- 容器（包括标准库和数组）被销毁时，其元素被销毁
- 动态分配的对象通过 delete 释放
- 临时对象在创建它的完整表达式结束时被销毁

```cpp
{
	Sales_data *p = new Sales_data;
	auto p2 = make_shared<Sales_data>();
	Sales_data item(*p); // 拷贝构造函数，item是局部变量
	vector<Sales_data> vec;
	vec.push_back(*p2); // 拷贝构造函数，将*p2拷贝到vec
	delete p; // 调用析构函数
}
// 退出作用域，销毁item、vec、p2
// p2的引用计数减一，销毁指向的对象
// 销毁vec时，销毁其元素
```

合成析构函数：

- 当一个类未定义自己的析构函数时,编译器会为它定义一个合成析构函数

```cpp
// 等价于
Sales_data::~Sales_data() {}
```

### 三/五法则

- 需要析构函数的类，也需要拷贝构造函数和拷贝赋值运算符。
- 拷贝构造函数跟拷贝赋值函数通常一起出现。

```cpp
class HasPtr {
public:
	HasPtr(const std::string &s = std::string()) :
		ps(new std::string(s)), i(0) {}
	HasPtr(const HasPtr &p) : // 如果没有拷贝构造或者赋值，指针指向同一个对象，会被delete两次
		ps(new std::string(*p.ps)), i(p.i) {}
	HasPtr& operator=(const HasPtr&);
	~HasPtr() { delete ps; }
private:
	std::string *ps;
	int i;
};

HasPtr& HasPtr::operator=(const HasPtr &rhs)
{
	auto newp = new std::string(*rhs.ps);
	delete ps;
	ps = newp;
	i = rhs.i;
	return *this;
}
```

### 使用 =default

default 关键字用于显式要求编译器生成合成的版本，支持：

- 默认构造函数
- 拷贝构造函数
- 拷贝赋值运算符
- 移动构造函数
- 移动赋值运算符
- 析构函数

```cpp
class Sales_data {
public:
	Sales_data() = default; // 内联
	Sales_data(const Sales_data&) = default;
	Sales_data& operator=(const Sales_data&);
	~Sales_data() = default;
};

Sales_data& Sales_data::operator=(const Sales_data &rhs) = default; // 非内联
```

### 阻止拷贝

- 对某些类来说，拷贝没有合理的意义。因此必须采用某种机制阻止拷贝或赋值。
- 例如，iostream 类阻止了拷贝，以避免多个对象写入或读取相同的 IO
- 删除的函数是指：虽然声明了它们，但不能以任何方式使用它们。
- =delete 可以用于任何函数，除了析构函数。

```cpp
class NoCopy {
public:
	NoCopy() = default;
	NoCopy(const NoCopy&) = delete; // 阻止拷贝
	NoCopy& operator=(const NoCopy&) = delete; // 阻止赋值
	~NoCopy() = default;
};
```

下面情况编译器不会生成合成版本（即删除）：

- 默认构造函数
  - 某个成员的**析构函数**是删除的或不可访问的
  - 有引用成员且没有类内初始化器
  - 有 const 成员且没有类内初始化器和显示定义默认构造函数
- 析构函数
  - 某个成员的**析构函数**是删除的或不可访问的
- 拷贝构造函数
  - 某个成员的**拷贝构造函数**是删除的或不可访问的
  - 某个成员的**析构函数**是删除的或不可访问的
- 拷贝赋值函数
  - 某个成员的**拷贝赋值函数**是删除的或不可访问的
  - 类有 const/引用成员（这些成员不能被赋值）

## 拷贝控制和资源管理

定义拷贝之前明确类的拷贝语义：

- 值，例如：string
- 指针，例如：shared_ptr

### 拷贝行为像值的类

类值赋值运算符：

- 赋值运算符通常组合了析构函数和构造函数的操作
  - 销毁左侧运算对象旧的资源
  - 从右侧对象拷贝数据
- 即使将对象赋值给自己，也要正确处理
  - 通常是先拷贝右侧运算对象，再销毁左侧运算对象
  - 如果先销毁，拷贝的时候就会出错
- 应当是异常安全的
  - 先拷贝到临时变量，这样就算拷贝抛异常也不会影响现有对象

```cpp
class HasPtr {
public:
	HasPtr(const std::string &s = std::string()) :
		ps(new std::string(s)), i(0) {}
	HasPtr(const HasPtr &p) :
		ps(new std::string(*p.ps)), i(p.i) {}
	HasPtr& operator=(const HasPtr&);
	~HasPtr() { delete ps; }
private:
	std::string *ps;
	int i;
};

HasPtr& HasPtr::operator=(const HasPtr &rhs)
{
	auto newp = new std::string(*rhs.ps); // 先拷贝到临时变量
	delete ps; // 再销毁左侧运算对象
	ps = newp;
	i = rhs.i;
	return *this;
}
```

### 拷贝行为像指针的类

- 可以使用 shared ptr 来管理类中的资源。
- 如果希望自己管理资源，使用引用计数。
  - 释放时不能直接 delete，而是减少引用计数，当计数为 0 时再释放。
  - 计数需要放在动态内存上

```cpp
class HasPtr {
public:
	HasPtr(const std::string &s = std::string()) :
		ps(new std::string(s)), i(0), use(new std::size_t(1)) {}
	HasPtr(const HasPtr &p) :
		ps(p.ps), i(p.i), use(p.use) { ++*use; }
	HasPtr& operator=(const HasPtr&);
	~HasPtr();
private:
	std::string *ps;
	int i;
	std::size_t *use;
};

HasPtr::~HasPtr()
{
	if (--*use == 0) {
		delete ps;
		delete use;
	}
}

HasPtr& HasPtr::operator=(const HasPtr &rhs)
{
	++*rhs.use; // 先递增右侧运算对象的引用计数
	if (--*use == 0) { // 引用计数减一，如果为 0，释放资源
		delete ps;
		delete use;
	}
	ps = rhs.ps;
	i = rhs.i;
	use = rhs.use;
	return *this;
}
```

## 交换操作

- 管理资源的类通常还会实现 swap 函数，尤其是用与标准库中重排元素的算法。
- 标准库中的 swap 操作通常会用到移动赋值或者拷贝赋值。
- 但另一方面在移动赋值或者拷贝赋值的实现中又会用到 swap 函数，所以我们需要自己实现一个 swap 函数。

类值 HasPtr：

```cpp
class HasPtr {
public:
	friend void swap(HasPtr&, HasPtr&);
	// 其他成员
};

inline void swap(HasPtr &lhs, HasPtr &rhs)
{
	using std::swap;
	swap(lhs.ps, rhs.ps); //这里是指针，但是如果是类对象，优先匹配非标准库的 swap
	swap(lhs.i, rhs.i);
}
```

copy 并 swap 定义拷贝赋值运算符：

- 实现
  - 参数是值传递，会调用拷贝构造函数进行拷贝
  - 然后 swap 交换两个对象的数据
  - 最后离开作用域时，会调用析构函数释放临时对象的资源
- 异常安全
- 自赋值安全

```cpp
HasPtr& HasPtr::operator=(HasPtr rhs) // 注意这里是值传递
{
	swap(*this, rhs);
	return *this;
}
```

## 拷贝控制示例

- 拷贝赋值运算符通常执行拷贝构造函数和析构函数中也要做的工作。公共的工作应该放在 private 的工具函数中完成。

## 对象移动

- 在某些情况对象拷贝后就立即被销毁了，使用移动而非拷贝对象可以大幅度提升性能。
- 另外，对于 IO 类和 unique_ptr 类型的对象，拷贝是禁止的，只能移动。

### 右值引用

- 右值引用即只能绑定到右值的引用。
- 右值引用只能绑定到一个将要销毁的对象，因此可以自由的将右值资源移动到新的对象中。
  - 字面值常量
  - 临时对象
- 左值引用不能绑定到要求转换的表达式、字面常量或是返回右值的表达式，但右值引用可以。

```cpp
int i = 42;
int &r = i; // 正确，左值引用
int &&rr = i; // 错误，右值引用不能绑定到左值
int &r2 = i * 42; // 错误，乘法的结果是右值
const int &r3 = i * 42; // 正确，常量引用可以绑定到右值
int &&rr2 = i * 42; // 正确，右值引用可以绑定到右值
```

- 变量是左值，包括右值引用变量本身。
- move 函数可以将一个左值转换为右值引用，定义在头文件 utility 中。
- 使用 move 的代码应该使用 std::move 而不是 move。这样做可以避免潜在的名字冲突。
- 我们可以销毁一个移后源对象，也可以赋予它新值，但不能使用一个移后源对象的值。

```cpp
int &&rr1 = 42; // 正确，字面值是右值
int &&rr2 = rr1; // 错误，rr1本身是左值
int &&rr3 = std::move(rr1); // 正确，std::move将左值转换为右值
```

### 移动构造函数和移动赋值运算符

移动构造函数和移动赋值运算符：

- 从给定对象“窃取”资源
- 第一个参数必须是右值引用
- 一旦资源完成移动，源对象必须不再指向被移动的资源
- 在移动操作之后，移后源对象必须保持有效的、可析构的状态，但是用尸不能对其值进行任何假设
- 由于一个移后源对象具有不确定的状态，对其调用 std::move 是危险的。当我们调用 move 时,必须绝对确认移后源对象没有其他用户
- 自赋值一般什么都不做
- 如果不抛出异常，应该声明为 noexcept，且声明和定义都要加

```cpp
class StrVec {
public:
	StrVec(StrVec &&) noexcept;
	StrVec& operator=(StrVec &&) noexcept; // 声明和定义都要加 noexcept
};

StrVec::StrVec(StrVec &&s) noexcept : // 移动构造函数
	elements(s.elements), first_free(s.first_free), cap(s.cap)
{
	s.elements = s.first_free = s.cap = nullptr; // 指针置空，资源控制权已经被移除
}

StrVec& StrVec::operator=(StrVec &&rhs) noexcept // 移动赋值运算符
{
	if (this != &rhs) { // 自赋值什么都不做
		free(); // 释放当前对象已有的资源
		elements = rhs.elements;
		first_free = rhs.first_free;
		cap = rhs.cap;
		rhs.elements = rhs.first_free = rhs.cap = nullptr;
	}
	return *this;
}
```

为什么不抛出异常的移动构造函数和移动赋值运算符需要声明为 noexcept：

- 如果移动操作抛出异常，标准库容器会选择使用拷贝操作来代替移动操作。
  - 拷贝操作只要先赋给临时对象，即便出现异常，也不会影响原来的对象。
  - 移动操作如果在移动过程中出现异常，原来的对象已经被破坏了
- 移动操作比拷贝操作更高效，因此我们希望容器在可能的情况下使用移动操作。

合成的移动操作：

- 如果一个类定义了这些函数之一，编译器就不会为它合成移动操作函数：
  - 拷贝构造函数
  - 拷贝赋值运算符
  - 析构函数
- 另外还需要这个类的每个成员都有移动操作或者是内置类型

合成移动操作为删除的跟合成拷贝类似：

- 类成员没有定义移动操作且不能生成合成的移动操作
- 移动操作被定义为删除的或不可访问的
- 类成员是 const 或者引用类型
- 必须定义拷贝操作，否则移动操作会被删除

类如果没有移动操作，通过函数匹配，编译器会使用拷贝操作代替移动操作：

```cpp
class Foo{
public:
	Foo() = default;
	Foo(const Foo&);
};

Foo x;
Foo y(x); // 调用拷贝构造函数
Foo z(std::move(x)); // 调用拷贝构造函数
```

使用 swap 写法可以同时支持拷贝和移动的赋值：

```cpp
class HasPtr {
public:
	HasPtr(const std::string &s = std::string()) :
		ps(new std::string(s)), i(0) {}
	HasPtr(HasPtr &&p) noexcept : ps(p.ps), i(p.i) { p.ps = 0; }
	HasPtr& operator=(HasPtr rhs) // 重点在于这个临时对象的构造是移动还是拷贝
	{
		swap(*this, rhs);
		return *this;
	}
	~HasPtr() { delete ps; }
	friend void swap(HasPtr&, HasPtr&);
private:
	std::string *ps;
	int i;
};

hp1 = hp2; // 先调用拷贝构造函数，再调用赋值运算符
hp1 = std::move(hp2); // 先调用移动构造函数，再调用赋值运算符
```

新的三/五法则：

- 定义了任一拷贝操作，就应该定义所有五个操作
  - 拷贝构造函数
  - 拷贝赋值运算符
  - 移动构造函数
  - 移动赋值运算符
  - 析构函数

移动迭代器：

- 使用 make_move_iterator 函数将普通迭代器转换为移动迭代器
- 通常的迭代器解引用返回左值引用，而移动迭代器解引用返回右值引用

```cpp
void StrVec::reallocate()
{
	auto newcapacity = size() ? 2 * size() : 1;
	auto first = alloc.allocate(newcapacity);
	auto last = std::uninitialized_copy(std::make_move_iterator(begin()),
										std::make_move_iterator(end()),
										first);
	free();
	elements = first;
	first_free = last;
	cap = elements + newcapacity;
}
```

### 右值引用和成员函数

成员函数也可以指定右值引用参数，一般来说：

- 拷贝版本使用 const T&形式
- 移动版本使用 T&&形式

```cpp
class StrVec {
public:
	void push_back(const std::string &s) {
		chk_n_alloc();
		alloc.construct(first_free++, s);
	}
	void push_back(std::string &&s)
	{
		chk_n_alloc();
		alloc.construct(first_free++, std::move(s));
	}
};

StrVec v;
std::string s = "some string or another";
v.push_back(s); // 调用拷贝版本
v.push_back("done"); // 调用移动版本
```

- 旧标准是没法阻止对右值的赋值：
  ```cpp
  string s1 = "a value", s2 = "another";
  s1 + s2 = "wow";  // 对右值赋值
  ```
- 新标准中可以使用引用限定符
- &：只能用于左值
- &&：只能用于右值
- 引用限定符可以区分重载版本
- 如果有 const，引用限定符必须在 const 之后
- 如果一个成员函数有引用限定符，则具有相同参数列表的所有版本都必须有引用限定符

```cpp
class Foo {
public:
	Foo sorted() &&;
	Foo sorted() const &;
private:
	std::vector<int> data;
};

Foo Foo::sorted() &&
{
	sort(data.begin(), data.end()); // 右值版本，可以直接原地排序
	return *this;
}

Foo Foo::sorted() const &
{
	Foo ret(*this); // const或左值，必须拷贝一份
	sort(ret.data.begin(), ret.data.end());
	return ret;
}

Foo retVal();
Foo &retFoo();

retVal().sorted(); // 调用右值版本
retFoo().sorted(); // 调用左值版本
```
