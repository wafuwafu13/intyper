import { Program, LetStatement, Identifier } from '../../src/ast/ast';
import { Token, TokenDef } from '../../src/token/token';

const stmt: any = new LetStatement(new Token(TokenDef.LET, 'let'));

stmt.name = new Identifier(new Token(TokenDef.IDENT, 'myVar'), 'myVar');

stmt.value = new Identifier(
  new Token(TokenDef.IDENT, 'anotherVar'),
  'anotherVar',
);

const program: any = new Program(stmt);

it('testString', () => {
  expect(program.statements.string()).toBe('let myVar = anotherVar;');
});
