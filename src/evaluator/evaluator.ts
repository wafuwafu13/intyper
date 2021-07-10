import {
  Integer,
  Boolean,
  Null,
  ReturnValue,
  Error,
  INTEGER_OBJ,
  RETURN_VALUE_OBJ,
  ERROR_OBJ,
} from '../object/object';

export const Eval = (node: any): any => {
  switch (node.constructor.name) {
    case 'Program':
      return evalProgram(node);
    case 'ExpressionStatement':
      return Eval(node.expression);
    case 'IntegerLiteral':
      return new Integer(node.value);
    case 'Boolean':
      return new Boolean(node.value);
    case 'PrefixExpression': {
      const right = Eval(node.right);
      if (isError(right)) {
        return right;
      }
      return evalPrefixExpression(node.operator, right);
    }
    case 'InfixExpression': {
      const left = Eval(node.left);
      if (isError(left)) {
        return left;
      }
      const right = Eval(node.right);
      if (isError(right)) {
        return right;
      }
      return evalInfixExpression(node.operator, left, right);
    }
    case 'BlockStatement':
      return evalBlockStatement(node);
    case 'IfExpression':
      return evalIfExpression(node);
    case 'ReturnStatement': {
      const val = Eval(node.returnValue);
      if (isError(val)) {
        return val;
      }
      return new ReturnValue(val);
    }
  }

  return null;
};

const evalProgram = (program: any): any => {
  let result: any;
  for (const statement of program.statements) {
    result = Eval(statement);

    switch (result.constructor.name) {
      case 'ReturnValue':
        return result.value;
      case 'Error':
        return result;
    }
  }

  return result;
};

const evalBlockStatement = (block: any): any => {
  let result: any;

  for (const statement of block.statements) {
    result = Eval(statement);
    if (result != null) {
      const rt = result.type();
      if (rt == RETURN_VALUE_OBJ || rt == ERROR_OBJ) {
        return result;
      }
    }
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
      return new Error(`unknown operator: ${operator}${right.type}`);
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
    return new Error(`unknown operator: -${right.type()}`);
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
  if (left.type() != right.type()) {
    return new Error(
      `type mismatch: ${left.type()} ${operator} ${right.type()}`,
    );
  }
  return new Error(
    `unknown operator: ${left.type()} ${operator} ${right.type()}`,
  );
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
      return new Error(
        `unknown operator: ${left.type()} ${operator} ${right.type()}`,
      );
  }
};

const evalIfExpression = (ie: any): any => {
  const condition = Eval(ie.condition);
  if (isError(condition)) {
    return condition;
  }

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

const isError = (obj: any): boolean => {
  if (obj != null) {
    return obj.type() == ERROR_OBJ;
  }
  return false;
};
