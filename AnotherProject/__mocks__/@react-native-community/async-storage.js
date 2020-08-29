const AsyncStorage = {
	setItem : async (k,v) => 1,
	getItem : async (k) => { 
		return JSON.stringify({ token: '9340349njfnidfbuierf', name : 'And', id : 2 }); 
	}
}

export { AsyncStorage as default }