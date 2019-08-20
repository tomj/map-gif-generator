'use strict';

const express = require('express');
const { createCanvas, loadImage } = require('canvas')
const GIFEncoder = require('gifencoder');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
const canvas = createCanvas(800, 800)
const ctx = canvas.getContext('2d')
const encoder = new GIFEncoder(800, 800);

app.get('/', (req, res) => {

	// Create GIF
	encoder.createReadStream().pipe(res);
	encoder.start();
	encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
	encoder.setDelay(500);  // frame delay in ms
	encoder.setQuality(10); // image quality. 10 is default.


	// First frame
	ctx.font = '30px Impact'
	ctx.fillText('Awesome!', 50, 100)

	// Draw line under text
	var text = ctx.measureText('Awesome!')
	ctx.strokeStyle = 'rgba(0,0,0,0.5)'
	ctx.beginPath()
	ctx.lineTo(50, 102)
	ctx.lineTo(50 + text.width, 102)
	ctx.stroke()
	encoder.addFrame(ctx);

	// Draw cat with lime helmet
	loadImage('http://boat.horse/images/ambient/ambient_main.jpg').then((image) => {
		ctx.drawImage(image, 50, 0, 70, 70)
		encoder.addFrame(ctx);
		encoder.finish();
	})
});

function sendAsGIF(response, canvas) {
  var encoder = createGifEncoder({x: canvas.width, y: canvas.height}, response);
  // Add 3 frames
  encoder.addFrame(context);
  encoder.addFrame(context);
  encoder.addFrame(context);

  encoder.finish();

};

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
