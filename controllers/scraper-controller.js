const mongoose = require("mongoose");
const request = require("request");
const cheerio = require("cheerio");

var url = "http://ubergizmo.com";
var databaseUrl = process.env.MONGODB_URI || "mongodb://localhost/scraper";
var collections = ["scrapedData"];

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
		});
		res.send("success message");
	});

	app.get("/saved", function (req, res) {
		//view saved articles
		//possibly from local storage?
		//or whatever we learned the day I was gone

		res.render("saved", {});
	});

}