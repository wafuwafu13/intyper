type ObjectType = string;

export const INTEGER_OBJ = 'INTEGER';
export const BOOLEAN_OBJ = 'BOOLEAN';
export const NULL_OBJ = 'NULL';

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
