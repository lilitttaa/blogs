---
title: C++ Primer 7.类
---

## 定义抽象数据类型

- 定义在类内部的函数是隐式的 inline 函数
- this 指针是一个常量指针，不允许改变指向的对象
- const 成员函数，可以看作是修饰 this 指针的底层 const，因此 this 这时候是一个指向常量的常量指针

```cpp
class Sales_data {
public:
	std::string isbn() const { return bookNo; } // 隐式内联，const成员函数
	Sales_data& combine(const Sales_data&);
	double avg_price() const;
private:
	std::string bookNo;
	unsigned units_sold = 0;
	double revenue = 0.0;
};

Sales_data::Sales_data& combine(const Sales_data& rhs) {...}
double Sales_data::avg_price() const {...} //类外定义也要写const

Sales_data total;
total.isbn(); // 调用isbn函数 可以看作Sales_data::isbn(&total)
```

### 与类相关的非成员函数

- 通常把函数的声明和定义分离开来
- 一般来说，如果非成员函数是类接口的组成部分，则这些函数的声明应该与类在同一个头文件内。

```cpp
Sales_data add(const Sales_data&, const Sales_data&);
```

### 构造函数

- 构造函数的任务是初始化类对象的数据成员，无论何时只要类的对象被创建，就会执行构造函数。
- 构造函数没有返回值
- 构造函数不能被声明为 const

```cpp
class Sales_data {
public:
	Sales_data() = default; // 默认构造函数
	Sales_data() const; // 错误，构造函数不能是const的
	Sales_data(const std::string &s) : bookNo(s) { } // 构造函数
	Sales_data(const std::string &s, unsigned n, double p) : bookNo(s), units_sold(n), revenue(p*n) { } // 构造函数
	Sales_data(std::istream &); // 构造函数
	...
}
```

- 默认构造函数无需任何实参
- 如果没有显示定义构造函数，编译器会自动生成一个合成默认构造函数。
  - 如果存在类内初始值，使用类内初始值初始化成员
  - 否则，执行默认初始化（内置类型通常是未定义）
- 除了非常简单的类，尽量不要依赖于合成默认构造函数：
  - 如果定义了其他构造函数，编译器不会再生成默认构造函数，这时候类就没有默认构造函数了
  - 对于一些内置类型、数组、指针来说默认初始化是未定义的
  - 如果类的成员没有默认构造函数，那么类的默认构造函数就无法初始化这些成员
- 没有被初始化列表覆盖的成员同样会按照类内初始化->默认初始化的顺序初始化

```cpp
class Sales_data {
	int a = 0;
	int b;
}
Sales_data item; // a = 0, b = 未定义

class A{
	A(int){} // 隐式删除默认构造函数
}
class B{
	B() = default;
	A a; // 错误，A没有默认构造函数
	int* p; // 未定义
}
class C{
	C() : a(0) {} // a = 0，b = 未定义，c = 0
	int a;
	int b;
	int c = 0;
}
```

## 访问控制与封装

- public：在整个程序内可访问
- private：只能被类的成员函数访问
- class 和 struct 的唯一区别是默认访问权限
  - class 默认是 private
  - struct 默认是 public

```cpp
class A{
	int a; // 默认是private
public:
	int b;
private:
	int c;
}
struct B{
	int a; // 默认是public
public:
	int b;
private:
	int c;
}
A a;
a.a; // 错误
a.b; // 正确
```

- 友元函数：可以访问类的私有成员
- 一般来说,最好在类定义开始或结束前的位置集中声明友元。

```cpp
class Sales_data {
	friend Sales_data add(const Sales_data&, const Sales_data&);// 只是友元函数声明，不是真的函数声明
	friend class A;
private:
	std::string bookNo;
	unsigned units_sold = 0;
	double revenue = 0.0;
}

Sales_data add(const Sales_data& a, const Sales_data& b) {
	Sales_data sum;
	sum.units_sold = a.units_sold + b.units_sold; // 可以访问私有成员
	return sum;
}
class A{
public:
	void print(const Sales_data& a) {
		std::cout << a.bookNo << std::endl; // 可以访问私有成员
	}
}
```

封装有两个重要的优点:

- 确保用户代码不会无意间破坏封装对象的状态。
- 被封装的类的具体实现细节可以随时改变，而无须调整用户级别的代码。

## 类的其他特性

### 类成员再探

类内类型别名：

- 类内类型别名受到访问控制的限制
- 与成员变量不同，必须先定义在使用

```cpp
class A{
public:
	using size_type = std::string::size_type;
	// typedef std::string::size_type size_type; // 与上面等价
	size_type size() const;
}
```

- 定义在类内部的成员函数是自动 inline 的
- 在声明和定义的地方同时说明 inline 是合法的。不过，最好只在类外部定义说明 inline，这样可以使类更容易理解
- 和我们在头文件中定义 inline 函数的原因一样，inline 成员函数也应该与相应的类定义在同一个头文件中。

```cpp
class A{
public:
	void print() const;
	void add(int a) { b += a; } // 隐式内联
}
inline void A::print() const {
	std::cout << "Hello, world!" << std::endl;
}
```

mutable 永远是可修改的，即便是：

- 是在 const 成员函数中
- 在 const 对象中

```cpp
class Screen {
public:
	void some_member() const;
private:
	mutable size_t access_ctr;
}
void Screen::some_member() const {
	++access_ctr;
}

const Screen myScreen;
myScreen.some_member();
```

c++11 中，如果类的数据成员如果总是需要有一个默认值，最好是使用类内初始值：

```cpp
class A{
	int a = 0;
	int b{0}; // 与上面等价
	int c(0); // 错误，只能使用 = 或者 {}
};
```

### 返回 \*this 的成员函数

```cpp
class Screen {
public:
	Screen& set(char c) {
		contents[cursor] = c;
		return *this;
	}
	Screen& move(std::size_t r, std::size_t c) {
		cursor = r * width + c;
		return *this;
	}
private:
	std::string contents;
	std::string::size_type cursor;
	std::string::size_type height, width;
}
Screen myScreen;
myScreen.set('#').move(4, 0); // 链式调用
```

### 类类型

- 即使两个类的成员列表完全一致,它们也是不同的类型。
- 前向声明定义了一个不完全类型
  - 可以定义指向这种类型的指针或引用
  - 可以声明（但不能定义）以不完全类型作为参数或返回类型的函数

### 友元再探

- 友元不具有传递性
- 重载函数每个都是单独的函数，需要分别声明为友元
- 友元函数可以定义在类内部
- 声明类的成员函数作为友元比较麻烦，只能按照下面的顺序写：

  ```cpp
  class Window_mgr {
  public:
  	void clear(ScreenIndex); // 需要先声明，这样友元才能声明
  	...
  }
  class Screen {
  	friend void Window_mgr::clear(ScreenIndex); // 声明友元
  	int width, height;
  }

  void Window_mgr::clear(ScreenIndex i) {
  	Screen &s = screens[i];
  	s.contents = std::string(s.height * s.width, ' '); // 需要声明友元后才能访问私有成员
  }
  ```

## 类的作用域

类中定义的类型，在外部需要加上作用域访问符：

```cpp
class A{
public:
	typedef double money;
	money add(money a, money b);
};
A::money A::add(money a, money b) { // 参数和函数体都在类的作用域内，返回值在外边需要加上作用域访问符
	money sum = a + b;
	return sum;
}
int main() {
    A a;
    A::money b = 0.0; // 加上作用域访问符
    A::money c = a.add(b,1.2);
    std::cout<<c<<std::endl;
}
```

名字查找：

- 在名字当前块中寻找，只考虑名字使用之前的声明
- 继续查找外层作用域
- 找不到报错

类的查找有点区别：

- 编译器处理完类中的全部声明后才会处理成员函数的定义。
- 如果成员使用了外层作用域中的某个名字，而该名字代表一种类型，则类不能在之后重新定义该名字:

```cpp
int a = 1;
typedef double money;
class A{
public:
    money a = 2.1;
    void print(money m){
        std::cout<<m<<std::endl;
    }
    typedef int money; // 错误，declaration of ‘typedef int A::money’ changes meaning of ‘money’ [-fpermissive]
    void print2(money m){
        std::cout<<m<<std::endl;
    }
};
```

类内定义的作用域名字查找：

- 在成员函数中使用前的声明
- 在类内部查找
- 在外部查找
- 如果定义在外边，在外部查找以函数体前面的声明为准

```cpp
class Screen{
public:
	typedef std::string::size_type pos;
	pos height;
	void setHeight(pos p);
};
int height;
void Screen::setHeight(pos p) {
	height = p;
}
```

## 构造函数再探

### 构造函数初始值列表

- 初始化成员的顺序与它们在类中定义的顺序一致
- 如果是 const、引用、没有默认构造函数的类类型，必须使用初始化列表或者类内初始化，而不是赋值

```cpp
class Sales_data {
private:
	unsigned units_sold = 0;
	std::string bookNo;
	double revenue = 0.0; // 初始化顺序为units_sold, bookNo, revenue
public:
	Sales_data(const std::string &s, unsigned n, double p) : bookNo(s), units_sold(n) { // 初始化
			revenue = p * n; // 赋值，revenue会在执行函数体之前被默认初始化
	 }
};
```

### 委托构造函数

```cpp
class Sales_data {
public:
	Sales_data(std::string s, unsigned cnt, double price) : bookNo(s), units_sold(cnt), revenue(cnt * price) { } // 执行委托构造后，再执行函数体
	Sales_data() : Sales_data("", 0, 0) { }
	Sales_data(std::string s) : Sales_data(s, 0, 0) { }
	Sales_data(std::istream &is) : Sales_data() { read(is, *this); } // 支持嵌套
};
```

### 默认构造函数的作用

对象被默认初始化或者值初始化时，会调用默认构造函数（包括构造函数所有参数都有默认值）。

使用默认初始化的场景：

- 非静态局部变量没有初始化
- 类内的类类型成员使用合成默认构造函数初始化
- 类类型的成员没有在构造函数初始值列表中显式地初始化时

使用值初始化的场景：

- 数组初始化时初始化值数量少于数组元素数量
- 静态局部变量没有初始化
- T()显示初始化，T 为类型，例如：vector<> v(10); // 10 个元素，值初始化

```cpp
class B{};
class A{
public:
	A() = default;
	A(int a) : a(a) {}
	int a;
	B b; // 使用合成默认构造函数初始化 默认初始化
};


void f() {
	int a; // 默认初始化
	static int b; // 值初始化
	int arr[5] = {1, 2}; // {1, 2, 0, 0, 0} 值初始化
	vector<int> v(10); // 10个元素，值初始化为0
	vector<A> va(10); // 10个元素，值初始化为A的默认构造函数
}
```

常见的错误：

```cpp
Sales_data item(); // 错误，声明了一个函数
Sales_data item; // 正确，调用默认构造函数
```

### 隐式的类类型转换

- 如果构造函数只接受一个实参，则它实际上定义了转换为此类类型的隐式转换机制，有时我们把这种构造函数称作转换构造函数
- 只允许一步类型转换

```cpp
class Sales_data {
public:
	Sales_data() = default;
	Sales_data(const std::string &s) : bookNo(s) { }
	Sales_data(const unsigned &n) : units_sold(n) { }
	void Combine(const Sales_data &rhs) { units_sold += rhs.units_sold; revenue += rhs.revenue; }
	unsigned units_sold = 0;
	double revenue = 0.0;
	std::string bookNo = "";
}

Sales_data item;
item.Combine(10); // 隐式转换
item.Combine("9-999-99999-9"); // 错误，两步转换
item.Combine(string("9-999-99999-9")); // 正确
```

可以使用 explicit 关键字阻止隐式转换：

- explicit 只对一个实参的构造函数有效
- 使用 explict 后，只能进行直接初始化，不能进行拷贝初始化
- explicit 放在类内声明处，不要放在类外定义处

```cpp
class Sales_data {
public:
	explicit Sales_data(const std::string &s) : bookNo(s) { }
	explicit Sales_data(const unsigned &n) : units_sold(n) { }
}
Sales_data item;
item.Combine(10); // 错误，不能隐式转换
item.Combine(string("9-999-99999-9")); // 错误，不能隐式转换
item.Combine(Sales_data(string("9-999-99999-9"))); // 正确

string null_book = "9-999-99999-9";
Sales_data item1(null_book); // 可以直接初始化
Sales_data item2 = null_book; // 错误，不能拷贝初始化
```

### 聚合类

聚合类满足以下条件：

- 所有成员都是 public
- 没有定义任何构造函数
- 没有类内初始值
- 没有基类，没有 virtual 函数

```cpp
struct Data {
	int ival;
	std::string s;
	float fval;
}

Data val1 = {0, "Anna"}; // 聚合类可以使用花括号列表初始化，fval执行值初始化
```

### 字面值常量类

constexpr 函数的返回值和形参必须是字面值类型，类也可以是字面值类型，要求：

- 数据成员都是字面值类型
- 类必须至少含有一个 constexpr 构造函数
- 如果一个成员变量有初始值，则初始值必须是常量表达式，如果是类，则必须调用 constexpr 构造函数
- 必须使用默认的析构函数

```cpp
class Debug {
public:
	constexpr Debug(bool b = true) : hw(b), io(b), other(b) { } // constexpr 构造函数一般函数体是空的
	constexpr Debug(bool h, bool i, bool o) : hw(h), io(i), other(o) { }
	constexpr bool any() { return hw || io || other; }
	void set_io(bool b) { io = b; }
	void set_hw(bool b) { hw = b; }
	void set_other(bool b) { other = b; }
private:
	bool hw;
	bool io;
	bool other;
}

constexpr Debug io_sub(false, true, false);
if (io_sub.any()) { ... }
```

## 类的静态成员

- 静态成员可以是 public 的或 private 的
- 静态成员函数不包含 this 指针。因此不能声明成 const 的，也不能在 static 函数体内使用 this 指针
- 要想确保对象只定义一次，最好的办法是把静态数据成员的定义与其他非内联函数的定义放在同一个文件中

访问方式：

```cpp
class A {
public:
    static int a;
    static void print();
    void printObj() { A::print(); } // 成员函数调用静态成员函数
};
int A::a = 0; // static关键词只出现类内部的声明中，类外部必须做初始化
void A::print() { std::cout << a << std::endl; }

int main() {
    A::a = 2;
    A::print();  // 通过类名调用静态成员函数
    A a;
    a.print(); // 通过对象调用静态成员函数
    a.printObj();
    return 0;
}
```

有特殊情况，静态成员变量可以进行类内初始化：

- 字面值常量类型的 constexpr
- 初始值必须是常量表达式

```cpp
class A {
public:
	static constexpr int a = 30; // 仅用于编译器可以替换的值，外部可以不用定义了
	double data[a];
};
constexpr int A::a; //但如果外面还有其他使用，则需要定义
void print(const int& a) {
	std::cout<<a<<std::endl;
}
int main() {
    print(A::a);
    return 0;
}
```

特殊性：

- 静态成员变量可以使用不完全类型
- 静态成员变量可以作为默认值

```cpp

class B;
class A {
public:
	static B sb; // 使用不完全类型
	static A sa;
	int n = 1;
	void print(A a = sa){ // 作为默认值
		std::cout<<a.n<<std::endl;
	}
};
class B{};

B A::sb;
A A::sa;

int main() {
    A a;
    a.print();
}
```
