$(document).ready(function () {

});

$('#btn-scrape').on("click", function() {
    $.ajax({url: "/scrape", success: function(result) {
        console.log("scrape success");
    }});
});


