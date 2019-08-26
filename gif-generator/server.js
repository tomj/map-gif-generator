
import express from 'express'
import render from 'mbgl-renderer'
import GIFEncoder from 'gifencoder'
import { createCanvas, loadImage, Image } from 'canvas'

import dotenv from 'dotenv'
import logger from 'morgan'
import fs from 'fs'

var style = fs.readFileSync('teststyle.json', 'UTF-8')
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

app.post('/', (req, res) => {

	res.type("image/gif")
	const layers = req.body.layers
	const title = req.body.title
	const description = req.body.description
	const coords = req.body.coords
	const zoom = req.body.zoom

	const canvas = createCanvas(300, 300)
	const ctx = canvas.getContext('2d')
	const encoder = new GIFEncoder(300, 300)

	const width = 512
	const height = 256
	const center = [-136.1086313990608, 58.96130401741544]

	var promise1 = render(style, width, height, { zoom, center, token: `${ACCESS_TOKEN}` })
	var promise2 = render(style, width, height, { zoom, center, token: `${ACCESS_TOKEN}` })
	var promise3 = render(style, width, height, { zoom, center, token: `${ACCESS_TOKEN}` })

	// Create GIF
	encoder.createReadStream().pipe(res)
	encoder.start()
	encoder.setRepeat(0)   // 0 for repeat, -1 for no-repeat
	encoder.setDelay(500)  // frame delay in ms
	encoder.setQuality(10) // image quality. 10 is default.

	
	Promise.all([promise1, promise2, promise3]).then(function(values) {
		values.forEach(function (value, index) {
			const img = new Image
			img.src = values[0]
		 	ctx.drawImage(img, 0, 0, 300, 300)
			encoder.addFrame(ctx)
		})
		encoder.finish()
	}).catch(function (err) {
    	console.log(err.message)
	})
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
