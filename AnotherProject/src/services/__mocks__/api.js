

class API {

  constructor(){

    this.users = {
      'anderson': { data : { token: '9340349njfnidfbuierf', name : 'And', id : 1 } }
    };

  }

  login(credentials) {
    return new Promise((resolve, reject) => {
      process.nextTick(() =>
        this.users[credentials.username]
          ? resolve(this.users[credentials.username])
          : reject({
            error: 'User with ' + credentials.username + ' not found.',
        }),
      );
    });
  }

  request(url, method, token, informations) {
    return new Promise((resolve, reject) => {
      process.nextTick(() => resolve([{id: 2, title : 'Loving...' }]));
    });
  }

}


export default new API();