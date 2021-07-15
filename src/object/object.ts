import type { BlockStatement, Identifier } from '../ast/ast';
import type { Environment } from './environment';

type ObjectType = string;

export const STRING_OBJ = 'STRING';
export const INTEGER_OBJ = 'INTEGER';
export const BOOLEAN_OBJ = 'BOOLEAN';
export const NULL_OBJ = 'NULL';
export const RETURN_VALUE_OBJ = 'RETURN_VALUE';
export const FUNCTION_OBJ = 'FUNCTION';
export const BUILTIN_OBJ = 'BUILTIN';
export const ARRAY_OBJ = 'ARRAY';
export const ERROR_OBJ = 'ERROR';

interface StringProps {
  value: string;
}

export class String<T extends StringProps> {
  value: T['value'];

  constructor(value: T['value']) {
    this.value = value;
  }

  inspect(): string {
    return this.value;
  }

  type(): ObjectType {
    return STRING_OBJ;
  }
}

interface IntegerProps {
  value: number;
}

export class Integer<T extends IntegerProps> {
  value: T['value'];

  constructor(value: T['value']) {
    this.value = value;
  }

  inspect(): void {
    console.log(this.value);
  }

  type(): ObjectType {
    return INTEGER_OBJ;
  }
}

interface BooleanProps {
  value: boolean;
}

export class Boolean<T extends BooleanProps> {
  value: T['value'];

  constructor(value: T['value']) {
    this.value = value;
  }

  inspect(): void {
    console.log(this.value);
  }

  type(): ObjectType {
    return BOOLEAN_OBJ;
  }
}

export class Null {
  inspect(): void {
    console.log('null');
  }

  type(): ObjectType {
    return NULL_OBJ;
  }
}

export class ReturnValue {
  value: any;

  constructor(value: any) {
    this.value = value;
  }

  inspect(): void {
    console.log(this.value.inspect());
  }

  type(): ObjectType {
    return RETURN_VALUE_OBJ;
  }
}

export class Function {
  parameters: Identifier<any>[];
  body: BlockStatement<any>;
  env: Environment;

  constructor(
    parameters: Identifier<any>[],
    body: BlockStatement<any>,
    env: Environment,
  ) {
    this.parameters = parameters;
    this.body = body;
    this.env = env;
  }

  inspect(): string {
    let out: string[] = [];
    let params: string[] = [];

    for (const p of this.parameters) {
      params.push(p.string() as any);
    }

    out.push('fn');
    out.push('(');
    out.push(params.join(', '));
    out.push(') {\n');
    out.push(this.body.string());
    out.push('\n}');

    return out.join('');
  }

  type(): ObjectType {
    return FUNCTION_OBJ;
  }
}

export class Builtin {
  fn: (...args: any) => any;

  constructor(fn: (...args: any) => any) {
    this.fn = fn;
  }

  inspect(): string {
    return 'builtin function';
  }

  type(): ObjectType {
    return BUILTIN_OBJ;
  }
}

export class Array {
  elements: any[];

  constructor(elements: any[]) {
    this.elements = elements;
  }

  inspect(): string {
    let out: string[] = [];
    let elements: string[] = [];

    for (const e of this.elements) {
      elements.push(e.inspect());
    }

    out.push('[');
    out.push(elements.join(''));
    out.push(']');

    return out.join('');
  }

  type(): ObjectType {
    return ARRAY_OBJ;
  }
}

export class Error {
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  inspect(): string {
    return 'ERROR: ' + this.message;
  }

  type(): ObjectType {
    return ERROR_OBJ;
  }
}
