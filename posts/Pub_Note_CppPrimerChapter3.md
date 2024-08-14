---
title: C++ Primer 3.字符串、向量和数组
---

## 命名空间的 using 声明

有了 using 声明就无须专门的前缀（形如命名空间::）也能使用所需的名字了。

```cpp
#include<iostream>
using std::cin;
int main(){
 int i;
 cin >> i;
 std::cout << i << std::endl; // 需要前缀
 return 0;
}
```

头文件不应包含 using 声明，因为头文件的内容会拷贝到所有引用它的文件中去，容易引起命名冲突。

## string

初始化：

```cpp
string s1; // 默认初始化，s1 是一个空串
string s2(s1); // 直接初始化，s2 是 s1 的副本
string s3 = s1; // 拷贝初始化，等价于 s2
string s4("value"); // 直接初始化，s4 是字面值 "value" 的副本，但是没有\0
string s5 = "value"; // 拷贝初始化，等价于 s4
string s6(10, 'c'); // 直接初始化，s6 的内容是 "cccccccccc"
```

操作：

```cpp
string s;
cin >> s; // 读入字符串，遇到空白停止
getline(cin, s); // 读入一整行，遇到换行符停止，返回cin
cout << s; // 输出字符串
s.empty(); // 判断是否为空
s.size(); // 返回字符串长度，无符号数
s[n]; // 第n个字符的引用
s1 + s2; // 连接两个字符串
s1 = s2; // 赋值
s1 == s2; // 比较
s1 != s2; // 比较
s1 < s2; // 按字典序逐个比较字符
```

```cpp
// 逐行读取，直到文件结束，换行符会被丢弃
while(getline(cin, line)){
 cout << line << endl;
}
```

```cpp
int a = -1;
string s("Hello World!!!");
if(s.size()>a){ //不要这么写，无符号数和有符号数比较，a会被转换为无符号数， -1 会变为一个很大的数
 cout << "s.size()<a" << endl;
}
```

```cpp
cout<< string("abc") < string("abcd") << endl; // 1，前面所有字符相等，长度小于，则小于
cout<< string("abc") < string("bcd") << endl; // 1. a<b，所以小于

cout<< (string("abc")<string("ab")) <<endl; // 0
cout<< ("abc"<"ab") <<endl; // 字面值的比较其实是比较地址，所以不会报错，但是结果是不确定的

```

```cpp
cout<< string("Hello") + "World" << endl; // HelloWorld，字面值转换为string
cout<< "Hello" + "World" << endl; // 错误，两个字面值无法相加
```

cctype 中字符处理函数：
![Alt text](image.png)

```cpp
string s("Hello World!!!");
s[0] = toupper(s[0]); // s[0] 是引用，可以修改
for (auto &c : s){
 c = toupper(c);  // 对于范围for循环，c是引用，可以修改
}
```

## vector

- string 是字符的可变长序列
- vector 是给定类型对象的可变长序列

初始化：

```cpp
vector<int> ivec; // 空vector
vector<int> ivec2(ivec); // 把 ivec 的元素拷贝给 ivec2
vector<int> ivec3 = ivec; // 把 ivec 的元素拷贝给 ivec3
vector<int> ivec4(10); // 10个元素，每个元素都是0
vector<int> ivec5(10, 1); // 10个元素，每个元素都是1
vector<int> ivec6 = 10; // 错误，必须使用直接初始化
vector<string> svec{ "a", "an", "the" }; // 列表初始化
vector<string> svec2 = { "a", "an", "the" }; // 列表初始化
vector<string> svec3("a", "an", "the"); // 错误，不能用圆括号
```

操作：

```cpp
vector<int> ivec;
ivec.push_back(42); // 在 ivec 的末尾添加42
ivec.empty(); // 判断是否为空
ivec.size(); // 返回元素个数
ivec[n]; // 返回第n个元素的引用
ivec1 = ivec2; // 赋值
ivec1 = {1, 2, 3, 4, 5}; // 列表赋值
ivec1 == ivec2; // 所有元素相等且长度相等
ivec1 != ivec2; // 有一个元素不相等或长度不等
ivec1 < ivec2; // 逐个比较元素，需要元素支持比较
```

```cpp
vector<int> ivec{1,2,3};
ivec[3] = 4; // 下标越界，这很危险，会出现运行时未知错误。
```

## iterator

迭代器 iterator 可以理解为一种针对容器的指针，模仿指针的行为对容器进行操作。

```cpp
vector<int> ivec{1,2,3,4,5};
auto b = ivec.begin(); // 指向第一个元素
auto e = ivec.end(); // 指向尾元素的下一个位置
for(auto it = b; it != e; ++it){
 cout << *it << endl;
}

vector<int> empty_vec;
cout<< empty_vec.begin() == empty_vec.end() << endl; // 1
```

操作：

```cpp
*iter; // 返回迭代器所指元素的引用
iter->mem; // 等价于 (*iter).mem
++iter; // 使 iter 指向容器中的下一个元素
--iter; // 使 iter 指向容器中的上一个元素
iter1 == iter2; // 判断两个迭代器是否相等
iter1 != iter2; // 判断两个迭代器是否不等

```

iterator 与 const_iterator：

```cpp
vector<int>::iterator it; // 读写
vector<int>::const_iterator it2; // 只读

vector<int> ivec{1,2,3,4,5};
vector<int>::iterator it = ivec.begin();
vector<int>::const_iterator it2 = ivec.cbegin();
```

谨记，但凡是使用了迭代器的循环体，都不要向迭代器所属的容器添加元素。

string 和 vector 的迭代器是随机访问迭代器，支持 +、-、+=、-=、<、<=、>、>=、-、[]、iter+n、iter-n、iter1-iter2。

```cpp
iter += n; // 向前移动n个元素
iter -= n; // 向后移动n个元素
iter + n; // 向前移动n个元素
iter - n; // 向后移动n个元素
iter1 - iter2; // 返回两个迭代器之间的距离
iter1 < iter2; // 比较两个迭代器的位置
```

## 数组

数组初始化必须指定类型和长度，长度必须是常量表达式。

```cpp
unsigned len = 10;
const unsigned len2 = 10;
int a[len]; // 错误，长度不是常量表达式
int b[len2]; // 正确
int c[] = {1,2,3}; // {1,2,3}
int d[5] = {1,2,3}; // {1,2,3,0,0}
int e[2] = {1,2,3}; // 错误，初始化列表中的元素个数不能超过数组长度

char a1[] = {'C', '+', '+','\0'};
char a2[] = "C++"; // 等价于 {'C', '+', '+','\0'}
char a3[6] = "Daniel"; // 错误，没有空间存放空字符
```

```cpp
auto a4[] = {1,2,3}; // 错误，数组不能使用auto
```

数组不支持拷贝和赋值：

```cpp
int a[] = {1,2,3};
int b[] = a; // 错误，数组不能拷贝
b = a; // 错误，数组不能赋值
```

数组的声明比较复杂，技巧是从右往左看，也是从内往外看：

```cpp
int *p[10]; // p 是含有10个整型指针的数组
int &r[10]; // 错误，引用不是对象，不能作为数组元素
int (*p)[10]; // p 是指向含有10个整数的数组的指针
int (&r)[10] = a; // r 是是指向含有10个整数的数组的引用
```

访问数组元素：

```cpp
int a[] = {1,2,3};
for(auto i : a){
 cout << i << endl;
}

```

## 数组和指针

```cpp
int a[] = {1,2,3};
int *p = &a[0]; // p 指向 a 的第一个元素
int *p2 = a; // 等价于 p
```

在大多数表达式中指向数组类型的对象实际上是使用一个指向数组首元素的指针，但 decltype 拿到的是数组类型：

```cpp
int a[] = {1,2,3};
auto p(a); // p 是int* 类型，指向 a 的第一个元素

// decltype(a) 是 int[3]
decltype(a) b = {4,5,6}; // b 是 int[3] 类型
decltype(a) c = {1,2,3,4}; // 错误，初始化列表中的元素个数不能超过数组长度
```

运算：

```cpp
int a[] = {1,2,3};
int *p = a;
int i = *(p+1); // 2
int *p2 = &a[1]; // p2 指向 a 的第二个元素
int k = p2[-1]; // 1 等价与 *(p2-1)，基础类型支持负数下标，但string和vector的重载运算符不支持
int m = p2[1]; // 3

++p; // 前进一个元素
p+1; // 前进一个元素
p-1; // 后退一个元素
p1-p2; // 两个指针之间的距离 ptrdiff_t 类型

int* beg = begin(a); // 定义在头文件 iterator 中
int* last = end(a);
```

### 与旧代码的接口

```cpp
string s("Hello World!!!");
const char *str = s.c_str(); // 返回一个指向s第一个字符的指针

int a[] = {1,2,3};
vector<int> ivec(begin(a), end(a)); // 使用数组初始化vector
```

现代 C++应该尽可能使用 vector 和 iterator，而不是数组和指针。

## 多维数组

多维数组即数组的数组，数组的元素仍然是数组，多维数组仍然建议像前面一样从右往左看：

```cpp
int a[3][4]; // a 是含有3个含有4个整数数组的数组
int b[3][4] = {0,1,2,3,4,5,6,7,8,9,10,11}; // 0-11
int c[3][4] = {{0,1,2,3},{4,5,6,7},{8,9,10,11}}; // 0-11
int d[3][4] = {0,1,2,3}; // 第一行是0-3，其他行是0
int e[3][4] = {{1},{1},{1}}; // 每行第一个元素是1，其他元素未初始化
```

### 下标访问

```cpp
int a[2][2] = {1,2,3,4};
int b[2][2][2] = {0,1,2,3,4,5,6,7};
a[1][1] = b[1][1][1]; // 下标访问
int (&row)[2] = a[1]; // row 绑定到a的第二行
cout << row[1] << endl; // 4
```

使用范围 for 循环：

```cpp
int a[2][2] = {1,2,3,4};
for(auto &row : a){
 for(auto& col : row){
  cout << col << endl;
 }
}

for(auto row : a){
 for(auto col : row){ // 报错, row被推导为int*，而不是int[2]
  cout << col << endl;
 }
}
```

因此，要遍历多维数组，除了最内层循环，其他循环都要使用引用。

```cpp
int a[2][2];
int (*p)[2] = a; // p 指向 a 的第一行
p = &a[1]; // 指向第二行
```

使用 auto 可以避免写指针：

```cpp
int a[2][2] = {1,2,3,4};
for(auto p = a; p != end(a); ++p){
 for(auto q = *p; q != end(*p); ++q){ // q 指向4个整数数组的第一个元素
  cout << *q << endl;
 }
}

// 使用begin和end
for(auto p = begin(a); p != end(a); ++p){
 for(auto q = begin(*p); q != end(*p); ++q){
  cout << *q << endl;
 }
}

// 使用类型别名
using int_array = int[4];
// typedef int int_array[4];
for(int_array *p = a; p != end(a); ++p){
 for(int *q = *p; q != end(*p); ++q){
  cout << *q << endl;
 }
}
```
