import { TokenDef } from '../../src/token/token'
import { Lexer } from '../../src/lexer/lexer'

const input: string = `let five = 5;

let ten = 10;

let add = fn(x, y) {
  x + y;
};

let result = add(five, ten);
`

const tests: { [expectedType: string]: string }[] = [
  { [TokenDef.LET]: 'let' },
  { [TokenDef.IDENT]: 'five' },
  { [TokenDef.ASSIGN]: '=' },
  { [TokenDef.INT]: '5' },
  { [TokenDef.SEMICOLON]: ';' },
  { [TokenDef.LET]: 'let' },
  { [TokenDef.IDENT]: 'ten' },
  { [TokenDef.ASSIGN]: '=' },
  { [TokenDef.INT]: '10' },
  { [TokenDef.SEMICOLON]: ';' },
  { [TokenDef.LET]: 'let' },
  { [TokenDef.IDENT]: 'add' },
  { [TokenDef.ASSIGN]: '=' },
  { [TokenDef.FUNCTION]: 'fn' },
  { [TokenDef.LPAREN]: '(' },
  { [TokenDef.IDENT]: 'x' },
  { [TokenDef.COMMA]: ',' },
  { [TokenDef.IDENT]: 'y' },
  { [TokenDef.RPAREN]: ')' },
  { [TokenDef.LBRACE]: '{' },
  { [TokenDef.IDENT]: 'x' },
  { [TokenDef.PLUS]: '+' },
  { [TokenDef.IDENT]: 'y' },
  { [TokenDef.SEMICOLON]: ';' },
  { [TokenDef.RBRACE]: '}' },
  { [TokenDef.SEMICOLON]: ';' },
  { [TokenDef.LET]: 'let' },
  { [TokenDef.IDENT]: 'result' },
  { [TokenDef.ASSIGN]: '=' },
  { [TokenDef.IDENT]: 'add' },
  { [TokenDef.LPAREN]: '(' },
  { [TokenDef.IDENT]: 'five' },
  { [TokenDef.COMMA]: ',' },
  { [TokenDef.IDENT]: 'ten' },
  { [TokenDef.RPAREN]: ')' },
  { [TokenDef.SEMICOLON]: ';' },
]

let l = new Lexer(input)

it('NextToken', () => {
  for (let expectedType in tests) {
    let tok = l.NextToken()
    expect(tok.type).toBe(Object.keys(tests[expectedType])[0])
    expect(tok.literal).toBe(Object.values(tests[expectedType])[0])
  }
})
