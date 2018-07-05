# SE View

SE View (S-Expression View)

_More content to come..._

## Varargs and text nodes

The problem with supporting varargs is, how do you differentiate an element from two text nodes?

For example:

```js
["div", ["b", "hello"]]
```

vs


```js
["div", ["hello", "there"]]
```

For the second case, varargs MUST be used:

```js
["div", "hello", "there"]
```
