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
  value?: Identifier<IdentifierProps>;
}

export class LetStatement<T extends LetStatementProps> {
  token: T['token'];
  name?: T['name'];
  value?: T['value'];

  constructor(token: T['token']) {
    this.token = token;
  }

  tokenLiteral(): string | number {
    return this.token.literal;
  }

  string(): string {
    let statements = [];
    statements.push(this.tokenLiteral() + ' ');
    statements.push(this.name!.string());
    statements.push(' = ');

    if (this.value != null) {
      statements.push(this.value.string());
    }

    statements.push(';');

    return statements.join('');
  }
}

export interface ReturnStatementProps {
  token: Token<TokenProps>;
  value?: Identifier<IdentifierProps>;
}

export class ReturnStatement<T extends ReturnStatementProps> {
  token: T['token'];
  returnValue?: T['value'];

  constructor(token: T['token']) {
    this.token = token;
  }

  tokenLiteral(): string | number {
    return this.token.literal;
  }

  string(): string {
    let statements = [];
    statements.push(this.tokenLiteral() + ' ');

    if (this.returnValue != null) {
      statements.push(this.returnValue);
    }

    statements.push(';');

    return statements.join('');
  }
}

export interface ExpressionStatementProps {
  token: Token<TokenProps>;
  expression?: Identifier<IdentifierProps>;
  value?: Identifier<IdentifierProps>;
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

  string(): string | number {
    if (this.expression != null) {
      return this.expression.string();
    }
    return '';
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

  string(): string {
    let statements = [];
    statements.push('(');
    statements.push(this.operator);
    statements.push(this.right!.string());
    statements.push(')');

    return statements.join('');
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

  string(): string {
    let statements = [];
    statements.push('(');
    try {
      statements.push(this.left.string());
    } catch {
      statements.push(this.left.value);
    }
    statements.push(' ' + this.operator + ' ');
    try {
      statements.push(this.right!.string());
    } catch {
      statements.push(this.right!.value);
    }
    statements.push(')');

    return statements.join('');
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

  tokenLiteral(): string | number {
    return this.token.literal;
  }

  string(): string | number {
    return this.value;
  }
}

export interface StringLiteralProps {
  token: Token<TokenProps>;
  value?: string;
}

export class StringLiteral<T extends StringLiteralProps> {
  token: T['token'];
  value?: T['value'];

  constructor(token: T['token'], value: T['value']) {
    this.token = token;
    this.value = value;
  }

  tokenLiteral(): string | number {
    return this.token.literal;
  }

  string(): string | number {
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

  string(): string | number {
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

  string(): string | number {
    return this.token.literal;
  }
}

export interface IfExpressionProps {
  token: Token<TokenProps>;
  condition?: Identifier<IdentifierProps>;
  consequence?: BlockStatement<BlockStatementProps>;
  alternative?: BlockStatement<BlockStatementProps>;
}

export class IfExpression<T extends IfExpressionProps> {
  token: T['token'];
  condition?: T['condition'];
  consequence?: T['consequence'];
  alternative?: T['alternative'];

  constructor(token: T['token']) {
    this.token = token;
  }

  tokenLiteral(): string | number {
    return this.token.literal;
  }

  string(): string | number {
    let statements = [];
    statements.push('if');
    statements.push(this.condition!.string());
    statements.push(' ');
    statements.push(this.consequence!.string());

    if (this.alternative != null) {
      statements.push('else');
      statements.push(this.alternative.string());
    }

    return statements.join('');
  }
}

export interface BlockStatementProps {
  token: Token<TokenProps>;
  statements?:
    | LetStatement<LetStatementProps>[]
    | ReturnStatement<ReturnStatementProps>[]
    | ExpressionStatement<ExpressionStatementProps>[];
}

export class BlockStatement<T extends BlockStatementProps> {
  token: T['token'];
  statements?: T['statements'];

  constructor(token: T['token']) {
    this.token = token;
  }

  tokenLiteral(): string | number {
    return this.token.literal;
  }

  string(): string {
    let statements = [];
    for (const statement of this.statements!) {
      statements.push(statement.string());
    }

    return statements.join('');
  }
}

export interface FunctionLiteralProps {
  token: Token<TokenProps>;
  parameters?: Identifier<IdentifierProps>[];
  body?: BlockStatement<BlockStatementProps>;
}

export class FunctionLiteral<T extends FunctionLiteralProps> {
  token: T['token'];
  parameters?: T['parameters'];
  body?: T['body'];

  constructor(token: Token<TokenProps>) {
    this.token = token;
  }

  tokenLiteral(): string | number {
    return this.token.literal;
  }

  string(): string {
    let statements = [];

    let params = [];
    for (const parameter of this.parameters!) {
      params.push(parameter.string());
    }

    statements.push(this.tokenLiteral());
    statements.push('(');
    statements.push(params.join(', '));
    statements.push(') ');
    statements.push(this.body!.string());

    return statements.join('');
  }
}

export interface CallExpressionProps {
  token: Token<TokenProps>;
  fc: Identifier<IdentifierProps>;
  arguments?: Identifier<IdentifierProps>[];
}

export class CallExpression<T extends CallExpressionProps> {
  token: T['token'];
  fc: T['fc'];
  arguments?: T['arguments'];

  constructor(token: T['token'], fc: T['fc']) {
    this.token = token;
    this.fc = fc;
  }

  tokenLiteral(): string | number {
    return this.token.literal;
  }

  string(): string {
    let statements = [];
    let args = [];

    for (const arg of this.arguments!) {
      args.push(arg.string());
    }

    statements.push(this.fc.string());
    statements.push('(');
    statements.push(args.join(', '));
    statements.push(')');

    return statements.join('');
  }
}

export interface ArrayLiteralProps {
  token: Token<TokenProps>;
  elements: any[];
}

export class ArrayLteral<T extends ArrayLiteralProps> {
  token: T['token'];
  elements?: T['elements'];

  constructor(token: T['token']) {
    this.token = token;
  }

  tokenLiteral(): string | number {
    return this.token.literal;
  }

  string(): string {
    let statements = [];
    let elements = [];
    for (const el of this.elements!) {
      elements.push(el.string());
    }
    statements.push('[');
    statements.push(elements.join(', '));
    statements.push(']');

    return statements.join('');
  }
}
