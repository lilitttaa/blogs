---
title: 什么是Traits？
cover: program.png
---

## Step1：写一个模板函数实现获得指针指向的值

```cpp
template<class T>
T Get(T* t) {
    return *t;
}
int main() {
    cout << Get(new int(8));
}
```

注：这里针对的是普通指针

## Step2：针对自定义指针（迭代器）实现

```cpp
template<class T>
class Iterator {
private:
    T* p;
public:
    Iterator(T* np):p(np) {}
    T& operator*() {
        return *p;
    }
};

template<class I>
? Get(I i) { //这里返回值不知道怎么写了，因为我们不知道怎么表示自定义指针指向的类型，这就是我们现在面临的问题
    return *i;
}
int main() {
    Iterator<int> i(new int(2));
    cout << Get(i) << endl;
}
```

## Step3：在迭代器里指出值类型

```cpp
template<class T>
class Iterator {
private:
    T* p;
public:
    typedef T valueType; //指出valueType是 T
    Iterator(T* np):p(np) {}
    T& operator*() {
        return *p;
    }
};

template<class I>
typename I::valueType Get(I i) { //返回值类型到Iterator里去找
    return *i;
}

int main() {
    Iterator<int> i(new int(2));
    cout << Get(i) << endl;
}
```

目前看上去问题已经解决了，不过还存在一点问题，目前 Get 函数仅仅支持了我们自定义的指针类型，对于普通类型是不适用的。

```cpp
Get(new int(2)) //显然这会出错，因为int* 可没有valueType这个成员
```

有两个思路：

1. 为 Get 函数增加处理基本类型的偏特化
2. 添加一个中间层（traits）为我们指定返回值类型

两个思路其实核心是一样的，但是后者可以作为一个工具为其他多个方法所使用，适用性更广。

## Step4：Traits

```cpp
template<class T>
class Iterator {
private:
    T* p;
public:
    typedef T valueType;
    Iterator(T* np):p(np) {}
    T& operator*() {
        return *p;
    }
};

template<class I>
struct  IteratorTraits {
    typedef typename I::valueType valueType;
};

//偏特化
template<class T>
struct IteratorTraits<T*> {
    typedef T valueType;
};

template<class I>
typename IteratorTraits<I>::valueType Get(I i) {
    return *i;
}

int main() {
    Iterator<int> i(new int(2));
    cout << Get(i) << endl;
    cout << Get(new int(8)) << endl;
}
```
