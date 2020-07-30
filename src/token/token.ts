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
  export const ASSIGN: string = '='
  export const PLUS = '+'

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
}

export const keywords: { [key: string]: string } = {
  fn: TokenDef.FUNCTION,
  let: TokenDef.LET,
}

export const LookupIdent = (ident: string): string => {
  if (keywords[ident]) {
    return keywords[ident]
  }

  return TokenDef.IDENT
}
