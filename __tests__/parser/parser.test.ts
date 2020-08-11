import { Lexer } from '../../src/lexer/lexer';
import { Parser } from '../../src/parser/parser';
import { Program, LetStatement, ReturnStatement } from '../../src/ast/ast';

describe('testLetStatement', () => {
  const input = `
let x = 5;
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
      // TODO
      const stmt: LetStatement | ReturnStatement | any = program.statements[i];
      if (stmt.name == undefined) {
        return;
      }
      expect(stmt.tokenLiteral()).toBe('let');
      expect(stmt.name.value).toBe(tests[i]);
      expect(stmt.name.tokenLiteral()).toBe(tests[i]);
    });
  }
});

describe('testRetrunStatement', () => {
  const input = `
return 5;
return 10;
return 993322;
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

  if (program == null) {
    return;
  }

  for (let i = 0; i < program.statements.length; i++) {
    it('returnStatement', () => {
      if (program == null) {
        return;
      }
      const stmt: ReturnStatement = program.statements[i];
      expect(stmt.tokenLiteral()).toBe('return');
    });
  }
});
