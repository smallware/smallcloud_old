

S.resource.fetch(42);

S.resource.fetch('42');

S.resource.fetch([42, 11, 52]);


S.resource.fetch({
  query: {key: 'key'}
});

S.resource.fetch({
  query: { name: {$like: 'Cebo%'}},
  from: {
    resource: 'resourceName',
    id: 42
  }
});

S.resource.create({
  query: {
    where: {},
    attributes: {},
    order: {},
    limit: {},
    offset: {}
  },
  data: {},
  from: {
    resource: 'resourceName',
    id: 42
  }
});











///////////////////////////////////////////////////////////////////////
S.resource.fetch({
  query: Object/String/Number,
  data:  Object,
  from:  String/Array
});

S.tags.fetch({
  query: {
    attributes: ['name', 'count'],
    order: ['name', 'ASC'],
    limit: 10,
    offset: 20
  },
  from: {
    resource: 'articles',
    id: 42
  }
});

S.tags.create({
  query: {},
  for: {
    resource: 'articles',
    id: 42
  }
});