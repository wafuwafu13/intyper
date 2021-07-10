type ObjectType = string;

export const INTEGER_OBJ = 'INTEGER';
export const BOOLEAN_OBJ = 'BOOLEAN';
export const NULL_OBJ = 'NULL';
export const RETURN_VALUE_OBJ = 'RETURN_VALUE';
export const ERROR_OBJ = 'ERROR';

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
