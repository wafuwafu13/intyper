import { Builtin, Error, Integer } from '../object/object';

export const builtins = {
  len: new Builtin((...args: any): any => {
    if (args.length != 1) {
      return new Error(`wrong number of arguments. got=${args.length}, want=1`);
    }

    switch (args[0].constructor.name) {
      case 'String':
        return new Integer(args[0].value.length);
      default:
        return new Error(
          `argument to \`len\` not supported, got ${args[0].type()}`,
        );
    }
  }),
};
