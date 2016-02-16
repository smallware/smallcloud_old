
// Fetch all groups
S.groups.fetch();

// Fetch a specific group
S.groups.fetch({
  query: {id: 42}
});

// Fetch groups with more than one user
S.groups.fetch({
  query: {
    count: {$gt: 1}
  }
});

// Fetch the groups a user belongs to
S.groups.fetch({
  query: {
    users: 'andres'
  }
});

// Get users that belong to admin group
S.users.fetch({
  query: {
    groups: 'admin'
  }
});

// Get users that belogs to admin and cebollines
S.users.fetch({
  query: {
    groups: {
      $and: {
        $eq: 'admin',
        $eq: 'cebollines'
      }
    }
  }
});
