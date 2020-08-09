import { Lexer } from '../lexer/lexer';
import { Token, TokenDef, TokenType } from '../token/token';
import { Program, statement, LetStatement, Identifier } from '../ast/ast';

export class Parser {
  l: Lexer;
  curToken: Token;
  peekToken: Token;

  constructor(l: Lexer, curToken: any = undefined, peekToken: any = undefined) {
    this.l = l;
    this.curToken = curToken;
    this.peekToken = peekToken;

    this.nextToken();
    this.nextToken();
  }

  nextToken(): void {
    this.curToken = this.peekToken;
    this.peekToken = this.l.NextToken();
  }

  parseProgram(): Program {
    const program = new Program();
    program.statements = statement(); // [] Why to do

    while (this.curToken.type != TokenDef.EOF) {
      let stmt: LetStatement | null = this.parseStatement();
      if (stmt != null) {
        program.statements.push(stmt);
      }
      this.nextToken();
    }

    return program;
  }

  parseStatement(): LetStatement | null {
    switch (this.curToken.type) {
      case TokenDef.LET:
        return this.parseLetStatement();
      default:
        return null;
    }
  }

  parseLetStatement(): LetStatement | null {

    let stmt: LetStatement | null = new LetStatement(this.curToken);

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
    return this.curToken.type == t;
  }

  peekTokenIs(t: TokenType): boolean {
    return this.peekToken.type == t;
  }

  expectPeek(t: TokenType): boolean {
    if (this.peekTokenIs(t)) {
      this.nextToken();
      return true;
    } else {
      return false;
    }
  }
}
