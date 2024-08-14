---
title: C++ Primer 14.重载运算与类型转换
---

## 基本概念

- 重载的运算符是具有特殊名字的函数：名字由 operator 和其后的运算符号共同组成。
- 重载运算符函数的参数数量与该运算符作用的运算对象数量一样多。
- 但成员函数第一个参数绑定到隐式的 this 上，所以参数数量比运算对象数量少一个。
- 要么是类的成员函数，要么是有类类型参数的普通函数，即不能重载内置类型的运算符。
  ```cpp
  int operator+(int, int); // 错误：内置类型不能重载运算符
  ```
- 运算符的优先级和结合律不能改变。
- 跟运算符内置的含义保持一致，尤其是返回值类型。

重载运算符调用：

```cpp
data1 + data2;
operator+(data1, data2); // 显示调用
```

- :: 、 ?: 、.\*、. 不能被重载。
- &&、||、,、不建议被重载，因为它们的求值顺序是固定的，重载后无法保留，同时短路求值也可能被破坏。
- 取地址运算符 & 也不应该重载，因为它对于类类型的对象有特殊的含义。

关于是成员函数还是非成员函数：

- 赋值=、下标[]、调用()、成员访问箭头->必须是成员函数。
- 复合赋值运算符一般是成员函数。
- 改变对象状态的运算符一般是成员函数。例如：递增++、递减--、解引用\*
- 具有对称性的运算符一般是非成员函数。例如：算术运算符+、-、\*、/、关系运算符==、!=、<、>、<<、>>

## 输入和输出运算符

- 输出运算符应该主要负责打印对象的内容而非控制格式，不应该打印换行符。
- 必须是非成员函数，一般是友元，因为左侧运算对象是流对象，而流对象不能被重载。
- 输入必须处理输入失败的情况，一般是重置对象。
- 输入失败应该设置流的条件状态以标示出失败信息，通常只设置 failbit。其他的由 IO 标准库自己标示。

```cpp
ostream &operator<<(ostream &os, const Sales_data &item) // ostream不支持拷贝，所以必须是引用，参数一般是const引用，因为不会改变参数的值
{
	os << item.isbn() << " " << item.units_sold << " "
	   << item.revenue << " " << item.avg_price();
	return os;
}

instream &operator>>(istream &is, Sales_data &item) // 返回值同样是引用，参数一般是引用，因为要改变参数的值
{
	double price;
	is >> item.bookNo >> item.units_sold >> price;
	if (is)
		item.revenue = item.units_sold * price;
	else
		item = Sales_data(); // 输入失败，重置对象
	return is;
}

```

## 算术和关系运算符

- 定义为非成员函数，这样左右操作数都可以进行类型转换。
- 一般是常量引用，因为不会改变参数的值。

对于算术运算符：

- 最好是定义一个复合赋值运算符，然后再定义算术运算符。

```cpp
Sales_data operator+(const Sales_data &lhs, const Sales_data &rhs)
{
	Sales_data sum = lhs;
	sum += rhs; // 调用复合赋值运算符
	return sum; //返回副本
}
```

相等运算符：

- 应该能判断两个重复对象是否相等
- 具有传递性
- 应该同时定义==和!=，因为!=可以通过==来实现

```cpp
bool operator==(const Sales_data &lhs, const Sales_data &rhs)
{
	return lhs.isbn() == rhs.isbn() &&
		   lhs.units_sold == rhs.units_sold &&
		   lhs.revenue == rhs.revenue;
}
bool operator!=(const Sales_data &lhs, const Sales_data &rhs)
{
	return !(lhs == rhs);
}
```

关系运算符：

- 能够定义顺序关系，即能够排序
- 跟==和!=保持一致，如果两个对象!=，则有一个对象<另一个对象

```cpp
bool operator<(const Sales_data &lhs, const Sales_data &rhs)
{
	return lhs.isbn() < rhs.isbn();
}
```

## 赋值运算符

- 赋值运算符必须是成员函数
- 复合赋值运算符一般是成员函数
- 返回值是左侧运算对象的引用

```cpp
Sales_data &Sales_data::operator=(const Sales_data &rhs)
{
	bookNo = rhs.bookNo;
	units_sold = rhs.units_sold;
	revenue = rhs.revenue;
	return *this; // 返回左值引用
}

Sales_data &Sales_data::operator+=(const Sales_data &rhs)
{
	units_sold += rhs.units_sold;
	revenue += rhs.revenue;
	return *this;
}

// 支持initializer_list的赋值运算符
StrVec &StrVec::operator=(std::initializer_list<std::string> il)
{
	auto data = alloc_n_copy(il.begin(), il.end());
	free();
	elements = data.first;
	first_free = cap = data.second;
	return *this;
}
```

## 下标运算符

- 必须是成员函数
- 通常两个版本，一个是常量版本，一个是非常量版本

```cpp
std::string &StrVec::operator[](std::size_t n)
{
	return elements[n];
}

const std::string &StrVec::operator[](std::size_t n) const
{
	return elements[n];
}

const StrVec cvec = {"hello", "world"};
StrVec svec = {"hello", "world"};
svec[0] = "hi"; // 正确
cvec[0] = "hi"; // 错误：cvec是常量对象
```

## 递增和递减运算符

- 分为前置版本和后置版本
- 前置版本返回引用，后置版本返回值
- 后置版本多一个 int 参数，用于区分前置和后置版本
- 通常后置版本委托调用前置版本
- 后置版本编译器默认传递 0 作为参数

```cpp
class StrBlobPtr
{
public:
	StrBlobPtr &operator++(); // 前置递增
	StrBlobPtr &operator--(); // 前置递减
	StrBlobPtr operator++(int); // 后置递增
	StrBlobPtr operator--(int); // 后置递减
};

StrBlobPtr &StrBlobPtr::operator++() // 返回引用
{
	check(curr, "increment past end of StrBlobPtr");
	++curr;
	return *this;
}

StrBlobPtr StrBlobPtr::operator++(int) // 返回值
{
	StrBlobPtr ret = *this;
	++*this; // 委托调用前置版本
	return ret;
}

++p; // 调用前置版本
p++; // 调用后置版本
p.operator++(); // 调用前置版本
p.operator++(0); // 调用后置版本
```

## 成员访问运算符

- 迭代器和指针类通常会重载成员访问运算符
- 箭头运算符必须是成员函数，解引用运算符通常是成员函数
- 它们不会改变对象的状态，所以通常是常量成员函数

```cpp
class StrBlobPtr
{
public:
	std::string &operator*() const;
	std::string *operator->() const;
};

std::string &StrBlobPtr::operator*() const // 返回引用
{
	auto p = check(curr, "dereference past end");
	return (*p)[curr];
}

std::string *StrBlobPtr::operator->() const // 返回指针
{
	return &this->operator*(); // 委托调用解引用运算符
}
```

## 函数调用运算符

- 如果类重载了函数调用运算符，则我们可以像使用函数一样使用该类的对象，该对象被称之为函数对象。
- 函数调用运算符必须是成员函数
- 函数对象常常作为泛型算法的实参

```cpp
class PrintString
{
public:
	PrintString(ostream &o = cout, char c = ' ') : os(o), sep(c) {}
	void operator()(const string &s) const { os << s << sep; }
private:
	ostream &os;
	char sep;
};

PrintString printer;
printer("hello"); // 调用operator()
```

- 本质上 lambda 表达式也是函数对象
- 编译器会将 lambda 表达式翻译为一个未命名的类类型的对象，该对象重载了函数调用运算符
- 捕获列表对应函数对象的数据成员，通过构造函数初始化
- lambda 表达式产生的类不含默认构造函数、赋值运算符及默认析构函数；它是否含有默认的拷贝/移动构造函数则通常要视捕获的数据成员类型而定。

```cpp
[sz](const string &a) { return a.size() >= sz; }
// 等价于
class SizeComp
{
public:
	SizeComp(std::size_t n) : sz(n) {}
	bool operator()(const string &a) const { return a.size() >= sz; }
private:
	std::size_t sz;
};
```

### 标准库定义的函数对象

标准库定义了一组表示算术运算符、关系运算符和逻辑运算符的类，每个类分别定义了一个执行命名操作的调用运算符，定义在头文件 functional 中：

- 算术
  - plus\<Type\>
  - minus\<Type\>
  - multiplies\<Type\>
  - divides\<Type\>
  - modulus\<Type\>
  - negate\<Type\>
- 关系
  - equal_to\<Type\>
  - not_equal_to\<Type\>
  - greater\<Type\>
  - greater_equal\<Type\>
  - less\<Type\>
  - less_equal\<Type\>
- 逻辑
  - logical_and\<Type\>
  - logical_or\<Type\>
  - logical_not\<Type\>

```cpp
vector<string *> nameTable;
sort(nameTable.begin(), nameTable.end(), [](string *a, string *b) { return a < b; }); // 错误：比较指针
sort(nameTable.begin(), nameTable.end(), less<string *>()); // 正确：使用标准库定义的函数对象
```

### 可调用对象与 function

可调用对象：

- 函数
- 函数指针
- lambda 表达式
- bind 创建的对象
- 重载了 operator() 的类

function：

- 不同的调用对象共享同一种调用形式，例如: <int(int, int)>。
- 使用 funciton 对象将这些不同类型的调用对象统一起来。
- function 类模板定义在头文件 functional 中，它是一个类模板，可以保存任何可调用对象。

![Alt text](image-1.png)

```cpp
int add(int i, int j) { return i + j; }
struct divide
{
	int operator()(int denominator, int divisor) { return denominator / divisor; }
};
function<int(int, int)> f1 = add;
function<int(int, int)> f2 = divide();

map<string, function<int(int, int)>> binops = {
	{"+", add},
	{"-", std::minus<int>()},
	{"*", [](int i, int j) { return i * j; }},
	{"/", divide()},
	{"%", modulus<int>()}};

binops["+"](10, 5); // 调用add
```

注意，函数名不足以区分函数重载，可以：

- 使用函数指针
- 使用 lambda 表达式封装一层

```cpp
int add(int i, int j) { return i + j; }
Sales_data add(const Sales_data &lhs, const Sales_data &rhs) { return lhs + rhs; }

binops.insert({"+",add}) // 错误：无法区分
int (*fp)(int, int) = add;
binops.insert({"+",fp}) // 正确

binops.insert({"+",[](const Sales_data &lhs, const Sales_data &rhs) { return lhs + rhs; }}) // 正确
```

## 重载、类型转换与运算符优先级

- **转换构造函数**和**类型转换运算符**共同定义了类类型转换(用户定义的类型转换)。
- 类型转换运算符：
  - 没有显示返回类型
  - 没有参数
  - 类的成员函数
  - const 成员函数

```cpp
class SmallInt
{
public:
	SmallInt(int i = 0) : val(i) { if (i < 0 || i > 255) throw std::out_of_range("Bad SmallInt value"); } // 转换构造函数
	operator int() const { return val; } // 类型转换运算符
private:
	std::size_t val;
};

SmallInt si;
si = 4; // 调用转换构造函数
si + 3; // si转换为int
```

- 尽管编译器一次只能执行一个用户定义的类型转换
- 但隐式的用户定义类型转换可以置于一个标准（内置）类型转换之前或之后，并与其一起使用

```cpp
SmallInt si = 3.14; // double转为int，再转为SmallInt
si + 3.14; // SmallInt转为int，再转为double
```

使用 explicit 阻止隐式转换：

```cpp
class SmallInt
{
public:
	explicit SmallInt(int i = 0) : val(i) { if (i < 0 || i > 255) throw std::out_of_range("Bad SmallInt value"); } // 转换构造函数
	explicit operator int() const { return val; } // 类型转换运算符
private:
	std::size_t val;
};

SmallInt si = 3.14; // 错误：不能隐式转换
SmallInt si = static_cast<int>(3.14); // 错误：int不能隐式转换为SmallInt
SmallInt si = SmallInt(3.14); // 正确：先隐式转换为int，再显示转换为SmallInt
si + 3.14; // 错误：不能隐式转换
static_cast<int>(si) + 3.14; // 正确：显示转换
```

- 用作条件表达式的情况比较特殊，编译器将显示转换运算符用于隐式转换：
  - if、while、do while 中的条件表达式
  - for 中的条件表达式
  - ！、||、&&的运算对象
  - ?:的条件表达式
- 通常到 bool 的转换是 explicit 的，因为这样可以避免一些错误的隐式转换。

```cpp
class SmallInt
{
	...
	explicit operator bool() const { return val == 0; }
};

if (si) // 隐式使用显示转换
```

### 避免二义性的类型转换

类型转换的二义性：

- 两个类提供相同的转换

  - A 接受 B 类型的转换构造函数
  - B 定义了 B->A 的类型转换运算符

  ```cpp
  struct A{
  	A(const B&);
  };
  struct B{
  	operator A() const;
  };
  void f(const A& a);

  B b;
  f(b); // 二义性

  // 通过显示转换解决
  f(A(b));
  f(b.operator A());
  ```

- 类定义了多个转换规则，这些类可以通过其他类型转换联系起来，尤其是算术运算。

  ```cpp
  struct A {
  	A(int = 0);
  	A(double);
  	operator int() const;
  	operator double() const;
  };
  void f(long double);
  A a;
  f(a); // a可以转换为int或double，二义性

  long lg;
  A a(lg);  // lg可以转换为int或double，二义性
  ```

- 通常不要为类定义相同的类型转换，也不要在类中定义两个及两个以上转换源或转换目标是算术类型的转换。

重载函数也容易出现二义性问题：

```cpp
struct C {
    C(int);
};
struct D {
    D(int);
};
void manip(const C&);
void manip(const D&);
manip(10);  // 既可以10->C，也可以10->D，二义性错误
manip(C(10));  // 显式调用消除冲突

struct E {
    E(double);
};
void manip(const C&);
void manip(const E&);
manip(10);  // 既可以10->C，也可以10->double->E，二义性错误
```

### 函数匹配与重载运算符

如果我们对同一个类既提供了转换目标是算术类型的类型转换，也提供了重载的运算符，则将会遇到重载运算符与内置运算符的二义性问题：

```cpp
class SmallInt {
    friend SmallInt operator+(const SmallInt&, const SmallInt&);
public:
    SmallInt(int = 0);
    operator int() const { return val; }
private:
    std::size_t val;
};

SmallInt s1, s2;
SmallInt s3 = s1 + s2;  // 正确，使用重载的非成员友元+
int i = s3 + 0;  // 既可以看作是SmallInt + SmallInt 也可以看作是int + int，二义性错误
```
