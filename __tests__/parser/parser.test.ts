import { Lexer } from '../../src/lexer/lexer';
import { Parser } from '../../src/parser/parser';
import { Program, LetStatement } from '../../src/ast/ast';

const input = `let x = 5;
let y = 10;
let foobar = 838383;
`;

const l = new Lexer(input);
const p = new Parser(l);

const program: Program = p.parseProgram();

it('parseProgram', () => {
  expect(program).not.toBe(null);
  expect(program.statements.length).toBe(3);
});

const tests = ['x', 'y', 'foobar'];

for (let i = 0; i < tests.length; i++) {
  let stmt: LetStatement = program.statements[i];
  // console.log(stmt)
  it('letStatement', () => {
    expect(stmt.tokenLiteral()).toBe('let');
    expect(stmt.name.value).toBe(tests[i]);
    expect(stmt.name.tokenLiteral()).toBe(tests[i]);
  });
}
