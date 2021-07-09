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
