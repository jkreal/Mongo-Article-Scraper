const mongoose = require("mongoose");
const request = require("request");
const cheerio = require("cheerio");
const db = require("../models");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapert";
var url = "https://techcrunch.com/";

mongoose.connect(MONGODB_URI);

module.exports = function (app) {

	app.get("/", function (req, res) {
		//view index page
		db.Article.find({}).then(function (articles) {
			console.log(articles);
			res.render("index", {articles});
		});

	});

	//JSON articles
	app.get("/articles", function (req, res) {
		db.Article.find({}).then(function (data) {
			res.json(data);
		});
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

			$('h2.post-block__title').each(function (i, element) {
				var title = $(element).text().trim();
				titles.push(title);
			});

			$('div.post-block__content').each(function (i, element) {
				var content = $(element).text().trim() + '...';
				contents.push(content);
			});

			$('a.post-block__title__link').each(function (i, element) {
				var link = $(element).attr('href');
				links.push(link);
			});

			$('figure.post-block__media').each(function (i, element) {
				var image = $(element).find('img').attr('src');
				images.push(image);

			});
				// insert into db
			for (var i = 0; i < titles.length; i++) {
				db.Article.create({
					title: titles[i],
					content: contents[i],
					image: images[i] || "",
					link: links[i]
				}).then(function (dbArticle) {
					console.log(dbArticle.title + " || added to db");
				}).catch(function (err) {
					throw err;
				});
			}

		});

	});

	app.get("/saved", function (req, res) {
		//view saved articles
		//possibly from local storage?
		//or whatever we learned the day I was gone

		db.Article.find({})
			.then(function (dbArticle) {
				console.log(dbArticle);
			});

		res.render("saved", {});
	});

}