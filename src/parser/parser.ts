import { Lexer } from '../lexer/lexer';
import { Token, TokenDef, TokenType } from '../token/token';
import {
  Program,
  LetStatement,
  Identifier,
  ReturnStatement,
  ExpressionStatement,
  IntegerLiteral,
  PrefixExpression,
  InfixExpression,
  Boolean,
} from '../ast/ast';

const LOWEST = 1;
const EQUALS = 2; // ==
const LESSGREATER = 3; // > または <
const SUM = 4; // +
const PRODUCT = 5; // *
const PREFIX = 6; // -X または !X
// const CALL = 7 // myFunction(X)

const precedences: { [token: string]: number } = {
  [TokenDef.EQ]: EQUALS,
  [TokenDef.NOT_EQ]: EQUALS,
  [TokenDef.LT]: LESSGREATER,
  [TokenDef.GT]: LESSGREATER,
  [TokenDef.PLUS]: SUM,
  [TokenDef.MINUS]: SUM,
  [TokenDef.SLASH]: PRODUCT,
  [TokenDef.ASTERISK]: PRODUCT,
};

export class Parser {
  l: Lexer;
  curToken: Token;
  peekToken: Token;
  errors: string[];

  prefixParseFns: any;
  infixParseFns: any;

  constructor(
    l: Lexer,
    curToken: Token = new Token(TokenDef.DEFAULT, 'DEFAULT'),
    peekToken: Token = new Token(TokenDef.DEFAULT, 'DEFAULT'),
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
    this.registerPrefix(TokenDef.BANG, this.parsePrefixExpression);
    this.registerPrefix(TokenDef.MINUS, this.parsePrefixExpression);
    this.registerPrefix(TokenDef.TRUE, this.parseBoolean);
    this.registerPrefix(TokenDef.FALSE, this.parseBoolean);

    this.infixParseFns = new Map();
    this.registerInfix(TokenDef.PLUS, this.parseInfixExpression);
    this.registerInfix(TokenDef.MINUS, this.parseInfixExpression);
    this.registerInfix(TokenDef.SLASH, this.parseInfixExpression);
    this.registerInfix(TokenDef.ASTERISK, this.parseInfixExpression);
    this.registerInfix(TokenDef.EQ, this.parseInfixExpression);
    this.registerInfix(TokenDef.NOT_EQ, this.parseInfixExpression);
    this.registerInfix(TokenDef.LT, this.parseInfixExpression);
    this.registerInfix(TokenDef.GT, this.parseInfixExpression);
  }

  nextToken(): void {
    this.curToken = this.peekToken;
    this.peekToken = this.l.NextToken();
  }

  registerPrefix(
    tokenType: TokenType,
    fn: (t: Token) => Identifier | IntegerLiteral | Boolean,
  ) {
    this.prefixParseFns[tokenType] = fn;
  }

  registerInfix(tokenType: TokenType, fn: any) {
    this.infixParseFns[tokenType] = fn;
  }

  parseProgram(): Program {
    const program = new Program();

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
    const stmt: ReturnStatement | null = new ReturnStatement(this.curToken);

    this.nextToken();

    while (!this.curTokenIs(TokenDef.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpressionStatement(): ExpressionStatement | null {
    const stmt: ExpressionStatement | null = new ExpressionStatement(
      this.curToken,
    );

    stmt.expression = this.parseExpression(LOWEST);

    if (this.peekTokenIs(TokenDef.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  noPrefixParseFnError(t: TokenType) {
    const msg = 'no prefix parse function for ' + t + ' found';
    this.errors.push(msg);
  }

  parseExpression(precedence: number) {
    const prefix = this.prefixParseFns[this.curToken.type].bind(this); //  [Function: parseIdentifier]
    if (prefix == null) {
      this.noPrefixParseFnError(this.curToken.type);
      return null;
    }

    let leftExp = prefix(this.curToken);

    while (
      !this.curTokenIs(TokenDef.SEMICOLON) &&
      precedence < this.peekPrecedence()
    ) {
      const infix = this.infixParseFns[this.peekToken.type].bind(this);
      if (infix == null) {
        return leftExp;
      }

      this.nextToken();

      leftExp = infix(this.curToken, leftExp);
    }

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

  parsePrefixExpression(curToken: Token): PrefixExpression {
    const expression = new PrefixExpression(curToken, curToken.literal);

    this.nextToken();

    expression.right = this.parseExpression(PREFIX);

    return expression;
  }

  parseInfixExpression(curToken: Token, left: Identifier): InfixExpression {
    const expression = new InfixExpression(curToken, curToken.literal, left);
    const precedence = this.curPrecedence();

    this.nextToken();

    expression.right = this.parseExpression(precedence);

    return expression;
  }

  parseBoolean(curToken: Token) {
    return new Boolean(curToken, this.curTokenIs(TokenDef.TRUE));
  }

  peekPrecedence(): number {
    const precedence = precedences[this.peekToken.type];

    return precedence || LOWEST;
  }

  curPrecedence(): number {
    const precedence = precedences[this.curToken.type];

    return precedence || LOWEST;
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
      this.peekError(t);
      return false;
    }
  }

  Errors(): string[] {
    return this.errors;
  }

  peekError(t: TokenType): void {
    const msg: string =
      'expected next token to be ' +
      t +
      ' , got ' +
      this.peekToken.type +
      ' instead';
    this.errors.push(msg);
  }
}
