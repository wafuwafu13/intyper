export type TokenType = string

export class Token {
  type: TokenType
  literal: string | number

  constructor(type: TokenType, literal: string | number) {
    this.type = type
    this.literal = literal
  }
}

export namespace TokenDef {
  export const ILLEGAL = 'ILLEGAL' // トークンが未知であることを表す
  export const EOF = 'EOF' // ファイルの終端を表し、構文解析器にここで停止してよいと伝える

  // 識別子 + リテラル
  export const IDENT = 'IDENT' // add, foobar, x, y, ...
  export const INT = 'INT' // 1232454

  // 演算子
  export const ASSIGN = '='
  export const PLUS = '+'
  export const MINUS = '-'
  export const BANG = '!'
  export const ASTERISK = '*'
  export const SLASH = '/'

  export const LT = '<'
  export const GT = '>'

  export const EQ = '=='
  export const NOT_EQ = '!='

  // デリミタ
  export const COMMA = ','
  export const SEMICOLON = ';'

  export const LPAREN = '('
  export const RPAREN = ')'
  export const LBRACE = '{'
  export const RBRACE = '}'

  // キーワード
  export const FUNCTION = 'FUNCTION'
  export const LET = 'LET'
  export const TRUE = 'TRUE'
  export const FALSE = 'FALSE'
  export const IF = 'IF'
  export const ELSE = 'ELSE'
  export const RETURN = 'RETURN'
}

export const keywords: { [key: string]: string } = {
  fn: TokenDef.FUNCTION,
  let: TokenDef.LET,
  true: TokenDef.TRUE,
  false: TokenDef.FALSE,
  if: TokenDef.IF,
  else: TokenDef.ELSE,
  return: TokenDef.RETURN,
}

export const LookupIdent = (ident: string): string => {
  if (keywords[ident]) {
    return keywords[ident]
  }

  return TokenDef.IDENT
}
