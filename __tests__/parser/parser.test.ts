import { Lexer } from '../../src/lexer/lexer';
import { Parser } from '../../src/parser/parser';
import { Program, LetStatement } from '../../src/ast/ast';

const input = `let x = 5;
let y = 10;
let foobar = 838383;
`;

const l = new Lexer(input);
const p = new Parser(l);

const program: Program | null = p.parseProgram();

it('checkParserErrros', () => {
  const errors = p.Errors();
  if (errors.length != 0) {
    for (let i = 0; i < errors.length; i++) {
      console.log('parser error: %s', errors[i]);
    }
  }
  expect(errors.length).toBe(0);
});

it('parseProgram', () => {
  expect(program).not.toBe(null);
  if (program == null) {
    return;
  }
  expect(program.statements.length).toBe(3);
});

const tests = ['x', 'y', 'foobar'];

for (let i = 0; i < tests.length; i++) {
  it('letStatement', () => {
    if (program == null) {
      return;
    }
    let stmt: LetStatement = program.statements[i];
    expect(stmt.tokenLiteral()).toBe('let');
    expect(stmt.name.value).toBe(tests[i]);
    expect(stmt.name.tokenLiteral()).toBe(tests[i]);
  });
}
