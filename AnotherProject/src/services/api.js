import axios from 'axios';

class API {

	constructor(){

		this.loginAdress = 'http://192.168.11.25:3030/authentication/';

		this.baseURL = 'http://192.168.11.25:3030/api/v1';

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

