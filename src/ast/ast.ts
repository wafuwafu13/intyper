import { Token } from '../token/token';

// TODO
// class Node {
//     tokenLiteral(statement) {
//         return statement.Token.Literal
//     }
// }

export class Program {
  statements: LetStatement[] | ReturnStatement[];
  tokenLiteralFC: () => string | number;

  constructor(statements: LetStatement[] | ReturnStatement[] = []) {
    this.statements = statements;
    this.tokenLiteralFC = this.tokenLiteral;
  }

  // TODO
  tokenLiteral(): string | number {
    if (this.statements.length > 0) {
      return this.statements[0].token.literal;
    } else {
      return '';
    }
  }
}

export class LetStatement {
  token: Token;
  name: Identifier;
  // value?: any;

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
  // returnValue: any;

  constructor(token: Token) {
    this.token = token;
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
