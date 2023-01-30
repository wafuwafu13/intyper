import { Identifier, LetStatement, Program } from "../../src/ast/ast.ts";
import { Token, TokenDef } from "../../src/token/token.ts";
import { assertEquals } from "https://deno.land/std@0.174.0/testing/asserts.ts";

const stmt: any = new LetStatement(new Token(TokenDef.LET, "let"));

stmt.name = new Identifier(new Token(TokenDef.IDENT, "myVar"), "myVar");

stmt.value = new Identifier(
  new Token(TokenDef.IDENT, "anotherVar"),
  "anotherVar",
);

const program: any = new Program(stmt);

Deno.test("testString", () => {
  assertEquals(program.statements.string(), "let myVar = anotherVar;");
});
