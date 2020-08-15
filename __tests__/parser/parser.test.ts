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

describe('testIdentifierExpression', () => {
  const input = 'foobar;';

  const l = new Lexer(input);
  const p = new Parser(l);

  const program = p.parseProgram();

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
    expect(program.statements.length).toBe(1);
  });

  if (program == null) {
    return;
  }

  const ident: any = program.statements[0];

  it('expressionIdentifier', () => {
    expect(ident.expression.value).toBe('foobar');
    expect(ident.tokenLiteral()).toBe('foobar');
  });
});

describe('testIntegerLiteralExpression', () => {
  const input = '5;';

  const l = new Lexer(input);
  const p = new Parser(l);

  const program = p.parseProgram();

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
    expect(program.statements.length).toBe(1);
  });

  if (program == null) {
    return;
  }

  const literal: any = program.statements[0];

  it('expressionIdentifier', () => {
    expect(literal.expression.value).toBe(5);
    expect(literal.tokenLiteral()).toBe('5');
  });
});

describe('testParsingPrefixExpressions', () => {
  const prefixTests = [
    { input: '!5', operator: '!', integerValue: 5 },
    { input: '-15', operator: '-', integerValue: 15 },
  ];

  for (const test of prefixTests) {
    const l = new Lexer(test['input']);
    const p = new Parser(l);

    const program = p.parseProgram();

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
      expect(program.statements.length).toBe(1);
    });

    if (program == null) {
      return;
    }

    const exp: any = program.statements[0];

    it('expressionStatement', () => {
      expect(exp.expression.operator).toBe(test['operator']);
      expect(exp.expression.right.value).toBe(test['integerValue']);
      expect(exp.expression.right.tokenLiteral()).toBe(
        String(test['integerValue']),
      );
    });
  }
});

describe('testParsingInfixExpressions', () => {
  const prefixTests = [
    { input: '5 + 5', leftvalue: 5, operator: '+', rightValue: 5 },
    { input: '5 - 5', leftvalue: 5, operator: '-', rightValue: 5 },
    { input: '5 * 5', leftvalue: 5, operator: '*', rightValue: 5 },
    { input: '5 / 5', leftvalue: 5, operator: '/', rightValue: 5 },
    { input: '5 > 5', leftvalue: 5, operator: '>', rightValue: 5 },
    { input: '5 < 5', leftvalue: 5, operator: '<', rightValue: 5 },
    { input: '5 == 5', leftvalue: 5, operator: '==', rightValue: 5 },
    { input: '5 != 5', leftvalue: 5, operator: '!=', rightValue: 5 },
  ];

  for (const test of prefixTests) {
    const l = new Lexer(test['input']);
    const p = new Parser(l);

    const program = p.parseProgram();

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
      expect(program.statements.length).toBe(1);
    });

    if (program == null) {
      return;
    }

    const exp: any = program.statements[0];

    it('expressionStatement', () => {
      expect(exp.expression.left.value).toBe(test['leftvalue']);
      expect(exp.expression.operator).toBe(test['operator']);
      expect(exp.expression.right.value).toBe(test['rightValue']);
    });
  }
});
