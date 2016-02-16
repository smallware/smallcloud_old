
// Create a user
S.users.create({
  data: {
    username:  'andres',
    firtsname: 'andres',
    lastname:  'arroyo',
    avatar:    'avatar.jpg',
    password:  '12345678'
  }
});

// Create user with group
S.users.create({
  data: {
    username:  'andres',
    firtsname: 'andres',
    lastname:  'arroyo',
    avatar:    'avatar.jpg',
    password:  '12345678',
    groups:    ['admin']
  }
});

// Create a group
S.groups.create({
  data: {
    name:        'cebollitos',
    avatar:      'cebollitos.jpg',
    description: 'Grupo para la cebollita y el cebollito'
  }
});

// Add user to a group
S.groups.create({
  query: {
    id: 'cebollitos',    // Group ID
    users: 'andres'      // Resource and resource ID
  }
});
