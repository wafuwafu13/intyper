import { Lexer } from '../lexer/lexer';
import { Token, TokenDef, TokenType } from '../token/token';
import {
  Program,
  LetStatement,
  Identifier,
  ReturnStatement,
  ExpressionStatement,
  IntegerLiteral,
} from '../ast/ast';

const LOWEST = 1;
// const EQUALS = 2      // ==
// const LESSGREATER = 3// > または <
// const SUM = 4        // +
// const PRODUCT = 5    // *
// const PREFIX = 6    // -X または !X
// const CALL = 7       // myFunction(X)

export class Parser {
  l: Lexer;
  curToken: Token | undefined;
  peekToken: Token | undefined;
  errors: string[];

  prefixParseFns: any;
  infixParseFns: any;

  constructor(
    l: Lexer,
    curToken: Token | undefined = undefined,
    peekToken: Token | undefined = undefined,
    errors: string[] = [],
    prefixParseFns: any = undefined,
    infixParseFns: any = undefined,
  ) {
    this.l = l;
    this.curToken = curToken;
    this.peekToken = peekToken;
    this.errors = errors;
    this.prefixParseFns = prefixParseFns;
    this.infixParseFns = infixParseFns;

    this.nextToken();
    this.nextToken();

    this.prefixParseFns = new Map();
    this.registerPrefix(TokenDef.IDENT, this.parseIdentifier);
    this.registerPrefix(TokenDef.INT, this.parseIntegerLiteral);
  }

  nextToken(): void {
    this.curToken = this.peekToken;
    this.peekToken = this.l.NextToken();
  }

  registerPrefix(
    tokenType: TokenType,
    fn: (t: Token) => Identifier | IntegerLiteral,
  ) {
    this.prefixParseFns[tokenType] = fn;
  }

  registerInfix(tokenType: TokenType, fn: any) {
    this.infixParseFns[tokenType] = fn;
  }

  parseProgram(): Program | null {
    const program = new Program();

    if (this.curToken == undefined) {
      return null;
    }

    while (this.curToken.type != TokenDef.EOF) {
      const stmt: any = this.parseStatement();
      if (stmt != null) {
        program.statements.push(stmt);
      }
      this.nextToken();
    }

    return program;
  }

  parseStatement():
    | LetStatement
    | ReturnStatement
    | ExpressionStatement
    | null {
    if (this.curToken == undefined) {
      return null;
    }
    switch (this.curToken.type) {
      case TokenDef.LET:
        return this.parseLetStatement();
      case TokenDef.RETURN:
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
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

  parseReturnStatement(): ReturnStatement | null {
    if (this.curToken == undefined) {
      return null;
    }
    const stmt: ReturnStatement | null = new ReturnStatement(this.curToken);

    this.nextToken();

    while (!this.curTokenIs(TokenDef.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpressionStatement(): ExpressionStatement | null {
    if (this.curToken == undefined) {
      return null;
    }
    const stmt: ExpressionStatement | null = new ExpressionStatement(
      this.curToken,
    );

    stmt.expression = this.parseExpression(LOWEST);

    if (this.peekTokenIs(TokenDef.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpression(precedence: number) {
    if (this.curToken == undefined) {
      return null;
    }
    const prefix = this.prefixParseFns[this.curToken.type]; //  [Function: parseIdentifier]
    if (prefix == null) {
      return null;
    }
    console.log(precedence);
    const leftExp = prefix(this.curToken);

    return leftExp;
  }

  parseIdentifier(curToken: Token): Identifier {
    return new Identifier(curToken, curToken.literal);
  }

  parseIntegerLiteral(curToken: Token): IntegerLiteral {
    const lit = new IntegerLiteral(curToken);
    const value = Number(curToken.literal);
    lit.value = value;

    return lit;
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
