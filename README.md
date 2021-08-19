## Reference

[Go言語でつくるインタプリタ](https://www.oreilly.co.jp/books/9784873118222/)

## Blog

[『Go言語で作るインタプリタ』をTypeScriptで実装する](https://wafuwafu13.hatenadiary.com/entry/2020/08/18/115126)

## How to try

### Run tests
```zsh
$ git clone https://github.com/wafuwafu13/Interpreter-made-in-TypeScript.git
$ cd Interpreter-made-in-TypeScript
$ npm i
$ npm run test
```

### Input and Build

Change here

```ts
const input = '(5 + 10 * 2 + 15 / 3) * 2 + -10';
```
https://github.com/wafuwafu13/Interpreter-made-in-TypeScript/blob/bbdce3acd38986e1474565b5e960c1bc95369bc0/src/repl/repl.ts#L7

and build
```zsh
$ npm run build
$ cd dist
$ node bundle.js
```

## Example

### Input

```ts
const input = `
if (len([1, 2, 3, 4]) > 3) {
	let add = fn(x, y) { x + y; };
	add(5 + 5, add(5, 5));
}
`;
```

### Lexer

![スクリーンショット 2021-07-17 11 33 14](https://user-images.githubusercontent.com/50798936/126022680-1fc710ac-4d93-4bcb-8320-21793f690286.png)

### Parser

![スクリーンショット 2021-07-17 11 34 25](https://user-images.githubusercontent.com/50798936/126022699-b94e66c9-2bbe-4766-897e-6cf90240b06e.png)

### Evaluator

![スクリーンショット 2021-07-17 11 35 23](https://user-images.githubusercontent.com/50798936/126022719-d22d9c51-01c0-4792-8b43-11ea5196a253.png)
