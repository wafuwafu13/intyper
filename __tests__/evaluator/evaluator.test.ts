import { Lexer } from '../../src/lexer/lexer';
import { Eval } from '../../src/evaluator/evaluator';
import { Parser } from '../../src/parser/parser';

const testEval = (input: string) => {
  const l = new Lexer(input);
  const p = new Parser(l);
  const program = p.parseProgram();

  return Eval(program);
};

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
