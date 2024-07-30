---
title: C++ Primer 1.开始
---

## 编写一个简单的 C++程序

```cpp
#include <iostream>
using namespace std;
int main(){
	cout << "Enter two numbers:" << endl;
	int v1 = 0, v2 = 0;
	cin >> v1 >> v2;
	cout << "The sum of " << v1 << " and " << v2 << " is " << v1 + v2 << endl;
	return 0;
}
```

## C++ 中的输入输出

- istream 对象
  - cin 标准输入
- ostream 对象
  - cout 标准输出
  - cerr 用于输出警告和错误信息
  - clog 用于输出程序运行时的一般性信息

C++中一个表达式产生一个结果，cout << x 的结果还是 cout，所以可以写作 cout << x << y;

cout << x << endl 中的 endl 是一个被称为操纵符(manipulator)的特殊值。写入 endl 的效果是结束当前行，并将与设备关联的缓冲区（buffer）中的内容刷到设备中。缓冲刷操作可以保证到目前为止程序所产生的所有输出都真正写入输出流中，而不是仅停留在内存中等待写入流。

## 注释

```cpp
// This is a single-line comment
/*
This is a multi-line comment
*/
```
多行注释是不能嵌套的：

```cpp
/* This is a comment /* This is a nested comment */ This is the end of the comment */
```
使用单行注释可以对包含多行注释的代码进行注释。

``` cpp
// /*
// * Comment
// */
```

## 读取数量不定的输入数据
当使用 istream 对象作为条件，结果就是检测流的状态。如果流是有效的（也就是说，如果读入下一个输入是可能的）那么测试成功。如果遇到文件结束符或无效输入时，则 istream 对象是无效的，处于无效状态的 istream 对象将导致条件失败。

```cpp
#include <iostream>
int main() {
    int sum = 0, value = 0;
	// 读取数据直到文件结束，计算所有读入的值的和
    while (std::cin >> value) {
        sum += value;
    }
    std::cout << sum << std::endl;
    return 0;
}
```
