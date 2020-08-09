import { Token } from '../token/token';

// TODO
// class Node {
//     tokenLiteral(statement) {
//         return statement.Token.Literal
//     }
// }

export const statement = () => {
  return [];
};

export class Program {
  statements: LetStatement[];
  tokenLiteralFC: () => string | number;

  constructor(statements: LetStatement[] = []) {
    this.statements = statements;
    this.tokenLiteralFC = this.tokenLiteral
  }

  tokenLiteral(): string | number {
    if (this.statements.length > 0) {
      return this.statements[0].token.literal
    } else {
      return '';
    }
  }
}

export class LetStatement {
  token: Token;
  name: Identifier;
  value: any; // TODO

  constructor(token: Token, name: any = undefined, value: any = undefined) { // TODO
    this.token = token;
    this.name = name;
    this.value = value;
  }

  statementNode() {}

  tokenLiteral() {
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
