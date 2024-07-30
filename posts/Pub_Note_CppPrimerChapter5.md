---
title: C++ Primer 5.语句
---

## 简单语句

```cpp
while (cin>>s && s != sought)
	; // 空语句，最好加上注释

while (iter != svec.end()) ; // 错误，这是一个空语句，不会执行循环体
	++iter;

```

## 条件语句

### if

```cpp
if (grade > 90)
	cout << "great" << endl; // 单个语句可以不用花括号
else if (grade >= 60)
	cout << "pass" << endl;
	if(grade >= 80) // 错误，前面的else if没有花括号
		cout << "high pass" << endl;
	else // C++中else与最近的if匹配
		cout << "low pass"<<endl;
else
	cout << "fail" << endl;
```

### switch

```cpp
switch (a){
	case 10:
		cout << "10" << endl; // 没有break，会继续执行下一个case
	case 3.14:  // 错误，case标签必须是整型常量表达式
		break;
	case 8:
		cout << "8" << endl;
		break;
	default:
		cout << "default" << endl; // 没有匹配的case时执行default
}
```

如果需要为某个 case 分支定义并初始化一个变量，我们应该把变量定义在块内，从而确保后面的所有 case 标签都在变量的作用域之外。

```cpp
switch (ival) {
	case 0:
		int ix = 1; // 错误，定义在case内部的变量在其他case中使用
	case 1:
		int k = ix + 1;
	case 2:
		{
			int ix = 1; // 正确，定义在块内
			break;
		}
}
```

## 迭代语句

### for

```cpp
for(int i=0,*p=&i;i<10;++i){ // 初始化语句可以定义多个变量，但是只能有一个类型说明符
	cout << i << endl;
}
// init_statement、condition、expression都是可选的
int i =0;
for(;;){
	if(i>10)
		break;
	cout << i << endl;
	++i;
}

// 范围for语句
vector<int> v = {1,2,3,4,5};
for(auto &i : v){
	i *= i;
}
// 等价于
for(auto beg = v.begin(); beg != v.end(); ++beg){
	auto i = *beg;
	i *= i;
}
// 在遍历过程中修改容器大小具体行为需要根据具体的容器来决定
```

### do while

```cpp
int i = 0;
do{
	cout << i << endl;
	++i;
}while(i<10); // 不要忘记分号
```

## 跳转语句

```cpp
// break
for(auto &i : v){
	if(i == 3)
		break; // 跳出最内层循环
}

// continue
for(auto &i : v){
	if(i == 3)
		continue; // 跳出本次循环，继续下一次循环
}

// 不要使用goto语句
```

## try 语句和异常处理

```cpp
try{
	// 语句块
	Sales_data item1, item2;
	cin >> item1 >> item2;
	if(item1.isbn() != item2.isbn())
		throw runtime_error("Data must refer to same ISBN"); // 抛出异常
	cout << item1 + item2 << endl;
}catch(runtime_error err){ // 捕获异常
	cout << err.what() << "\nTry Again? Enter y or n" << endl; // err.what()返回异常信息
} catch(bad_alloc){ // 捕获bad_alloc异常
	cout << "bad_alloc" << endl;
} catch(...){ // 捕获所有异常
	cout << "unknown exception" << endl;
}
```

- 寻找处理代码的过程与函数调用链刚好相反。当异常被抛出时，首先搜索抛出该异常的函数。如果没找到匹配的 catch 子句，终止该函数，并在调用该函数的函数中继续寻找。如果还是没有找到匹配的 catch 子句，这个新的函数也被终止，继续搜索调用它的函数。
- 如果最终没有找到匹配的 catch 子句，程序调用 terminate 函数，终止程序的执行。
- 没有定义异常处理的代码因为找不到 catch 语句，所以会调用 terminate 函数终止程序。

编写异常安全的代码非常困难，因为异常发生时程序的正常流程被中断，在这之前已经有一些资源被分配，或一些对象处于某种状态。要想保证程序能继续的运行，就需要在异常处理中考虑到这些问题。

### 常见的异常类

``` cpp
exception //定义在exception头文件中，只报告异常，不提供额外信息
bad_alloc //定义在new头文件中，内存分配失败
bad_cast //定义在typeinfo头文件中，类型转换错误

// 定义在stdexcept头文件中的异常类
exception // 最常见的问题
runtime_error //运行时错误
range_error //生成的结果超出了有意义的值域
overflow_error // 计算上溢
underflow_error // 计算下溢
logic_error // 程序逻辑错误
domain_error // 参数对应的结果值不存在
invalid_argument // 无效参数
length_error // 试图创建一个超出该类型最大长度的对象
out_of_range // 使用一个超出有效范围的值
```

- exception、bad_alloc、bad_cast 只提供了默认构造函数，其他异常类必须使用含 string 参数的构造函数。
- 如果异常类型有一个字符串初始值，则 what 返回该字符串。对于其他无初始值的异常类型来说，what 返回的内容由编译器决定。
