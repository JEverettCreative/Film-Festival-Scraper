$(document).ready(function(){
    
    var articleContainer = $(".article-container");
    $(document).on("click", ".delete-btn", deleteArticle);
    // $(document).on("click", ".notes-btn", pullNotes);
    $(document).on("click", ".create-note-btn", createNote);
    // $(document).on("click", ".delete-note-btn", deleteNotes);

    initializePage();

    function initializePage() {
        articleContainer.empty();
        $.get("/api/articles?saved=true")
            .then(function(data) {
                if (data && data.length) {
                    renderArticles(data);
                }
                else {
                    renderEmpty();
                }
            });
    }

    function renderEmpty() {
        var emptyMessage =
            $(["<div class='alert alert-warning text-center'>",
                "<h4>It seems you don't have any saved articles at the moment!</h4>",
                "<div class='panel panel-default'>",
                "<div class='panel-heading text-center'>",
                "<h2>Check Out Available Articles?</h2>",
                "</div>",
                "<div class='panel-body text-center'>",
                "<h4><a href='/'>Browse Articles</a></h4>",
                "</div>",
                "</div>"
            ].join(""));

        articleContainer.append(emptyMessage);
    }

    function renderArticles(articles) {
        var articlesArray = [];

        for (var i = 0; i < articles.length; i++) {
            articlesArray.push(createContents(articles[i]));
        }
    }

    function createContents(article) {
        var panel =
            $(["<div class='panel panel-default'>",
                "<div class='panel-heading'>",
                "<h3>",
                article.title,
                "<a class='btn btn-danger delete-btn'>Delete From Saved</a>",
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

    function deleteArticle() {
        var targetArticle = $(this).parents(".panel").data();

        $.ajax({
            method: "DELETE",
            url: "/api/articles/" + targetArticle._id
        })
        .then(function(data) {
            if (data.ok) {
                initializePage();
            }
        });
    }

    function createNote() {
        var currentArticle = $(this).parents(".panel").data();

        $.get("/api/notes/" + currentArticle._id)
            .then(function(data) {
                var newModal = [
                    "<div class='container-fluid text-center'>",
                    "<h4>Article Comments: ",
                    currentArticle._id,
                    "</h4>",
                    "<hr />",
                    "<ul class='list-group note-container'>",
                    "</ul>",
                    "<textarea placeholder='New Comment' rows='6' cols='60'>",
                    "</textarea>",
                    "<button class='btn btn-success create-note-btn'>Save Comment",
                    "</button>",
                    "</div>"
                ].join("");

                bootbox.dialog({
                    message: newModal,
                    closeButton: true
                });
                var noteInfo = {
                    _id: currentArticle._id,
                    notes: data || []
                };

                $(".create-note-btn").data("article", noteInfo);
                // Create this function
                renderNotesList(noteInfo);
            });
    }

    function renderNotesList(data) {
        var notesArray = [];
        var currentNote;
        if (!data.notes.length) {
            currentNote = [
                "<li class='list-group-item'>",
                "There are no comments on this article yet.",
                "</li>"
            ].join("");
            notesArray.push(currentNote);
        } else {
            for (var i=0; i < data.notes.length; i++) {
                currentNote = $([
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger delete-note-btn'>x",
                    "</button>",
                    "</li>"
                ]).join("");

                currentNote.children("button").data("_id", data.notes[i]._id);
                notesArray.push(currentNote);
            }
        }
        $(".note-container").append(notesArray);
    }

});