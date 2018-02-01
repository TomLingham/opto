export const match = test => (...args) => {
  const optional = args.find(x => x instanceof test.constructor);

  if (!optional) {
    console.error(test);
    throw new Error('Match not satisfied');
  }

  return optional.isEmpty
    ? optional.value()
    : optional.value(test.value)
}

export const option = (name, isEmpty = false) => {
  const m = {
    [name]: function (value) {
      this.value = value;
      this.isEmpty = isEmpty;
    }
  };
  return val => new m[name](val);
}

export const Some = option('Some');

export const None = option('None', true);