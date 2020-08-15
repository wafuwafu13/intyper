import { Token } from '../token/token';

// TODO
// class Node {
//     tokenLiteral(statement) {
//         return statement.Token.Literal
//     }
// }

export class Program {
  statements: LetStatement[] | ReturnStatement[] | ExpressionStatement[];
  // tokenLiteralFC: () => string | number;

  constructor(
    statements: LetStatement[] | ReturnStatement[] | ExpressionStatement[] = [],
  ) {
    this.statements = statements;
    // this.tokenLiteralFC = this.tokenLiteral;
  }

  // TODO
  // tokenLiteral(): string | number {
  //   if (this.statements.length > 0) {
  //     return this.statements[0].token.literal;
  //   } else {
  //     return '';
  //   }
  // }
}

export class LetStatement {
  token: Token;
  name: Identifier;
  value?: any;

  constructor(token: Token) {
    this.token = token;
    this.name = name;
    //this.value = value;
  }

  statementNode() {}

  tokenLiteral(): string | number {
    return this.token.literal;
  }
}

export class ReturnStatement {
  token: Token;
  value?: any;

  constructor(token: Token) {
    this.token = token;
  }

  tokenLiteral(): string | number {
    return this.token.literal;
  }
}

export class ExpressionStatement {
  token: Token;
  expression?: Identifier;
  value?: any;

  constructor(token: Token) {
    this.token = token;
  }

  tokenLiteral(): string | number {
    return this.token.literal;
  }
}

export class PrefixExpression {
  token: Token;
  operator: string | number;
  right?: Identifier;

  constructor(token: Token, operator: string | number) {
    this.token = token;
    this.operator = operator;
  }

  tokenLiteral(): string | number {
    return this.token.literal;
  }
}

export class InfixExpression {
  token: Token;
  left: Identifier;
  operator: string | number;
  right?: Identifier;

  constructor(token: Token, operator: string | number, left: Identifier) {
    this.token = token;
    this.operator = operator;
    this.left = left;
  }

  tokenLiteral(): string | number {
    return this.token.literal;
  }
}

export class Identifier {
  token: Token;
  value: string | number;

  constructor(token: Token, value: string | number) {
    this.token = token;
    this.value = value;
  }

  expressionNode() {} // Why defined?

  tokenLiteral(): string | number {
    return this.token.literal;
  }
}

export class IntegerLiteral {
  token: Token;
  value?: number;

  constructor(token: Token) {
    this.token = token;
  }

  tokenLiteral(): string | number {
    return this.token.literal;
  }
}

export class Boolean {
  token: Token;
  value: boolean;

  constructor(token: Token, value: boolean) {
    this.token = token;
    this.value = value;
  }

  tokenLiteral(): string | number {
    return this.token.literal;
  }
}
