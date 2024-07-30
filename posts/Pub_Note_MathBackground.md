---
title: Games105 2.Math Background
---

- [Lecture Notes](https://games-105.github.io/ppt/02%20-%20Math%20Background.pdf)

## Vector

![alt text](image.png)

- vector : $\vec{a} = \begin{bmatrix} a_1 & a_2 & a_3 \end{bmatrix} = \begin{bmatrix} a_1 \\ a_2 \\ a_3 \end{bmatrix}^T$
- magnitude/length/norm : $||\vec{a}|| = \sqrt{a_1^2 + a_2^2 + a_3^2}$
- unit vector : $\hat{a} = \frac{\vec{a}}{||\vec{a}||}$

### Vector Arithmetic

$\vec{a} = \begin{bmatrix} a_1 & a_2 & a_3 \end{bmatrix}$
$\vec{b} = \begin{bmatrix} b_1 & b_2 & b_3 \end{bmatrix}$
$\vec{a} + \vec{b} = \begin{bmatrix} a_1 + b_1 & a_2 + b_2 & a_3 + b_3 \end{bmatrix}$
$\vec{a} - \vec{b} = \begin{bmatrix} a_1 - b_1 & a_2 - b_2 & a_3 - b_3 \end{bmatrix}$
$\vec{a} + 2\vec{b} = \begin{bmatrix} a_1 + 2b_1 & a_2 + 2b_2 & a_3 + 2b_3 \end{bmatrix}$

![alt text](image-1.png)

$\vec{a} \cdot \vec{b} = \vec{b} \cdot \vec{a}$
$\vec{a} \cdot (\vec{b} + \vec{c}) = \vec{a} \cdot \vec{b} + \vec{a} \cdot \vec{c}$
$\vec{a} \cdot \vec{a}  = a_1b_1 + a_2b_2 + a_3b_3 = ||\vec{a}||^2$
$\vec{a} \cdot \vec{b} = ||\vec{a}|| \cdot ||\vec{b}|| \cdot \cos\theta$
$\theta = \arccos\frac{\vec{a} \cdot \vec{b}}{||\vec{a}|| \cdot ||\vec{b}||}$
![alt text](image-2.png)
投影
$\ a_b = ||\vec{a}|| \cdot \cos\theta = \vec{a} \frac{\vec{b}}{||\vec{b}||}$
![alt text](image-3.png)
