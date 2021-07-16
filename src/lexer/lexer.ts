import {
  TokenDef,
  Token,
  TokenProps,
  LookupIdent,
} from '../../src/token/token';

export interface LexerProps {
  input: string;
  position: number;
  readPosition: number;
  ch: string | number;
}

export class Lexer<T extends LexerProps> {
  input: T['input'];
  position: T['position'];
  readPosition: T['readPosition'];
  ch: T['ch'];

  constructor(
    input: T['input'],
    position: T['position'] = 0,
    readPosition: T['readPosition'] = 0,
    ch: T['ch'] = '',
  ) {
    this.input = input;
    this.position = position;
    this.readPosition = readPosition;
    this.ch = ch;

    this.readChar();
  }

  readChar(): void {
    if (this.readPosition >= this.input.length) {
      this.ch = 'EOF';
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition += 1;
  }

  peekChar(): string | number {
    if (this.readPosition >= this.input.length) {
      return 0;
    } else {
      return this.input[this.readPosition];
    }
  }

  readIdentifier(): string {
    const position = this.position;
    while (this.isLetter(this.ch)) {
      this.readChar();
    }
    return this.input.slice(position, this.position);
  }

  readString(): string {
    const position = this.position + 1;
    while (true) {
      this.readChar();
      if (this.ch == '"' || this.ch == 'EOF') {
        break;
      }
    }

    return this.input.slice(position, this.position);
  }

  isLetter(ch: string | number): boolean {
    let flag: boolean;
    if (typeof ch === 'number') {
      flag = false;
    } else if (ch.match(/[A-Z|a-z]/g)) {
      flag = true;
    } else {
      flag = false;
    }
    return flag;
  }

  readNumber(): string {
    const position = this.position;
    while (this.isDigit(this.ch)) {
      this.readChar();
    }
    return this.input.slice(position, this.position);
  }

  isDigit(ch: string | number): boolean {
    let flag: boolean;
    if (typeof ch === 'number') {
      flag = false;
    } else if (ch.match(/[0-9]/g)) {
      flag = true;
    } else {
      flag = false;
    }
    return flag;
  }

  skipWhitespace(): void {
    while (
      this.ch == ' ' ||
      this.ch == '\t' ||
      this.ch == '\n' ||
      this.ch == '\r'
    ) {
      this.readChar();
    }
  }

  NextToken(): Token<TokenProps> {
    let tok: Token<TokenProps>;

    this.skipWhitespace();

    switch (this.ch) {
      case '=':
        if (this.peekChar() == '=') {
          const ch = this.ch;
          this.readChar();
          const literal = String(ch) + String(this.ch);
          tok = this.newToken(TokenDef.EQ, literal);
        } else {
          tok = this.newToken(TokenDef.ASSIGN, this.ch);
        }
        break;
      case '"':
        tok = this.newToken(TokenDef.STRING, this.readString());
        break;
      case ':':
        tok = this.newToken(TokenDef.COLON, this.ch);
        break;
      case ';':
        tok = this.newToken(TokenDef.SEMICOLON, this.ch);
        break;
      case '(':
        tok = this.newToken(TokenDef.LPAREN, this.ch);
        break;
      case ')':
        tok = this.newToken(TokenDef.RPAREN, this.ch);
        break;
      case ',':
        tok = this.newToken(TokenDef.COMMA, this.ch);
        break;
      case '+':
        tok = this.newToken(TokenDef.PLUS, this.ch);
        break;
      case '-':
        tok = this.newToken(TokenDef.MINUS, this.ch);
        break;
      case '!':
        if (this.peekChar() == '=') {
          const ch = this.ch;
          this.readChar();
          const literal = String(ch) + String(this.ch);
          tok = this.newToken(TokenDef.NOT_EQ, literal);
        } else {
          tok = this.newToken(TokenDef.BANG, this.ch);
        }
        break;
      case '/':
        tok = this.newToken(TokenDef.SLASH, this.ch);
        break;
      case '*':
        tok = this.newToken(TokenDef.ASTERISK, this.ch);
        break;
      case '<':
        tok = this.newToken(TokenDef.LT, this.ch);
        break;
      case '>':
        tok = this.newToken(TokenDef.GT, this.ch);
        break;
      case '{':
        tok = this.newToken(TokenDef.LBRACE, this.ch);
        break;
      case '}':
        tok = this.newToken(TokenDef.RBRACE, this.ch);
        break;
      case '[':
        tok = this.newToken(TokenDef.LBRACKET, this.ch);
        break;
      case ']':
        tok = this.newToken(TokenDef.RBRACKET, this.ch);
        break;
      case 'EOF':
        tok = this.newToken(TokenDef.EOF, '');
        break;
      default:
        if (this.isLetter(this.ch)) {
          const literal: string = this.readIdentifier();
          tok = this.newToken(LookupIdent(literal), literal);
          return tok; // readIdentifierでreadCharが呼び出されreadPositionが進んでいる
        } else if (this.isDigit(this.ch)) {
          tok = this.newToken(TokenDef.INT, this.readNumber());
          return tok;
        } else {
          tok = this.newToken(TokenDef.ILLEGAL, this.ch);
        }
    }

    this.readChar();
    return tok;
  }

  newToken(tokenType: string, ch: string | number): Token<TokenProps> {
    return new Token(tokenType, ch);
  }
}
