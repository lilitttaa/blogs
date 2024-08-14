---
title: C++ Primer 17.标准库特殊设施
---

## tuple 类型

- tuple 类型及其伴随类型和函数都定义在 tuple 头文件中。
- 可以将 tuple 看作一个“快速而随意”的数据结构

```cpp
tutple<size_t, size_t, size_t> threeD; // 所有成员都进行值初始化
tuple<string, vector<double>, int, list<int>> someVal("constants", {3.14, 2.718}, 42, {0, 1, 2, 3, 4, 5}); // explicit，使用值进行初始化
tutple<size_t, size_t, size_t> threeD{1, 2, 3}; // 使用花括号列表初始化
tutple<size_t, size_t, size_t> threeD = {1, 2, 3}; // 错误，explicit不能使用花括号列表初始化
auto item = make_tuple("0-999-78345-X", 3, 20.00); // 使用make_tuple函数，自动推断类型

auto book = get<0>(item); // item是右值，get返回右值引用
auto cnt = get<1>(item);
auto price = get<2>(item);
item.get<2>() *= 0.8; // item是左值，get返回左值引用

// == !=
tuple<size_t, size_t, size_t> threeD{1, 2, 3};
tuple<size_t, size_t, size_t> threeD2{1, 2, 3};
threeD == threeD2; // 长度相同，每个元素对应相等，返回true
threeD != threeD2; // false

// < <= > >= 字典序比较
tuple<size_t, size_t, size_t> threeD{1, 2, 3};
tuple<size_t, size_t, size_t> threeD2{1, 2, 4};
threeD < threeD2; // true

tuple<size_t, size_t, size_t> threeD{1, 2, 3};
tuple<size_t, size_t, size_t, size_t> threeD2{1, 2, 4, 5};
threeD < threeD2; // 错误，类型不同

tuple_size<decltype(item)>::value; // 3个元素，public constexpr static const size_t value = 3;

tuple_element<0, decltype(item)>::type; // 0号元素的类型
```

使用 tuple 返回多个值：

```cpp
tuple<string, int, double> get_student(int id)
{
	if (id == 0)
		return {"Tom", 20, 3.8};
	else if (id == 1)
		return {"Jerry", 21, 3.9};
	else
		return {"Mickey", 22, 4.0};
}
```

## bitset 类型

- 可以使用整数作为二进制位集合进行运算
- Bitset 能够处理超过最长整数位的大小
- 定义在头文件 bitset 中

```cpp
bitset<32> bitvec; // 32位的bitset，每位都是0，constexpr构造函数
bitset<13> bitvec2(0xbeef); // 使用unsigned long long初始化，bitset如果超过其位数，高位置为0
string str("1100");
bitset<32> bitvec3(str, 0, str.size()); // 从字符串初始化，从0开始，长度为str.size()
string str("aabb");
bitset<32> bitvec4(str, 0, str.size(), 'a', 'b'); // 从字符串初始化，从0开始，长度为str.size()，a和b分别对应0和1
bitset<32> bitvec5("1100", 4); // 从const char*初始化，从4开始，长度为4
```

更多细节参考：
![Alt text](image.png)

bitset 的操作：

```cpp
// any, all, none, count, size
bitset<8> bitvec("1100"); // 0 0 0 0 1 1 0 0
bitvec.any(); // true，是否有1
bitvec.all(); // false，是否全是1
bitvec.none(); // false，是否全是0
bitvec.count(); // 2，1的个数
bitvec.size(); // 8，位数
```

```cpp
// test, set, reset, flip，[]
bitset<8> bitvec("1100"); // 0 0 0 0 1 1 0 0
bitvec.test(0); // false，第0位是否为1
bitvec.test(2); // true，第2位是否为1
bitvec.set(0); // 0 0 0 0 1 1 0 1，将第0位设置为1
bitvec.set(2, 0); // 0 0 0 0 1 0 0 1，将第2位设置为0
bitvec.reset(3); // 0 0 0 0 0 0 0 1，将第3位设置为0
bitvec.reset(); // 0 0 0 0 0 0 0 0，将所有位设置为0
bitvec.flip(0); // 0 0 0 0 0 0 0 1，将第0位取反
bitvec.flip(); // 1 1 1 1 1 1 1 0，将所有位取反
bool b = bitvec[0]; // false，第0位是否为1
bool b = bitvec[2]; // true，第2位是否为1
```

```cpp
// |, &, ^, ~, <<, >>
bitset<8> bitvec("1100"); // 0 0 0 0 1 1 0 0
bitset<8> bitvec2("0110"); // 0 0 0 0 0 1 1 0
bitset<8> result = bitvec & bitvec2; // 0 0 0 0 0 1 0 0
bitset<8> result = bitvec | bitvec2; // 0 0 0 0 1 1 1 0
bitset<8> result = bitvec ^ bitvec2; // 0 0 0 0 1 0 1 0
bitset<8> result = ~bitvec; // 1 1 1 1 0 0 1 1
bitset<8> result = bitvec << 2; // 0 0 0 1 1 0 0 0
bitset<8> result = bitvec >> 2; // 0 0 0 0 0 0 1 1
```

```cpp
// to_ulong, to_ullong, to_string
bitset<8> bitvec("1100"); // 0 0 0 0 1 1 0 0
unsigned long ulong = bitvec.to_ulong(); // 12
unsigned long long ullong = bitvec.to_ullong(); // 12
string str = bitvec.to_string(); // "00000011"
```

```cpp
// <<, >>
bitset<8> bitvec("1100"); // 0 0 1 1 0 0 0 0
cin >> bitvec; // 从cin读入最多8个字符，0和1
cout << bitvec << endl; // 输出
```

## 正则表达式

- 定义在头文件 regex 中

![Alt text](image-1.png)

regex_match 和 regex_search

- 都返回一个 bool 值，表示是否找到了匹配的子串
- 两种类型参数：
  - (seq, m, r, mft)
  - (seq, r, mft)

其中：

- seq：可以是 string，一对迭代器，c 风格字符串指针
- m：smatch 对象，保存匹配结果的细节
- r：regex 对象，表示正则表达式
- mft：可选的 regex_constants::match_flag_type，控制匹配的方式

```cpp
string pattern("[[:alpha:]]*[^c]ei[[:alpha:]]*"); // 匹配ei但不是cei的单词
regex r(pattern);
smatch results;
string test_str = "receipt freind theif receive";
if (regex_search(test_str, results, r))
	cout << results.str() << endl; // freind
```

- 可以指定一些标志来影响 regex 如何操作。这些标志控制 regex 对象的处理过程。
- flag 可以指定正则使用的语法
  - 默认情况下，regex 会使用 ECMA-262 规范(很多 Web 浏览器使用的正则表达式语言)
  - ECMAScript：ECMA-262 规范
  - basic：POSIX 基本正则表达式
  - extended：POSIX 扩展正则表达式
  - awk：POSIX 版本 awk 语言语法
  - grep：POSIX 版本 grep 语法
  - egrep：POSIX 版本 egrep 语法
- 除此之外还有：
  - icase：忽略大小写
  - nosubs：不存储子表达式
  - optimize：执行速度优先于构造速度

regex 的相关操作：
| 操作 | 说明 |
| --- | --- |
| regex r(re) | re 可以是 string、c 风格字符串、迭代器范围、花括号列表、字符指针和计数器 |
| regex r(re, flag) | flag 是 regex_constants::syntax_option_type 类型 |
| r1 = re| 赋值，re 可以是 regex，也可以是前面

```cpp
// 构造
regex r("[[:alpha:]]*");
regex r(string("[[:alpha:]]*"));
string pattern("[^c]ei");
regex r(begin(pattern), end(pattern));
regex r({'[', '^', 'c', ']', 'e', 'i'});
regex r("[[:alpha:]]*", regex::icase|regex::grep);
regex r2("[^c]ei", regex::icase);

// 赋值
r1 = r2;
r1 = "[^c]ei";
r1.assign("[^c]ei", regex::icase);

r.mark_count(); // 返回正则表达式中的子表达式数量
r.flags(); // 返回正则表达式的标志
```

- 正则表达式的语法是否正确是在运行时解析的。
- 如果正则表达式存在错误，则在运行时标准库会抛出一个类型为 regex_error 的异常。

```cpp
try
{
	regex r("[[:alpha:]]*[^c]ei[[:alpha:]]*");
}
catch(regex_error e)
{
	cout << e.what() << "\ncode: " << e.code() << endl;
}
```

正则表达式错误类型：
![Alt text](image-4.png)

正则表达式编译是很慢的，不要在循环中构造。

根据输入序列类型的不同，使用不同的正则表达式相关类型：
| 输入序列类型 | regex 类型| match 类型 | sub_match 类型 | iterator 类型 |
| --- | --- | --- | --- | --- |
| string | regex | match_results | sub_match | sregex_iterator |
| const char* | cregex | cmatch | csub_match | cregex_iterator |
| wstring | wregex | wmatch | wsub_match | wsregex_iterator |
| const wchar_t* | wcregex | wcmatch | wcsub_match | wcregex_iterator |

### 匹配与 regex 迭代器类型

使用迭代器访问所有匹配的子串，注意：

- regex 的迭代器跟一般的迭代器机制有点区别
  ![Alt text](image-5.png)
- 递增迭代器时，跳到下一个匹配

```cpp
string pattern("[[:alpha:]]*[^c]ei[[:alpha:]]*");
regex r(pattern);
for (sregex_iterator it(file.begin(), file.end(), r), end_it; it != end_it; ++it) // ++时跳到下一个匹配
    cout << it->str() << endl; //迭代器指向smatch对象，可以使用str()获取匹配的子串
```

smatch 支持的操作：
![Alt text](image-6.png)

### 使用子表达式

- 括号内的部分称为子表达式，类似于一些语言中的捕获组

```cpp
regex r("([[:alnum:]]+)\\.(cpp|cxx|cc)$", regex::icase);
smatch results;
string filename{"file.cpp"};
if (regex_search(filename, results, r))
{
	cout << results.str() << endl; // file.cpp
	cout << results.str(0) << endl; // file.cpp
	cout << results.str(1) << endl; // file
	cout << results.str(2) << endl; // cpp
	cout << results[0] << endl; // file.cpp
	cout << results[1] << endl; // file
	cout << results[2] << endl; // cpp
}
```

子匹配操作：
![Alt text](image-7.png)

### 使用 regex_replace

- regex_replace 比起 search 额外新增了一个描述输出 format 的参数 -标准库还定义了用来在替换过程中控制匹配或格式的标志。
  ![Alt text](image-8.png)

```cpp
regex phone("\\()?\\d{3}(\\))?([-. ])?\\d{3}([-. ])?\\d{4}");
string number = "morgan (201)555-2368 862-555-0123";
string fmt = "$2.$5.$7"; //$2表示第二个子表达式
cout << regex_replace(number, phone, fmt) << endl; // morgan 201.555.2368 862.555.0123

cout << regex_replace(number, phone, fmt, regex_constants::format_no_copy) << endl; // 201.555.2368 862.555.0123
```

## 随机数

- 定义在头文件 random 中
- 通过一组协作的类来解决这些问题：随机数引擎类和随机数分布类
  - 随机数引擎类生成 unsigned 整数序列
  - 随机数分布类使用引擎返回符合特定分布的随机数
- C++程序不应该使用库函数 rand，而应使用 default random engine 类和恰当的分布类对象。
- 标准库定义了多个随机数引擎类，它们性能和质量不同，编译器选择默认的引擎类。
- 某些分布可能需要调用引擎多次才能得到一个值。

```cpp
default_random_engine e; // 默认引擎
for (size_t i = 0; i < 10; ++i)
	cout << e() << " "; // 生成随机数

uniform_int_distribution<unsigned> u(0, 9); // 0到9的均匀分布
for (size_t i = 0; i < 10; ++i)
	cout << u(e) << " "; // 生成0到9的随机数
```

```cpp
default_random_engine e; // 默认引擎
default_random_engine e2(2147483646); // 指定种子
e.seed(32767); // 指定种子
e.min(); // 引擎能生成的最小值
e.max(); // 引擎能生成的最大值
Engine::result_type; // 引擎生成的类型
e.discard(100); // 将引擎推荐100个值，参数为unsigned long long
```

随机性中令人困惑的部分：

- 每次运行程序，生成的随机数序列都是相同的（序列不变，对于调试来说确实很有用）
- 一个给定的随机数发生器，生成的内容是确定的。因此如果封装为函数，每次获取的结果都一样
- 可以将引擎和分布设为 static 的，这样每次生成都会保持状态

```cpp
unsigned get_random_number()
{
	default_random_engine e;
	uniform_int_distribution<unsigned> u(0, 9);
	return u(e);
}
cout << get_random_number() << endl;
cout << get_random_number() << endl; // 每次调用生成的随机数都一样

unsigned get_random_number()
{
	static default_random_engine e;
	static uniform_int_distribution<unsigned> u(0, 9);
	return u(e);
}
cout << get_random_number() << endl;
cout << get_random_number() << endl; // 保持状态，生成的随机数不一样
```

设置种子：

```cpp
default_random_engine e1;
e1.seed(32767); // 指定种子
default_random_engine e2(32767); // 指定种子
cout << e1() << endl;
cout << e2() << endl; // 种子相同，两个引擎生成的随机数序列相同

default_random_engine e1(time(0)); // 使用当前时间作为种子，但这个时间的变化是以秒为单位的，所以只适用于间隔大于1秒的情况
cout << e1() << endl;
```

### 其他的随机数分布

应用常常需要：

- 不同类型的随机数
- 不同的分布

```cpp
default_random_engine e;
uniform_real_distribution<double> u(0, 1); // 0到1的均匀分布
for (size_t i = 0; i < 10; ++i)
	cout << u(e) << " "; // 生成0到1的随机浮点数
```

分布类型操作：

```cpp
uniform_real_distribution<double> u； // 默认构造函数，其他构造函数的形式依赖于类型
uniform_real_distribution<> u; //默认为double类型
uniform_int_distribution<> u; // 默认为int类型
u(e); // 生成一个随机数
u.min(); // 返回分布的最小值
u.max(); // 返回分布的最大值
u.reset(); // 重建u的状态，使得后续的生成不再依赖于之前的值
```

标准库中定义了 20 种不同的分布类型

```cpp
// 正态分布
normal_distribution<> n(4, 1.5); // 均值4，标准差1.5
// 伯努利分布 总是返回一个bool值
bernoulli_distribution b; // 默认概率0.5/0.5
bernoulli_distribution b(0.75); // true的概率0.75
```

### 随机数附录

待补充

## IO 库再探

### 格式化输入和输出

- 除了条件状态外，每个 iostream 对象还维护一个格式状态
- 该状态控制 IO 如何格式化的细节：如整型值进制、浮点精度、元素宽度等
- 标准库定义了一组操纵符来修改流的格式状态
  - 操纵符用于两大类输出控制:控制数值的输出形式以及控制补白的数量和位置
  - 大多数改变格式状态的操纵符都是设置/复原成对的：一个用来将格式状态设置为一个新值，另一个用来将其复原。
  - 将流的状态置于一个非标准状态可能会导致错误。通常在不再需要特殊格式时尽快将流恢复到默认状态。

bool：

- boolalpha：将 bool 值输出为 true 或 false
- noboolalpha

```cpp
cout << true << " " << false; // 1 0
cout << boolalpha << true << " " << false << noboolalpha; // true false
```

整数：

- dec：十进制
- oct：八进制
- hex：十六进制
- showbase：显示进制前缀
- noshowbase

```cpp
cout << "default: " << 20 << " " << 1024 << endl; // 20 1024
cout << "oct: " << oct << 20 << " " << 1024 << endl; // 24 2000
cout << "hex: " << hex << 20 << " " << 1024 << endl; // 14 400
cout << "dec: " << dec << 20 << " " << 1024 << endl; // 20 1024

cout << showbase; // 显示进制前缀
cout << "default: " << 20 << " " << 1024 << endl; // 20 1024
cout << "oct: " << oct << 20 << " " << 1024 << endl; // 024 02000
cout << "hex: " << hex << 20 << " " << 1024 << endl; // 0x14 0x400
cout << "dec: " << dec << 20 << " " << 1024 << endl; // 20 1024
cout << noshowbase;
```

浮点数：

- setprecision(n)：设置浮点数的精度为 n 位，数字的总位数（整数+小数）
- scientific：使用科学计数法
- fixed：使用定点十进制
- hexfloat：使用十六进制浮点数
- defaultfloat：恢复默认格式
- sceintific、fixed、hexfloat 会改变精度的含义，表示小数点后的位数
- setprecision 和其他接受参数的操纵符都定义在头文件 iomanip 中
- showpoint：显示小数点
- noshowpoint

```cpp
float f = 100*sqrt(2.0);
cout << f << endl; // 141.421
cout << setprecision(4) << f << endl; // 141.4
cout << scientific << f << endl; // 1.4142e+02
cout << fixed << f << endl; // 141.4214
cout << hexfloat << f << endl; // 0x1.1eb85p+7
cout << defaultfloat << f << endl; // 141.421

cout << 10.0 << endl; // 10
cout << showpoint << 10.0 << endl; // 10.000
cout << noshowpoint << 10.0 << endl; // 10
```

还有其他的操纵符，参考如下：
![Alt text](image-2.png)
![Alt text](image-3.png)

### 未格式化的输入输出操作

- 标准库还提供了一组低层操作，支持未格式化 IO（可以将流当作无解释的字节序列来处理）
- 未格式化操作会读取而不是忽略空白符（与格式化 IO 使用 noskipws 相同）

单字节 IO：

```cpp
char ch;
while(cin.get(ch)) // 读取字符，返回cin
	cout.put(ch); // 输出字符，返回cout

int ch;
while((ch = cin.get()) != EOF) // 读取字节，返回int
	cout.put(ch);
```

```cpp
int i = cin.get(); // 读取一个字节，返回int
int i = cin.peek(); // 读取一个字节，返回int，但不从流中删除
```

```cpp
// 读取，再放回去
char ch;
cin.get(ch);
cin.putback(ch); // 参数必须和上次读取的值相同

// 读取，再回退
char ch;
cin.get(ch);
cin.unget(); // 回退

```

多字节 IO：

- 处理大块数据，多字节 IO 比单字节 IO 更高效
- 这些操作容易出错，因为需要自己分配并管理保存和提取的字符数组

| 操作                         | 说明                                                                                                                        |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| cin.get(sink,size,delim)     | 从输入流中读取字符，存到 sink 指向的字符数组中，最多读取 size 个字符，直到遇到 delim 字符或者文件结束符，delim 本身不被读取 |
| cin.getline(sink,size,delim) | 同上，但是 delim 会被读取                                                                                                   |
| cin.read(sink,size)          | 从输入流中读取 size 个字符，存到 sink 指向的字符数组中，并返回 cin                                                          |
| cin.gcount()                 | 返回最近一次读取操作读取的字符数                                                                                            |
| cout.write(source,size)      | 将 source 指向的字符数组中的 size 个字符写到输出流中，并返回 cout                                                           |
| cin.ignore(size,delim)       | 从输入流读取并丢弃 size 个字符，包括 delim，size 默认为 1，delim 默认为 EOF                                                 |

```cpp
char ch;
while((ch = cin.get()) != EOF) // 循环可能永远不会结束，如果char的编译器实现是unsigned，则永远不会等于EOF
	cout.put(ch);
```

### 流随机访问

- 各种流类型通常都支持对流中数据的随机访问
- 但它们是否会做有意义的事情依赖于流绑定到哪个设备。在大多数系统中，绑定到 cin、cout、cerr 和 clog 的流不支持随机访问。
- 可以重定位流，跳过一些数据，先读最后一行，然后读取第一行等。
- 标准库提供了函数 seek 用于流中定位，tell 获取其位置。
- seek 和 tell 分别有 g(get)和 p(put)版本，用于输入和输出流。

```cpp
// seekg, tellg
ifstream in("file");
ifstream::off_type off = 10; // 表示偏移量，可以是正数或负数
in.seekg(off, ios::beg); // 定位到文件开始，往后移动10个字符
in.seekg(-5, ios::cur); // 定位到从当前位置开始，往前移动5个字符
in.seekg(0, ios::end); // 定位文件末尾
ifstream::pos_type mark = in.tellg(); // 获取当前位置
in.seekg(mark); // 回到mark位置

// seekp, tellp
ofstream out("file");
ofstream::off_type off = 10; // 表示偏移量，可以是正数或负数
out.seekp(off, ios::beg); // 定位到文件开始，往后移动10个字符
out.seekp(-5, ios::cur); // 定位到从当前位置开始，往前移动5个字符
out.seekp(0, ios::end); // 定位文件末尾
ofstream::pos_type mark = out.tellp(); // 获取当前位置
out.seekp(mark); // 回到mark位置
```

```cpp
fstream fstrm("file", fstream::in | fstream::out| fstream::ate); // 读写模式，定位到文件末尾

if(!fstrm)
{
	cerr << "Unable to open file!" << endl;
	return -1;
}
auto end_mark = fstrm.tellg(); // 记录文件末尾位置
fstrm.seekg(0, fstream::beg); // 回到文件开始
size_t cnt = 0;
string line;
while(fstrm && fstrm.tellg() != end_mark && getline(fstrm, line))
{
	cnt += line.size() + 1;
	auto mark = fstrm.tellg(); // 记录当前位置
	fstrm.seekp(0, fstream::end);
	fstrm << cnt;
	if(mark != end_mark)
		fstrm << " ";
	fstrm.seekg(mark);
}
```
