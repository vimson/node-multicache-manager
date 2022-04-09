class CacheEngineFactory {
  public getInstance<T>(entityClass: new (id: number) => T, id: number): T {
    const entity = new entityClass(id);
    // logic to load the entity ...
    return entity;
  }
}

class CacheEngineFactoryWithOptions {
  public getInstance<T>(
    entityClass: new ({ ...options }: any) => T,
    { ...options }: any
  ): T {
    const entity = new entityClass({ ...options });
    Object.assign(this, options);
    return entity;
  }
}

class SomeClass {
  constructor({ ...options }) {
    Object.assign(this, options);
  }
}

test('Experimenting factory methods', () => {
  const classNames = {
    SomeClass: SomeClass,
  };

  //let result = new CacheEngineFactory().getInstance(classNames.SomeClass, 1);

  let result = new CacheEngineFactoryWithOptions().getInstance(
    classNames.SomeClass,
    { name: 'Vimson', email: 'vimson@gmail.com', phone: '+971508019727' }
  );

  console.log(result);
});
