$(document).ready(function () {

});

$('#btn-home').on("click", function () {
    window.location.href = "/";
});

$('#btn-scrape').on("click", function () {
    $.ajax({
        url: "/scrape", success: function (result) {
            console.log("scrape success");
        }
    });
});

$('#btn-saved').on("click", function () {
    window.location.href = "/saved";
    var post = {};

    for(var i = 0; i < localStorage.length; ++i) {
        var article = JSON.parse(localStorage.getItem(i));
        console.log(article);
    }
});

$(document).on("click", ".save-article", function () {
    var article = {};

    console.log($(this).attr("id"));


    $("#article-" + $(this).attr("id")).children().each(function (index) {

        if ($(this).children().attr("src")) {
            article.image = $(this).children().attr("src");
        }

        if ($(this).children().children().attr("href")) {
            article.src = $(this).children().children().attr("href");
        }

        if ($(this).children().children().is("a")) {
            article.title = $(this).children().children().text();
        }

        if($(this).children().is("p")) {
            article.content = $(this).children().text();
        }
        
    });

    console.log(article);
    articleString = JSON.stringify(article);
    console.log(articleString);

    console.log(localStorage.length);

    localStorage.setItem(localStorage.length, articleString);

    console.log(JSON.parse(localStorage.getItem(localStorage.length - 1 )));
});


