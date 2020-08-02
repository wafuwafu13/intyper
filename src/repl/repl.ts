import { Lexer } from '../lexer/lexer'
import { TokenDef } from '../token/token'

export const Start = () => {
  let input = 'let add = fn(x, y) { x + y; };'
  let l = new Lexer(input)
  while (true) {
    let tok = l.NextToken()
    if (tok.type == TokenDef.EOF) {
      break
    }
    console.log(tok)
  }
}
