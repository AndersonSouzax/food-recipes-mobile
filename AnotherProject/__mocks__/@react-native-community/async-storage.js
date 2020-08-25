const AsyncStorage = {
	setItem : async (k,v) => 1,
	getItem : async (k) => { 
		return JSON.stringify({ token: '9340349njfnidfbuierf', name : 'And', id : 1 }); 
	}
}

export { AsyncStorage as default }