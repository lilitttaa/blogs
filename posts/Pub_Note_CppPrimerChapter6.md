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
void print(int (*matrix)[10], size_t rowSize){
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
