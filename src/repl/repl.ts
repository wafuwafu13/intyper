import { Lexer } from '../lexer/lexer';
import { TokenDef } from '../token/token';
import { Parser } from '../parser/parser';

const input = 'a + add(b * 1) + 2;';

export const StartLexer = () => {
  const l = new Lexer(input);
  while (true) {
    const tok = l.NextToken();
    if (tok.type == TokenDef.EOF) {
      break;
    }
    console.log(tok);
  }
};

export const StartParser = () => {
  const l = new Lexer(input);
  const p = new Parser(l);
  const program: any = p.parseProgram();

  if (p.Errors().length != 0) {
    printParseErrors(p.Errors());
  }

  console.log(program.statements[0].expression.string());
};

const printParseErrors = (errors: string[]) => {
  for (const error of errors) {
    console.log('\t' + error + '\n');
  }
};
