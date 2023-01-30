import { Lexer } from "../lexer/lexer.ts";
import { TokenDef } from "../token/token.ts";
import { Parser } from "../parser/parser.ts";
import { Eval } from "../evaluator/evaluator.ts";
import { Environment } from "../object/environment.ts";

const StartLexer = (input: string) => {
  const l = new Lexer(input);
  while (true) {
    const tok = l.NextToken();
    if (tok.type == TokenDef.EOF) {
      break;
    }
    console.log(tok);
  }
};

export const Start = (input: string, debug: boolean) => {
  if (debug) {
    console.log("### Lexer \n");
    StartLexer(input)
    console.log("");
  }

  const l = new Lexer(input);
  const p = new Parser(l);
  const program: any = p.parseProgram();

  if (p.Errors().length != 0) {
    printParseErrors(p.Errors());
    Deno.exit(1);
  }

  if (debug) {
    console.log("### Parser \n");
    console.log(program);
    console.log("");
  }

  const store = new Map<string, any>();
  const env = new Environment(store);

  const evaluated = Eval(program, env);
  if (evaluated != null) {
    console.log("### Eval \n");
    console.log(evaluated.inspect());
    console.log("");
  }
};

const printParseErrors = (errors: string[]) => {
  for (const error of errors) {
    console.log("\t" + error + "\n");
  }
};
