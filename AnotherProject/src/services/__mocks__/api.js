

class API {

  constructor(){

    this.users = {
      'anderson': { data : { token: '9340349njfnidfbuierf', name : 'And', id : 1 } }
    };

    this.recipes = [
      { id: 1, title : 'Fish', user : { id: 1 }, category : { id: 1 } },
      { id: 67, title : 'Sushi', user : { id: 2 }, category : { id: 54 } },
    ];
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
      process.nextTick(() => {

          if(url.includes('recipe?user')){

            // As we're working in a controlled enviroment,there's no need for checks...
            const userId = parseInt(url.substring(url.indexOf('=') + 1));
    
            resolve(this.recipes.filter( x => x.user.id === userId));

          }else{
            resolve( { data: this.recipes } )   
          }
        });
    });
  }

}


export default new API();