---
title: Games105 2.Math Background
---

- [Lecture Notes](https://games-105.github.io/ppt/02%20-%20Math%20Background.pdf)

## Vector

![alt text](image.png)

vector : $\vec{a} = \begin{bmatrix} a_x & a_y & a_z \end{bmatrix}^T = \begin{bmatrix} a_x \\ a_y \\ a_z \end{bmatrix}$

magnitude/length/norm : $||\vec{a}|| = \sqrt{a_x^2 + a_y^2 + a_z^2}$

unit vector : $\hat{a} = \frac{\vec{a}}{||\vec{a}||}$

### Addition and Subtraction

$\vec{a} = \begin{bmatrix} a_x & a_y & a_z \end{bmatrix}^T$

$\vec{b} = \begin{bmatrix} b_x & b_y & b_z \end{bmatrix}^T$

$\vec{a} + \vec{b} = \begin{bmatrix} a_x + b_x & a_y + b_y & a_z + b_z \end{bmatrix}^T$

$\vec{a} - \vec{b} = \begin{bmatrix} a_x - b_x & a_y - b_y & a_z - b_z \end{bmatrix}^T$

$\vec{a} + 2\vec{b} = \begin{bmatrix} a_x + 2b_x & a_y + 2b_y & a_z + 2b_z \end{bmatrix}^T$

![alt text](image-1.png)

### Dot Product

$\vec{a} \cdot \vec{b} = \vec{b} \cdot \vec{a}$

$\vec{a} \cdot (\vec{b} + \vec{c}) = \vec{a} \cdot \vec{b} + \vec{a} \cdot \vec{c}$

$\vec{a} \cdot \vec{a}  = a_x^2 + a_y^2 + a_z^2 = ||\vec{a}||^2$

$\vec{a} \cdot \vec{b} = ||\vec{a}|| \cdot ||\vec{b}|| \cdot \cos\theta$

$\theta = \arccos\frac{\vec{a} \cdot \vec{b}}{||\vec{a}|| \cdot ||\vec{b}||}$
![alt text](image-2.png)

### Projection

$\ a_b = ||\vec{a}|| \cdot \cos\theta = \vec{a} \frac{\vec{b}}{||\vec{b}||}$
![alt text](image-3.png)

### Cross Product

$\vec{a} \times \vec{b} = -\vec{b} \times \vec{a}$

$\vec{a} \times \vec{a} = ||\vec{a}|| \cdot ||\vec{a}|| \cdot \sin0\hat{n} = \vec{0}$

$\vec{a} \times (\vec{b} + \vec{c}) = \vec{a} \times \vec{b} + \vec{a} \times \vec{c}$

$\vec{a} \times (\vec{b} \times \vec{c}) \neq (\vec{a} \times \vec{b}) \times \vec{c}$

$\vec{c} = \vec{a} \times \vec{b} =  \begin{bmatrix} a_yb_z - a_zb_y \\ a_zb_x - a_xb_z \\ a_xb_y - a_yb_x \end{bmatrix}$

$\vec{c} = \vec{a} \times \vec{b} = ||a|| \cdot ||b|| \cdot \sin\theta \cdot \hat{n}$

$\vec{n} \neq \frac{\vec{a}}{||\vec{a}||} \times \frac{\vec{b}}{||\vec{b}||}$

$\vec{n} = \frac{\vec{a} \times \vec{b}}{||\vec{a} \times \vec{b}||} \vec{a} \neq \vec{0}, \vec{b} \neq \vec{0}, \vec{a} \nparallel \vec{b}$
![alt text](image-4.png)

### How to find the rotation between vectors?

平分面上的任意向量都可以是轴：
![alt text](image-5.png)
The minium rotation:
$\vec{u} = \frac{\vec{a} \times \vec{b}}{||\vec{a} \times \vec{b}||}$

$\theta = \arccos\frac{\vec{a} \cdot \vec{b}}{||\vec{a}|| \cdot ||\vec{b}||}$

### How to rotate a vector?

![alt text](image-8.png)
$sin\alpha||\vec{a}|| = sin\alpha||\vec{a}||||\vec{u}|| = ||\vec{u}\times\vec{a}||$

$||\vec{v}|| = ||\vec{u}\times\vec{a}||sin\theta$

$\hat{v} = \frac{\vec{u} \times \vec{a}}{||\vec{u}\times\vec{a}||}$

$\vec{v} = ||\vec{v}||\hat{v} = sin\theta(\vec{u}\times\vec{a})$

$||\vec{t}|| = (1-cos\theta)||\vec{u}\times\vec{a}||$

$\hat{t} = \frac{\vec{u} \times(\vec{u}\times\vec{a})}{||\vec{u}\times(\vec{u}\times\vec{a})||}$

$||\vec{u}\times(\vec{u}\times\vec{a})|| = ||\vec{u}||||\vec{u}\times\vec{a}||=||\vec{u}\times\vec{a}||$

$\vec{t} = ||\vec{t}||\hat{t} = (1-cos\theta)(\vec{u}\times(\vec{u}\times\vec{a}))$

Rodrigues' rotation formula:
$\vec{b} = \vec{a} + \sin\theta(\vec{u} \times \vec{a}) + (1 - \cos\theta)\vec{u} \times(\vec{u} \times \vec{a}) $

### Orthogonal Basis and Orthogonal Coordinates（正交基和正交坐标）

![alt text](image-7.png)
$\vec{a} = \begin{bmatrix} a_x & a_y & a_z \end{bmatrix}^T \in \mathbb{R}^3$

$\vec{a}$ 在正交坐标下表示为：
$\vec{a} = a_x\vec{e_x} + a_y\vec{e_y} + a_z\vec{e_z}$

$a\cdot b$ 根据分配律展开，并消除正交项：
![alt text](image-9.png)
$\vec{a} \times \vec{b}$ 根据分配律展开，消除相同向量叉乘项，合并相反的叉乘项：
![alt text](image-10.png)
![alt text](image-11.png)

## Matrix

$A = \begin{bmatrix} a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33} \end{bmatrix} \in \mathbb{R}^{3 \times 3}$
$= \begin{bmatrix} \vec{a_1} & \vec{a_2} & \vec{a_3} \end{bmatrix}$

### Special Matrices

- Identity Matrix: $I = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$
- diagonal matrix: $D = \begin{bmatrix} d_1 & 0 & 0 \\ 0 & d_2 & 0 \\ 0 & 0 & d_3 \end{bmatrix}$
- symmetric matrix: $A = \begin{bmatrix} a & b & c \\ b & d & e \\ c & e & f \end{bmatrix} = A^T$
- skew-symmetric matrix: $A = \begin{bmatrix} 0 & -c & b \\ c & 0 & -a \\ -b & a & 0 \end{bmatrix} = -A^T$

### transpose

$A = \begin{bmatrix} a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33} \end{bmatrix} = \begin{bmatrix} \vec{a_1} & \vec{a_2} & \vec{a_3} \end{bmatrix}$
$A^T = \begin{bmatrix} a_{11} & a_{21} & a_{31} \\ a_{12} & a_{22} & a_{32} \\ a_{13} & a_{23} & a_{33} \end{bmatrix} = \begin{bmatrix} \vec{a_1}^T \\ \vec{a_2}^T \\ \vec{a_3}^T \end{bmatrix}$

### transpose of special matrices

![alt text](image-12.png)

### Matrix Operations

$A = \begin{bmatrix} a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33} \end{bmatrix}$

$sA = \begin{bmatrix} sa_{11} & sa_{12} & sa_{13} \\ sa_{21} & sa_{22} & sa_{23} \\ sa_{31} & sa_{32} & sa_{33} \end{bmatrix}$

$A + B = \begin{bmatrix} a_{11} + b_{11} & a_{12} + b_{12} & a_{13} + b_{13} \\ a_{21} + b_{21} & a_{22} + b_{22} & a_{23} + b_{23} \\ a_{31} + b_{31} & a_{32} + b_{32} & a_{33} + b_{33} \end{bmatrix}$

#### Matrix multiplication

![alt text](image-13.png)
$AB \neq BA$

$A(BC) = (AB)C$

$A(B + C) = AB + AC$

$(AB)^T = B^TA^T$

$IA = AI = A$

#### Inverse of a matrix

$M = A^{-1} \Rightarrow MA = AM = I$
$(AB)^{-1} = B^{-1}A^{-1}$

#### Matrix Form of Dot Product

$\vec{a} \cdot \vec{b} = a_xb_x + a_yb_y + a_zb_z = \begin{bmatrix} a_x & a_y & a_z \end{bmatrix} \begin{bmatrix} b_x \\ b_y \\ b_z \end{bmatrix} = \vec{a}^T\vec{b}$
$=\begin{bmatrix}b_x & b_y & b_z\end{bmatrix}\begin{bmatrix}a_x \\ a_y \\ a_z\end{bmatrix} = \vec{b}^T\vec{a}$

#### Matrix Form of Cross Product

$\vec{a} \times \vec{b} = \begin{bmatrix} a_yb_z - a_zb_y \\ a_zb_x - a_xb_z \\ a_xb_y - a_yb_x \end{bmatrix} = \begin{bmatrix} 0 & -a_z & a_y \\ a_z & 0 & -a_x \\ -a_y & a_x & 0 \end{bmatrix} \begin{bmatrix} b_x \\ b_y \\ b_z \end{bmatrix} = [\vec{a}]_{\times}\vec{b}$
$[\vec{a}]_{\times}$ 被称为叉乘矩阵，是 skew-symmetric matrix

$\vec{a}\times(\vec{b}\times\vec{c}) = [\vec{a}]_{\times}([\vec{b}]_{\times}\vec{c}) = [\vec{a}]_{\times}[\vec{b}]_{\times}\vec{c}$
$(\vec{a}\times\vec{b})\times\vec{c}  = [\vec{a}\times\vec{b}]_\times\vec{c}$

### How to rotate a vector?

![alt text](image-14.png)
![alt text](image-15.png)

### Orthogonal Matrix

矩阵的列向量（且行向量）是相互正交的
$A = \begin{bmatrix} \vec{a_1} & \vec{a_2} & \vec{a_3} \end{bmatrix}$
相互正交的：
$\vec{a}_i^T\vec{a}_j = \begin{cases} 1 & i = j \\ 0 & i \neq j \end{cases}$
$A^TA = \begin{bmatrix} \vec{a_1}^T \\ \vec{a_2}^T \\ \vec{a_3}^T \end{bmatrix} \begin{bmatrix} \vec{a_1} & \vec{a_2} & \vec{a_3} \end{bmatrix} = \begin{bmatrix} a_1^Ta_1 & a_1^Ta_2 & a_1^Ta_3 \\ a_2^Ta_1 & a_2^Ta_2 & a_2^Ta_3 \\ a_3^Ta_1 & a_3^Ta_2 & a_3^Ta_3 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} = I$
所以：
$A^T = A^{-1}$

## Determinant of a Matrix

$ A = \begin{bmatrix} a*{11} & a*{12} & a*{13} \\ a*{21} & a*{22} & a*{23} \\ a*{31} & a*{32} & a*{33} \end{bmatrix} \in \mathbb{R}^{3 \times 3}$
$det(A) = \begin{vmatrix} a*{11} & a*{12} & a*{13} \\ a*{21} & a*{22} & a*{23} \\ a*{31} & a*{32} & a*{33} \end{vmatrix} = a*{11} \begin{vmatrix} a*{22} & a*{23} \\ a*{32} & a*{33} \end{vmatrix} - a*{12} \begin{vmatrix} a*{21} & a*{23} \\ a*{31} & a*{33} \end{vmatrix} + a*{13} \begin{vmatrix} a*{21} & a*{22} \\ a*{31} & a*{32} \end{vmatrix} = a*{11}a*{22}a*{33} + a*{12}a*{23}a*{31} + a*{13}a*{21}a*{32} - a*{13}a*{22}a*{31} - a*{11}a*{23}a*{32} - a*{12}a*{21}a\_{33}$
![alt text](image-16.png)

$detI = 1$
$detAB = detA * detB$
$detA^T = detA$
如果 $detA = 0$，则 A 不可逆，反之则 A 可逆
如果 A 是 invertible（可逆的）：$detA^{-1} = (detA)^{-1}$
如果 U 是 orthogonal（正交的）：$detU = \pm 1$

正交矩阵的行列式：
$detU = \pm 1$
如果正交矩阵的列向量构成右手坐标系，则 $detU = 1$，否则 $detU = -1$

### Eigenvalues and Eigenvectors（特征值和特征向量）

For a matrix 𝐴, if a **nonzero** vector $\vec{x}$ satisfies:
$A\vec{x} = \lambda\vec{x}$

- Then $\lambda$ is an eigenvalue of 𝐴
- $\vec{x}$ is an eigenvector of 𝐴 corresponding to $\lambda$.

Especially, a 3x3 orthogonal matrix U has at least one real eigenvalue:
$\lambda = detU = \pm 1$

## Rigid Transformation

![alt text](image-17.png)

### Scale

![alt text](image-18.png)
$\vec{a} = \begin{bmatrix} a_x & a_y & a_z \end{bmatrix}^T$
$\vec{a^{'}} = \begin{bmatrix} s_xa_x & s_ya_y & s_za_z \end{bmatrix}^T = \begin{bmatrix} s_x & 0 & 0 \\ 0 & s_y & 0 \\ 0 & 0 & s_z \end{bmatrix} \begin{bmatrix} a_x \\ a_y \\ a_z \end{bmatrix} = S\vec{a}$

### Translation

![alt text](image-19.png)
$\vec{a^{'}} = \vec{a} + \vec{t}$

Combination of Translations:
![alt text](image-20.png)
$\vec{t} = \vec{t^{'}} + \vec{t^{''}}$

### Rotation

![alt text](image-21.png)
$\vec{a^{'}} = R\vec{a}$

- Rotation matrix is orthogonal: $R^{-1} = R^T$, $R^TR = RR^T = I$
- Determinant of R: $detR = +1$
- Rotation maintains length of vectors: $||R\vec{a}|| = ||\vec{a}||$

Combination of Rotations:
![alt text](image-22.png)
$R_2(R_1\vec{a}) = R_2R_1\vec{a} = R\vec{a}$

Rotation around coordinate axes:
![alt text](image-23.png)
$R_x(\alpha) = \begin{bmatrix} 1 & 0 & 0 \\ 0 & \cos\alpha & -\sin\alpha \\ 0 & \sin\alpha & \cos\alpha \end{bmatrix}$
$R_y(\beta) = \begin{bmatrix} \cos\beta & 0 & \sin\beta \\ 0 & 1 & 0 \\ -\sin\beta & 0 & \cos\beta \end{bmatrix}$
$R_z(\gamma) = \begin{bmatrix} \cos\gamma & -\sin\gamma & 0 \\ \sin\gamma & \cos\gamma & 0 \\ 0 & 0 & 1 \end{bmatrix}$

绕 xyz 旋转等价于绕某一轴旋转：
![alt text](image-24.png)

Rotation Axis and Angle
已知旋转矩阵 R 特征值为+1：
$R\vec{u} = \vec{u}$
意味着 $\vec{u}$ 是旋转中的不变量，因此 R 可以考虑为绕 $\vec{u}$ 轴旋转角度为 $\theta$的矩阵。

所以下面的问题是如何找到 $\vec{u}$ 和 $\theta$？
$R\vec{u} = \vec{u} \Rightarrow \vec{u} = R^T\vec{u}$
$\Rightarrow(R-R^T)\vec{u}=0$
$\Rightarrow\begin{bmatrix} 0 & -(r_{21}-r_{12}) & r_{13}-r_{31} \\ r_{21}-r_{12} & 0 & -(r_{32}-r_{23}) \\ -(r_{13}-r_{31}) & r_{32}-r_{23} & 0 \end{bmatrix}\vec{u}= \vec{0}$
该矩阵为 skew-symmetric matrix，因此可以表示为叉乘的形式：
$\vec{u'} \times \vec{u} = \vec{0}$
对照叉乘到反对称矩阵的关系，可以得到：
$u'_x = r_{32}-r_{23}, u'_y = r_{13}-r_{31}, u'_z = r_{21}-r_{12}$
所以$\vec{u'} = \begin{bmatrix} r_{32}-r_{23} \\ r_{13}-r_{31} \\ r_{21}-r_{12} \end{bmatrix}$
另外根据叉乘为 0，可以得到：$\vec{u}$与$\vec{u'}$共线，或者$\vec{u'} = \vec{0}$
什么时候$\vec{u'} = \vec{0}$呢？
当 $R = R^T \Rightarrow sin\theta = 0$ $\Rightarrow \theta = 0$ or $\pi$
