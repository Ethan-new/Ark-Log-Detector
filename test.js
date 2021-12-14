const Discord = require('discord.js')
const screenshot = require('screenshot-desktop')
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
var Jimp = require('jimp');

const wh = new Discord.WebhookClient({
	id: '920253731319185439',
	token: 'jENNhfoSTs9tY9cRHrrO0D7-t3tlR-oGVFdAAo9u956u5_K-xuFju7bmWZDSwlKoFH69'
})



var Gyazo = require('gyazo-api');


var imgURL = ""
var imgDiff = 0;

async function crop() {
	// Read the image.
	const image = await Jimp.read('./img1.png');
	await image.crop(1330,180, 470,830);
	// Save and overwrite the image
	await image.writeAsync(`cimg1.png`);
  }
  async function crop2() {
	// Read the image.
	const image = await Jimp.read('./img2.png');
	await image.crop(1330, 180, 470, 830);
	// Save and overwrite the image
	await image.writeAsync(`cimg2.png`);
  }

async function AlertWhenRed() {

	screenshot({
		filename: './img2.png'
	})
	await new Promise(resolve => setTimeout(resolve, 1500));
	console.error("Croping 1 & 2");

	crop2();
	await new Promise(resolve => setTimeout(resolve, 2000));

	const img1 = PNG.sync.read(fs.readFileSync('cimg1.png'));
	const img2 = PNG.sync.read(fs.readFileSync('cimg2.png'));

	const {
		width,
		height
	} = img1;
	const diff = new PNG({
		width,
		height
	});

	imgDiff = pixelmatch(img1.data, img2.data, diff.data, width, height, {
		threshold: 0.5
	})



	if (imgDiff > 10000) {
		console.error("Changing Photo");
		var client = new Gyazo('E72eUWyeu6-COR1O9zguGuRKKGijN7wEMSpcZ1mG1cE');
		client.upload('./cimg2.png', {
				title: "Tribe Log Has Changed!!",
				desc: "upload from pc"
			})
			.then(function(res) {
				console.log(res.data.image_id);
				console.log(res.data.permalink_url);

				imgURL = res.data.permalink_url
				imgURL.replace('https://', 'https://i.');
				imgURL = imgURL + '.png'

				wh.send({
					"embeds": [{
						"title": ":smiling_imp: Tribe Log Has Changed:smiling_imp: ",
						"description": "@everyone There has been a change to the tribe log",
						"image": {
							"url": imgURL
						},
						"content": "@everyone",
						"allowed_mentions": {
						  "parse": ["everyone"]
						}
					}]
				})
				screenshot({
					filename: './img1.png'
				})
				crop()
				
  .catch(err => {
    console.error(err);
  });
			})
			.catch(function(err) {
				console.error("UPLOAD:" + err);
			});
	}

	setTimeout(AlertWhenRed, 5000);
}

screenshot({
	filename: './img1.png'
})
crop()
AlertWhenRed();