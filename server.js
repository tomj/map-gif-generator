
import express from 'express'
import render from 'mbgl-renderer'
import GIFEncoder from 'gifencoder'
import twitter from 'twitter'
import { createCanvas, loadImage, Image } from 'canvas'

import dotenv from 'dotenv'
import logger from 'morgan'
import fs from 'fs'

// style JSON file with MapBox style.  Can also be opened and read instead of imported.
const style = JSON.parse(fs.readFileSync('teststyle.json', 'UTF-8'))

// Constants
dotenv.config()
const PORT = 8080
const HOST = '0.0.0.0'
const ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN

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
	console.log("-------------------------")
	console.log("Request received")
	const layers = req.body.layers
	const title = req.body.title
	const description = req.body.description
	const coords = req.body.coords
	const zoom = req.body.zoom	
	const publishTweet = req.body.publishTweet
	const width = 300
	const height = 300

	const canvas = createCanvas(width, height)
	const ctx = canvas.getContext('2d')
	const encoder = new GIFEncoder(width, height)
	// The renderer takes lon/lat for some reason?
	const center = [coords[1], coords[0]]
	var promises = new Array(layers.length)

	console.log("Making promises...")
	// For each layer, set up a Promise to render it, using our parameters
	layers.forEach(function (layerToKeep, index) {
		const styleClone = JSON.parse(JSON.stringify(style))

		// Keep only the layer that is the one we're rendering OR 
		// wasn't included in our list of passed layer IDs
		styleClone.layers = styleClone.layers.filter(layer =>
			layer.id == layerToKeep || !layers.includes(layer.id)
		)
		promises[index] = render(styleClone, width, height, { zoom, center, token: `${ACCESS_TOKEN}` })	
	})

	// Create the stream to render the GIF
	var stream = encoder.createReadStream()
	res.type("image/gif")
	stream.pipe(res)

	let chunks = []
	var fileBuffer;

	// Each time there's a new chunk/frame added to the GIF, prep it for the twitter buffer
	// Pretty sure we could skip this step if I could get the stream outputting a Buffer
	// directly. 
	stream.on('data', (chunk) => {
		console.log("Chunking data...")
		chunks.push(chunk);
	})

	// Once we've finished creating the GIF, upload it to Twitter
	stream.once('end', () => {
		console.log("Data chunked!")
		fileBuffer = Buffer.concat(chunks);
		if (publishTweet) {
			console.log("Opting to tweet...")
			client.post('media/upload', {media: fileBuffer}, function(error, media, response) {
			  if (!error) {
			    var status = {
			      status: "GIF up",
			      media_ids: media.media_id_string // Pass the media id string
			    }

			    client.post('statuses/update', status, function(error, tweet, response) {
			      if (!error) {
			        console.log("Successfully tweeted")
			      }
			    })
			  } else {
			  	console.log(error.message)
			  }
			})
		}
	})

	// Start the GIF encoder
	encoder.start()
	encoder.setRepeat(0)   // 0 for repeat, -1 for no-repeat
	encoder.setDelay(500)  // frame delay in ms
	encoder.setQuality(10) // image quality. 10 is default.

	// For each set up render of a layer, return the image and create a GIF frame
	Promise.all(promises).then(function(values) {
		values.forEach(function (value, index) {
			const img = new Image
			img.src = values[index]
		 	ctx.drawImage(img, 0, 0, width, height)
			encoder.addFrame(ctx)
			console.log("Adding frame to GIF")
		})

		// If all rendered correctly, set our response type and pipe the result out
		encoder.finish()
		console.log("-------------------------")
	}).catch(function (err) {
    	res.status(403).send("Error retrieving map files.")
    	console.log("-------------------------")
	})
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
