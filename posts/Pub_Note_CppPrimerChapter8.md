---
title: C++ Primer 8. IO库
---

## IO 类

### 概述

- C++通过定义在标准库中的类型来处理 IO。
- 这些类型支持从设备读取数据、向设备写入数据的 IO 操作。
- 设备可以是文件、控制台窗口等。还有一些类型允许内存 IO，即 string 读写。

![Alt text](image.png)

```cpp
#include <iostream>
using namespace std;

int main()
{
	int i;
	cin >> i;
	cout << i;
	return 0;
}
```

```cpp
#include <fstream>
using namespace std;

int main()
{
	ifstream in("file.txt");
	ofstream out("file.txt");
	int i;
	in >> i;
	out << i;
	return 0;
}
```

```cpp
#include <sstream>
using namespace std;

int main()
{
	stringstream sstr;
	sstr << "Hello, world!";
	string s;
	sstr >> s;
	cout << s;
	return 0;
}
```

为了支持宽字符，标准库定义了一系列操纵 wchar_t 类型的类型和函数。这些类型和函数的名字都以 w 开头，例如 wcin、wcout、wcerr 等，与普通版本放在同一个头文件中。

### IO 对象无拷贝或赋值

```cpp
ofstream out1, out2;
out1 = out2; // 错误，不能赋值
ofstream print(ofstream); // 错误，不能拷贝
ostream& operator<<(ostream&, const A&); //IO对象作为形参和返回值只能传引用
```

### 条件状态

IO 操作一个与生俱来的问题是可能发生错误。一些错误是可恢复的，而其他错误则发生在系统深处，已经超出了应用程序可以修正的范围。下面是一些 IO 类所定义的条件状态：
![Alt text](image-1.png)
![Alt text](image-2.png)

确定一个流状态最简单的办法，就是将流当作一个条件来使用。条件成立当且仅当流的状态是有效的。例如：

```cpp
while(cin >> i){...}
```

### 管理输出缓冲

通过缓冲机制，操作系统可以将程序的多个输出操作组合成单一的系统级写操作，提升性能。

导致缓冲刷新的情况：

- 整个程序正常结束
- 缓冲区满时
- endl 手动刷新缓冲区
- 使用 unitbuf 操纵符来设置流的状态，默认 cerr 是设置了 unitbuf 的
- 读写流关联时，读操作会刷新写操作的缓冲区，默认 cin 和 cout 是关联的

```cpp
cout << "hi!" << endl; // endl 刷新缓冲区并输出换行符
cout << "hi!" << flush; // flush 刷新缓冲区
cout << "hi!" << ends; // ends 输出一个空字符，然后刷新缓冲区

cout << unitbuf; // 所有输出操作后都会立即刷新缓冲区
cout << nounitbuf; // 恢复正常的缓冲方式

cin >> ival;  // cin 读取数据时，cout 的缓冲区会被刷新
```

使用 tie 函数来关联流：

```cpp
cin.tie(&cout); // cin 和 cout 关联
ostream *old_tie = cin.tie(nullptr); // cin 和 cout 解除关联
```

## 文件输入输出

常用 API：

```cpp
ifstream in("file.txt"); // 构造一个ifstream对象并打开文件
ofstream out; // 输出文件流，没有关联文件
fstream io("file.txt", fstream::in | fstream::out); // 读写文件流
ofstream out;
out.open("file.txt"); // 打开文件
out.close(); // 关闭文件
out.is_open(); // 检查文件是否打开
```

当一个 fstream 对象被销毁时，close 会自动被调用。

file mode：

```cpp
in // 以读模式打开
out // 以写模式打开
app // 每次写操作前定位到文件末尾
ate // 打开文件后立即定位到文件末尾
trunc // 截断文件
binary // 以二进制模式打开
```

它们之间的关系如下：

- 只可以对 ofstream 或 fstream 对象设定 out 模式
- 只可以对 ifstream 或 fstream 对象设定 in 模式
- trunc 模式只能用 out
- 没有 trunc 时才能设 app
- app 下默认 out
- 默认情况下使用 trunc，除非指定 app
- ate 和 binary 模式使用比较自由
- out 默认会清空文件内容
- 保留被 ofstream 打开的文件中已有数据的唯一方法是显式指定 app 或 in 模式。

```cpp
ofstream out("file.txt", ofstream::app); // 以 app 模式打开
ofstream out("file.txt", ofstream::app | ofstream::binary); // 以 app 和 binary 模式打开
```

## string 流

``` cpp
stringstream sstr;
sstr << "Hello, world!"; // 向 sstr 写入数据
string s1;
sstr >> s1;
cout<< s1 <<endl; // Hello,
cout<<sstr.str()<<endl; // Hello, world!

string s2 = sstr.str(); // 返回 sstr 中的 string 副本
cout<<s2<<endl; // Hello, world!

string s3("Hello, world!2");
sstr.str(s3); // 将 sstr 重置为 s3
cout<<sstr.str()<<endl; // Hello, world!2
```