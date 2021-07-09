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
  const tests = [
    { input: 'let x = 5;', expectedIdentifier: 'x', expectedValue: 5 },
    { input: 'let y = true;', expectedIdentifier: 'y', expectedValue: true },
    {
      input: 'let foobar = y;',
      expectedIdentifier: 'foobar',
      expectedValue: 'y',
    },
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

    const stmt: LetStatement<LetStatementProps> | any = program.statements[0];

    it('letStatement', () => {
      expect(stmt.token.literal).toBe('let');
      expect(stmt.name.value).toBe(test['expectedIdentifier']);
      expect(stmt.value.value).toBe(test['expectedValue']);
    });
  }
});

describe('testRetrunStatement', () => {
  const tests = [
    { input: 'return 5;', expectedValue: 5 },
    { input: 'return true;', expectedValue: true },
    { input: 'return foobar;', expectedValue: 'foobar' },
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

    const stmt: ReturnStatement<ReturnStatementProps> | any =
      program.statements[0];

    it('returnStatement', () => {
      expect(stmt.token.literal).toBe('return');
      expect(stmt.returnValue.value).toBe(test['expectedValue']);
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
    // TODO: セミコロンないと実行されない
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
    {
      input: '1 + (2 + 3) + 4;',
      expected: '((1 + (2 + 3)) + 4)',
    },
    {
      input: '1 + (2 + 3) + 4',
      expected: '((1 + (2 + 3)) + 4)',
    },
    {
      input: '(5 + 5) * 2',
      expected: '((5 + 5) * 2)',
    },
    {
      input: '2 / (5 + 5)',
      expected: '(2 / (5 + 5))',
    },
    {
      input: '(5 + 5) * 2 * (5 + 5)',
      expected: '(((5 + 5) * 2) * (5 + 5))',
    },
    {
      input: '-(5 + 5)',
      expected: '(-(5 + 5))',
    },
    {
      input: '!(true == true)',
      expected: '(!(true == true))',
    },
    {
      input: 'a + add(b * c) + d;',
      expected: '((a + add((b * c))) + d)',
    },
    {
      input: 'add(a, b, 1, 2 * 3, 4 + 5, add(6, 7 * 8));',
      expected: 'add(a, b, 1, (2 * 3), (4 + 5), add(6, (7 * 8)))',
    },
    {
      input: 'add(a + b + c * d / f + g);',
      expected: 'add((((a + b) + ((c * d) / f)) + g))',
    },
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

    it('parseProgram', () => {
      expect(program).not.toBe(null);
      expect(program.statements.length).toBe(1);
    });

    const actual = program.statements[0].expression.string();

    expect(actual).toBe(test['expected']);
  }
});

describe('testIfExpression', () => {
  const input = `if (x < y) { x }`;

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
    expect(program.statements.length).toBe(1);
  });

  const exp: any = program.statements[0];

  it('ifExpression', () => {
    expect(exp.expression.condition.left.value).toBe('x');
    expect(exp.expression.condition.operator).toBe('<');
    expect(exp.expression.condition.right.value).toBe('y');
    expect(exp.expression.consequence.statements.length).toBe(1);

    const consequence = exp.expression.consequence.statements[0];
    expect(consequence.expression.value).toBe('x');
  });
});

describe('testIfElseExpression', () => {
  const input = `if (x < y) { x } else { y }`;

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
    expect(program.statements.length).toBe(1);
  });

  const exp: any = program.statements[0];

  it('ifElseExpression', () => {
    expect(exp.expression.condition.left.value).toBe('x');
    expect(exp.expression.condition.operator).toBe('<');
    expect(exp.expression.condition.right.value).toBe('y');
    expect(exp.expression.consequence.statements.length).toBe(1);

    const consequence = exp.expression.consequence.statements[0];
    expect(consequence.expression.value).toBe('x');

    expect(exp.expression.alternative.statements.length).toBe(1);
    const alternative = exp.expression.alternative.statements[0];
    expect(alternative.expression.value).toBe('y');
  });
});

describe('testFunctionLiteralParsing', () => {
  const input = `fn(x, y) { x + y; }`;

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
    expect(program.statements.length).toBe(1);
  });

  const functionLiteral: any = program.statements[0];

  it('functionLiteralParsing', () => {
    expect(functionLiteral.expression.parameters.length).toBe(2);
    expect(functionLiteral.expression.parameters[0].value).toBe('x');
    expect(functionLiteral.expression.parameters[1].value).toBe('y');

    expect(functionLiteral.expression.body.statements.length).toBe(1);
    const bodyStmt = functionLiteral.expression.body.statements[0];

    expect(bodyStmt.expression.left.value).toBe('x');
    expect(bodyStmt.expression.operator).toBe('+');
    expect(bodyStmt.expression.right.value).toBe('y');
  });
});

describe('testFunctionParameterParsing', () => {
  const tests = [
    { input: 'fn() {};', expectedParams: [] },
    { input: 'fn(x) {};', expectedParams: ['x'] },
    { input: 'fn(x, y, z) {};', expectedParams: ['x', 'y', 'z'] },
  ];

  for (const test of tests) {
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
      expect(program.statements.length).toBe(1);
    });

    const functionLiteral: any = program.statements[0];

    it('functionParameterParsing', () => {
      expect(functionLiteral.expression.parameters.length).toBe(
        test['expectedParams'].length,
      );

      for (let i = 0; i < test['expectedParams'].length; i++) {
        expect(functionLiteral.expression.parameters[i].value).toBe(
          test['expectedParams'][i],
        );
      }
    });
  }
});

describe('testCallExpressionParsing', () => {
  const input = `add(1, 2 * 3, 4 + 5);`;

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
    expect(program.statements.length).toBe(1);
  });

  const exp: any = program.statements[0];

  it('callExpressionParsing', () => {
    expect(exp.expression.fc.value).toBe('add');
    expect(exp.expression.arguments.length).toBe(3);

    expect(exp.expression.arguments[0].value).toBe(1);
    expect(exp.expression.arguments[1].left.value).toBe(2);
    expect(exp.expression.arguments[1].operator).toBe('*');
    expect(exp.expression.arguments[1].right.value).toBe(3);
    expect(exp.expression.arguments[2].left.value).toBe(4);
    expect(exp.expression.arguments[2].operator).toBe('+');
    expect(exp.expression.arguments[2].right.value).toBe(5);
  });
});
