import { Lexer } from '../../src/lexer/lexer';
import { Eval } from '../../src/evaluator/evaluator';
import { Parser } from '../../src/parser/parser';
import { Environment } from '../../src/object/environment';

const testEval = (input: string) => {
  const l = new Lexer(input);
  const p = new Parser(l);
  const program = p.parseProgram();

  const store = new Map<string, any>();
  const env = new Environment(store);

  return Eval(program, env);
};

describe('testStringLiteral', () => {
  const input = `"Hello World!"`;
  const evaluated = testEval(input);

  it('testObject', () => {
    expect(evaluated.constructor.name).toBe('String');
  });

  it('testEval', () => {
    expect(evaluated.value).toBe('Hello World!');
  });
});

const testIntegerObject = (obj: any, expected: number): boolean => {
  if (obj.constructor.name != 'Integer') {
    console.log(`object is not Integer. got ${obj.constructor.name}`);
    return false;
  }
  if (obj.value != expected) {
    console.log(`object has wrong value. got ${obj.value}, want ${expected}`);
    return false;
  }

  return true;
};

describe('testEvalIntegerExpression', () => {
  const tests = [
    {
      input: '5',
      expected: 5,
    },
    {
      input: '10',
      expected: 10,
    },
    {
      input: '-5',
      expected: -5,
    },
    {
      input: '-10',
      expected: -10,
    },
    { input: '5 + 5 + 5 + 5 - 10', expected: 10 },
    { input: '2 * 2 * 2 * 2 * 2', expected: 32 },
    { input: '-50 + 100 + -50', expected: 0 },
    { input: '5 * 2 + 10', expected: 20 },
    { input: '5 + 2 * 10', expected: 25 },
    { input: '20 + 2 * -10', expected: 0 },
    { input: '50 / 2 * 2 + 10', expected: 60 },
    { input: '2 * (5 + 10)', expected: 30 },
    { input: '3 * 3 * 3 + 10', expected: 37 },
    { input: '3 * (3 * 3) + 10', expected: 37 },
    { input: '(5 + 10 * 2 + 15 / 3) * 2 + -10', expected: 50 },
  ];
  for (const test of tests) {
    it('testEval', () => {
      const evaluated = testEval(test.input);
      expect(testIntegerObject(evaluated, test.expected)).toBe(true);
    });
  }
});

const testBooleanObject = (obj: any, expected: boolean): boolean => {
  if (obj.constructor.name != 'Boolean') {
    console.log(`object is not Boolean. got ${obj.constructor.name}`);
    return false;
  }
  if (obj.value != expected) {
    console.log(`object has wrong value. got ${obj.value}, want ${expected}`);
    return false;
  }

  return true;
};

describe('testBooelanExpression', () => {
  const tests = [
    {
      input: 'true;',
      expected: true,
    },
    {
      input: 'false;',
      expected: false,
    },
    { input: '1 < 2', expected: true },
    { input: '1 > 2', expected: false },
    { input: '1 < 1', expected: false },
    { input: '1 > 1', expected: false },
    { input: '1 == 1', expected: true },
    { input: '1 != 1', expected: false },
    { input: '1 == 2', expected: false },
    { input: '1 != 2', expected: true },
    { input: 'true == true;', expected: true },
    { input: 'false == false;', expected: true },
    { input: 'true == false;', expected: false },
    { input: 'true != false;', expected: true },
    { input: 'false != true;', expected: true },
    { input: '(1 < 2) == true;', expected: true },
    { input: '(1 < 2) == false;', expected: false },
    { input: '(1 > 2) == true;', expected: false },
    { input: '(1 > 2) == false;', expected: true },
  ];
  for (const test of tests) {
    it('testEval', () => {
      const evaluated = testEval(test.input);
      expect(testBooleanObject(evaluated, test.expected)).toBe(true);
    });
  }
});

describe('testBangOperator', () => {
  const tests = [
    {
      input: '!true;',
      expected: false,
    },
    {
      input: '!false;',
      expected: true,
    },
    {
      input: '!5',
      expected: false,
    },
    {
      input: '!!true;',
      expected: true,
    },
    {
      input: '!!false;',
      expected: false,
    },
    {
      input: '!!5',
      expected: true,
    },
  ];
  for (const test of tests) {
    it('testEval', () => {
      const evaluated = testEval(test.input);
      expect(testBooleanObject(evaluated, test.expected)).toBe(true);
    });
  }
});

const testNullObject = (obj: any): boolean => {
  if (obj.value != null) {
    console.log(`object is not Null. got ${obj}`);
    return false;
  }
  return true;
};

describe('testIfElseExpressions', () => {
  const tests_1 = [
    { input: 'if (true) { 10 }', expcted: 10 },
    { input: 'if (1) { 10 }', expcted: 10 },
    { input: 'if (1 < 2) { 10 }', expcted: 10 },
    { input: 'if (1 > 2) { 10 } else { 20 }', expcted: 20 },
    { input: 'if (1 < 2) { 10 } else { 20 }', expcted: 10 },
  ];

  for (const test of tests_1) {
    const evaluated = testEval(test.input);

    it('testEval', () => {
      expect(testIntegerObject(evaluated, test.expcted)).toBe(true);
    });
  }

  const tests_2 = [
    { input: 'if (false) { 10 }', expcted: null },
    { input: 'if (1 > 2) { 10 }', expcted: null },
  ];

  for (const test of tests_2) {
    const evaluated = testEval(test.input);

    it('testEval', () => {
      expect(testNullObject(evaluated)).toBe(true);
    });
  }
});

describe('testReturnStatements', () => {
  const tests = [
    { input: 'return 10;', expected: 10 },
    { input: 'return 10; 9;', expected: 10 },
    { input: 'return 2 * 5; 9;', expected: 10 },
    { input: '9; return 2 * 5; 9;', expected: 10 },
    { input: 'if (10 > 1) { return 10; }', expected: 10 },
    {
      input: `
if (10 > 1) {
if (10 > 1) {
return 10;
}

return 1;
}
`,
      expected: 10,
    },
  ];

  for (const test of tests) {
    const evaluated = testEval(test.input);

    it('testEval', () => {
      expect(testIntegerObject(evaluated, test.expected)).toBe(true);
    });
  }
});

describe('testErrorHandling', () => {
  const tests = [
    {
      input: '5 + true;',
      expectedMessage: 'type mismatch: INTEGER + BOOLEAN',
    },
    {
      input: '5 + true; 5;',
      expectedMessage: 'type mismatch: INTEGER + BOOLEAN',
    },
    {
      input: '-true;',
      expectedMessage: 'unknown operator: -BOOLEAN',
    },
    {
      input: 'true + false;',
      expectedMessage: 'unknown operator: BOOLEAN + BOOLEAN',
    },
    {
      input: 'true + false + true + false;',
      expectedMessage: 'unknown operator: BOOLEAN + BOOLEAN',
    },
    {
      input: '5; true + false; 5',
      expectedMessage: 'unknown operator: BOOLEAN + BOOLEAN',
    },
    {
      input: 'if (10 > 1) { true + false; }',
      expectedMessage: 'unknown operator: BOOLEAN + BOOLEAN',
    },
    {
      input: `
if (10 > 1) {
if (10 > 1) {
return true + false;
}

return 1;
}
`,
      expectedMessage: 'unknown operator: BOOLEAN + BOOLEAN',
    },
    {
      input: 'foobar;',
      expectedMessage: 'identifier not found: foobar',
    },
  ];

  for (const test of tests) {
    const evaluated = testEval(test.input);
    it('testObject', () => {
      expect(evaluated.constructor.name).toBe('Error');
    });
    it('testEval', () => {
      expect(evaluated.message).toBe(test.expectedMessage);
    });
  }
});

describe('testLetStatements', () => {
  const tests = [
    { input: 'let a = 5; a;', expected: 5 },
    { input: 'let a = 5 * 5; a;', expected: 25 },
    { input: 'let a = 5; let b = a; b;', expected: 5 },
    { input: 'let a = 5; let b = a; let c = a + b + 5; c;', expected: 15 },
  ];

  for (const test of tests) {
    it('testEval', () => {
      expect(testIntegerObject(testEval(test.input), test.expected)).toBe(true);
    });
  }
});

describe('testFunctionObject', () => {
  const input = 'fn(x) { x + 2; };';

  const evaluated = testEval(input);
  it('testObject', () => {
    expect(evaluated.constructor.name).toBe('Function');
  });
  it('testParameter', () => {
    expect(evaluated.parameters.length).toBe(1);
    expect(evaluated.parameters[0].string()).toBe('x');
  });

  const expectedBody = '(x + 2)';

  it('testBody', () => {
    expect(evaluated.body.string()).toBe(expectedBody);
  });
});

describe('testFunctionApplication', () => {
  const tests = [
    { input: 'let identity = fn(x) { x; }; identity(5);', expected: 5 },
    { input: 'let identity = fn(x) { return x; }; identity(5);', expected: 5 },
    { input: 'let double = fn(x) { x * 2; }; double(5);', expected: 10 },
    { input: 'let add = fn(x, y) { x + y; }; add(5, 5);', expected: 10 },
    {
      input: 'let add = fn(x, y) { x + y; }; add(5 + 5, add(5, 5));',
      expected: 20,
    },
    { input: 'fn(x) { x; }(5)', expected: 5 },
  ];

  for (const test of tests) {
    it('testEval', () => {
      expect(testIntegerObject(testEval(test.input), test.expected)).toBe(true);
    });
  }
});

describe('testEnclosingEnvironments', () => {
  const input = `
	let first = 10;
	let second = 10;
	let third = 10;
	
	let ourFunction = fn(first) {
	  let second = 20;
	
	  first + second + third;
	};
	
	ourFunction(20) + first + second;`;

  it('testEval', () => {
    expect(testIntegerObject(testEval(input), 70)).toBe(true);
  });
});

describe('testClosures', () => {
  const input = `
	let newAdder = fn(x) {
	  fn(y) { x + y };
	};
	
	let addTwo = newAdder(2);
	addTwo(2);`;

  it('testEval', () => {
    expect(testIntegerObject(testEval(input), 4)).toBe(true);
  });
});
