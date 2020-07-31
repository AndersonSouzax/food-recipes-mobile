const users = {
  'anderson': { token: '9340349njfnidfbuierf', name : 'And', id : 1}
};

export function login(credentials) {
  return new Promise((resolve, reject) => {
    process.nextTick(() =>
      users[credentials.username]
        ? resolve(users[credentials.username])
        : reject({
            error: 'User with ' + credentials.username + ' not found.',
          }),
    );
  });
}