import { Lexer } from '../../src/lexer/lexer';
import { Parser } from '../../src/parser/parser';
import {
  Program,
  LetStatement,
  ReturnStatement,
  ProgramProps,
  LetStatementProps,
  ReturnStatementProps,
  ExpressionStatement,
  ExpressionStatementProps,
  PrefixExpression,
  PrefixExpressionProps,
  InfixExpression,
  InfixExpressionProps,
} from '../../src/ast/ast';

describe('testLetStatement', () => {
  const input = `
let x = 5;
let y = 10;
let foobar = 838383;
`;

  const l = new Lexer(input);
  const p = new Parser(l);

  const program: Program<ProgramProps> = p.parseProgram();

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
    expect(program.statements.length).toBe(3);
  });

  const tests = ['x', 'y', 'foobar'];

  for (let i = 0; i < tests.length; i++) {
    it('letStatement', () => {
      const stmt: LetStatement<LetStatementProps> | any = program.statements[i];
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

  const program: Program<ProgramProps> = p.parseProgram();

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
    expect(program.statements.length).toBe(3);
  });

  for (let i = 0; i < program.statements.length; i++) {
    it('returnStatement', () => {
      const stmt: ReturnStatement<ReturnStatementProps> | any =
        program.statements[i];
      expect(stmt.tokenLiteral()).toBe('return');
    });
  }
});

describe('testIdentifierExpression', () => {
  const input = 'foobar;';

  const l = new Lexer(input);
  const p = new Parser(l);

  const program: Program<ProgramProps> = p.parseProgram();

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
    expect(program.statements.length).toBe(1);
  });

  const ident: ExpressionStatement<ExpressionStatementProps> =
    program.statements[0];

  it('expressionIdentifier', () => {
    expect(ident.expression!.value).toBe('foobar');
    expect(ident.tokenLiteral()).toBe('foobar');
  });
});

describe('testIntegerLiteralExpression', () => {
  const input = '5;';

  const l = new Lexer(input);
  const p = new Parser(l);

  const program: Program<ProgramProps> = p.parseProgram();

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
    expect(program.statements.length).toBe(1);
  });

  const literal: ExpressionStatement<ExpressionStatementProps> =
    program.statements[0];

  it('expressionIdentifier', () => {
    expect(literal.expression!.value).toBe(5);
    expect(literal.tokenLiteral()).toBe('5');
  });
});

describe('testParsingPrefixExpressions', () => {
  const prefixTests = [
    { input: '!5', operator: '!', value: 5 },
    { input: '-15', operator: '-', value: 15 },
    { input: '!foobar;', operator: '!', value: 'foobar' },
    { input: '-foobar;', operator: '-', value: 'foobar' },
    { input: '!true;', operator: '!', value: true },
    { input: '!false;', operator: '!', value: false },
  ];

  for (const test of prefixTests) {
    const l = new Lexer(test['input']);
    const p = new Parser(l);

    const program: Program<ProgramProps> = p.parseProgram();

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
      expect(program.statements.length).toBe(1);
    });

    const exp: PrefixExpression<PrefixExpressionProps> | any =
      program.statements[0];

    it('expressionStatement', () => {
      expect(exp.expression.operator).toBe(test['operator']);
      expect(exp.expression.right.value).toBe(test['value']);
      expect(exp.expression.right.tokenLiteral()).toBe(String(test['value']));
    });
  }
});

describe('testParsingInfixExpressions', () => {
  const prefixTests = [
    { input: '5 + 5', leftValue: 5, operator: '+', rightValue: 5 },
    { input: '5 - 5', leftValue: 5, operator: '-', rightValue: 5 },
    { input: '5 * 5', leftValue: 5, operator: '*', rightValue: 5 },
    { input: '5 / 5', leftValue: 5, operator: '/', rightValue: 5 },
    { input: '5 > 5', leftValue: 5, operator: '>', rightValue: 5 },
    { input: '5 < 5', leftValue: 5, operator: '<', rightValue: 5 },
    { input: '5 == 5', leftValue: 5, operator: '==', rightValue: 5 },
    { input: '5 != 5', leftValue: 5, operator: '!=', rightValue: 5 },
    {
      input: 'foobar + barfoo;',
      leftValue: 'foobar',
      operator: '+',
      rightValue: 'barfoo',
    },
    {
      input: 'foobar - barfoo;',
      leftValue: 'foobar',
      operator: '-',
      rightValue: 'barfoo',
    },
    {
      input: 'foobar * barfoo;',
      leftValue: 'foobar',
      operator: '*',
      rightValue: 'barfoo',
    },
    {
      input: 'foobar / barfoo;',
      leftValue: 'foobar',
      operator: '/',
      rightValue: 'barfoo',
    },
    {
      input: 'foobar > barfoo;',
      leftValue: 'foobar',
      operator: '>',
      rightValue: 'barfoo',
    },
    {
      input: 'foobar < barfoo;',
      leftValue: 'foobar',
      operator: '<',
      rightValue: 'barfoo',
    },
    {
      input: 'foobar == barfoo;',
      leftValue: 'foobar',
      operator: '==',
      rightValue: 'barfoo',
    },
    {
      input: 'foobar != barfoo;',
      leftValue: 'foobar',
      operator: '!=',
      rightValue: 'barfoo',
    },
    {
      input: 'true == true;',
      leftValue: true,
      operator: '==',
      rightValue: true,
    },
    {
      input: 'true != false;',
      leftValue: true,
      operator: '!=',
      rightValue: false,
    },
    {
      input: 'false == false;',
      leftValue: false,
      operator: '==',
      rightValue: false,
    },
  ];

  for (const test of prefixTests) {
    const l = new Lexer(test['input']);
    const p = new Parser(l);

    const program: Program<ProgramProps> = p.parseProgram();

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
      expect(program.statements.length).toBe(1);
    });

    const exp: InfixExpression<InfixExpressionProps> | any =
      program.statements[0];

    it('expressionStatement', () => {
      expect(exp.expression.left.value).toBe(test['leftValue']);
      expect(exp.expression.operator).toBe(test['operator']);
      expect(exp.expression.right.value).toBe(test['rightValue']);
    });
  }
});

describe('testBooleanExpression', () => {
  const tests = [
    { input: 'true;', expectedBoolean: true },
    { input: 'false;', expectedBoolean: false },
  ];

  for (const test of tests) {
    const l = new Lexer(test['input']);
    const p = new Parser(l);

    const program: Program<ProgramProps> = p.parseProgram();

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
      expect(program.statements.length).toBe(1);
    });

    const boolean: ExpressionStatement<ExpressionStatementProps> =
      program.statements[0];

    it('booleanStatement', () => {
      expect(boolean.expression!.value).toBe(test['expectedBoolean']);
    });
  }
});

describe('testOperatorPrecedenceParsing', () => {
  const tests = [
    {
      input: '-a * b;',
      expected: '((-a) * b)',
    },
    {
      input: '!-a;',
      expected: '(!(-a))',
    },
    {
      input: 'a + b + c;',
      expected: '((a + b) + c)',
    },
    {
      input: 'a + b - c;',
      expected: '((a + b) - c)',
    },
    {
      input: 'a * b * c;',
      expected: '((a * b) * c)',
    },
    {
      input: 'a * b / c;',
      expected: '((a * b) / c)',
    },
    {
      input: 'a + b / c;',
      expected: '(a + (b / c))',
    },
    {
      input: 'a + b * c + d / e - f;',
      expected: '(((a + (b * c)) + (d / e)) - f)',
    },
    // TODO
    // {
    //   input: '3 + 4; -5 * 5;',
    //   expected: '(3 + 4)((-5) * 5)',
    // },
    {
      input: '5 > 4 == 3 < 4;',
      expected: '((5 > 4) == (3 < 4))',
    },
    {
      input: '5 < 4 != 3 > 4;',
      expected: '((5 < 4) != (3 > 4))',
    },
    {
      input: '3 + 4 * 5 == 3 * 1 + 4 * 5;',
      expected: '((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))',
    },
    {
      input: 'true;',
      expected: 'true',
    },
    {
      input: 'false;',
      expected: 'false',
    },
    {
      input: '3 > 5 == false;',
      expected: '((3 > 5) == false)',
    },
    {
      input: '3 < 5 == true;',
      expected: '((3 < 5) == true)',
    },
    // TODO
    // {
		// 	input: "1 + (2 + 3) + 4;",
		// 	expected: "((1 + (2 + 3)) + 4)",
		// },
  ];

  for (const test of tests) {
    const l = new Lexer(test['input']);
    const p = new Parser(l);

    const program: any = p.parseProgram();

    it('checkParserErrros', () => {
      const errors = p.Errors();
      if (errors.length != 0) {
        for (let i = 0; i < errors.length; i++) {
          console.log('parser error: %s', errors[i]);
        }
      }
      expect(errors.length).toBe(0);
    });

    const actual = program.statements[0].expression.string();

    expect(actual).toBe(test['expected']);
  }
});
