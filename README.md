# vscode-align
A naive alignment extension for vscode

This extension will do two things:

1. align multiple lines on `=` or `:` characters
2. align multiple lines on words that are repeated in all lines

## Limitations

* no language features (e.g. aligning on function calls or keywords)
* doesn't align if one of the lines doesn't share a word - the word or token must be shared across all selected lines in order to align.

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

Before:

```html
<img src="img1.jpg" alt="an image named 'one'" width="100px" height="100px" />
<img src="anotherimage.png" alt="secondary image" width="20em" height="20em" />
<img src="thirdPic.gif" alt="funny gif" width="54.25%" height="32.68%" />
```

After:

```html
<img src="img1.jpg"         alt="an image named 'one'" width="100px"  height="100px"  />
<img src="anotherimage.png" alt="secondary image"      width="20em"   height="20em"   />
<img src="thirdPic.gif"     alt="funny gif"            width="54.25%" height="32.68%" />
```