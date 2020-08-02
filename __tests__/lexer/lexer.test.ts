import { TokenDef } from '../../src/token/token';
import { Lexer } from '../../src/lexer/lexer';

const input: string = `let five = 5;

let ten = 10;

let add = fn(x, y) {
  x + y;
};

let result = add(five, ten);
!-/*5;
5 < 10 > 5;

if (5 < 10) {
  return true;
} else {
  return false;
}

10 == 10;
10 != 9;
`;

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
  { [TokenDef.BANG]: '!' },
  { [TokenDef.MINUS]: '-' },
  { [TokenDef.SLASH]: '/' },
  { [TokenDef.ASTERISK]: '*' },
  { [TokenDef.INT]: '5' },
  { [TokenDef.SEMICOLON]: ';' },
  { [TokenDef.INT]: '5' },
  { [TokenDef.LT]: '<' },
  { [TokenDef.INT]: '10' },
  { [TokenDef.GT]: '>' },
  { [TokenDef.INT]: '5' },
  { [TokenDef.SEMICOLON]: ';' },
  { [TokenDef.IF]: 'if' },
  { [TokenDef.LPAREN]: '(' },
  { [TokenDef.INT]: '5' },
  { [TokenDef.LT]: '<' },
  { [TokenDef.INT]: '10' },
  { [TokenDef.RPAREN]: ')' },
  { [TokenDef.LBRACE]: '{' },
  { [TokenDef.RETURN]: 'return' },
  { [TokenDef.TRUE]: 'true' },
  { [TokenDef.SEMICOLON]: ';' },
  { [TokenDef.RBRACE]: '}' },
  { [TokenDef.ELSE]: 'else' },
  { [TokenDef.LBRACE]: '{' },
  { [TokenDef.RETURN]: 'return' },
  { [TokenDef.FALSE]: 'false' },
  { [TokenDef.SEMICOLON]: ';' },
  { [TokenDef.RBRACE]: '}' },
  { [TokenDef.INT]: '10' },
  { [TokenDef.EQ]: '==' },
  { [TokenDef.INT]: '10' },
  { [TokenDef.SEMICOLON]: ';' },
  { [TokenDef.INT]: '10' },
  { [TokenDef.NOT_EQ]: '!=' },
  { [TokenDef.INT]: '9' },
  { [TokenDef.SEMICOLON]: ';' },
  { [TokenDef.EOF]: '' },
];

let l = new Lexer(input);

it('NextToken', () => {
  for (let expectedType in tests) {
    let tok = l.NextToken();
    expect(tok.type).toBe(Object.keys(tests[expectedType])[0]);
    expect(tok.literal).toBe(Object.values(tests[expectedType])[0]);
  }
});
