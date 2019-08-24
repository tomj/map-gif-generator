'use strict';

const express = require('express');
const { createCanvas, loadImage } = require('canvas')
const GIFEncoder = require('gifencoder');
const dotenv = require('dotenv');
var logger = require('morgan');

// Constants
dotenv.config();
const PORT = 8080;
const HOST = '0.0.0.0';
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

// App and router setup
const app = express();
app.use(express.json());
app.use(logger('dev'));
var router = express.Router();
router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

app.post('/', (req, res) => {

	res.type("image/gif");
	const layers = req.body.layers;
	const title = req.body.title;
	const description = req.body.description;
	const coords = req.body.coords;
	const zoom = req.body.zoom;

	const canvas = createCanvas(300, 300)
	const ctx = canvas.getContext('2d')
	const encoder = new GIFEncoder(300, 300);

	// Create GIF
	encoder.createReadStream().pipe(res);
	encoder.start();
	encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
	encoder.setDelay(500);  // frame delay in ms
	encoder.setQuality(10); // image quality. 10 is default.

	var promise1 = loadImage(`https://api.mapbox.com/styles/v1/ryanbateman/cjzo9fmc00k2m1clp1rr163ix/static/${coords[1]},${coords[0]},${zoom},0,0/300x300?access_token=${ACCESS_TOKEN}`);
	var promise2 = loadImage(`https://api.mapbox.com/styles/v1/ryanbateman/cjzo9fmc00k2m1clp1rr163ix/static/${coords[1]},${coords[0]},${zoom},0,0/300x300?access_token=${ACCESS_TOKEN}`);
	var promise3 = loadImage(`https://api.mapbox.com/styles/v1/ryanbateman/cjzo9fmc00k2m1clp1rr163ix/static/${coords[1]},${coords[0]},${zoom},0,0/300x300?access_token=${ACCESS_TOKEN}`);

	Promise.all([promise1, promise2, promise3]).then(function(values) {
	 	ctx.drawImage(values[0], 0, 0, 300, 300);
		encoder.addFrame(ctx);
	  	
		ctx.drawImage(values[1], 0, 0, 300, 300);
		encoder.addFrame(ctx);

		ctx.drawImage(values[2], 0, 0, 300, 300);
	  	encoder.addFrame(ctx);

		encoder.finish();
	}).catch(function (err) {
    	console.log(err.message);
	});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
