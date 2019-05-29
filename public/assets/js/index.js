$(document).ready(function() {

    var articleContainer = $(".article-container");
    $(document).on("click", ".save-btn", saveArticle);
    $(document).on("click", ".scrape", scrapeNewArticles);

    initializePage();

    function initializePage() {
        articleContainer.empty();
        $.get("/api/articles?saved=false")
            .then(function(data) {
                if (data && data.length) {
                    renderArticles(data);
                }
                else {
                    renderEmpty();
                }
            });
    }

    function renderArticles(articles) {
        var articlesArray = [];

        for (var i = 0; i < articles.length; i++) {
            articlesArray.push(createContents(articles[i]));
        }

        articleContainer.append(articlesArray);
    }

    function createContents(article) {
        var panel =
            $(["<div class='panel panel-default'>",
                "<div class='panel-heading'>",
                "<h3>",
                article.title,
                "<a class='btn btn-success save-btn'> Save Article</a>",
                "<a class='btn btn-alert' href=" + article.link +
                "> View Source</a>",
                "</h3>",
                "</div>",
                "<div class='panel-body'>",
                article.summary,
                "</div>",
                "</div>"
            ].join(""));

        panel.data("_id", article._id);
        return panel;
    }

    function renderEmpty() {
        var emptyMessage =
            $(["<div class='alert alert-warning text-center'>",
                "<h4>Ruh roh! Seems we don't have any articles at the moment!</h4>",
                "<div class='panel panel-default'>",
                "<div class='panel-heading text-center'>",
                "<h2>What Should We Do?</h2>",
                "</div>",
                "<div class='panel-body text-center'>",
                "<h4><a class='scrape'>Scrape for Articles</a></h4>",
                "<h4><a href='/saved'>View Saved Articles</a></h4>",
                "</div>",
                "</div>"
            ].join(""));

        articleContainer.append(emptyMessage);
    }

    function saveArticle() {
        var targetArticle = $(this).parents(".panel").data();
        targetArticle.saved = true;

        $.ajax({
            method: "PATCH",
            url: "/api/articles",
            data: targetArticle
        })
        .then(function(data){
            if (data.ok) {
                initializePage();
            }
        });
    }

    function scrapeNewArticles() {
        $.get("/api/scrape")
            .then(function(data){
                initializePage();
                bootbox.alert("<h2 class='text-center m-top-80'>" + data.message + "</h3>");
            });
    }
})