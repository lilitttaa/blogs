---
title: Python Regex
---

```python
## findall() function returns a list containing all match strings.
txt = 'The rain in Spain'
x = re.findall('ai', txt)
print(x) ## ['ai', 'ai']

## search() function searches the string for a match, and returns a Match object if there is a match.
txt = 'The rain in Spain'
x = re.search('^The.*Spain$', txt)
print(x) ## <re.Match object; span=(0, 17), match='The rain in Spain'>

## split() function returns a list where the string has been split at each match.
txt = 'The rain in Spain'
x = re.split('\s', txt)
print(x) ## ['The', 'rain', 'in', 'Spain']

## sub() function replaces the matches with the text of your choice.
txt = 'The rain in Spain'
x = re.sub('\s', '9', txt)
print(x) ## The9rain9in9Spain
```

```python
## [] - A set of characters
txt = 'The rain in Spain'
x = re.findall('The [a-z]* in Spain',txt)
print(x) ## ['The rain in Spain']

## [^] - Excludes a set of characters
txt = 'The rain in Spain'
x = re.findall('The [^a-z]* in Spain',txt)
print(x) ## []

## . - Any character (except newline character)
txt = 'The rain in Spain'
x = re.findall('T....',txt)
print(x) ## ['The r']

## | - Either or
txt = 'The rain in Spain'
x = re.findall('rain|Spain',txt)
print(x) ## ['rain', 'Spain']
```

```python
## ^ - Starts with
txt = 'The rain in Spain'
x = re.findall('^The.*',txt)
print(x) ## ['The rain in Spain']
x = re.findall('^rain',txt)
print(x) ## []

## $ - Ends with
x = re.findall('.*Spain$',txt)
print(x) ## ['The rain in Spain']
x = re.findall('.*sp$',txt)
print(x) ## []
```

```python
## * - Zero or more occurrences
txt = 'The rain in Spain'
x = re.findall('S.*n',txt)
print(x) ## ['Spain']
x = re.findall('S.*p',txt)
print(x) ## ['Sp']

## + - One or more occurrences
txt = 'The rain in Spain'
x = re.findall('S.+n',txt)
print(x) ## ['Spain']
x = re.findall('S.+p',txt)
print(x) ## []

## ? - Zero or one occurrences
txt = 'The rain in Spain'
x = re.findall('Spa.?n',txt)
print(x) ## ['Spain']

## () - Capturing group
x = re.findall('Spa(in)?',txt)
print(x) ## ['in']
x = re.findall('(Spa)(in)?',txt)
print(x) ## [('Spa', 'in')]
## ?: - Non-capturing group
x = re.findall('Spa(?:in)?',txt)
print(x) ## ['Spain']

## {} - Exactly the specified number of occurrences
txt = 'hello helo'
x = re.findall('he.{2}o',txt)
print(x) ## ['hello']
x = re.findall('he.{1}o',txt)
print(x) ## ['helo']
```

```python
## \d - [0-9]
txt = 'The rain in Spain 123'
x = re.findall('\d',txt)
print(x) ## ['1', '2', '3']

## \s - space
txt = 'The rain in Spain 123'
x = re.findall('\s',txt)
print(x) ## [' ', ' ', ' ']

## \w - [a-zA-Z0-9_]
txt = 'The rain in Spain 123'
x = re.findall('\w',txt)
print(x) ## ['T', 'h', 'e', 'r', 'a', 'i', 'n', 'i', 'n', 'S', 'p', 'a', 'i', 'n', '1', '2', '3']

## \D \S \W - Opposite of \d \s \w
txt = 'The rain in Spain 123'
x = re.findall('\D',txt)
print(x) ## ['T', 'h', 'e', ' ', 'r', 'a', 'i', 'n', ' ', 'i', 'n', ' ', 'S', 'p', 'a', 'i', 'n', ' ']

## \A - Returns a match if the specified characters are at the beginning of the string
txt = 'The rain in Spain'
x = re.findall('\AThe',txt)
print(x) ## ['The']
x = re.findall('\Ain',txt)
print(x) ## []

## \Z - Returns a match if the specified characters are at the end of the string
txt = 'The rain in Spain'
x = re.findall('Spain\Z',txt)
print(x) ## ['Spain']

## \b - Returns a match where the specified characters are at the beginning or at the end of a word
txt = 'The rain in Spain'
x = re.findall(r'\bTh',txt)
print(x) ## ['Th']

## \B - Returns a match where the specified characters are present, but NOT at the beginning (or at the end) of a word
txt = 'The rain in Spain'
x = re.findall(r'\BTh',txt)
print(x) ## []
```
