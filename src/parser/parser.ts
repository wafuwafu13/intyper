import { Lexer } from '../lexer/lexer';
import { Token, TokenDef, TokenType } from '../token/token';
import { Program, statement, LetStatement, Identifier } from '../ast/ast';

export class Parser {
  l: Lexer;
  curToken: Token | undefined;
  peekToken: Token | undefined;
  errors: string[];

  constructor(
    l: Lexer,
    curToken: Token | undefined = undefined,
    peekToken: Token | undefined = undefined,
    errors: string[] = [],
  ) {
    this.l = l;
    this.curToken = curToken;
    this.peekToken = peekToken;
    this.errors = errors;

    this.nextToken();
    this.nextToken();
  }

  nextToken(): void {
    this.curToken = this.peekToken;
    this.peekToken = this.l.NextToken();
  }

  parseProgram(): Program | null {
    const program = new Program();
    program.statements = statement(); // [] Why to do

    if (this.curToken == undefined) {
      return null;
    }

    while (this.curToken.type != TokenDef.EOF) {
      const stmt: LetStatement | null = this.parseStatement();
      if (stmt != null) {
        program.statements.push(stmt);
      }
      this.nextToken();
    }

    return program;
  }

  parseStatement(): LetStatement | null {
    if (this.curToken == undefined) {
      return null;
    }
    switch (this.curToken.type) {
      case TokenDef.LET:
        return this.parseLetStatement();
      default:
        return null;
    }
  }

  parseLetStatement(): LetStatement | null {
    if (this.curToken == undefined) {
      return null;
    }
    const stmt: LetStatement | null = new LetStatement(this.curToken);

    if (!this.expectPeek(TokenDef.IDENT)) {
      return null;
    }

    stmt.name = new Identifier(this.curToken, this.curToken.literal);

    if (!this.expectPeek(TokenDef.ASSIGN)) {
      return null;
    }

    while (!this.curTokenIs(TokenDef.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  curTokenIs(t: TokenType): boolean {
    if (this.curToken == undefined) {
      return false;
    }
    return this.curToken.type == t;
  }

  peekTokenIs(t: TokenType): boolean {
    if (this.peekToken == undefined) {
      return false;
    }
    return this.peekToken.type == t;
  }

  expectPeek(t: TokenType): boolean {
    if (this.peekTokenIs(t)) {
      this.nextToken();
      return true;
    } else {
      this.peekError(t);
      return false;
    }
  }

  Errors(): string[] {
    return this.errors;
  }

  peekError(t: TokenType): void | null {
    if (this.peekToken == undefined) {
      return null;
    }
    const msg: string =
      'expected next token to be ' +
      t +
      ' , got ' +
      this.peekToken.type +
      ' instead';
    this.errors.push(msg);
  }
}
