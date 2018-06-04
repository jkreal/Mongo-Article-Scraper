const mongoose = require("mongoose");
const request = require("request");
const cheerio = require("cheerio");
const db = require("../models");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapert";
var url = "http://ubergizmo.com";

mongoose.connect(MONGODB_URI);

module.exports = function (app) {

	app.get("/", function (req, res) {
		//view index page
		res.render("index", {});
	});

	app.get("/articles", function (req, res) {
		//view the articles in the db
		res.render("articles", {});
	});

	app.get("/scrape", function (req, res) {
		//scrape articles to db
		db.Article.deleteMany({}, function () {
			console.log('database wiped');
		});

		request(url, function (error, response, html) {
			if (error) throw error;

			var $ = cheerio.load(html);
			var titles = [];
			var images = [];
			var contents = [];
			var links = [];

			$('div.byline_container_home > h1').each(function (i, element) {
				var title = $(element).text();
				titles.push(title);

				var link = $(element).children().attr('href');
				links.push(link);
			});

			$('div.article > p').each(function (i, element) {
				var image = $(element).children().attr('src') || $(element).children().attr('href');
				images.push(image);
			});

			$('div.article > p').each(function (i, element) {
				var content = $(element).text();
				contents.push(content);
			});

			// 	insert into db
			for (var i = 0; i < titles.length; i++) {
				db.Article.create({
					title: titles[i],
					content: contents[i],
					image: images[i],
					link: links[i]
				}).then(function (dbArticle) {
					console.log(dbArticle.title + " || added to db");
				}).catch(function (err) {
					throw err;
				});
			}
		});



		res.render("index", {});
	});

	app.get("/saved", function (req, res) {
		//view saved articles
		//possibly from local storage?
		//or whatever we learned the day I was gone

		db.Article.find({})
		.then(function(dbArticle) {
			console.log(dbArticle);
		});
		
		res.render("saved", {});
	});

}