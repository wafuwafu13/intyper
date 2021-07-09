import { Integer, Boolean, Null, INTEGER_OBJ } from '../object/object';

export const Eval = (node: any): any => {
  switch (node.constructor.name) {
    case 'Program':
      return evalStatements(node.statements);
    case 'ExpressionStatement':
      return Eval(node.expression);
    case 'IntegerLiteral':
      return new Integer(node.value);
    case 'Boolean':
      return new Boolean(node.value);
    case 'PrefixExpression': {
      const right = Eval(node.right);
      return evalPrefixExpression(node.operator, right);
    }
    case 'InfixExpression': {
      const left = Eval(node.left);
      const right = Eval(node.right);
      return evalInfixExpression(node.operator, left, right);
    }
    case 'BlockStatement':
      return evalStatements(node.statements);
    case 'IfExpression':
      return evalIfExpression(node);
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

const evalPrefixExpression = (operator: string, right: any): any => {
  switch (operator) {
    case '!':
      return evalBangOperatorExpression(right);
    case '-':
      return evalMinusPrefixOperatorExpression(right);
    default:
      return new Null();
  }
};

const evalBangOperatorExpression = (right: any): any => {
  switch (right.value) {
    case true:
      return new Boolean(false);
    case false:
      return new Boolean(true);
    case null:
      return new Boolean(true);
    default:
      return new Boolean(false);
  }
};

const evalMinusPrefixOperatorExpression = (right: any): any => {
  if (right.type() != INTEGER_OBJ) {
    return new Null();
  }

  const value = right.value;
  return new Integer(-value);
};

const evalInfixExpression = (operator: string, left: any, right: any): any => {
  if (left.type() == INTEGER_OBJ && right.type() == INTEGER_OBJ) {
    return evalIntegerInfixExpression(operator, left, right);
  }
  if (operator == '==') {
    return new Boolean(left.value == right.value);
  }
  if (operator == '!=') {
    return new Boolean(left.value != right.value);
  }
  return new Null();
};

const evalIntegerInfixExpression = (
  operator: string,
  left: any,
  right: any,
): any => {
  const leftVal = left.value;
  const rightVal = right.value;

  switch (operator) {
    case '+':
      return new Integer(leftVal + rightVal);
    case '-':
      return new Integer(leftVal - rightVal);
    case '*':
      return new Integer(leftVal * rightVal);
    case '/':
      return new Integer(leftVal / rightVal);
    case '<':
      return new Boolean(leftVal < rightVal);
    case '>':
      return new Boolean(leftVal > rightVal);
    case '==':
      return new Boolean(leftVal == rightVal);
    case '!=':
      return new Boolean(leftVal != rightVal);
    default:
      return new Null();
  }
};

const evalIfExpression = (ie: any): any => {
  const condition = Eval(ie.condition);

  if (isTruthy(condition)) {
    return Eval(ie.consequence);
  } else if (ie.alternative != null) {
    return Eval(ie.alternative);
  } else {
    return new Null();
  }
};

const isTruthy = (obj: any): any => {
  switch (obj.value) {
    case null:
      return false;
    case true:
      return true;
    case false:
      return false;
    default:
      return true;
  }
};
