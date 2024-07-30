---
title: C++ Primer 4.表达式
---

## 基础

### 基本概念

我们使用重载运算符时，其包括运算对象的类型和返回值的类型，都是由该运算符定义的。但是运算对象的个数、运算符的优先级和结合律都是无法改变的。

```cpp
class A{
public:
	int a;
	int b;
	A(int a):a(a){}
	A operator+(const A &b){
		return A(a*b.a); // 反过来使用乘法
	}
	A operator*(int b){
		return A(a+b); // 反过来使用加法
	}
};

ostream &operator<<(ostream &os, const A &a){
	os << a.a;
	return os;
}

A a(1);
A b(2);
cout << a + b * 3 << endl; // 5
```

当一个对象被用作右值的时候，用的是对象的值（内容），当对象被用作左值的时候，用的是对象的身份（在内存中的位置）。左值可以当作右值使用，但是右值不能当作左值使用。

```cpp
int a = 1; // a 是左值
int b = a; // a 是右值
int *p = &a; // a 是左值
int arr[] = {1,2,3};
int *p2 = arr; // arr 是右值
int v = *p2; // v 是左值
int v2 = arr[1]; // v2 是左值
int v3 = a++; // v3 是左值
decltype(*p2) v4; // int &
decltype(&p2) v5; // int **
```

对于含有多个运算符的复杂表达式来说，要想理解它的含义首先要理解运算符的优先级(precedence)、结合律(associativity)以及运算对象的求值顺序（order of evaluation）。

- 优先级决定不同级运算符的运算顺序
- 结合律决定相同级运算符的运算顺序
- 求值顺序是未定义的

```cpp
int f(){
	return 1;
}
int g(){
	return 2;
}
int h(){
	return 3;
}
int a = f() + g() * h() + 4; // 11

// 优先级决定了先乘后加
// 结合律决定了从左到右
// 求值顺序是未定义的，意味着这三个函数的调用顺序是未定义的
```

不过，C++中有以下运算符的求值顺序是确定的：

- &&
- ||
- ,
- ? :

```cpp
int f(){
	cout<<"f"<<endl;
	return 0;
}
int g(){
	cout<<"g"<<endl;
	return 1;
}
int h(){
	cout<<"h"<<endl;
	return 2;
}

int a = f() && g();  // f a=0
int b = g() && h(); // g h b=1
int c = f() || g(); // f g c=1
int e = g() || h(); // g   e=1
int m = (f(), g());  // f g   m=1
int n = f() ? g() : h(); // f h n=2
int l = g() ? f() : h(); // g f l=0

```

介于这种求值顺序的不确定性，我们应该避免在表达式中写入并读取同一个对象。

## 算术运算符

```cpp
m + n; // 加法
m - n; // 减法
m * n; // 乘法
m / n; // 除法
m % n; // 取模
+m; // 一元取正
-m; // 一元取负
```

- 算术运算符都是左结合的
- 小整数类型的运算对象被提升成较大的整数类型，所有运算对象最终会转换成同一类型。

```cpp
int i = 1024;
int k = -i; // -1024
bool b = true;
bool b2 = -b; // true b在运算前被转换成int类型
```

### 除法运算

除数运算，商一律向 0 取整，即舍弃小数部分。

```cpp
int i = 10;
int j = -10;
int a = i / 3; // 3
int b = j / 3; // -3
int c = i / -3; // -3
int d = j / -3; // 3
```

### 取模运算

- 参与取模运算的运算对象必须是整数类型
- 取模运算的符号由被取模数决定

```cpp
int i = 21;
double d = 3.14;
int j = i % 4; // 1
d % 3; // 错误，浮点数不能取模

21 % 8; // 5
21 % -8; // 5
-21 % 8; // -5
-21 % -8; // -5
```

## 逻辑和关系运算符

```cpp
m == n; // 等于
m != n; // 不等于
m < n; // 小于
m > n; // 大于
m <= n; // 小于等于
m >= n; // 大于等于

!m; // 逻辑非
m && n; // 逻辑与
m || n; // 逻辑或
```

- && 和 || 遵循短路求值规则，即只有在必要的情况下才会对右侧的运算对象求值。
- 值为 0（整数或指针）的运算对象被认为是假的，反之为真。
- 关系运算符满足左结合律。

```cpp
int val = 1;
if(val){...} //编译器也会将val转换成bool类型
if(val == true){...} // 编译器会将true转为val的类型，如果val不是bool类型，不要这样写
```

## 赋值运算符

- 赋值运算符满足右结合律，且结果返回左侧对象，所以支持连续赋值。
- 复合赋值运算符等价于 a = a op b，不过使用复合赋值运算符只求值一次，而分开写则求值两次。
- 赋值运算符右侧对象类型如果与左侧不同，会发生隐式类型转换。

```cpp
int i, j, k = 0; // 初始化，而非赋值
i = j = k = 0; // 连续赋值
i += j; // i = i + j
int d = 3.14;
i = d; // 类型转换，i = 3
```

赋值运算符的优先级比较低，通常都需要加括号。

```cpp
int i;
while((i = get_value()) != 42){...}
```

## 递增和递减运算符

```cpp
i++; // 后置递增，返回原值
++i; // 前置递增，返回递增后的值
```

- 尽可能使用前置版本，因为前置版本不需要保存原值，效率更高。尤其是在复杂的迭代器类型中，因为没有了编译器的优化，会更加明显。

```cpp
*pbeg++ // 等价于*(pbeg++)
```

- 运算对象求值顺序未定义，容易出现问题：

```cpp
while(beg != s.end() && !isspace(*beg)){
    *beg = toupper(*beg++); // 编译器可能先求左侧，也可能先求右侧
}
```

## 成员访问运算符

- ptr->mem 等价于 (\*ptr).mem
- 写作(\*ptr).mem 的时候，圆括号是必须的，因为成员访问运算符的优先级比解引用运算符低。

## 条件运算符

条件运算符满足右结合律，即 a ? b : c ? d : e 等价于 a ? b : (c ? d : e)。

## 位运算符

```cpp
a << 2; // 左移
a >> 2; // 右移
~a; // 按位取反
a & b; // 按位与
a | b; // 按位或
a ^ b; // 按位异或 同0反1
```

- 右侧的运算对象一定不能为负，而且值必须严格小于结果的位数，否则就会产生未定义的行为。
- 位运算符会对运算的对象的类型进行提升，然后再进行运算。
- 移位运算符满足左结合律。

### 移位运算

意味运算左移会往后加 0，而右移分为逻辑右移和算术右移。其中逻辑右移会往前加 0，而算术右移会往前加符号位。具体使用哪种类型取决于是无符号数还是有符号数。

![alt text](image-2.png)

## sizeof 运算符

- sizeof 满足右结合律
- sizeof 返回的是一个 size_t 类型的值，这是一种无符号类型
- sizeof 修饰类型需要加括号，修饰对象不需要加括号

```cpp
struct Sales_data{
	unsigned units_sold = 0; // 4
	double revenue = 0.0; // 8
};
Sales_data data, *p;
sizeof(Sales_data); // 16
sizeof data; // 16
sizeof p; // 8
sizeof *p; // 16
sizeof data.revenue; // 8
sizeof Sales_data::revenue; // 8

int arr[] = {1,2,3,4,5};
int *ptr = arr;
sizeof(arr); // 20
sizeof(ptr); // 8
sizeof(*ptr); // 4
sizeof(arr) / sizeof(*arr); // 5
```

## 逗号运算符

- 逗号运算符，求值顺序确定，从左往右
- 逗号表达式的返回值是最右侧表达式的值

```cpp
int f(){
    cout<<"f"<<endl;
    return 1;
}
int g(){
    cout<<"g"<<endl;
    return 2;
}
int i = (f(), g()); // f g i=2
```

## 类型转换

### 隐式类型转换

```cpp
short a = 123;
int b = a + 1; // 大多数表达式中比int小的整数类型会被提升为较大的整数类型
if(a){...} // 条件中的值会被转换成bool类型
int c = 3.14; // 初始化语句中，初始值会被转换成变量的类型
c = 3.14; //赋值语句中，右侧值会被转换成左侧变量的类型
int d = 3.14 + 1; // 算术或关系运算中，参与运算的值会被转换成相同的类型
void f(int);
f(3.14); // 实参会被转换成形参的类型
```

### 算术转换

```cpp
long double ld = 3.1415926536;
int a = 5;
cout<<(ld+a)<<endl; // 8 算术运算对象将会被转换成最宽的类型
```

整数提升：

- 类型提升为“提升顺序”中刚好能容纳的类型
- bool、char、signed char、unsigned char、short 、unsigned short 的提升顺序为 int -> unsigned int
- wchar_t、char16_t、char32_t 的提升顺序为 int -> unsigned int -> long -> unsigned long -> long long -> unsigned long long

无符号类型和有符号类型转换：

- 首先进行整数提升
- 可以简单的把同等大小的无符号类型认为比有符号类型大，所以除非有符号类型比无符号类型实际的长度要大，否则有符号类型会被转换成无符号类型。

```cpp
bool flag;
char cval;
short sval;
unsigned short usval;
int ival;
unsigned uival;
long lval;
unsigned long ulval;
float fval;
double dval;

3.14159L + 'a'; // char -> int -> long double
dval + ival; // int -> double
dval + fval; // float -> double
ival = dval; // 截断，double -> int
flag = dval; // 0/1，double -> bool
cval + fval; // char -> int -> float
sval + cval; // char -> int|short -> int
cval + lval; // char -> long
ival + ulval; // int -> unsigned long
usval + ival; // 如果int比unsigned short大，那么unsigned short -> int，否则int -> unsigned short
uival + lval; // 如果long比unsigned大，那么unsigned -> long，否则long -> unsigned
```

### 其他的隐式类型转换

数组：

```cpp
int arr[10];
int *p = arr; // 通常数组会转换成指向首元素的指针

// 但是下面的情况不会发生隐式转换
sizeof(arr); // 40
decltype(arr); // int[10]
typeid(arr).name(); // A10_i
&arr; // int(*)[10]
```

指针：

```cpp
int i = 42;
int* p = nullptr; // nullptr/0 可以转换成任意指针类型
void *p = &i; // 任何非常量对象的地址都能转换成void*
const void *p = &i; // 任何对象的地址都能转换成const void*
const int *p = &i; // 非常量地址转为常量地址
const int& r = i; // 非常量引用转为常量引用
```

### 强制类型转换

- static_cast
  static_cast 任何具有明确定义的类型转换，只要不包含底层 const

  ```cpp
  int i = 42;
  double d = static_cast<double>(i);
  void *p = &d;
  double *dp = static_cast<double*>(p);
  ```

- const_cast
  const_cast 只能改变底层 const，不能改变顶层 const

  ```cpp
  const char *p = "Daniel";
  char *p2 = const_cast<char*>(p);
  // *p = 'd'; // 错误
  *p2 = 'd'; // 正确
  char* p3 = static_cast<char*>(p); // 错误，static_cast不能改变底层const
  ```

- reinterpret_cast
  reinterpret_cast 为运算对象的位模式提供较低层次上的重新解释，其本质上依赖于机器。要想安全地使用 reinterpret cast 必须对涉及的类型和编译器实现转换的过程都非常了解。大多数情况下，使用 reinterpret_cast 都是危险的。

  ```cpp
  int *ip;
  long *lp = reinterpret_cast<long*>(ip);
  ```

- dynamic_cast
  dynamic_cast 动态类型转换，只能用于含有虚函数的类，在基类和派生类之间的转换。

  ```cpp
  class Base{
  public:
  	virtual ~Base() = default;
  };
  class Derived : public Base{
  public:
  	virtual ~Derived() = default;
  };
  Base *bp = new Derived;
  Derived *dp = dynamic_cast<Derived*>(bp);
  ```

## 运算符优先级表

![Alt text](image.png)
![Alt text](image-1.png)
