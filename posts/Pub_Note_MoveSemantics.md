---
title: C++ 移动语义
cover: program.png
---

## 左值引用与右值引用

C++ 中有左值与右值的概念，一般认为可以取地址的是左值，反之是右值：

```cpp
// 左值
int a = 1;
int* p = &a;

// 右值
1;
"abc";
```

通常我们可以这样定义一个引用：

```cpp
int a = 1;
int& b = a;
```

此时该引用指向一个左值，我们称之为左值引用。
而使用

```cpp
int& b = 1;
```

则会报错，因为 1 是一个右值，不能取地址。

C++还允许使用引用指向右值，即所谓的右值引用：

```cpp
class A{}

int&& a = 1;
A&& b = A(); // 临时对象
```

## 为什么要引入右值引用？

首先，我们回到使用左值引用的场景：

```cpp

void func1(const A& a){
    // do something
}

void func2(const int& a){
    // do something
}

A a;
func1(a)

int b = 1;
func2(b)

```

我们使用引用作为函数参数，这样可以减少一次拷贝构造函数的调用，但这样的方式并不适用于右值：

```cpp
void func2(const int& a){
    // do something
}
func2(1);
```

右值引用使得我们可以传入一个临时变量作为实参，临时变量的生命周期很短，每次用完立马就销毁是很浪费的。使用右值引用一方面**解决了值传递浪费资源的问题**，另一方面**突破了引用只能传递左值的限制**。

## 右值引用本身是左值还是右值？

```cpp
int f(int& a){
    cout<<"lvalue"<<endl;
}

int f(int&& a){
    cout<<"rvalue"<<endl;
}

int main(){
    int&& a = 1;
    f(a); // lvalue
    f(1); // rvalue
}
```

## 常量左值引用

常量左值引用既可以绑定左值也可以绑定右值：

```cpp
const int& a = 1;
int b = 1;
const int& c = b;
```

## 移动构造函数

复制构造函数会创建一段新的内存空间，将原对象的内容复制到新的内存空间中，然后返回一个指向新对象的指针。而移动构造函数则是地址直接指向原来的内存空间，然后将原对象的指针置为空。
![alt text](image.png)
来简单看一下，引入移动构造函数后的调用情况。

```cpp
class Str{
public:
    Str(int n){
        cout<< "constructor" <<endl;
        data = new char[n+1];
        data[n] = '\0';
    }
    Str(const Str& s){
        cout<< "copy constructor" <<endl;
        data = new char[strlen(s.data)+1];
        strcpy(data, s.data);
    }
    Str(Str&& s){
        cout<< "move constructor" <<endl;
        data = s.data;
        s.data = nullptr;
    }
private:
    char* data;
};

int main(){
    vector<Str> v;
    v.reserve(3); //设置一下v的capacity，否则会因为扩容模糊这里的调用情况。
    Str s(5);
    v.push_back(s);
    v.push_back(Str(3));

    // output:
    // constructor
    // copy constructor
    // constructor
    // move constructor
}
```

## std::move

move 可以将一个左值转为右值

```cpp
int main(){
    vector<Str> v;
    v.reserve(3);
    Str s(5);
    v.push_back(s);
    v.push_back(std::move(s));
    // output:
    // constructor
    // copy constructor
    // move constructor
}
```

## 完美转发
还记得前面提到的右值引用本身是左值吗

这就导致了，当传入一个右值给右值引用作为参数后，右值引用这个形参本身是左值，当他在作为实参调用其他函数时调用的是左值作为参数的函数。这就产生了不完美转发。

```cpp
void f(int&& a){
    cout<<"rvalue"<<endl;
}

void f(int& a){
    cout<<"lvalue"<<endl;
}

void g(int&& a){
    f(a);
}

int main(){
    g(1);
    // output:
    // lvalue
}
```

那要如何解决? 调用forward函数，forward函数会将其转为右值。
``` cpp
void g(int&& a){
    f(std::forward<int>(a));
}
```


## 通用引用与引用折叠
