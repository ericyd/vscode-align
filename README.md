# vscode-align
A naive alignment extension for vscode

This extension will do two things:

1. align multiple lines on `=` or `:` characters
2. align multiple lines on words that are repeated in all lines

## Limitations

* no language features (e.g. aligning on function calls, etc
* lots of others, it's very basic

## Examples

### css

Before:

```css
.my-class {
    box-sizing: border-box;
    background-color: #fff;
    font-family: sans-serif;
}
```

After:

```css
.my-class {
    box-sizing      : border-box;
    background-color: #fff;
    font-family     : sans-serif;
}
```

### js

Before:

```js
function manyParamDefaults(param1 = "test",
                           longerParam = 42,
                           thirdParam = "twelve")
{ return false; }
```

After:

```js
function manyParamDefaults(param1      = "test",
                           longerParam = 42,
                           thirdParam  = "twelve")
{ return false; }
```

### html

```html
```
