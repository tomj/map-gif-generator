
import express from 'express'
import render from 'mbgl-renderer'
import GIFEncoder from 'gifencoder'
import twitter from 'twitter'
import { createCanvas, loadImage, Image } from 'canvas'

import dotenv from 'dotenv'
import logger from 'morgan'
import fs from 'fs'

var style = JSON.parse(fs.readFileSync('teststyle.json', 'UTF-8'))
// style JSON file with MapBox style.  Can also be opened and read instead of imported.

// Constants
dotenv.config()
const PORT = 8080
const HOST = '0.0.0.0'
const ACCESS_TOKEN = process.env.ACCESS_TOKEN

// App and router setup
const app = express()
app.use(express.json())
app.use(logger('dev'))
var router = express.Router()
router.use(function(req, res, next) {
    console.log(req.method, req.url)
    next()
})

// Twitter setup
var client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

app.post('/', (req, res) => {

	res.type("image/gif")
	const layers = req.body.layers
	const title = req.body.title
	const description = req.body.description
	const coords = req.body.coords
	const zoom = req.body.zoom	
	const width = 300
	const height = 300

	const canvas = createCanvas(width, height)
	const ctx = canvas.getContext('2d')
	const encoder = new GIFEncoder(width, height)
	const center = [coords[1], coords[0]]

	console.log(`Layer count: ${layers.length} passed, ${style.layers.length} in file`)	
	var promises = new Array(layers.length)

	layers.forEach(function (layerToPop, index) {
		console.log("Layer: " + layerToPop)
		const styleClone = JSON.parse(JSON.stringify(style))
		styleClone.layers = styleClone.layers.filter(layer =>
			//if (layer.id == layerToPop) 
			//	console.log(`Layer ID comparison: ${layer.id} to ${layerToPop}`)
			layer.id !== layerToPop
		)
		console.log(`Layers after filter: ${styleClone.layers.length}`)
		promises[index] = render(styleClone, width, height, { zoom, center, token: `${ACCESS_TOKEN}` })	
	})

	// Create GIF
	encoder.createReadStream().pipe(res)
	encoder.start()
	encoder.setRepeat(0)   // 0 for repeat, -1 for no-repeat
	encoder.setDelay(500)  // frame delay in ms
	encoder.setQuality(10) // image quality. 10 is default.

	Promise.all(promises).then(function(values) {
		values.forEach(function (value, index) {
			const img = new Image
			img.src = values[index]
		 	ctx.drawImage(img, 0, 0, width, height)
			encoder.addFrame(ctx)
		})
		encoder.finish()
	}).catch(function (err) {
    	console.log(err.message)
	})
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
