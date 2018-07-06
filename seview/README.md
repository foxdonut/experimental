# SE View

SE View (S-Expression View)

_More content to come..._

## Credits

SE View is inspired by the following. Credit goes to the authors and their communities.

- [How to UI in 2018](https://medium.com/@thi.ng/how-to-ui-in-2018-ac2ae02acdf3)
- [ijk](https://github.com/lukejacksonn/ijk)
- [JSnoX](https://github.com/af/JSnoX)
- [Mithril](http://mithril.js.org)
- [domvm](https://domvm.github.io/domvm/)

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
