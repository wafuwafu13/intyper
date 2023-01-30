import { Lexer } from "../../src/lexer/lexer.ts";
import { Parser } from "../../src/parser/parser.ts";
import {
  ExpressionStatement,
  ExpressionStatementProps,
  InfixExpression,
  InfixExpressionProps,
  LetStatement,
  LetStatementProps,
  PrefixExpression,
  PrefixExpressionProps,
  Program,
  ProgramProps,
  ReturnStatement,
  ReturnStatementProps,
} from "../../src/ast/ast.ts";
import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.174.0/testing/asserts.ts";

Deno.test("testLetStatement", () => {
  const tests = [
    { input: "let x = 5;", expectedIdentifier: "x", expectedValue: 5 },
    { input: "let y = true;", expectedIdentifier: "y", expectedValue: true },
    {
      input: "let foobar = y;",
      expectedIdentifier: "foobar",
      expectedValue: "y",
    },
  ];

  for (const test of tests) {
    const l = new Lexer(test["input"]);
    const p = new Parser(l);

    const program: Program<ProgramProps> = p.parseProgram();

    const errors = p.Errors();
    if (errors.length != 0) {
      for (let i = 0; i < errors.length; i++) {
        console.log("parser error: %s", errors[i]);
      }
    }
    assertEquals(errors.length, 0, "checkParserErrros");

    assertNotEquals(program, null, "parseProgram");
    assertEquals(program.statements.length, 1, "parseProgram");

    const stmt: LetStatement<LetStatementProps> | any = program.statements[0];

    assertEquals(stmt.token.literal, "let", "letStatement");
    assertEquals(stmt.name.value, test["expectedIdentifier"], "letStatement");
    assertEquals(stmt.value.value, test["expectedValue"], "letStatement");
  }
});

Deno.test("testRetrunStatement", () => {
  const tests = [
    { input: "return 5;", expectedValue: 5 },
    { input: "return true;", expectedValue: true },
    { input: "return foobar;", expectedValue: "foobar" },
  ];

  for (const test of tests) {
    const l = new Lexer(test["input"]);
    const p = new Parser(l);

    const program: Program<ProgramProps> = p.parseProgram();

    const errors = p.Errors();
    if (errors.length != 0) {
      for (let i = 0; i < errors.length; i++) {
        console.log("parser error: %s", errors[i]);
      }
    }
    assertEquals(errors.length, 0, "checkParserErrros");

    assertNotEquals(program, null, "parseProgram");
    assertEquals(program.statements.length, 1, "parseProgram");

    const stmt: ReturnStatement<ReturnStatementProps> | any =
      program.statements[0];

    assertEquals(stmt.token.literal, "return", "returnStatement");
    assertEquals(
      stmt.returnValue.value,
      test["expectedValue"],
      "returnStatement",
    );
  }
});

Deno.test("testIdentifierExpression", () => {
  const input = "foobar;";

  const l = new Lexer(input);
  const p = new Parser(l);

  const program: Program<ProgramProps> = p.parseProgram();

  const errors = p.Errors();
  if (errors.length != 0) {
    for (let i = 0; i < errors.length; i++) {
      console.log("parser error: %s", errors[i]);
    }
  }
  assertEquals(errors.length, 0, "checkParserErrros");

  assertNotEquals(program, null, "parseProgram");
  assertEquals(program.statements.length, 1, "parseProgram");

  const ident: ExpressionStatement<ExpressionStatementProps> =
    program.statements[0];

  assertEquals(ident.expression!.value, "foobar", "expressionIdentifier");
  assertEquals(ident.tokenLiteral(), "foobar", "expressionIdentifier");
});

Deno.test("testStringLiteralExpression", () => {
  const input = '"hello world"';

  const l = new Lexer(input);
  const p = new Parser(l);

  const program: Program<ProgramProps> = p.parseProgram();

  const errors = p.Errors();
  if (errors.length != 0) {
    for (let i = 0; i < errors.length; i++) {
      console.log("parser error: %s", errors[i]);
    }
  }
  assertEquals(errors.length, 0, "checkParserErrros");

  assertNotEquals(program, null, "parseProgram");
  assertEquals(program.statements.length, 1, "parseProgram");

  const literal: ExpressionStatement<ExpressionStatementProps> =
    program.statements[0];

  assertEquals(
    literal.expression!.value,
    "hello world",
    "expressionIdentifier",
  );
  assertEquals(literal.tokenLiteral(), "hello world", "expressionIdentifier");
});

Deno.test("testIntegerLiteralExpression", () => {
  const input = "5;";

  const l = new Lexer(input);
  const p = new Parser(l);

  const program: Program<ProgramProps> = p.parseProgram();

  const errors = p.Errors();
  if (errors.length != 0) {
    for (let i = 0; i < errors.length; i++) {
      console.log("parser error: %s", errors[i]);
    }
  }
  assertEquals(errors.length, 0, "checkParserErrros");

  assertNotEquals(program, null, "parseProgram");
  assertEquals(program.statements.length, 1, "parseProgram");

  const literal: ExpressionStatement<ExpressionStatementProps> =
    program.statements[0];

  assertEquals(literal.expression!.value, 5, "expressionIdentifier");
  assertEquals(literal.tokenLiteral(), "5", "expressionIdentifier");
});

Deno.test("testParsingPrefixExpressions", () => {
  const prefixTests = [
    { input: "!5", operator: "!", value: 5 },
    { input: "-15", operator: "-", value: 15 },
    { input: "!foobar;", operator: "!", value: "foobar" },
    { input: "-foobar;", operator: "-", value: "foobar" },
    { input: "!true;", operator: "!", value: true },
    { input: "!false;", operator: "!", value: false },
  ];

  for (const test of prefixTests) {
    const l = new Lexer(test["input"]);
    const p = new Parser(l);

    const program: Program<ProgramProps> = p.parseProgram();

    const errors = p.Errors();
    if (errors.length != 0) {
      for (let i = 0; i < errors.length; i++) {
        console.log("parser error: %s", errors[i]);
      }
    }
    assertEquals(errors.length, 0, "checkParserErrros");

    assertNotEquals(program, null, "parseProgram");
    assertEquals(program.statements.length, 1, "parseProgram");

    const exp: PrefixExpression<PrefixExpressionProps> | any =
      program.statements[0];

    assertEquals(
      exp.expression.operator,
      test["operator"],
      "expressionStatement",
    );
    assertEquals(
      exp.expression.right.value,
      test["value"],
      "expressionStatement",
    );
    assertEquals(
      exp.expression.right.tokenLiteral(),
      String(test["value"]),
      "expressionStatement",
    );
  }
});

Deno.test("testParsingInfixExpressions", () => {
  const prefixTests = [
    { input: "5 + 5", leftValue: 5, operator: "+", rightValue: 5 },
    { input: "5 - 5", leftValue: 5, operator: "-", rightValue: 5 },
    { input: "5 * 5", leftValue: 5, operator: "*", rightValue: 5 },
    { input: "5 / 5", leftValue: 5, operator: "/", rightValue: 5 },
    { input: "5 > 5", leftValue: 5, operator: ">", rightValue: 5 },
    { input: "5 < 5", leftValue: 5, operator: "<", rightValue: 5 },
    { input: "5 == 5", leftValue: 5, operator: "==", rightValue: 5 },
    { input: "5 != 5", leftValue: 5, operator: "!=", rightValue: 5 },
    {
      input: "foobar + barfoo;",
      leftValue: "foobar",
      operator: "+",
      rightValue: "barfoo",
    },
    {
      input: "foobar - barfoo;",
      leftValue: "foobar",
      operator: "-",
      rightValue: "barfoo",
    },
    {
      input: "foobar * barfoo;",
      leftValue: "foobar",
      operator: "*",
      rightValue: "barfoo",
    },
    {
      input: "foobar / barfoo;",
      leftValue: "foobar",
      operator: "/",
      rightValue: "barfoo",
    },
    {
      input: "foobar > barfoo;",
      leftValue: "foobar",
      operator: ">",
      rightValue: "barfoo",
    },
    {
      input: "foobar < barfoo;",
      leftValue: "foobar",
      operator: "<",
      rightValue: "barfoo",
    },
    {
      input: "foobar == barfoo;",
      leftValue: "foobar",
      operator: "==",
      rightValue: "barfoo",
    },
    {
      input: "foobar != barfoo;",
      leftValue: "foobar",
      operator: "!=",
      rightValue: "barfoo",
    },
    {
      input: "true == true;",
      leftValue: true,
      operator: "==",
      rightValue: true,
    },
    {
      input: "true != false;",
      leftValue: true,
      operator: "!=",
      rightValue: false,
    },
    {
      input: "false == false;",
      leftValue: false,
      operator: "==",
      rightValue: false,
    },
  ];

  for (const test of prefixTests) {
    const l = new Lexer(test["input"]);
    const p = new Parser(l);

    const program: Program<ProgramProps> = p.parseProgram();

    const errors = p.Errors();
    if (errors.length != 0) {
      for (let i = 0; i < errors.length; i++) {
        console.log("parser error: %s", errors[i]);
      }
    }
    assertEquals(errors.length, 0, "checkParserErrros");

    assertNotEquals(program, null, "parseProgram");
    assertEquals(program.statements.length, 1, "parseProgram");

    const exp: InfixExpression<InfixExpressionProps> | any =
      program.statements[0];

    assertEquals(
      exp.expression.left.value,
      test["leftValue"],
      "expressionStatement",
    );
    assertEquals(
      exp.expression.operator,
      test["operator"],
      "expressionStatement",
    );
    assertEquals(
      exp.expression.right.value,
      test["rightValue"],
      "expressionStatement",
    );
  }
});

Deno.test("testBooleanExpression", () => {
  const tests = [
    { input: "true;", expectedBoolean: true },
    { input: "false;", expectedBoolean: false },
  ];

  for (const test of tests) {
    const l = new Lexer(test["input"]);
    const p = new Parser(l);

    const program: Program<ProgramProps> = p.parseProgram();

    const errors = p.Errors();
    if (errors.length != 0) {
      for (let i = 0; i < errors.length; i++) {
        console.log("parser error: %s", errors[i]);
      }
    }
    assertEquals(errors.length, 0, "checkParserErrros");

    assertNotEquals(program, null, "parseProgram");
    assertEquals(program.statements.length, 1, "parseProgram");

    const boolean: ExpressionStatement<ExpressionStatementProps> =
      program.statements[0];

    assertEquals(
      boolean.expression!.value,
      test["expectedBoolean"] as any,
      "booleanStatement",
    );
  }
});

Deno.test("testOperatorPrecedenceParsing", () => {
  const tests = [
    {
      input: "-a * b;",
      expected: "((-a) * b)",
    },
    {
      input: "!-a;",
      expected: "(!(-a))",
    },
    {
      input: "a + b + c;",
      expected: "((a + b) + c)",
    },
    {
      input: "a + b - c;",
      expected: "((a + b) - c)",
    },
    {
      input: "a * b * c;",
      expected: "((a * b) * c)",
    },
    {
      input: "a * b / c;",
      expected: "((a * b) / c)",
    },
    {
      input: "a + b / c;",
      expected: "(a + (b / c))",
    },
    {
      input: "a + b * c + d / e - f;",
      expected: "(((a + (b * c)) + (d / e)) - f)",
    },
    // TODO
    // {
    //   input: '3 + 4; -5 * 5;',
    //   expected: '(3 + 4)((-5) * 5)',
    // },
    {
      input: "5 > 4 == 3 < 4;",
      expected: "((5 > 4) == (3 < 4))",
    },
    {
      input: "5 < 4 != 3 > 4;",
      expected: "((5 < 4) != (3 > 4))",
    },
    {
      input: "3 + 4 * 5 == 3 * 1 + 4 * 5;",
      expected: "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))",
    },
    // TODO: セミコロンないと実行されない
    {
      input: "true;",
      expected: "true",
    },
    {
      input: "false;",
      expected: "false",
    },
    {
      input: "3 > 5 == false;",
      expected: "((3 > 5) == false)",
    },
    {
      input: "3 < 5 == true;",
      expected: "((3 < 5) == true)",
    },
    {
      input: "1 + (2 + 3) + 4;",
      expected: "((1 + (2 + 3)) + 4)",
    },
    {
      input: "1 + (2 + 3) + 4",
      expected: "((1 + (2 + 3)) + 4)",
    },
    {
      input: "(5 + 5) * 2",
      expected: "((5 + 5) * 2)",
    },
    {
      input: "2 / (5 + 5)",
      expected: "(2 / (5 + 5))",
    },
    {
      input: "(5 + 5) * 2 * (5 + 5)",
      expected: "(((5 + 5) * 2) * (5 + 5))",
    },
    {
      input: "-(5 + 5)",
      expected: "(-(5 + 5))",
    },
    {
      input: "!(true == true)",
      expected: "(!(true == true))",
    },
    {
      input: "a + add(b * c) + d;",
      expected: "((a + add((b * c))) + d)",
    },
    {
      input: "add(a, b, 1, 2 * 3, 4 + 5, add(6, 7 * 8));",
      expected: "add(a, b, 1, (2 * 3), (4 + 5), add(6, (7 * 8)))",
    },
    {
      input: "add(a + b + c * d / f + g);",
      expected: "add((((a + b) + ((c * d) / f)) + g))",
    },
    {
      input: "a * [1, 2, 3, 4][b * c] * d;",
      expected: "((a * ([1, 2, 3, 4][(b * c)])) * d)",
    },
    {
      input: "add(a * b[2], b[1], 2 * [1, 2][1]);",
      expected: "add((a * (b[2])), (b[1]), (2 * ([1, 2][1])))",
    },
  ];

  for (const test of tests) {
    const l = new Lexer(test["input"]);
    const p = new Parser(l);

    const program: any = p.parseProgram();

    const errors = p.Errors();
    if (errors.length != 0) {
      for (let i = 0; i < errors.length; i++) {
        console.log("parser error: %s", errors[i]);
      }
    }
    assertEquals(errors.length, 0, "checkParserErrros");

    assertNotEquals(program, null, "parseProgram");
    assertEquals(program.statements.length, 1, "parseProgram");

    const actual = program.statements[0].expression.string();

    assertEquals(actual, test["expected"]);
  }
});

Deno.test("testIfExpression", () => {
  const input = `if (x < y) { x }`;

  const l = new Lexer(input);
  const p = new Parser(l);

  const program = p.parseProgram();

  const errors = p.Errors();
  if (errors.length != 0) {
    for (let i = 0; i < errors.length; i++) {
      console.log("parser error: %s", errors[i]);
    }
  }
  assertEquals(errors.length, 0, "checkParserErrros");

  assertNotEquals(program, null, "parseProgram");
  assertEquals(program.statements.length, 1, "parseProgram");

  const exp: any = program.statements[0];

  assertEquals(exp.expression.condition.left.value, "x", "ifExpression");
  assertEquals(exp.expression.condition.operator, "<", "ifExpression");
  assertEquals(exp.expression.condition.right.value, "y", "ifExpression");
  assertEquals(exp.expression.consequence.statements.length, 1, "ifExpression");

  const consequence = exp.expression.consequence.statements[0];
  assertEquals(consequence.expression.value, "x", "ifExpression");
});

Deno.test("testIfElseExpression", () => {
  const input = `if (x < y) { x } else { y }`;

  const l = new Lexer(input);
  const p = new Parser(l);

  const program = p.parseProgram();

  const errors = p.Errors();
  if (errors.length != 0) {
    for (let i = 0; i < errors.length; i++) {
      console.log("parser error: %s", errors[i]);
    }
  }
  assertEquals(errors.length, 0, "checkParserErrros");

  assertNotEquals(program, null, "parseProgram");
  assertEquals(program.statements.length, 1, "parseProgram");

  const exp: any = program.statements[0];

  assertEquals(exp.expression.condition.left.value, "x", "ifElseExpression");
  assertEquals(exp.expression.condition.operator, "<", "ifElseExpression");
  assertEquals(exp.expression.condition.right.value, "y", "ifElseExpression");
  assertEquals(
    exp.expression.consequence.statements.length,
    1,
    "ifElseExpression",
  );

  const consequence = exp.expression.consequence.statements[0];
  assertEquals(consequence.expression.value, "x", "ifElseExpression");

  assertEquals(exp.expression.alternative.statements.length, 1);
  const alternative = exp.expression.alternative.statements[0];
  assertEquals(alternative.expression.value, "y", "ifElseExpression");
});

Deno.test("testFunctionLiteralParsing", () => {
  const input = `fn(x, y) { x + y; }`;

  const l = new Lexer(input);
  const p = new Parser(l);

  const program = p.parseProgram();

  const errors = p.Errors();
  if (errors.length != 0) {
    for (let i = 0; i < errors.length; i++) {
      console.log("parser error: %s", errors[i]);
    }
  }
  assertEquals(errors.length, 0, "checkParserErrros");

  assertNotEquals(program, null, "parseProgram");
  assertEquals(program.statements.length, 1, "parseProgram");

  const functionLiteral: any = program.statements[0];

  assertEquals(
    functionLiteral.expression.parameters.length,
    2,
    "functionLiteralParsing",
  );
  assertEquals(
    functionLiteral.expression.parameters[0].value,
    "x",
    "functionLiteralParsing",
  );
  assertEquals(
    functionLiteral.expression.parameters[1].value,
    "y",
    "functionLiteralParsing",
  );

  assertEquals(
    functionLiteral.expression.body.statements.length,
    1,
    "functionLiteralParsing",
  );
  const bodyStmt = functionLiteral.expression.body.statements[0];

  assertEquals(bodyStmt.expression.left.value, "x", "functionLiteralParsing");
  assertEquals(bodyStmt.expression.operator, "+", "functionLiteralParsing");
  assertEquals(bodyStmt.expression.right.value, "y", "functionLiteralParsing");
});

Deno.test("testFunctionParameterParsing", () => {
  const tests = [
    { input: "fn() {};", expectedParams: [] },
    { input: "fn(x) {};", expectedParams: ["x"] },
    { input: "fn(x, y, z) {};", expectedParams: ["x", "y", "z"] },
  ];

  for (const test of tests) {
    const l = new Lexer(test["input"]);
    const p = new Parser(l);

    const program = p.parseProgram();

    const errors = p.Errors();
    if (errors.length != 0) {
      for (let i = 0; i < errors.length; i++) {
        console.log("parser error: %s", errors[i]);
      }
    }
    assertEquals(errors.length, 0);

    assertNotEquals(program, null, "checkParserErrros");
    assertEquals(program.statements.length, 1, "checkParserErrros");

    const functionLiteral: any = program.statements[0];

    assertEquals(
      functionLiteral.expression.parameters.length,
      test["expectedParams"].length,
      "functionParameterParsing",
    );

    for (let i = 0; i < test["expectedParams"].length; i++) {
      assertEquals(
        functionLiteral.expression.parameters[i].value,
        test["expectedParams"][i],
        "functionParameterParsing",
      );
    }
  }
});

Deno.test("testCallExpressionParsing", () => {
  const input = `add(1, 2 * 3, 4 + 5);`;

  const l = new Lexer(input);
  const p = new Parser(l);

  const program = p.parseProgram();

  const errors = p.Errors();
  if (errors.length != 0) {
    for (let i = 0; i < errors.length; i++) {
      console.log("parser error: %s", errors[i]);
    }
  }
  assertEquals(errors.length, 0, "checkParserErrros");

  assertNotEquals(program, null, "parseProgram");
  assertEquals(program.statements.length, 1, "parseProgram");

  const exp: any = program.statements[0];

  assertEquals(exp.expression.fc.value, "add", "callExpressionParsing");
  assertEquals(exp.expression.arguments.length, 3, "callExpressionParsing");

  assertEquals(exp.expression.arguments[0].value, 1, "callExpressionParsing");
  assertEquals(
    exp.expression.arguments[1].left.value,
    2,
    "callExpressionParsing",
  );
  assertEquals(
    exp.expression.arguments[1].operator,
    "*",
    "callExpressionParsing",
  );
  assertEquals(
    exp.expression.arguments[1].right.value,
    3,
    "callExpressionParsing",
  );
  assertEquals(
    exp.expression.arguments[2].left.value,
    4,
    "callExpressionParsing",
  );
  assertEquals(
    exp.expression.arguments[2].operator,
    "+",
    "callExpressionParsing",
  );
  assertEquals(
    exp.expression.arguments[2].right.value,
    5,
    "callExpressionParsing",
  );
});

Deno.test("testParsingArrayLiterals", () => {
  const input = "[1, 2 * 2, 3 + 3]";

  const l = new Lexer(input);
  const p = new Parser(l);
  const program = p.parseProgram();

  const errors = p.Errors();
  if (errors.length != 0) {
    for (let i = 0; i < errors.length; i++) {
      console.log("parser error: %s", errors[i]);
    }
  }
  assertEquals(errors.length, 0, "checkParserErrros");

  assertNotEquals(program, null, "parseProgram");
  assertEquals(program.statements.length, 1, "parseProgram");

  const array: any = program.statements[0];

  assertEquals(array.expression.elements.length, 3, "parsingArrayLiterals");
  assertEquals(array.expression.elements[0].value, 1, "parsingArrayLiterals");
  assertEquals(
    array.expression.elements[1].left.value,
    2,
    "parsingArrayLiterals",
  );
  assertEquals(
    array.expression.elements[1].operator,
    "*",
    "parsingArrayLiterals",
  );
  assertEquals(
    array.expression.elements[1].right.value,
    2,
    "parsingArrayLiterals",
  );
  assertEquals(
    array.expression.elements[2].left.value,
    3,
    "parsingArrayLiterals",
  );
  assertEquals(
    array.expression.elements[2].operator,
    "+",
    "parsingArrayLiterals",
  );
  assertEquals(
    array.expression.elements[2].right.value,
    3,
    "parsingArrayLiterals",
  );
});

Deno.test("testParsingIndexExpressions", () => {
  const input = "myArray[1 + 1]";

  const l = new Lexer(input);
  const p = new Parser(l);
  const program = p.parseProgram();

  const errors = p.Errors();
  if (errors.length != 0) {
    for (let i = 0; i < errors.length; i++) {
      console.log("parser error: %s", errors[i]);
    }
  }
  assertEquals(errors.length, 0, "checkParserErrros");

  assertNotEquals(program, null, "parseProgram");
  assertEquals(program.statements.length, 1, "parseProgram");

  const indexExp: any = program.statements[0];
  assertEquals(
    indexExp.expression.left.value,
    "myArray",
    "parsingIndexExpressions",
  );
  assertEquals(
    indexExp.expression.index.left.value,
    1,
    "parsingIndexExpressions",
  );
  assertEquals(
    indexExp.expression.index.operator,
    "+",
    "parsingIndexExpressions",
  );
  assertEquals(
    indexExp.expression.index.right.value,
    1,
    "parsingIndexExpressions",
  );
});

Deno.test("testParsingHashLiteralsStringKeys", () => {
  const input = `{"one": 1, "two": 2, "three": 3}`;

  const l = new Lexer(input);
  const p = new Parser(l);
  const program = p.parseProgram();

  const errors = p.Errors();
  if (errors.length != 0) {
    for (let i = 0; i < errors.length; i++) {
      console.log("parser error: %s", errors[i]);
    }
  }
  assertEquals(errors.length, 0, "checkParserErrros");

  assertNotEquals(program, null, "parseProgram");
  assertEquals(program.statements.length, 1, "parseProgram");

  const hash: any = program.statements[0];
  assertEquals(hash.expression.pairs.size, 3, "hashLength");

  const expected: any = {
    one: 1,
    two: 2,
    three: 3,
  };

  for (const [key, value] of hash.expression.pairs) {
    const expectedValue: any = expected[key.string()];
    assertEquals(value.value, expectedValue);
  }
});

Deno.test("testParsingEmptyHashLiteral", () => {
  const input = `{}`;

  const l = new Lexer(input);
  const p = new Parser(l);
  const program = p.parseProgram();

  const errors = p.Errors();
  if (errors.length != 0) {
    for (let i = 0; i < errors.length; i++) {
      console.log("parser error: %s", errors[i]);
    }
  }
  assertEquals(errors.length, 0, "checkParserErrros");

  assertNotEquals(program, null, "parseProgram");
  assertEquals(program.statements.length, 1, "parseProgram");

  const hash: any = program.statements[0];
  assertEquals(hash.expression.pairs.size, 0, "hashLength");
});

Deno.test("testParsingHashLiteralsWithExpressions", () => {
  const input = `{"one": 0 + 1, "two": 10 - 8, "three": 15 / 5}`;

  const l = new Lexer(input);
  const p = new Parser(l);
  const program = p.parseProgram();

  const errors = p.Errors();
  if (errors.length != 0) {
    for (let i = 0; i < errors.length; i++) {
      console.log("parser error: %s", errors[i]);
    }
  }
  assertEquals(errors.length, 0, "checkParserErrros");

  assertNotEquals(program, null, "parseProgram");
  assertEquals(program.statements.length, 1, "parseProgram");

  const hash: any = program.statements[0];
  assertEquals(hash.expression.pairs.size, 3, "hashLength");

  const expected: any = {
    one: [0, "+", 1],
    two: [10, "-", 8],
    three: [15, "/", 5],
  };

  for (const [key, value] of hash.expression.pairs) {
    const expectedValue: any = expected[key.string()];
    assertEquals(value.left.value, expectedValue[0]);
    assertEquals(value.operator, expectedValue[1]);
    assertEquals(value.right.value, expectedValue[2]);
  }
});
