import { Integer } from '../object/object';

export const Eval = (node: any): any => {
  switch (node.constructor.name) {
    case 'Program':
      return evalStatements(node.statements);
    case 'ExpressionStatement':
      return Eval(node.expression);
    case 'IntegerLiteral':
      return new Integer(node.value);
  }

  return null;
};

const evalStatements = (stmts: any): any => {
  let result: any;
  for (const statement of stmts) {
    result = Eval(statement);
  }

  return result;
};
