---
title: C++ Primer 6.函数
---

## 函数基础

### 编写函数

```cpp
int fact(int val) // 函数定义 val是形参
{
	int ret = 1;
	while (val > 1)
	{
		ret *= val--;
	}
	return ret;
}
int fact(int val); // 函数声明

int j = fact(5); // 函数调用 5是实参
```

函数定义最多只能有一个，而函数声明可以有多个。

### 函数调用的过程

- 函数的调用完成两项工作：
  - 用实参初始化函数对应的形参
  - 将控制权转移给被调用函数。此时，主调函数（calling function）的执行被暂时中断，被调函数(called function)开始执行。
- return 语句也完成两项工作：
  - 返回 return 语句中的值(如果有的话)
  - 将控制权从被调函数转移回主调函数。

### 实参和形参

尽管实参与形参存在对应关系，但是并没有规定实参的求值顺序

实参至少需要能够转换成形参的类型：

```cpp
int fact(int val);

fact("hello"); // 错误，const char* 不能转换成 int
fact(3.14); // 正确，3.14会被转换成3
fact(); // 实参数量不匹配
fact(1, 2); // 实参数量不匹配
```

```cpp
void f();
void f1(int a,b); // 错误，形参列表中每个形参都必须有一个类型说明符
void f2(void); // 正确，显示指定没有形参
void f3(int,int); // 正确，形参可以没有名字
void f4(int a,float a); // 错误，形参名字不能重复
```

### 返回值

- void 表示函数不返回任何值
- 数组类型和函数类型不能作为函数的返回类型，但是可以返回指向数组或函数的指针

### 局部对象

- 名字有作用域，对象有生命周期(lifetime)。
- 名字的作用域是程序文本的一部分，名字在其中可见。
- 对象的生命周期是程序执行过程中该对象存在的一段时间。

局部变量生命周期：

1. 自动对象：
   - 在块内定义的对象，当程序执行到定义处时创建，当块执行完毕时销毁。
   - 形参也是自动对象。
   - 局部变量如果没有被初始化，其值是未定义的。
2. 局部静态对象：
   - 在块内定义的 static 对象，只在第一次调用时初始化，直到整个程序结束才销毁。
   - 局部静态对象在程序的整个生命周期内都存在，但是只能在定义它的函数内访问。
   - 局部静态对象值如果没有被初始化，会执行值初始化，获取默认值。
   ```cpp
   void count_calls()
   {
   	static size_t ctr = 0;
   	cout << ctr << endl;
   	++ctr;
   }
   count_calls(); // 0
   count_calls(); // 1
   ```

### 函数声明

- 因为函数的声明不包含函数体，所以也就无须形参的名字。
- 函数声明应该放在头文件中，函数定义放在源文件中。

### 分离式编译

TODO

## 参数传递

函数形参可以有两种：

- 引用
- 值，指针也是一种值

### 传值

函数对形参做的所有操作都不会影响实参，指针也是一种值，不过由于它的值是一个地址，所以可以通过地址访问实参。

```cpp
void reset(int i)
{
	i = 0; // 值传递，不会改变实参的值
}

void reset(int* i)
{
	i = 0; // 值传递，不会改变实参的值
	*i = 0; // i是指针，可以通过地址修改实参的值
}
```

### 传递引用

操作引用实际上是在操作引用所绑定的对象

```cpp
void reset(int& i)
{
	i = 0; // 引用传递，会改变实参的值
}
```

- 使用引用可以避免拷贝，提高效率
- 使用引用可以返回多个值

```cpp
void multi_return(int& a, int& b)
{
	a = 1;
	b = 2;
}
int a, b;
multi_return(a, b);
```

如果不想改变实参的值，尽量使用 const 引用：

- 普通引用既可以表示传参，也可以表示返回值，会误导调用者
- 不能把 const 对象、字面值、需要类型转换的对象传递给普通的引用形参

```cpp
void is_sentence(const string& s){...}
is_sentence("hello world"); // 正确
void is_sentence(string& s){...}
is_sentence("hello world"); // 错误
```

和其他初始化过程一样，当用实参初始化形参时会忽略掉顶层 const。当形参有顶层 const 时，传给它常量对象或者非常量对象都可以，以下两个函数是重复的：

```cpp
void f(const int i);
void f(int i);
```

### 数组形参

因为数组会被转换成指针，所以当我们为函数传递一个数组时，实际上传递的是指向数组首元素的指针。以下三个函数是等价的：

```cpp
void print(const int*);
void print(const int[]);
void print(const int[10]); // 这里的10是一个提示，实际上没有用

int i = 0, j[2] = {0, 1};
print(&i);
print(j);
```

因为传递指针没有大小信息，因此通常会采用下面三种方法：

```cpp
void print(const char* begin, const char* end){
	while(begin != end){
		cout << *begin++ << endl;
	}
}

void print(const char* begin, size_t size){
	for(size_t i = 0; i < size; ++i){
		cout << begin[i] << endl;
	}
}

void print(const char* begin){ // C风格字符串，以空字符结尾
	while(*begin){
		cout << *begin++ << endl;
	}
}
```

数组引用形参，写作 const int (&arr)[10] 而不是 const int &arr[10]：

```cpp
void print(const int (&arr)[3]){ // 数组的大小也是构成数组类型的一部分
	for(auto i : arr){
		cout << i << endl;
	}
}
int i[] = {0,1};
int j[] = {0,1,2};
print(i); // 错误，数组大小不匹配
print(j); // 正确
```

### 多维数组

C++ 中没有真正的多维数组，多维数组是数组的数组。因此同样的，多维数组的形参本质上是指向数组的指针。

```cpp
void print(int (*matrix)[10], size_t rowSize){ // 必须指定除第一维外的所有维度
	for(size_t i = 0; i < rowSize; ++i){
		for(size_t j = 0; j < 10; ++j){
			cout << matrix[i][j] << endl;
		}
	}
}
```

再次区别一下：

```cpp
int* matrix[10]; // 指针数组，每个元素都是指针
int (*matrix)[10]; // 指向数组的指针
```

### main 函数

```cpp
int main(int argc, char* argv[]){...}
int main(int argc, char** argv){...} // 因为数组会被转换成指针，所以这两种写法是等价的
```

- argc 是命令行参数的数量（不包括 argv[0]）
- argv 是一个指针数组，每个元素都是一个指向 C 风格字符串的指针，其中 argv[0] 是程序名

### 含有可变形参的函数

```cpp
#include <iostream>
#include <initializer_list>
using namespace std;
int sum(initializer_list<int> il)
{
	int sum = 0;
	for(auto i : il){
		sum += i;
	}
	return sum;
}
int main()
{
	cout << sum({1,2,3,4,5}) << endl;
	initializer_list<int> il = {1,2,3,4,5};
	initial_list<int> il2 = il; // 拷贝，与il共享底层数据
	unsigned size = il.size();
	auto begin = il.begin();
	auto end = il.end();

	for(auto b = li.begin();b!=li.end();++b){
        cout<<*b<<endl; // 1 2 3 4 5
        cout<<b[0]<<endl; // 1 2 3 4 5
		*b = 1; // 错误，initializer_list中的元素都是常量
    }
}
```

省略符形参：

```cpp
void foo(parm_list, ...);
```

省略符形参是为了便于 C++程序访问某些特殊的 C 代码而设置的,这些代码使用了名为 varargs 的 C 标准库功能。通常，省略符形参不应用于其他目的。

## 返回类型和 return 语句

无返回值的函数：

```cpp
void func(){
	return;
}
void func2(){
	return func();
}
```

- return 语句返回值的类型必须与函数的返回类型相同，或者能隐式地转换成函数的返回类型。
- 返回一个值的方式和初始化一个变量或形参的方式完全一样：返回值用于初始化调用点的一个临时变量，该临时变量就是函数调用的结果。

不要返回局部对象的引用或指针：

```cpp
const string& manip(){
	string ret;
	if(!ret.empty()){
		return ret; // 错误，ret是局部对象
	}else{
		return "empty"; // 错误，返回的是局部对象
	}
}

string* manip(){
	string ret;
	if(!ret.empty()){
		return &ret; // 错误，ret是局部对象
	}else{
		return new string("empty"); // 正确，返回的是动态分配的对象，但是这种写法有内存泄漏的风险
	}
}
```

调用本身也是一种运算符，它的优先级和结合律和. ->一样：

```cpp
auto sz = shorterString(s1, s2).size();
```

当返回值是引用时，这时候拿到的是左值，因此可以对返回值进行赋值：

```cpp
char& getVal(string& str, string::size_type ix){
	return str[ix];
}
getVal(s, 0) = 'A';
```

C++11 之后可以使用 initiallizer_list 来初始化返回的临时量：

```cpp
vector<string> process()
{
	if(expected.empty())
		return {}; // 返回一个空的vector
	else if(expected.size() == 1)
		return {"only"}; // 返回一个只有一个元素的vector
	else
		return {"the","other","case"}; // 返回一个有三个元素的vector
}

int func(){
	return {1};
	// return {1,2,3}; // 错误，内置类型只有一个元素
	return {}; // 正确，执行值初始化
}
// 类类型由类自己决定如何初始化
```

main 函数返回值，如果没有 return，编译器会隐式添加 return 0; 0 表示程序正常退出，非 0 表示异常退出。

```cpp
int main()
{
	if(fail)
		return EXIT_FAILURE; // 定义在cstdlib中
	else
		return EXIT_SUCCESS; // 定义在cstdlib中
}
```

### 返回数组指针

返回数组的指针写法比较复杂：

```cpp
int (*func(int i))[10];
```

- func(int i) 表示 func 是一个函数，参数是 int
- (\*func(int i)) 表示 func 的返回值可以被解引用
- (\*func(int i))[10] 表示解引用得到一个指向大小为 10 的数组的指针
- int (\*func(int i))[10] 表示这个数组的元素是 int 类型

可以使用类型别名、尾置返回类型或 decltype 简化：

```cpp
typedef int arrT[10]; // using arrT = int[10];
arrT* func(int i);

auto func(int i) -> int(*)[10];

int arr[10];
decltype(arr)* func(int i){...}
```

## 函数重载

```cpp
void print(const char* p);
void print(const int* p, size_t size);
void print(const int* beg, const int* end);

print("hello");
const char* p = "hello";
print(p, end(p) - begin(p));
print(begin(arr), end(arr));
```

对于重载的函数来说，它们应该在形参数量或形参类型上有所不同，不能仅仅是返回类型不同。

```cpp
int sum(int a, int b);
double sum(int a, int b); // 错误，只有返回类型不同
```

```cpp
Record lookup(const Account& acct);
Record lookup(const Accout&); // 错误，同一个函数

typedef Phone Tel;
Record lookup(const Phone&);
Record lookup(const Tel&); // 错误，同样的类型
```

顶层 const 不影响传参，因此不能通过顶层 const 来区分重载函数：

```cpp
void f(int);
void f(const int); // 顶层const，不能区分
void f(int*);
void f(int* const); // 顶层const，不能区分
void f(int*);
void f(const int*); // 底层const，可以区分
void f(int&);
void f(const int&); // 底层const，可以区分
```

当我们传递一个非常量对象或者指向非常量对象的指针时，编译器会优先选用非常量版本的函数。

### 重载函数匹配

函数匹配：编译器首先将调用的实参与重载集合中每一个函数的形参进行比较，然后根据比较的结果决定到底调用哪个函数。
函数匹配会有三种结果：

- 找到最佳匹配
- 找不到匹配，发出无匹配的错误
- 有多个函数都可以匹配，但是没有一个是明显的最佳匹配，发出二义性调用的错误

### 重载与作用域

- 一旦在当前作用域中找到了所需的名字，编译器就会忽略掉外层作用域中的同名实体。
- 在 C++ 语言中，名字查找发生在类型检查之前。

```cpp
void print(const char* str){
    cout<<str<<endl;
}
void print(int n){
    cout<<n<<endl;
}
void print(double d){
    cout<<d<<endl;
}
int main()
{
    void print(int); // 内层作用域的声明会隐藏外层作用域的同名实体
    // print("Hello"); // 错误，找不到匹配的函数
    print(3.14); // 3
    print(1); // 1
}
```

## 特殊用途语言特性

### 默认实参

- 默认实参默认值放在函数声明中，而不是函数定义中。
- 默认实参只能出现在形参列表的尾部，不能在中间某个位置省略。
- 默认实参可以分在多个声明中，但是不能重复。

```cpp
void foo(int a, int b, int c = 1);
void foo(int a, int b, int c = 2); //错误，重复声明
void foo(int a=1, int b=1, int c); // 正确
```

除了局部变量不能作为默认实参外，其他只要类型匹配都可以：

```cpp
void print(int n){
    cout<<n<<endl;
}
int j = 2;
int main()
{
    void print(int n = j);
    int i =1;
    void print(int n = i); // 错误，局部变量不能作为默认实参
    print();
}
```

用作默认实参的名字在函数声明所在的作用域内解析，而这些名字的求值过程发生在函数调用时：

```cpp
size_t wd = 80;
char def = ' ';
size_t ht();
string screen(size_t = ht(), size_t = wd, char = def);

string window = screen();  // call screen(ht(), 80, ' ')

void f2() {
    def = '*',
    size_t wd = 100;
    window = screen();  // call screen(ht(), 80, '*')
}
```

### 内联函数和 constexpr 函数

内联函数：

- 优化规模较小、流程直接、频繁调用的函数
- 内联说明只是向编译器发出的一个请求，编译器可以选择忽略这个请求。

内联函数会被编译器在每个调用点展开：

```cpp
inline const string& shorterString(const string& s1, const string& s2)
{
	return s1.size() <= s2.size() ? s1 : s2;
}

cout << shorterString(s1, s2) << endl;
// =>
cout << (s1.size() <= s2.size() ? s1 : s2) << endl;
```

constexpr 函数：

- 指能用于常量表达式的函数。
- constexpr 函数不一定返回常量表达式。
- 函数返回值及其形参都是字面值类型
- 有且只有一条 return 语句
- 编译器隐式的将 constexpr 函数内联

```cpp
constexpr int new_sz(){return 42;}
constexpr int foo = new_sz(); // 正确，返回值是常量表达式

constexpr size_t scale(size_t cnt){return new_sz()*cnt;}
int arr[scale(2)]; // 正确，返回值是常量表达式
int i = 2;
int arr2[scale(i)]; // 错误，返回值不是常量表达式
```

内联函数和 constexpr 函数定义需要放在头文件中。

### 调试帮助

assert 是预处理宏，用于调试程序，它依赖于一个名为 NDEBUG 的预处理变量：

```cpp
#include <cassert>
int main()
{
	assert(1>0); // NDEBUG未定义，assert会执行
}

#define NDEBUG
#include <cassert>
int main()
{
	assert(1>0); // NDEBUG定义了，assert不会执行
}
```

```cpp
__func__ // 由C++编译器定义，表示当前函数的名字
__LINE__ // 由预处理器定义，表示当前行号，整数字面值
__FILE__ // 由预处理器定义，表示当前文件名，字符串字面值
__TIME__ // 由预处理器定义，表示当前时间，字符串字面值
__DATE__ // 由预处理器定义，表示当前日期，字符串字面值
```

## 函数匹配

1. 选定候选函数集，要求：
   1. 与被调用的函数同名
   2. 声明在调用点可见
2. 选定可行函数，要求：
   1. 形参与实参的数量相同，除非有默认实参
   2. 实参的类型与对应的形参类型相同，或者能转换成形参的类型
3. 寻找最佳匹配，即实参与形参类型越接近越好，要求：
   1. 所有参数都不弱于其他候选函数的对应参数
   2. 至少有一个参数比其他候选函数的对应参数更好

```cpp
void func(int, int);
void func(double, double);
func(1,2); // int, int
func(1.0, 2.0); // double, double
func(1, 2.0); // 错误，二义性
```

最佳匹配的规则排序如下：

1. 精确匹配，包括：
   - 类型完全相同
   - 实参从数组或函数转换成指针
   - 实参添加或删除顶层 const
2. 通过 const 转换实现的匹配
3. 通过类型提升实现的匹配
4. 通过算术类型转换或指针转换实现的匹配
5. 通过类类型转换实现的匹配

```cpp
void func(int);
void func2(double);
void func3(int*);
void func4(const int);
void func5(const int*)
void func6(Car);

func(42); // 1 类型完全相同
int arr[] = {0,1,2};
func3(arr); // 1 实参从数组转换成指针
func4(42); // 1 添加顶层const
int i = 42;
func5(&i); // 2 通过const转换实现的匹配
short s = 42;
func(s); // 3 通过类型提升实现的匹配
func2(42); // 4 通过算术类型转换实现的匹配
```

## 函数指针

```cpp
bool lengthCompare(const string&, const string&); // lengthCompare是函数类型
bool (*pf)(const string&, const string&);  // pf是函数指针类型
pf = lengthCompare; // 函数类型自动转换成函数指针类型
pf = &lengthCompare; // 与前面是等价的
pf = nullptr; // pf可以指向空
```

区分：

```cpp
bool (*pf)(const string&, const string&); // pf是一个函数指针
bool *pf(const string&, const string&); // pf是一个函数，返回值是bool*
```

重载函数的指针，要求必须精确的匹配参数和返回类型：

```cpp
void ff(int*);
void (*pf1)(int) = ff; // 错误，参数不匹配
double (*pf2)(int*) = ff; // 错误，返回类型不匹配
```

函数类型不能作为形参和返回值：

```cpp
void useBigger(const string& s1, const string& s2, bool pf(const string&, const string&)); // 自动转换成函数指针
void useBigger(const string& s1, const string& s2, bool (*pf)(const string&, const string&)); // 显示指定函数指针
useBigger(s1, s2, lengthCompare); // lengthCompare自动转换成函数指针
```

函数指针作为返回值的写法很复杂，推荐使用类型别名、尾置返回类型或 decltype：

```cpp
int (*f1(int))(int*, int); // f1是一个函数，返回值是函数指针
auto f1(int) -> int(*)(int*, int); // 使用尾置返回类型

typedef decltype(f1) ff1; // 定义函数类型
typedef decltype(f1) *ff2; // 定义函数指针类型

using F = int(int*, int); // F是函数类型
using PF = int(*)(int*, int); // PF是函数指针类型
typedef int F(int*, int); // F是函数类型
typedef int (*PF)(int*, int); // PF是函数指针类型

PF f1(int); // f1是一个函数，返回值是函数指针
F f1(int); // 错误，返回值是函数类型
F *f1(int); // 正确，返回值是函数指针类型
```
