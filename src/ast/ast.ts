import { Token, TokenProps } from '../token/token';

export interface ProgramProps {
  statements:
    | LetStatement<LetStatementProps>[]
    | ReturnStatement<ReturnStatementProps>[]
    | ExpressionStatement<ExpressionStatementProps>[];
}

export class Program<T extends ProgramProps> {
  statements: T['statements'];

  constructor(statements: T['statements'] = []) {
    this.statements = statements;
  }
}

export interface LetStatementProps {
  token: Token<TokenProps>;
  name: Identifier<IdentifierProps>;
  value?: any;
}

export class LetStatement<T extends LetStatementProps> {
  token: T['token'];
  name: T['name'];
  value?: T['value'];

  constructor(token: T['token']) {
    this.token = token;
    this.name = name;
  }

  statementNode() {}

  tokenLiteral(): string | number {
    return this.token.literal;
  }
}

export interface ReturnStatementProps {
  token: Token<TokenProps>;
  value?: any;
}

export class ReturnStatement<T extends ReturnStatementProps> {
  token: T['token'];
  value?: T['value'];

  constructor(token: T['token']) {
    this.token = token;
  }

  tokenLiteral(): string | number {
    return this.token.literal;
  }
}

export interface ExpressionStatementProps {
  token: Token<TokenProps>;
  expression?: Identifier<IdentifierProps>;
  value?: any;
}

export class ExpressionStatement<T extends ExpressionStatementProps> {
  token: T['token'];
  expression?: T['expression'];
  value?: T['value'];

  constructor(token: T['token']) {
    this.token = token;
  }

  tokenLiteral(): string | number {
    return this.token.literal;
  }
}

export interface PrefixExpressionProps {
  token: Token<TokenProps>;
  operator: string | number;
  right?: Identifier<IdentifierProps>;
}

export class PrefixExpression<T extends PrefixExpressionProps> {
  token: T['token'];
  operator: T['operator'];
  right?: T['right'];

  constructor(token: T['token'], operator: T['operator']) {
    this.token = token;
    this.operator = operator;
  }

  tokenLiteral(): string | number {
    return this.token.literal;
  }
}

export interface InfixExpressionProps {
  token: Token<TokenProps>;
  operator: string | number;
  left: Identifier<IdentifierProps>;

  right?: Identifier<IdentifierProps>;
}

export class InfixExpression<T extends InfixExpressionProps> {
  token: T['token'];
  operator: T['operator'];
  left: T['left'];
  right?: Identifier<IdentifierProps>;

  constructor(token: T['token'], operator: T['operator'], left: T['left']) {
    this.token = token;
    this.operator = operator;
    this.left = left;
  }

  tokenLiteral(): string | number {
    return this.token.literal;
  }
}

export interface IdentifierProps {
  token: Token<TokenProps>;
  value: string | number;
}

export class Identifier<T extends IdentifierProps> {
  token: T['token'];
  value: T['value'];

  constructor(token: T['token'], value: T['value']) {
    this.token = token;
    this.value = value;
  }

  expressionNode() {} // Why defined?

  tokenLiteral(): string | number {
    return this.token.literal;
  }
}

export interface IntegerLiteralProps {
  token: Token<TokenProps>;
  value?: number;
}

export class IntegerLiteral<T extends IntegerLiteralProps> {
  token: T['token'];
  value?: T['value'];

  constructor(token: T['token']) {
    this.token = token;
  }

  tokenLiteral(): string | number {
    return this.token.literal;
  }
}

export interface BooleanProps {
  token: Token<TokenProps>;
  value: boolean;
}

export class Boolean<T extends BooleanProps> {
  token: T['token'];
  value: T['value'];

  constructor(token: T['token'], value: T['value']) {
    this.token = token;
    this.value = value;
  }

  tokenLiteral(): string | number {
    return this.token.literal;
  }
}
