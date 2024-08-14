---
title: C++ Primer 2.变量和基本类型
---

## 基本类型

类型的最小尺寸：
![Alt text](image.png)

- 类型决定了数据所占的比特数以及该如何解释这些内容
- short <= int <= long <= long long
- 通常 float 4 Bytes，double 8 Bytes，long double 96-128 Bytes
- char 分为三种类型：char、signed char、unsigned char
  char 具体是有符号还是无符号由编译器决定，所以不要在算术表达式中使用 char。
- 执行浮点数运算通常选用 double（8 Bytes），因为 float（4 Bytes）通常精度不够且双精度和单精度的计算代价相差无几。
- 不要混用有符号类型和无符号类型，有符号类型会隐式转为无符号类型，导致结果不符合预期：
  ```cpp
  cout<<sizeof(int)<<endl; //4
  int a = -1;
  uint b = a;
  cout<<(b==0xFFFFFFFF)<<endl; //1
  ```
- 当我们赋给带符号类型一个超出它表示范围的值时，结果是未定义的(undefined)。此时，程序可能继续工作、可能崩溃，也可能生成垃圾数据。

### 字面值常量

```cpp
cout<< (10 == 10) <<endl; // 十进制
cout<< (0b10 == 2) <<endl; // 二进制
cout<< (010 == 8) <<endl; // 八进制
cout<< (0x10 == 16) <<endl; // 十六进制
```

-42 本质上 42 是字面值常量，负号是一元运算符，作用于字面值常量 42。

整数的字面值是 int=>long=>long long 中第一个能容纳的类型。

浮点数字面值可以用小数或者科学计数法表示，字面值默认是 double：

```cpp
3.14
3.14e-2  // 3.14 * 10^-2
0.		 // 0.0
0e0		 // 0.0
.001	// 0.001
```

为了兼容 C 语言，C++中所有的字符串字面值都由编译器自动在末尾添加一个空字符\0。“A”表示包含字母 A 和空字符\0 共二个字符的字符串。

```cpp
'a' // 字符字面值
"Hello, World!" // 字符串字面值

// 字符串字面值可以拆开写
cout<<"Hello,"
"World!"<<endl; // Hello,World!

```

C++ 中的转义序列：
![Alt text](image-1.png)
以及用十六进制或八进制表示的泛化转义序列：

```cpp
// \ddd 八进制
\7 // 响铃
\12 // 换行
\40 // 空格
\0 // 空字符
\115 // M

// \xhh 十六进制
\x4d // M
```

添加前缀和后缀可以改变字面值的类型：
![Alt text](image-2.png)

```cpp
u"hi!" // char16_t
U"hi!" // char32_t
L'a' // wchar_t
u8"hi!" // char utf-8
8.23e-2f // float
8.23e-2l // long double
5u // unsigned int
5L // long
5ll // long long
```

nullptr 是指针字面值
true 和 false 是布尔字面值

## 变量

### 变量初始化

```cpp
int a = 1, b, c = 1;
cout<<a<<b<<c<<endl; // 1 undefined 1
```

在 C++中，初始化和赋值是 2 个完全不同的操作。初始化的含义是创建变量的时候赋予一个初始值，而赋值的含义是把对象的当前值擦除，用一个新值来替代。

```cpp
int unit_sold = 0;
int unit_sold = {0};
int unit_sold{0};
int unit_sold(0);
```

C++ 11 中引入了列表初始化，当用于内置类型的变量时，这种初始化形式有一个重要特点，如果我们使用列表初始化且初始值存在丢失信息的风险，则编译器将报错:

```cpp
long double ld = 3.1415926536;
int a{ld}, b = {ld}; // 错误：转换未执行，因为存在丢失信息的风险
```

内置类型变量的默认初始化由其定义的位置决定，定义于函数体外的变量被初始化为 0，定义于函数体内的变量将不被初始化，其值是不确定的。

```cpp
int a;
int main(){
	int b;
	cout<<a<<b<<endl; // 0 undefined
}
```

### 变量声明与定义

- 变量声明：规定了变量的类型和名字。
- 变量定义：除声明之外，还需要申请存储空间。

```cpp
int a; // 声明并定义
extern int b; // 声明
extern int c = 1; // 定义 extern被抵消了
```

变量只能定义一次，但可以多次声明。

```cpp
// test.h
// int a; 错误，变量定义会导出符号表，如果头文件被多个cpp文件引入，链接时会发生冲突。
extern int a;
```

```cpp
// test.cpp
#include "test.h"
int a = 1;
```

```cpp
// main.cpp
#include<iostream>
#include"test.h"
using namespace std;
int main(){
	cout<< a << endl; //1
	return 0;
}
```

### 标识符

- 以字母、下划线或者连字符开头，后面可以跟字母、下划线、连字符或数字。
- 区分大小写。
- 不能使用 C++ 的关键字。
- 为了 STL，不能使用双下划线开头和下划线后紧跟大写字母。（用 GDB 测试，没报错）

```cpp
int _; // 合法
int __; // 不合法
int double; // 不合法
int Double; // 合法
int double_; // 合法
int _double; // 合法
int _Double; // 不合法
int 1_or_2 = 1; // 不合法
```

### 作用域

```cpp
int a = 1;
int main(){
	int a = 2;
	cout<<a<<endl; // 2 作用域覆盖
	cout<<::a<<endl; // 1 全局作用域
}

```

## 复合类型

引用和指针都是复合类型

```cpp
int a = 1, &b = a, *c = &a;
int* d, e; // int *d; int e; 建议写作 int *d而不是int* d，否则像这样容易产生误解，&同理
```

### 引用（左值引用）

引用应当看作是变量的别名，与变量绑定在一起：

```cpp
int a = 1;
int b = 2;
int& c; // 错误，引用必须初始化
int& d = a;
d = b; // 错误，初始化后不能再绑定其他变量，但GDB中没有报错
int& e = 1; // 错误，引用必须绑定变量
```

引用本身不能再被引用，因为引用不是对象，而是对象的别名。

且引用与被引用对象的类型必须一致，不过也有例外：

```cpp
int a = 1;
int const &b = a; // 常量引用可以绑定到非常量对象，但不能通过常量引用修改对象的值
```

### 指针

指针本身是对象，因此可以赋值和拷贝，且指针可以在初始化时不指向任何对象（非常不建议这样做，野指针很危险）。

```cpp
int a = 0;
int *p = &a;
int *p2 = p;
int *p3 = nullptr; // C++ 11
int *p4 = NULL; // 预处理器定义的宏，会被替换为 0
int *p5 = 0;  // 等价于 nullptr
int *p6 = a; // 错误，可以指向字面值 0，但是不能指向非指针类型的变量
```

### 指向指针的引用

```cpp
int a = 1;
int *p = &a;
int *&r = p; // 从右往左读，&修饰*
```

## const

const 初始化有两种：

- const int a = 1; // 编译能确定的常量
- const int a = get_num(); // 运行时确定的常量

编译期的 const，编译器将会对使用变量的地方直接进行替换，为了既能获取到变量的定义，又保证不同的编译单元中不会出现重复定义，cpp 将 const 变量默认为只在本文件中有效。

const 很难分清的两个概念：

- 指向常量的指针，访问的值不可变
- 常量指针，指针本身不可变

其实有一个技巧，const 修饰其左边的所有内容，如果左边不存在，则修饰右边的第一个部分：

```cpp
int v = 1;
int v2 = 2;
const int v3 = 3;   // 顶层const
const int *p1 = &v; // 指向常量的指针 顶层const
int const *p2 = &v; // 指向常量的指针 顶层const
int* const p3 = &v; // 常量指针 底层const
const int* const p4 = p3; // 左边const修饰int，右边修饰const int*
// *p1 = 2; 错误
p1 = &v2;
// *p2 = 2; 错误
p2 = &v2;
*p3 = 2;
// p3 = &v2; 错误
```

另外，引用如果类型不同，编译器会引入 temp 变量：

```cpp
double d = 3.14;
const int &v = d;

// =>
double d = 3.14
const int temp = d;
const int &v = temp;

// 但如果是 非常量引用
double d = 3.14;
int &v = d;
// =>
double d = 3.14;
const int temp = d;
int& v = temp; // 错误，非常量引用应当被认为是可以修改值的

```

### constexpr

常量表达式（const expression）是指值不会改变并且在编译过程就能得到计算结果的表达式。

```cpp
const int max_files = 20; // max_files 是常量表达式
const int limit = max_files + 1; // limit 是常量表达式
int staff_size = 27; // staff_size 不是常量表达式
const int sz = get_size(); // sz 不是常量表达式
```

C++ 11 引入了 constexpr 关键字，让编译器来验证变量是否是常量表达式：

```cpp
constexpr int mf = 20; // 20 是常量表达式
constexpr int limit = mf + 1; // mf + 1 是常量表达式
constexpr int sz = size(); // 只有 size 是constexpr函数时，才不会报错
```

constexpr 指针可以指向：

- nullptr 或 0
- 存储于固定地址的对象，即函数外对象，函数内对象地址不固定

```cpp
int a = 1;
int main(){
	int b = 2;
	constexpr int *p = &a; // 合法
	constexpr int *p2 = &b; // 错误
	constexpr int *p3 = nullptr; // 合法
}
```

## 处理类型

### 类型别名

typedef

```cpp
typedef double wages; // wages == double
typedef wages base, *p; // base == double, p == double*
```

using

```cpp
using wages = double; // wages == double
using base = wages; // base == double
using p = double*; // p == double*
```

typedef 的修饰问题：

```cpp
typedef char *pstring;
const pstring cstr = 0; // const 这时修饰的是char *
const char *cstr2 = 0; // const 修饰的是char
```

### auto

auto 可以用于自动推断变量的类型，但是不能用于函数参数和函数返回值。

```cpp
auto a = 1, *p = &a; // auto == int
auto b = 1, c = 3.14; // 错误，auto不能推断多种类型

int a = 1, &r = a;
auto b = r; // auto == int，使用引用时本质上是使用引用的对象

// auto 一般会忽略顶层const，底层const会保留
const int a = 1;
auto b = a; // auto == int
const int &c = 2;
auto d = c; // auto == int
auto e = &a; // auto == int*

const auto f = a; // 保留顶层const需要显式声明
auto& g = 1; // 错误，引用必须绑定变量
```

### decltype

decltype 用于获取表达式的类型，但是不会执行表达式。

```cpp
int a = 1, &b = a;
decltype(a) c = 1; // c == int
decltype(b) d = a; // d == int&
int sum();
decltype(sum()) e; // e == int，sum()不会被执行
```

decltype 有两个点需要特别注意：

- (i) 会被考虑为一种作为赋值语句左值的表达式，因此 decltype((i))得到的类型是引用，而 decltype(i)得到的类型是 i 本身的类型。
- 如果表达式是解引用操作，则 decltype 将得到引用类型。

```cpp
int i = 42, *p = &i, &r = i;
decltype(r + 0) b; // int
decltype(*p) c; // int&
decltype((i)) d; // int&
```
