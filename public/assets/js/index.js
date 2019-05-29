$(document).ready(function() {

    var articleContainer = $(".article-container");
    $(document).on("click", ".save-btn", saveArticle);
    $(document).on("click", ".scrape", scrapeNewArticles);
    // $(document).on("click", ".view-note-btn", viewNotes);
    $(document).on("click", ".modal-btn", createModal);

    initializePage();

    function initializePage() {
        articleContainer.empty();
        $.get("/api/articles")
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
                "<a class='btn btn-success save-btn'>Save Article</a>",
                "<a class='btn btn-alert' href=" + article.link +
                "> View Source</a>",
                "</h3>",
                "</div>",
                "<div class='panel-body'>",
                article.summary,
                // Find a better spot and style for this
                "<a class='btn btn-alert modal-btn view-note-btn'>Comments</a>",
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
            method: "POST",
            url: "/api/articles/" + targetArticle._id,
            data: {
                saved: true
            }
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
            });
    }

    function createModal() {
        var currentArticle = $(this).parents(".panel").data();

        var newModal = [
            "<div class='modal fade show' role='dialog' aria-modal='true' style='display: block'>",
            "<div class='modal-dialog'>",
            "<div class='modal-content'>",
            "<div class='modal-header'>",
            "<h4>Article Comments: " + currentArticle._id + "</h4>",
            "</div>",
            "<div class='modal-body'>",
            "<ul class='list-group note-container'>",
            "</ul>",
            "<textarea placeholder='New Comment' rows='6' cols='60'>",
            "</textarea>",
            "<button class='btn btn-primary create-note-btn'>Add Comment",
            "</button>",
            "</div>",
            "</div>",
            "</div>",
            "</div>"
        ].join("");

        $("body").append(newModal);
        $(".modal").modal("show");
    }

    // function viewNotes() {
    //     var currentArticle = $(this).parents(".panel").data();

    //     $.get("/api/notes/" + currentArticle._id)
    //         .then(function(data) {
    //             var newModal = [
    //                 // "<div class='container-fluid text-center'>",
    //                 // "<h4>Article Comments: ",
    //                 // currentArticle._id,
    //                 // "</h4>",
    //                 // "<hr />",
    //                 // "<ul class='list-group note-container'>",
    //                 // "</ul>",
    //                 // "<textarea placeholder='New Comment' rows='6' cols='60'>",
    //                 // "</textarea>",
    //                 // "<button class='btn btn-success create-note-btn'>Save Comment",
    //                 // "</button>",
    //                 // "</div>"
    //                 "<div class='modal fade show' role='dialog' aria-modal='true' style='display: block'>",
    //                 "<div class='modal-dialog'>",
    //                 "<div class='modal-content'>",
    //                 "<div class='modal-header'>",
    //                 "<h4>Article Comments: " + currentArticle._id + "</h4>",
    //                 "</div>",
    //                 "<div class='modal-body'>",
    //                 "<ul class='list-group note-container'>",
    //                 "</ul>",
    //                 "<textarea placeholder='New Comment' rows='6' cols='60'>",
    //                 "</textarea>",
    //                 "<button class='btn btn-primary create-note-btn'>Add Comment",
    //                 "</button>",
    //                 "</div>",
    //                 "</div>",
    //                 "</div>",
    //                 "</div>"
    //             ].join("");

    //             var noteInfo = {
    //                 _id: currentArticle._id,
    //                 notes: data || []
    //             };

    //             // Create this function
    //             // renderNotesList(noteInfo);
    //         });
    // }
    
});