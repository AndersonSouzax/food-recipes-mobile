import axios from 'axios';

class API {

	constructor(){

		this.loginAdress = 'https://receitas.devari.com.br/authentication/';

		this.baseURL = 'https://receitas.devari.com.br/api/v1';

	}

	login(credentials){
		return axios({ method: 'post', url: this.loginAdress, data : credentials });
	}

	request(url, method, token, informations){
		return axios({ method : method, url: this.baseURL + url, data: informations,
			headers: {'Authorization' : `Token ${token}`},
		});
	}

}

export default new API();

