# intyper

This is TypeScript Implemention of
[Writing An Interpreter In Go](https://interpreterbook.com/)\
Copyright (c) 2016-2017 Thorsten Ball

|Chapter|Feature|Impremented|
|--|--|--|
|1|Lexing|✔️|
|2|Parsing|✔️|
|3|Evaluation|✔️|
|4|Extending the Interpreter|✔️|

### Usage

```
~/path/to/intyper 
$ deno run ./src/main.ts "<INPUT>" [option]
```

### Example

```zsh
~/path/to/intyper 
$ deno run ./src/main.ts \
> "if (len([1, 2, 3, 4]) > 3) {
        let add = fn(x, y) { x + y; };
        add(5 + 5, add(5, 5));
}"

 Hello! This is the Monkey programming language! 

### Eval 

20
```

### Debug mode

```zsh
~/path/to/intyper 
$ deno run ./src/main.ts \        
"if (len([1, 2, 3, 4]) > 3) {
    let add = fn(x, y) { x + y; };
    add(5 + 5, add(5, 5));
}" --debug

 Hello! This is the Monkey programming language! 

### Lexer 

Token { type: "IF", literal: "if" }
Token { type: "(", literal: "(" }
Token { type: "IDENT", literal: "len" }
Token { type: "(", literal: "(" }
Token { type: "[", literal: "[" }
Token { type: "INT", literal: "1" }
Token { type: ",", literal: "," }
Token { type: "INT", literal: "2" }
Token { type: ",", literal: "," }
Token { type: "INT", literal: "3" }
Token { type: ",", literal: "," }
Token { type: "INT", literal: "4" }
Token { type: "]", literal: "]" }
Token { type: ")", literal: ")" }
Token { type: ">", literal: ">" }
Token { type: "INT", literal: "3" }
Token { type: ")", literal: ")" }
Token { type: "{", literal: "{" }
Token { type: "LET", literal: "let" }
Token { type: "IDENT", literal: "add" }
Token { type: "=", literal: "=" }
Token { type: "FUNCTION", literal: "fn" }
Token { type: "(", literal: "(" }
Token { type: "IDENT", literal: "x" }
Token { type: ",", literal: "," }
Token { type: "IDENT", literal: "y" }
Token { type: ")", literal: ")" }
Token { type: "{", literal: "{" }
Token { type: "IDENT", literal: "x" }
Token { type: "+", literal: "+" }
Token { type: "IDENT", literal: "y" }
Token { type: ";", literal: ";" }
Token { type: "}", literal: "}" }
Token { type: ";", literal: ";" }
Token { type: "IDENT", literal: "add" }
Token { type: "(", literal: "(" }
Token { type: "INT", literal: "5" }
Token { type: "+", literal: "+" }
Token { type: "INT", literal: "5" }
Token { type: ",", literal: "," }
Token { type: "IDENT", literal: "add" }
Token { type: "(", literal: "(" }
Token { type: "INT", literal: "5" }
Token { type: ",", literal: "," }
Token { type: "INT", literal: "5" }
Token { type: ")", literal: ")" }
Token { type: ")", literal: ")" }
Token { type: ";", literal: ";" }
Token { type: "}", literal: "}" }

### Parser 

Program {
  statements: [
    ExpressionStatement {
      token: Token { type: "IF", literal: "if" },
      expression: IfExpression {
        token: [Object],
        condition: [Object],
        consequence: [Object],
        alternative: undefined
      },
      value: undefined
    }
  ]
}

### Eval 

20
```
