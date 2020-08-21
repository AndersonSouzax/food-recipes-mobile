import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

class API {

	constructor(){

		this.loginAdress = 'https://receitas.devari.com.br/authentication/';

		this.api = axios.create({
  		baseURL: 'https://receitas.devari.com.br/api/v1/',
		});

		this.api.interceptors.request.use(async (config) => {

//		  if (!config.url.includes('authentication')){

		  	const userToken = await AsyncStorage.getItem('FoodRecipeToken');

		  	config.headers.Authorization = `Token ${userToken}`;
//  		}
  		
  		return config;

		}, (error) => { return Promise.reject(error); });

	}

	login(credentials){
		return axios({ method: 'post', url: this.loginAdress, data : credentials });
	}

	PostRequest(url, informations){
		return this.api.post(url, informations);
	}

	GetRequest(url){
		return this.api.get(url);
	}

}

export default new API();

