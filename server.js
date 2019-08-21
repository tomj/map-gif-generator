'use strict';

const express = require('express');
const { createCanvas, loadImage } = require('canvas')
const GIFEncoder = require('gifencoder');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

app.get('/', (req, res) => {
	const canvas = createCanvas(200, 200)
	const ctx = canvas.getContext('2d')
	const encoder = new GIFEncoder(200, 200);

	// Create GIF
	encoder.createReadStream().pipe(res);
	encoder.start();
	encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
	encoder.setDelay(500);  // frame delay in ms
	encoder.setQuality(10); // image quality. 10 is default.

	var promise1 = loadImage('https://picsum.photos/200');
	var promise2 = loadImage('https://picsum.photos/200');
	var promise3 = loadImage('https://picsum.photos/200');

	Promise.all([promise1, promise2, promise3]).then(function(values) {
	 	ctx.drawImage(values[0], 0, 0, 200, 200);
		encoder.addFrame(ctx);
	  	
		ctx.drawImage(values[1], 0, 0, 200, 200);
		encoder.addFrame(ctx);

		ctx.drawImage(values[2], 0, 0, 200, 200);
	  	encoder.addFrame(ctx);

		encoder.finish();
	});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
