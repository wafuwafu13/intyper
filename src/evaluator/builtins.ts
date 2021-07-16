import { Array, Builtin, Error, Integer } from '../object/object';

export const builtins = {
  len: new Builtin((...args: any): any => {
    if (args.length != 1) {
      return new Error(`wrong number of arguments. got=${args.length}, want=1`);
    }

    switch (args[0].constructor.name) {
      case 'String':
        return new Integer(args[0].value.length);
      case 'Array':
        return new Integer(args[0].elements.length);
      default:
        return new Error(
          `argument to \`len\` not supported, got ${args[0].type()}`,
        );
    }
  }),

  first: new Builtin((...args: any): any => {
    if (args.length != 1) {
      return new Error(`wrong number of arguments. got=${args.length}, want=1`);
    }

    if (args[0].constructor.name != 'Array') {
      return new Error(
        `argument to \`first\` must be ARRAY, got ${args[0].type()}`,
      );
    }

    if (args[0].elements.length > 0) {
      return args[0].elements[0];
    }

    return null;
  }),

  last: new Builtin((...args: any): any => {
    if (args.length != 1) {
      return new Error(`wrong number of arguments. got=${args.length}, want=1`);
    }

    if (args[0].constructor.name != 'Array') {
      return new Error(
        `argument to \`last\` must be ARRAY, got ${args[0].type()}`,
      );
    }

    const length = args[0].elements.length;

    if (length > 0) {
      return args[0].elements[length - 1];
    }

    return null;
  }),

  rest: new Builtin((...args: any): any => {
    if (args.length != 1) {
      return new Error(`wrong number of arguments. got=${args.length}, want=1`);
    }

    if (args[0].constructor.name != 'Array') {
      return new Error(
        `argument to \`rest\` must be ARRAY, got ${args[0].type()}`,
      );
    }

    const length = args[0].elements.length;

    if (length > 0) {
      const newElements = JSON.parse(JSON.stringify(args[0].elements)).slice(
        1,
        length,
      );

      return new Array(newElements);
    }

    return null;
  }),

  push: new Builtin((...args: any): any => {
    if (args.length != 2) {
      return new Error(`wrong number of arguments. got=${args.length}, want=2`);
    }

    if (args[0].constructor.name != 'Array') {
      return new Error(
        `argument to \`rest\` must be ARRAY, got ${args[0].type()}`,
      );
    }

    const length = args[0].elements.length;

    let newElements = JSON.parse(JSON.stringify(args[0].elements));
    newElements[length] = args[1];

    return new Array(newElements);
  }),
};
