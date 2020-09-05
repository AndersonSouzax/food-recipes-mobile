const express = require('express');
var bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3030;

const recipes = [
      { id: 1, title : 'Fish', user : { id: 1 }, category : { id: 1 } },
      { id: 67, title : 'Sushi', user : { id: 2 }, category : { id: 54 } },
    ];

app.get('/api/v1/recipe', function (req, res) {
 	
 	let user = req.query.user;

 	if(user){

 		res.json([{ id: 67, title : 'Sushi', user : { id: 2 }, 
 			category : { id: 54 } }]);

 	}else{

 		res.json(recipes);
 	}
});

app.get('/api/v1/recipe/:id', function(req, res) {

	let id = req.params.id;

	res.json(recipes.filter( x => x.id === id));

});

app.post('/authentication', function (req, res) {
  res.json({ token: '9340349njfnidfbuierf', name : 'And', id : 1, 
  	image : 'http://br.web.img3.acsta.net/r_1920_1080/pictures/17/05/24/16/35/013898.jpg' });
});

app.post('/api/v1/category', function (req, res) {
  res.json([{ id : 1, name : "Japonese Food", 
  	image : 'https://upload.wikimedia.org/wikipedia/commons/5/57/Oseti.jpg'}]);
});

app.post('/api/v1/recipe/', function (req, res) {
  
 	let body = Object.assign({}, req.body);
 	let userId = body.user;
 	let catId = body.category;

 	body.user = { id : userId };
 	body.category = { id : catId };

 	res.json(body);

});

app.put('/api/v1/recipe/:id', function (req, res) {
 	 
 	let body = Object.assign({}, req.body);
 	let userId = body.user;
 	let catId = body.category;

 	body.user = { id : userId };
 	body.category = { id : catId };

 	res.json(body);
});

app.delete('/api/v1/recipe/:id', function (req, res) {
  res.send('Got a DELETE request at /user');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

