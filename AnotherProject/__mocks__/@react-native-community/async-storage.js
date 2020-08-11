const AsyncStorage = {
	setItem : async (k,v) => 1,
	getItem : async () => { return JSON.stringify({ name: 'cat' }); }
}

export { AsyncStorage as default };