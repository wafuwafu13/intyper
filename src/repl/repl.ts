import { Lexer } from '../lexer/lexer';
import { TokenDef } from '../token/token';

export const Start = () => {
  const input = 'let add = fn(x, y) { x + y; };';
  const l = new Lexer(input);
  while (true) {
    const tok = l.NextToken();
    if (tok.type == TokenDef.EOF) {
      break;
    }
    console.log(tok);
  }
};
