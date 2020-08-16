import { Lexer, LexerProps } from '../lexer/lexer';
import { Token, TokenDef, TokenType, TokenProps } from '../token/token';
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
  ProgramProps,
  LetStatementProps,
  ReturnStatementProps,
  ExpressionStatementProps,
  PrefixExpressionProps,
  InfixExpressionProps,
  IdentifierProps,
  IntegerLiteralProps,
  BooleanProps,
} from '../ast/ast';

const LOWEST = 1;
const EQUALS = 2;
const LESSGREATER = 3;
const SUM = 4;
const PRODUCT = 5;
const PREFIX = 6;
// const CALL = 7

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

interface ParserProps {
  l: Lexer<LexerProps>;
  curToken: Token<TokenProps>;
  peekToken: Token<TokenProps>;
  errors: string[];

  prefixParseFns: Map<
    string,
    (
      t: Token<TokenProps>,
    ) =>
      | Identifier<IdentifierProps>
      | IntegerLiteral<IntegerLiteralProps>
      | Boolean<BooleanProps>
  >;
  infixParseFns: Map<
    string,
    (
      t: Token<TokenProps>,
      left: Identifier<IdentifierProps>,
    ) => InfixExpression<InfixExpressionProps>
  >;
}

export class Parser<T extends ParserProps> {
  l: T['l'];
  curToken: T['curToken'];
  peekToken: T['peekToken'];
  errors: T['errors'] = [];

  prefixParseFns: T['prefixParseFns'];
  infixParseFns: T['infixParseFns'];

  constructor(
    l: T['l'],
    curToken: T['curToken'] = new Token(TokenDef.DEFAULT, 'DEFAULT'),
    peekToken: T['peekToken'] = new Token(TokenDef.DEFAULT, 'DEFAULT'),
    errors: T['errors'] = [],
    prefixParseFns: T['prefixParseFns'] = new Map<
      string,
      (
        t: Token<TokenProps>,
      ) =>
        | Identifier<IdentifierProps>
        | IntegerLiteral<IntegerLiteralProps>
        | Boolean<BooleanProps>
    >(),
    infixParseFns: T['infixParseFns'] = new Map<
      string,
      (
        t: Token<TokenProps>,
        left: Identifier<IdentifierProps>,
      ) => InfixExpression<InfixExpressionProps>
    >(),
  ) {
    this.l = l;
    this.curToken = curToken;
    this.peekToken = peekToken;
    this.errors = errors;
    this.prefixParseFns = prefixParseFns;
    this.infixParseFns = infixParseFns;

    this.nextToken();
    this.nextToken();

    this.registerPrefix(TokenDef.IDENT, this.parseIdentifier);
    this.registerPrefix(TokenDef.INT, this.parseIntegerLiteral);
    this.registerPrefix(TokenDef.BANG, this.parsePrefixExpression);
    this.registerPrefix(TokenDef.MINUS, this.parsePrefixExpression);
    this.registerPrefix(TokenDef.TRUE, this.parseBoolean);
    this.registerPrefix(TokenDef.FALSE, this.parseBoolean);
    this.registerPrefix(TokenDef.LPAREN, this.parseGroupedExpression);

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
    fn: (
      t: Token<TokenProps>,
    ) =>
      | Identifier<IdentifierProps>
      | IntegerLiteral<IntegerLiteralProps>
      | Boolean<BooleanProps>,
  ): void {
    this.prefixParseFns.set(tokenType, fn);
  }

  registerInfix(
    tokenType: TokenType,
    fn: (
      t: Token<TokenProps>,
      left: Identifier<IdentifierProps>,
    ) => InfixExpression<InfixExpressionProps>,
  ): void {
    this.infixParseFns.set(tokenType, fn);
  }

  parseProgram(): Program<ProgramProps> {
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
    | LetStatement<LetStatementProps>
    | ReturnStatement<ReturnStatementProps>
    | ExpressionStatement<ExpressionStatementProps> {
    switch (this.curToken.type) {
      case TokenDef.LET:
        return this.parseLetStatement();
      case TokenDef.RETURN:
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
    }
  }

  parseLetStatement(): LetStatement<LetStatementProps> {
    const stmt: LetStatement<LetStatementProps> = new LetStatement(
      this.curToken,
    );

    if (!this.expectPeek(TokenDef.IDENT)) {
      return stmt;
    }

    stmt.name = new Identifier(this.curToken, this.curToken.literal);

    if (!this.expectPeek(TokenDef.ASSIGN)) {
      return stmt;
    }

    while (!this.curTokenIs(TokenDef.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseReturnStatement(): ReturnStatement<ReturnStatementProps> {
    const stmt: ReturnStatement<ReturnStatementProps> = new ReturnStatement(
      this.curToken,
    );

    this.nextToken();

    while (!this.curTokenIs(TokenDef.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpressionStatement(): ExpressionStatement<ExpressionStatementProps> {
    const stmt: ExpressionStatement<ExpressionStatementProps> = new ExpressionStatement(
      this.curToken,
    );

    stmt.expression = this.parseExpression(LOWEST);

    if (this.peekTokenIs(TokenDef.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  noPrefixParseFnError(t: TokenType): void {
    const msg = 'no prefix parse function for ' + t + ' found';
    this.errors.push(msg);
  }

  parseExpression(precedence: number): any {
    const prefix: (t: Token<TokenProps>) => any = this.prefixParseFns
      .get(this.curToken.type)!
      .bind(this); //  [Function: parseIdentifier]
    if (prefix == null) {
      this.noPrefixParseFnError(this.curToken.type);
      return null;
    }

    let leftExp: any = prefix(this.curToken);

    while (
      !this.curTokenIs(TokenDef.SEMICOLON) &&
      precedence < this.peekPrecedence()
    ) {
      const infix: (
        t: Token<TokenProps>,
        left: Identifier<IdentifierProps>,
      ) => InfixExpression<InfixExpressionProps> = this.infixParseFns
        .get(this.peekToken.type)!
        .bind(this);
      if (infix == null) {
        return leftExp;
      }

      this.nextToken();

      leftExp = infix(this.curToken, leftExp);
    }

    return leftExp;
  }

  parseIdentifier(curToken: Token<TokenProps>): Identifier<IdentifierProps> {
    return new Identifier(curToken, curToken.literal);
  }

  parseIntegerLiteral(
    curToken: Token<TokenProps>,
  ): IntegerLiteral<IntegerLiteralProps> {
    const lit = new IntegerLiteral(curToken);
    const value = Number(curToken.literal);
    lit.value = value;

    return lit;
  }

  parsePrefixExpression(
    curToken: Token<TokenProps>,
  ): PrefixExpression<PrefixExpressionProps> {
    const expression = new PrefixExpression(curToken, curToken.literal);

    this.nextToken();

    expression.right = this.parseExpression(PREFIX);

    return expression;
  }

  parseInfixExpression(
    curToken: Token<TokenProps>,
    left: Identifier<IdentifierProps>,
  ): InfixExpression<InfixExpressionProps> {
    const expression = new InfixExpression(curToken, curToken.literal, left);
    const precedence = this.curPrecedence();

    this.nextToken();

    expression.right = this.parseExpression(precedence);

    return expression;
  }

  parseGroupedExpression(): Identifier<IdentifierProps> {
    this.nextToken();
    const exp = this.parseExpression(LOWEST);

    if (!this.peekTokenIs(TokenDef.RPAREN)) {
      return exp;
    }

    return exp;
  }

  parseBoolean(curToken: Token<TokenProps>): Boolean<BooleanProps> {
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
