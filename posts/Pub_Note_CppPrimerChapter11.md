---
title: C++ Primer 11.关联容器
---

八个标准库关联容器：
| 类型 | set/map | 是否有序 | key 是否唯一 | 头文件 |
| ------------------ | ------- | -------- | ------------ | ------------- |
| set | set | 有序 | 唯一 | set |
| multiset | set | 有序 | 不唯一 | set |
| map | map | 有序 | 唯一 | map |
| multimap | map | 有序 | 不唯一 | map |
| unordered_set | set | 无序 | 唯一 | unordered_set |
| unordered_multiset | set | 无序 | 不唯一 | unordered_set |
| unordered_map | map | 无序 | 唯一 | unordered_map |
| unordered_multimap | map | 无序 | 不唯一 | unordered_map |

## 使用关联容器

使用 map：

```cpp
map<string, size_t> word_count;
string word;
while (cin >> word)
	++word_count[word]; // 如果 word 不在 word_count 中，会插入一个新元素0
for (const auto &w : word_count)
	cout << w.first << " occurs " << w.second
		 << ((w.second > 1) ? " times" : " time") << endl; // w.first 是关键字，w.second 是值
```

使用 set：

```cpp
set<string> exclude = {"The", "But", "And", "Or", "An", "A",
						"the", "but", "and", "or", "an", "a"};
map<string, size_t> word_count;
string word;
while (cin >> word)
	if (exclude.find(word) == exclude.end()) // 如果 word 不在 exclude 中
		++word_count[word];
for (const auto &w : word_count)
	cout << w.first << " occurs " << w.second
		 << ((w.second > 1) ? " times" : " time") << endl;
```

## 关联容器概述

- 关联容器的迭代器是双向的

### 定义关联容器

```cpp
map<string, size_t> word_count; // 空 map
map<string, size_t> word_count = {{"hello", 1}, {"world", 2}}; // 列表初始化
map<string, size_t> word_count(word_count2); // 拷贝构造函数
map<string, size_t> word_count(word_count2.begin(), word_count2.end()); // 迭代器范围构造函数，只要迭代器指向的元素类型可以转换为 map 的 元素类型

set<string> exclude; // 空 set
set<string> exclude = {"The", "But", "And", "Or", "An", "A",
						"the", "but", "and", "or", "an", "a"}; // 列表初始化
set<string> exclude(exclude2); // 拷贝构造函数
set<string> exclude(exclude2.begin(), exclude2.end()); // 迭代器范围构造函数
```

multiset 能存储重复的关键字：

```cpp
vector<int> ivec{1,1,2,2,3,3};
set<int> iset(ivec.cbegin(), ivec.cend());
cout << iset.size() << endl; // 3
multiset<int> miset(ivec.cbegin(), ivec.cend());
cout << miset.size() << endl; // 6
```

### 关键字类型的要求

- 严格弱序：
  - 不能 a < b 且 b < a
  - 传递性：如果 a < b 且 b < c，则 a < c
  - 等价性：如果 !(a < b) 且 !(b < a)，则 a 和 b 等价，如果 a 和 b 等价，b 和 c 等价，则 a 和 c 等价
- 默认情况下，关联容器使用 `<` 运算符来比较关键字
- 也可以自己提供谓词函数来比较关键字

```cpp
bool compareIsbn(const Sales_data &lhs, const Sales_data &rhs)
{
	return lhs.isbn() < rhs.isbn();
}
multiset<Sales_data, decltype(compareIsbn)*> bookstore(compareIsbn);
```

### pair 类型

- pair 是一个模板类型，接受两个类型参数
- 定义在头文件 utility 中
- p1 relop(<,>,<=,>=) p2：按字典序比较，例如：p1.first < p2.first || (!(p2.first < p1.first) && p1.second < p2.second) 则 p1 < p2
- p1 == p2：p1.first == p2.first && p1.second == p2.second
- p1 != p2：!(p1 == p2)

```cpp
pair<string, int> p1;
pair<string, int> p2("hello", 1);
pair<string, int> p3 = {"world", 2};
pair<string, int> p4 = make_pair("hello", 1);

cout<< p2.first << " " << p2.second << endl; // hello 1
```

## 关联容器操作

### 关联容器类型成员

```cpp
set<string>::value_type v1; // string
set<string>::key_type v2; // string

map<string, int>::value_type v3; // pair<const string, int>
map<string, int>::key_type v4; // string
map<string, int>::mapped_type v5; // int
```

### 关联容器迭代器

```cpp
map<string, size_t> word_count{{"hello", 1}, {"world", 2}};
auto map_it = word_count.begin(); // 指向value_type类型的元素
cout << map_it -> first; // hello
cout << map_it -> second; // 1
map_it -> first = "new"; // 错误，first 是 const 的
map_it -> second = 3; // 正确
```

```cpp
set<int> iset = {0,1,2,3,4};
set<int>::iterator set_it = iset.begin();
*set_it = 1; // 错误，set 的元素是 const 的
cout << *set_it; // 0
```

遍历：

- 有序容器的遍历顺序是按关键字升序

```cpp
for (auto it = word_count.cbegin(); it != word_count.cend(); ++it)
	cout << it -> first << " " << it -> second << endl;

for (const auto &w : word_count)
	cout << w.first << " " << w.second << endl;
```

```cpp
for(auto it = iset.cbegin(); it != iset.cend(); ++it)
	cout << *it << endl;

for(const auto &elem : iset)
	cout << elem << endl;
```

关联容器与算法：

- 通常不对关联容器使用泛型算法
- 因为其关键词为 const，意味着修改或重排的算法无法使用
- 另外很多算法都要搜素序列，这个复杂度是 O(N)的，但关联容器的查询要快得多
- 如果要使用，一般来说是把它当成源序列或者目标序列来使用，例如：copy

### 添加元素

| 操作               | 作用                                                      |
| ------------------ | --------------------------------------------------------- |
| c.insert(v)        | v 是 value_type 类型，插入 v                              |
| c.emplace(args)    | args 是 value_type 的构造函数的参数，直接在容器中构造元素 |
| c.insert(b, e)     | b 和 e 是迭代器，插入范围内的元素                         |
| c.insert(il)       | il 是初始化列表，插入列表中的元素                         |
| c.insert(p, v)     | p 是迭代器，提示从哪开始搜索插入 v 的位置                 |
| c.emplace(p, args) | 同上，采用构造的方法                                      |

insert 的返回值：

- 如果是 map 或 set，返回一个 pair
  - pair 的 first 是一个迭代器，指向给定关键词的 value_type 元素
  - second 是一个 bool 值，表示是否插入成功
- 如果是 multimap 或 multiset，直接返回一个迭代器，指向给定关键词的元素

```cpp
auto ret = word_count.insert({"new", 1}); // 返回一个 pair
if (ret.second)
	cout << "key: " << ret.first -> first << "value: " << ret.first -> second << endl;
else
	cout << "insert fail" << endl;

auto ret = iset.insert(1); // 返回一个 pair
if (ret.second)
	cout << "insert success: " << *(ret.first) << endl;
else
	cout << "insert fail" << endl;

auto ret = mismap.insert({"new", 1});
ret = mismap.insert({"new", 2}); // 直接返回value_type类型的迭代器
cout << ret -> first << " " << ret -> second << endl;

auto ret = miset.insert(1);
ret = miset.insert(1); // 直接返回value_type类型的迭代器
cout << *ret << endl;
```

### 删除元素

| 操作          | 作用                                                     |
| ------------- | -------------------------------------------------------- |
| c.erase(k)    | 删除关键字为 k 的元素，返回 size_type 表示删除的元素个数 |
| c.erase(p)    | 删除迭代器 p 指向的元素，返回指向 p 之后元素的迭代器     |
| c.erase(b, e) | 删除范围内的元素，返回指向 e 的迭代器                    |

```cpp
map<string, int> word_count{{"hello", 1}, {"world", 2}, {"new", 3}};

auto erase_size = word_count.erase("hello");
cout << erase_size << endl; // 1
auto it  = word_count.erase(word_count.begin());
word_count.erase(it, word_count.end());
```

### map 的下标操作

- map 和 unordered_map 支持下标操作，set 和 unordered_set 不支持
- 只能对非 const 的 map 进行下标操作
- map[key]：如果 key 不在 map 中，会插入一个新元素，进行值初始化
- map\.at(key)：如果 key 不在 map 中，会抛出 out_of_range 异常

### 访问元素

| 操作             | 作用                                                                               | 补充                                                       |
| ---------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| c.find(k)        | 返回一个迭代器，指向第一个关键字为 k 的元素，如果没有找到，返回 c.end()            |                                                            |
| c.count(k)       | 返回关键字为 k 的元素的个数                                                        | map 和 set 返回 0 或 1，multimap 和 multiset 返回 0 或更多 |
| c.lower_bound(k) | 返回一个迭代器，指向第一个关键字不小于 k 的元素                                    | 不适用于无序容器                                           |
| c.upper_bound(k) | 返回一个迭代器，指向第一个关键字大于 k 的元素                                      | 不适用于无序容器                                           |
| c.equal_range(k) | 返回一个 pair，表示关键字为 k 的元素的范围，如果没找到 k，两个迭代器都等于 c.end() |                                                            |

下标操作会插入一个新元素，因此不适用于仅查询和访问 const 的 map

```cpp
map<string, size_t> word_count{{"hello", 1}, {"world", 2}};
auto map_it = word_count.find("hello");
if (map_it != word_count.end())
	cout << map_it -> first << " " << map_it -> second << endl;
auto count = word_count.count("hello"); // 1
auto lb = word_count.lower_bound("hello");
cout << lb -> first << " " << lb -> second << endl; // hello 1
auto ub = word_count.upper_bound("hello");
cout << ub -> first << " " << ub -> second << endl; // world 2
auto er = word_count.equal_range("hello");
cout << er.first -> first << " " << er.first -> second << endl; // hello 1
cout << er.second -> first << " " << er.second -> second << endl; // world 2
```

multimap 的查询：

```cpp
multimap<string, string> authors{{"Barth, John", "Sot-Weed Factor"},
								 {"Barth, John", "Lost in the Funhouse"},
								 {"Hawthorne, Nathaniel", "Twice-Told Tales"}};
auto count = authors.count("Barth, John");
auto it = authors.find("Barth, John"); // 指向找到的第一个元素
while (count)
{
	cout << it -> second << endl;
	++it;
	--count;
}

// 使用 lower_bound 和 upper_bound
for (auto beg = authors.lower_bound("Barth, John"), end = authors.upper_bound("Barth, John");
	 beg != end; ++beg)
	cout << beg -> second << endl;

// 使用 equal_range
for (auto pos = authors.equal_range("Barth, John"); pos.first != pos.second; ++pos.first)
	cout << pos.first -> second << endl;
```

## 无序容器

- 有序容器使用比较运算符来组织元素
- 无序容器使用哈希函数和关键字类型的==运算符
- 理论上哈希技术能获得更好的平均性能，但在实际中需要进行一些性能测试和调优工作。通常会有更好的性能。
- 通常可以用无序容器替换对应的有序容器，反之亦然。但是，由于元素未按顺序存储，使用无序容器的程序的输出（通常）会与使用有序容器不同。
- 无序容器在存储上组织为一组桶，每个桶保存零个或多个元素。
- 无序容器使用一个哈希函数将元素映射到桶。

无序容器管理桶的接口：
| 操作 | 作用 |
| ---- | ---- |
| c.bucket_count() | 返回 c 当前有多少个桶 |
| c.max_bucket_count() | 返回 c 可以有多少个桶 |
| c.bucket_size(n) | 返回第 n 个桶中有多少个元素 |
| c.bucket(k) | 返回关键字 k 在哪个桶中 |
| local_iterator, const_local_iterator | 一个迭代器类型，可以遍历给定桶中的所有元素 |
| c.begin(n), c.end(n) | 返回一个迭代器范围，表示第 n 个桶中的元素 |
| c.cbegin(n), c.cend(n) | 返回一个迭代器范围，表示第 n 个桶中的元素 |
| c.load_factor() | 返回 c 中平均每个桶有多少个元素，float |
| c.max_load_factor() | 返回或设置 c 的最大负载因子，当 load_factor 超过这个值，容器会自动增加桶的数量 |
| c.rehash(n) | 重组 c，使得 bucket_count 至少为 n，并且 bucket_count>size/max_load_factor |
| c.reserve(n) | 使得 c 至少能容纳 n 个元素，避免 rehash |

对关键字的要求：

- 无序容器使用关键字类型的==运算符来比较元素
- 还使用一个 hash\<key type\>类型的对象来生成每个元素的哈希值。
- 标准库为内置类型、string、智能指针定义了 hash
- 如果要使用自定义类型有两种方法：
  - 使用模板特化，定义 hash\<T\> 模板
  - 提供 hash 函数，和==运算符

下面给出一个提供 hash 函数的例子：

```cpp
size_t hasher(const Sales_data &sd) // 返回size_t 表示位置
{
	return hash<string>()(sd.isbn());
}
bool eqOp(const Sales_data &lhs, const Sales_data &rhs)
{
	return lhs.isbn() == rhs.isbn();
}

unordered_set<Sales_data, decltype(hasher)*, decltype(eqOp)*> SDset(42, hasher, eqOp);
```
