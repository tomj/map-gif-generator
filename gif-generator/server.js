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

	var promise1 = loadImage(`http://mbgl-renderer:8004/render?height=400&width=400&center=-136.165420668035,58.9478304748497&zoom=10&style={%22version%22:8,%22name%22:%22GlacierBay%22,%22metadata%22:{%22topic%22:%22RetreatofglaciersinGlacierBayNP,1986-2018%22,%22bbox%22:{%22minx%22:58.746110621412086,%22miny%22:-136.6284462686509,%22maxx%22:59.14358286650635,%22maxy%22:-135.68369801174188},%22mapbox:sdk-support%22:{%22js%22:%220.54.0%22,%22android%22:%227.4.0%22,%22ios%22:%224.10.0%22}},%22center%22:[-136.1086313990608,58.96130401741544],%22zoom%22:9.434155739835361,%22bearing%22:0,%22pitch%22:0,%22sources%22:{%22mapbox:%2F%2Fearthrise.GlacierBay_Landsat2011-09-11%22:{%22url%22:%22mapbox:%2F%2Fearthrise.GlacierBay_Landsat2011-09-11%22,%22type%22:%22raster%22,%22tileSize%22:256}},%22sprite%22:%22mapbox:%2F%2Fsprites%2Ftomjtomj%2Fcjyrmq6k600p61cmyw1cmk3fa%2Fck2u8j60r58fu0sgyxrigm3cu%22,%22layers%22:[{%22id%22:%22earthrise-GlacierBay_Landsat2011-09-11%22,%22type%22:%22raster%22,%22source%22:%22mapbox:%2F%2Fearthrise.GlacierBay_Landsat2011-09-11%22,%22paint%22:{%22raster-opacity%22:1}}],%22created%22:%222019-07-31T19:14:37.659Z%22,%22id%22:%22cjyrmq6k600p61cmyw1cmk3fa%22,%22modified%22:%222019-07-31T19:14:37.659Z%22,%22owner%22:%22tomjtomj%22,%22visibility%22:%22private%22,%22draft%22:false}&token=pk.eyJ1IjoidG9tanRvbWoiLCJhIjoiY2p4amx3aGVsMTkwazN5cWRxc2s0dGdoNyJ9.qHJI5lJH5uB__YzjRf6vmQ`);
	var promise2 = loadImage(`http://mbgl-renderer:8004/render?height=400&width=400&center=-136.165420668035,58.9478304748497&zoom=11&style={%22version%22:8,%22name%22:%22GlacierBay%22,%22metadata%22:{%22topic%22:%22RetreatofglaciersinGlacierBayNP,1986-2018%22,%22bbox%22:{%22minx%22:58.746110621412086,%22miny%22:-136.6284462686509,%22maxx%22:59.14358286650635,%22maxy%22:-135.68369801174188},%22mapbox:sdk-support%22:{%22js%22:%220.54.0%22,%22android%22:%227.4.0%22,%22ios%22:%224.10.0%22}},%22center%22:[-136.1086313990608,58.96130401741544],%22zoom%22:9.434155739835361,%22bearing%22:0,%22pitch%22:0,%22sources%22:{%22mapbox:%2F%2Fearthrise.GlacierBay_Landsat2011-09-11%22:{%22url%22:%22mapbox:%2F%2Fearthrise.GlacierBay_Landsat2011-09-11%22,%22type%22:%22raster%22,%22tileSize%22:256}},%22sprite%22:%22mapbox:%2F%2Fsprites%2Ftomjtomj%2Fcjyrmq6k600p61cmyw1cmk3fa%2Fck2u8j60r58fu0sgyxrigm3cu%22,%22layers%22:[{%22id%22:%22earthrise-GlacierBay_Landsat2011-09-11%22,%22type%22:%22raster%22,%22source%22:%22mapbox:%2F%2Fearthrise.GlacierBay_Landsat2011-09-11%22,%22paint%22:{%22raster-opacity%22:1}}],%22created%22:%222019-07-31T19:14:37.659Z%22,%22id%22:%22cjyrmq6k600p61cmyw1cmk3fa%22,%22modified%22:%222019-07-31T19:14:37.659Z%22,%22owner%22:%22tomjtomj%22,%22visibility%22:%22private%22,%22draft%22:false}&token=pk.eyJ1IjoidG9tanRvbWoiLCJhIjoiY2p4amx3aGVsMTkwazN5cWRxc2s0dGdoNyJ9.qHJI5lJH5uB__YzjRf6vmQ`);
	var promise3 = loadImage(`http://mbgl-renderer:8004/render?height=400&width=400&center=-136.165420668035,58.9478304748497&zoom=12&style={%22version%22:8,%22name%22:%22GlacierBay%22,%22metadata%22:{%22topic%22:%22RetreatofglaciersinGlacierBayNP,1986-2018%22,%22bbox%22:{%22minx%22:58.746110621412086,%22miny%22:-136.6284462686509,%22maxx%22:59.14358286650635,%22maxy%22:-135.68369801174188},%22mapbox:sdk-support%22:{%22js%22:%220.54.0%22,%22android%22:%227.4.0%22,%22ios%22:%224.10.0%22}},%22center%22:[-136.1086313990608,58.96130401741544],%22zoom%22:9.434155739835361,%22bearing%22:0,%22pitch%22:0,%22sources%22:{%22mapbox:%2F%2Fearthrise.GlacierBay_Landsat2011-09-11%22:{%22url%22:%22mapbox:%2F%2Fearthrise.GlacierBay_Landsat2011-09-11%22,%22type%22:%22raster%22,%22tileSize%22:256}},%22sprite%22:%22mapbox:%2F%2Fsprites%2Ftomjtomj%2Fcjyrmq6k600p61cmyw1cmk3fa%2Fck2u8j60r58fu0sgyxrigm3cu%22,%22layers%22:[{%22id%22:%22earthrise-GlacierBay_Landsat2011-09-11%22,%22type%22:%22raster%22,%22source%22:%22mapbox:%2F%2Fearthrise.GlacierBay_Landsat2011-09-11%22,%22paint%22:{%22raster-opacity%22:1}}],%22created%22:%222019-07-31T19:14:37.659Z%22,%22id%22:%22cjyrmq6k600p61cmyw1cmk3fa%22,%22modified%22:%222019-07-31T19:14:37.659Z%22,%22owner%22:%22tomjtomj%22,%22visibility%22:%22private%22,%22draft%22:false}&token=pk.eyJ1IjoidG9tanRvbWoiLCJhIjoiY2p4amx3aGVsMTkwazN5cWRxc2s0dGdoNyJ9.qHJI5lJH5uB__YzjRf6vmQ`);

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
