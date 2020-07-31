import axios from 'axios';

class API {

	constructor(){

		this.loginAdress = 'https://receitas.devari.com.br/authentication/';

		this.api = axios.create({
  		baseURL: 'https://receitas.devari.com.br/api/v1/',
		});	

	}

	login(credentials){
		return axios({ method: 'post', url: this.loginAdress, data : credentials });
	}

}

export default new API();

