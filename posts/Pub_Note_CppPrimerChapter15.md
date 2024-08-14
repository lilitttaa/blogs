---
title: C++ Primer 15.面向对象程序设计
---

## OOP 概述

OOP 的核心是：

- 数据抽象：类的接口与实现分离
- 继承：定义相似关系，并对相似关系建模
- 动态绑定：一定程度上忽略对象的区别，以统一的方式使用对象

在 C++中，基类分别对待两类函数：

- 如果希望派生类各自定义适合自身的版本，基类就将这些函数声明成虚函数
- 反之，如果希望派生类直接使用基类的版本，基类就将这些函数声明成非虚函数

```cpp
class Quote
{
public:
	std::string isbn() const; // 非虚函数
	virtual double net_price(std::size_t n) const; // 虚函数
};

class Bulk_quote : public Quote
{
public:
	double net_price(std::size_t n) const override; // 覆盖基类的虚函数
};
```

- 动态绑定：在运行时选择调用哪个版本的函数。
- 当我们使用基类的指针或引用调用虚函数时将发生动态绑定。

```cpp

double print_total(std::ostream &os, const Quote &item, std::size_t n)
{
	double ret = item.net_price(n);
	os << "ISBN: " << item.isbn() << " # sold: " << n << " total due: " << ret << std::endl;
	return ret;
}

Quote base("0-201-82470-1", 50);
Bulk_quote derived("0-201-82470-1", 50, 5, .19);
print_total(std::cout, base, 10); // 调用 Quote::net_price
print_total(std::cout, derived, 10); // 调用 Bulk_quote::net_price
```

## 定义基类和派生类

### 定义基类

- 基类通常都应该定义一全虚析构函数，即使该函数不执行任何实际操作。
- 任何构造函数之外的非静态函数都可以是虚函数。
- virtual 只能出现在类内部的声明语句之前而不能用于类外部的函数定义。
- 如果基类把一个函数声明成虚函数，则该函数在派生类中隐式地也是虚函数。
- 派生类可以访问 public、protected 成员，但不能访问 private 成员。

```cpp
class Quote
{
public:
	Quote() = default;
	Quote(const std::string &book, double sales_price) : bookNo(book), price(sales_price) {}
	std::string isbn() const { return bookNo; }
	virtual double net_price(std::size_t n) const { return n * price; } // 虚函数
	virtual ~Quote() = default; // 虚析构函数
private:
	std::string bookNo;
protected:
	double price = 0.0; // 保护成员
};
```

### 定义派生类

- 派生类通过派生列表指明其基类。
- 三种继承方式：
  - public
  - protected
  - private
- 如果派生类没有覆盖其基类中的某个虚函数，则该虚函数的行为类似于其他普通成员，派生类会直接继承其在基类中的版本
- 派生类可以在它覆盖的函数前使用 virtual 关键字，但不是非得这么做。
- 可以使用 override 显式地注明覆盖了某个继承的虚函数，需要在形参列表后（const 和&后）写上 override。

```cpp
class Bulk_quote : public Quote // public 继承
{
public:
	Bulk_quote() = default;
	Bulk_quote(const std::string &book, double sales_price, std::size_t qty, double disc) : Quote(book, sales_price), min_qty(qty), discount(disc) {}
	double net_price(std::size_t n) const override; // 覆盖基类的虚函数
private:
	std::size_t min_qty = 0;
	double discount = 0.0;
};
```

- 一个派生类对象包含多个组成部分：
  - 派生类自己定义的（非静态）成员的子对象
  - 该派生类继承的基类对应的子对象（可以是多个）
- C++标准没有规定派生类的对象的内存分布，但是认为它包含这两个部分（实际上基类部分跟派生类部分不一定是连续存储的）：
  ![Alt text](image.png)
- 因为派生类包含基类子对象，所以可以进行类型转换
- 编译器会隐式的执行派生类到基类的类型转换（只对指针或引用有效）

```cpp
Bulk_quote bulk;
Quote *itemP = &bulk; // 派生类到基类的类型转换
Quote &itemR = bulk; // 派生类到基类的类型转换
```

- 派生类的构造函数委托基类的构造函数完成基类部分的初始化
- 如果没有显式地初始化基类部分，则会使用默认构造函数初始化基类部分
- 首先初始化基类的部分，,然后按照声明的顺序依次初始化派生类的成员。
- 派生类应该遵循基类的接口，通过调用基类的构造函数来初始化基类成员，而不是通过赋值基类成员的方式。

```cpp
Bulk_quote::Bulk_quote(const std::string &book, double sales_price, std::size_t qty, double disc) : Quote(book, sales_price), min_qty(qty), discount(disc) {}
```

- 不论从基类中派生出来多少个派生类，对于每个静态成员来说都只存在唯一的实例。
- 静态成员遵循通用的访问控制规则，如果基类中的成员是 private 的，则派生类无权访问它。

```cpp
class Base
{
public:
	static void statmem();
};
class Derived : public Base
{
	void f(const Derived&);
};

void Derived::f(const Derived &derived_obj)
{
	Base::statmem(); // 正确：通过 Base 调用
	Derived::statmem(); // 正确：Dervived继承自Base
	derived_obj.statmem(); // 正确：通过 Derived 对象调用
	statmem(); // 正确：通过this指针调用
}
```

- 派生类的声明不要包括派生列表。
- 如果某个类要作为基类，则它必须是完整的类型，也就是说必须得被定义。
- 使用 final 关键字可以阻止其他类继承自该类。

```cpp
// 声明
class Bulk_quote : public Quote; // 错误
class Bulk_quote; // 正确

class NoDerived final { /* ... */ }; // 不能被继承
class Last final: Base { /* ... */ }; // Last 不能被继承
```

### 类型转换与继承

- 智能指针类也支持派生类向基类的类型转换。
- 动态类型与静态类型：
  - 表达式的静态类型在编译时总是已知的，它是变量声明时的类型或表达式生成的类型。
  - 动态类型则是变量或表达式表示的内存中的对象的类型，直到运行时才能知道。
  - 例如：一个 Qutoe& item 的静态类型是 Quote&，但是它的动态类型可能是 Bulk_quote&。
  - 只有引用和指针动态类型和静态类型可能不一致。
- 不存在从基类向派生类的隐式类型转换。
- 编译器只能通过静态类型进行判断，因此无法在编译时确定某个特定的转换在运行时是否是安全的。
- 如果基类中有虚函数，可以使用 dynamic_cast 请求运行时类型转换。
- 如果已知基类到派生类的转换是安全的，可以使用 static_cast 进行强制类型转换（强制覆盖编译器的类型检查）。

```cpp
Quote item;
Bulk_quote bulk;
Quote *p = &bulk; // 正确：派生类到基类的类型转换
Bulk_quote *dp = &item; // 错误：基类到派生类的类型转换
Bulk_quote *dp2 = p; // 错误：基类到派生类的类型转换
Bulk_quote &dr = item; // 错误：基类到派生类的类型转换
```

- 使用引用的移动和拷贝操作可以传递派生类对象
- 只有该派生类对象中的基类部分会被拷贝、移动或赋值，它的派生类部分将被忽略掉

```cpp
Bulk_quote bulk;
Quote base(bulk); // 正确：拷贝构造函数
base = bulk; // 正确：拷贝赋值运算符
```

## 虚函数

- 普通的函数如果没有用到可以只声明不定义，但所有的虚函数都要有定义而不只是声明（编译器也不知道运行时调用哪个版本的函数）。
- OOP 的核心思想是多态性(polymorphism)。我们把具有继承关系的多个类型称为多态类型，因为我们能使用这些类型的“多种形式”而无须在意它们的差异。
- 一旦某个函数被声明成虚函数，则在所有派生类中它都是虚函数（即便在派生类中没有被声明为 virtual）。
- 派生类覆盖的虚函数：
  - 参数必须保持完全一致
  - 返回值通常也要保持一致，除非返回类型是类本身的指针或引用
- 虚函数自动继续函数匹配，但是可能匹配不上，使用 override 可以让编译器报错。
- 加上 final 关键字可以阻止派生类覆盖虚函数，final 和 override 一样出现在 const 和&之后。

```cpp
class Base
{
public:
	virtual Base* get_pointer() { return this; }
};

class Derived : public Base
{
public:
	Derived* get_pointer() override { return this; } // 类本身类型指针，返回类型可以不同
};
```

```cpp
struct B{
	virtual void f1(int) const;
	virtual void f2();
	void f3();
};
struct D : B{
	void f1(int) const final; // 正确，避免后续派生类覆盖
	void f2(int) override; // 错误：没有与之匹配的基类函数
	void f3() override; // 错误：基类f3不是虚函数
	void f4() override; // 错误：没有与之匹配的基类函数
};
```

虚函数可以有默认实参，但是调用使用的默认实参由静态类型决定：

```cpp
struct Base
{
	virtual void foo(int i = 10);
};

struct Derived : Base
{
	void foo(int i = 20) override;
};

Derived d;
Base *pb = &d;
pb->foo(); // 调用 Base::foo，i = 10
```

- 使用作用域限定符可以避开虚函数的动态绑定。
- 尤其是在派生类内，使用作用域限定符可以调用基类的虚函数，避免递归调用。

```cpp
pb->Base::foo(); // 调用 Base::foo，不考虑pb的实际类型
```

## 抽象基类

- 某些基类的虚函数不具备实际含义，可以定义为纯虚函数。
- 纯虚函数不需要定义，其实也可以定义，但是只能写在类外部。
- 包含纯虚函数的类是抽象基类，负责定义接口，不能创建该类的对象。
- 派生类的构造函数只初始化它的直接基类。

```cpp
class Disc_quote : public Quote
{
public:
	Disc_quote() = default;
	Disc_quote(const std::string &book, double price, std::size_t qty, double disc) : Quote(book, price), quantity(qty), discount(disc) {}
	double net_price(std::size_t) const = 0; // 纯虚函数
protected:
	std::size_t quantity = 0;
	double discount = 0.0;
};
```

## 访问控制与继承

### 受保护的成员

- 类使用 protected 关键字来声明那些它希望与派生类分享但是不想被其他公共访问使用的成员。
- 和私有成员类似，受保护的成员对于类的用户来说是不可访问的。
- 和公有成员类似，受保护的成员对于派生类的成员和友元来说是可访问的。
- 派生类的成员或友元只能通过派生类对象来访问基类的受保护成员。派生类对于一个基类对象中的受保护成员没有任何访问特权。

```cpp
class Base
{
protected:
	int prot_mem;
};
class Sneaky : public Base
{
	friend void clobber(Sneaky&);
	friend void clobber(Base&);
	int j;
};
void clobber(SneSneaky &s)
{
	s.j = s.prot_mem = 0; // 通过访问派生类对象来访问基类的受保护成员
}
void clobber(Base &b)
{
	b.prot_mem = 0; // 错误：不能直接访问基类的受保护成员
}
```

### public、protected 和 private 继承

- 继承而来的成员受两个因素影响：
  - 基类中该成员的访问说明符
  - 派生列表中该成员的访问说明符
    - 不影响派生类自身对于基类成员的访问权限
    - 影响派生类的派生类和派生类的用户的访问权限

```cpp
class Base
{
public:
	void pub_mem();
protected:
	int prot_mem;
private:
	char priv_mem;
};

class Pub_Derv : public Base
{
	int f() { return prot_mem; } // 正确：可以访问 Base 的 protected 成员
	char g() { return priv_mem; } // 错误：不能访问 Base 的 private 成员
};

class Priv_Derv : private Base // 基类的所有成员在派生类中都变成private了
{
	int f1() const { return prot_mem; } // 正确：private继承不影响访问基类的 protected 成员
};

class Prot_Derv : protected Base // 基类的所有成员在派生类中都变成protected了
{
	int f2() { return prot_mem; } // 正确：protected继承不影响访问基类的 protected 成员
};

Pub_Derv d1;
Priv_Derv d2;
Prot_Derv d3;
d1.pub_mem(); // 正确
d2.pub_mem(); // 错误：pub_mem是private的
d3.pub_mem(); // 错误：pub_mem是protected的

class Derived_from_Public : public Pub_Derv
{
	int use_base() { return prot_mem; } // 正确
};

class Derived_from_Private : public Priv_Derv
{
	int use_base() { return prot_mem; } // 错误：Priv_Derv 的所有成员在派生类中都是 private 的
};

class Derived_from_Protected : public Prot_Derv
{
	int use_base() { return prot_mem; } // 正确
};
```

### 派生类向基类转换的可访问性

派生类像基类转换的可访问性与成员的可访问性相似：

- 友元的地位等价于类内部的地位
- 不管是 public、protected 还是 private 继承，在派生类及其友元中都可以执行向基类的转换
- 如果是 public 继承
  - 都可以转换
- 如果是 protected 继承
  - 用户不能进行向基类的转换
  - 派生类与友元及其后续的派生类中可以进行向基类的转换
- 如果是 private 继承
  - 除了派生类及其友元中，其他地方都不能进行向基类的转换
- 一个简单的技巧：如果基类的 public 成员可以访问，那么向基类的转换也是可以访问的，反之，则不行

```cpp
class Base
{
public:
	int val = 1;
};
class D1 : protected Base
{
public:
	friend void func();
};
void func()
{
	D1 d1;
	Base *pb = &d1; // 正确
}
int main()
{
	D1 d1;
	Base *pb = &d1; // 错误，不能进行向基类的转换
}
```

### 友元与继承

- 友元不能传递也不能继承
- 友元与声明类具有等价的访问权限
- 友元能够访问 Base 对象的成员，这种可访问性包括了 Base 对象内嵌在其派生类对象中的情况

```cpp
class Base{
public:
	friend class Pal;
	int pub_val = 1;
protected:
	int prot_val = 2;
private:
	int priv_val = 3;
};

class Derived : private Base{
private:
	int val = 4;
};

class Pal{
public:
	int f(Base b) { return b.priv_val; } // 正确：Pal 是 Base 的友元
	int f(Derived d) { return d.val; } // 错误：Pal 不是 Derived 的友元
	int f(Derived d) { return d.prot_val; } // 正确：访问内嵌在 Derived 中的 Base 对象的 protected 成员
};
```

### 改变继承的可访问性

- 使用 using 声明可以改变继承的可访问性
- 改变后的可访问性来自于 using 语句当前所在的访问性级别
- 派生类只能为那些它可以访问的名字提供 using 声明

```cpp
class Base
{
public:
	int pub_mem;
protected:
	int prot_mem;
private:
	int priv_mem;
};

class D1 : private Base
{
private:
	using Base::pub_mem; // 改变为 private
	using Base::priv_mem; // 错误：访问不到priv_mem
public:
	using Base::prot_mem; // 改变为 public

};
```

### 默认的继承保护级别

- class 默认是 private 继承
- struct 默认是 public 继承
- private 派生的类最好显式地将 private 声明出来，而不要仅仅依赖于默认的设置

## 继承中的类作用域

- 派生类的作用域嵌套在其基类的作用域之内。
- 如果名字在派生类的作用域内无法正确解析，则编译器将继续在外层的基类寻找。
- 对象、指针、引用的静态类型决定了哪些成员是可见的，即便动态类型和静态类型不一致。
  ```cpp
  class Base{
  };
  class D1 : public Base{
  public:
  void func(){};
  };
  D1 d1;
  Base *pb = &d1;
  pb->func(); // 错误：Base类型没有func成员
  ```

### 名字冲突与继承

- 派生类的成员将隐藏同名的基类成员
- 可以使用作用域运算符来访问被隐藏的名字
- 除了覆盖虚函数外，派生类最好不要重用其他定义在基类中的名字
- 名字查找先于类型检查：内层作用域的名字会隐藏外层作用域的名字，即使它们是不同参数的重载版本

```cpp
struct Base
{
public:
	int memfcn();
};
struct Derived : Base
{
public:
	int memfcn(int);
};
Derived d; Base b;
b.memfcn(); // 正确：调用 Base::memfcn
d.memfcn(); // 错误：没有与之匹配的函数
d.memfcn(10); // 正确：调用 Derived::memfcn
```

函数调用中的解析过程（假设调用 p->mem()或 obj.mem()）：

- 确定 p 或者 obj 的静态类型
- 在该类型的作用域中查找 mem，找不到就沿着继承链向上查找
- 找到后进行常规的类型检查（实参形参匹配等）
- 如果调用合法，检查是否是虚函数：
  - 指针和引用的虚函数调用：编译器生成代码，该代码在运行时选择正确的版本
  - 对象或者非虚函数：编译器生成一份常规的函数调用代码

### 虚函数与作用域

- 如果基类与派生类的虚函数接受的实参不同，会导致派生类将基类虚函数隐藏，无法进行多态调用。

```cpp
class Base{
public:
	virtual int fcn();
};
class D1 : public Base{
public:
	int fcn(int); // 隐藏 Base::fcn
	virtual void f2();
};
class D2 : public D1{
public:
	int fcn(int); // 非虚函数，隐藏 D1::fcn(int)
	int fcn(); // 虚函数，覆盖 Base::fcn
	void f2(); // 虚函数，覆盖 D1::f2
};

Base bobj; D1 d1obj; D2 d2obj;

Base *bp1 = &bobj, *bp2 = &d1obj, *bp3 = &d2obj;
bp1->fcn(); // 虚调用，Base::fcn
bp2->fcn(); // 虚调用，Base::fcn
bp3->fcn(); // 虚调用，D2::fcn

D1 *d1p = &d1obj; D2 *d2p = &d2obj;
bp2->f2(); // 错误：Base没有f2
d1p->f2(); // 虚调用，D1::f2
d2p->f2(); // 虚调用，D2::f2

Base *p1 = &d2obj; D1 *p2 = &d2obj; D2 *p3 = &d2obj;
p1->fcn(42); // 错误：Base没有接受int的fcn
p2->fcn(42); // 静态绑定，D1::fcn(int)
p3->fcn(42); // 静态绑定，D2::fcn(int)
```

### 覆盖重载的函数

- 派生类覆盖重载函数一般要么一个都不覆盖，要么都覆盖
- 如果只覆盖其中一部分，剩下的重载函数将被隐藏，无法进行多态调用

```cpp
class Base{
public:
	virtual int fcn();
	virtual int fcn(int);
}；

class Derived : public Base{
public:
	int fcn();
}；

Derived d;
d.fcn(1); // fcn(int) 被隐藏
```

## 构造函数与拷贝控制

### 虚析构函数

- 甚类通常应该定义一个虚析构函数
- 如果基类的析构函数不是虚函数,则 delete 一个指向派生类对象的基类指针将产生未定义的行为。
- 如果一个类定义了析构函数，即使它通过=default 的形式使用了合成的版本，编译器也不会为这个类合成移动操作。

### 合成拷贝控制与继承

- 派生类合成的函数成员负责使用**直接基类**中的对应操作对对象的直接基类部分进行初始化、赋值或销毁。
- 派生类的析构函数来说，它除了销毁派生类自己的成员外,还负责销毁派生类的直接基类。

```cpp
class Base{
public:
	Base() = default;
	Base(const Base&) = default;
	Base& operator=(const Base&) = default;
	~Base() = default;
};
class D1 : public Base{
public:
	D1() = default;
	D1(const D1&) = default;
	D1& operator=(const D1&) = default;
	~D1(){
		// ~Base() 会被自动调用
	}
};
```

派生类中删除的拷贝控制与基类的关系：

- 基类中对应的操作（默认构造、拷贝构造、拷贝赋值、析构）被删除（或无法访问），则派生类中对应的操作也会被删除（或无法访问）。
- 如果基类中的析构函数是删除（或无法访问）的，则派生类的合成的默认构造函数和拷贝构造函数也会被删除（或无法访问）。
- 基类中析构函数被删除（或无法访问），派生类中的移动操作也会被删除（或无法访问），如果基类的移动操作被删除（或无法访问），则无法通过=default 的形式生成派生类的移动操作。

```cpp
class B {
public:
    B();
    B(const B&) = delete;
};

class D: public B {
};

D d;
D d2(d);  // 错误：B 的拷贝构造函数被删除，B因此也无法拷贝构造（无法构造基类的部分）
D d3(std::move(d));  // 错误：B没有生成合成的移动构造函数，D只能调用B的拷贝构造函数，但是被删除了
```

- 大多数基类都会定义一个虚析构函数。默认情况下，基类通常不含有合成的移动操作，而且在它的派生类中也没有合成的移动操作。
- 如果确实需要移动操作，应该首先在基类中进行定义，一旦定义了移动操作，那么它必须同时显式地定义拷贝操作。

```cpp
class Quote{
public:
	Quote() = default;
	Quote(const Quote&) = default;
	Quote(Quote&&) = default;
	Quote& operator=(const Quote&) = default;
	Quote& operator=(Quote&&) = default;
	virtual ~Quote() = default;
};
```

### 派生类的拷贝控制成员

- 派生类构造函数在其初始化阶段中不但要初始化派生类自己的成员，还要初始化派生类对象的基类部分。
- 派生类的拷贝和移动构造函数在拷贝和移动自有成员的同时，也要拷贝和移动基类部分的成员。
- 派生类赋值运算符也必须为其基类部分的成员赋值。
- 但析构函数只负责销毁派生类自己分配的资源。派生类对象的基类部分是自动销毁的。

拷贝构造函数初始化：

- B(d)将对象 d 绑定到 B&的参数上，Base 的拷贝构造将使用 d 的 Base 部分来创建当前对象的 Base 部分。
- 如果没有显式地初始化基类部分，则会使用默认构造函数初始化基类部分。

```cpp
class B{...};
class D : public B{
public:
	D(const D &d) : B(d) {...} // 拷贝基类部分
	D(D &&d) : B(std::move(d)) {...} // 移动基类部分
```

赋值运算符：

```cpp
Base::operator=(const Base &rhs);
D::operator=(const D &rhs)
{
	Base::operator=(rhs); // 显式调用基类的赋值运算符
	// 处理派生类自己的成员
	return *this;
}
```

析构函数：

```cpp
D::~D()
{
	// 析构派生类自己的成员
	// Base::~Base() 会被自动调用
}

构造函数和析构函数中调用虚函数：
- 构造时先构造基类部分，再构造派生类部分
- 析构时先析构派生类部分，再析构基类部分
- 因此调用基类构造函数时，派生类部分是没有初始化的，调用基类析构函数时，派生类部分已经被销毁了
- 因此不能在基类的构造函数和析构函数中使用派生类的虚函数版本

```

### 继承的构造函数

- 通常，using 声明语句只是令某个名字在当前作用域内可见。
- 而当作用于构造函数时，using 声明语句将令编译器产生代码。对于基类的每个构造函数，编译器都生成一个与之对应的派生类构造函数。
- 类只初始化它的直接基类，出于同样的原因，类也只继承其直接基类的构造函数。类不能继承默认、拷贝和移动构造函数。
- 与普通的 using 声明不一样，一个构造函数的 using 声明并不会改变该构造函数的访问级别。也就是说，如果一个构造函数在基类中是私有的，那么通过 using 声明后在派生类中也还是私有的。
- 如果基类的构造函数是 explicit 或 constexpr，则继承的构造函数也拥有相同的属性。
- 当一个基类构造函数含有默认实参，这些实参并不会被继承，派生类会获得多个继承的构造函数，其中每个构造函数分别省略掉一个含有默认实参的形参。
- 如果派生类定义了和基类的构造函数具有相同参数列表的构造函数，则基类的该构造函数不会被继承。

```cpp
class Bulk_quote : public Quote
{
public:
	using Quote::Quote; // 继承构造函数
	double net_price(std::size_t) const override;
};

// 生成的构造函数等价于
Bulk_quote(const std::string &book, double sales_price, std::size_t qty, double disc) : Quote(book, sales_price), min_qty(qty), discount(disc) {}
```

## 容器与继承

- 当使用容器存放继承体系中的对象时，通常必须采取间接存储的方式。因为不允许在容器中保存不同类型的元素。

```cpp
vector <Quote> basket;
basket.push_back(Quote("0-201-82470-1", 50));
basket.push_back(Bulk_quote("0-201-54848-8", 50, 5, .19)); //Bulk_quote对象被切割
```

可以通过放置指针或者智能指针来解决这个问题：

```cpp
vector<shared_ptr<Quote>> basket;
basket.push_back(make_shared<Quote>("0-201-82470-1", 50));
basket.push_back(make_shared<Bulk_quote>("0-201-54848-8", 50, 5, .19));
```

不过这使得用户不得不面对智能指针，我们可以优化一下：

```cpp
class Quote{
public:
	virtual Quote* clone() const & { return new Quote(*this); }
	virtual Quote* clone() && { return new Quote(std::move(*this)); }
};

class Bulk_quote : public Quote{
public:
	Bulk_quote* clone() const & { return new Bulk_quote(*this); }
	Bulk_quote* clone() && { return new Bulk_quote(std::move(*this)); }
};

class Basket{
public:
	void add_item(const Quote &sale)
	{
		items.insert(shared_ptr<Quote>(sale.clone()));
	}
	void add_item(Quote &&sale)
	{
		items.insert(shared_ptr<Quote>(std::move(sale).clone()));
	}
private:
	...
};
```
