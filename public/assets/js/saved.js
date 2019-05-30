$(document).ready(function(){
    
    var articleContainer = $(".article-container");
    $(document).on("click", ".delete-btn", deleteArticle);
    // $(document).on("click", ".notes-btn", pullNotes);
    // $(document).on("click", ".create-note-btn", createNote);
    // $(document).on("click", ".delete-note-btn", deleteNotes);
    $(document).on("click", ".modal-btn", createModal);

    initializePage();

    function initializePage() {
        articleContainer.empty();
        $.get("/api/saved")
            .then(function(data) {
                if (data) {
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

        articleContainer.append(articlesArray);
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
                "<a class='btn btn-alert modal-btn view-note-btn'>Comments</a>",
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

    function createModal() {
        var currentArticle = $(this).parents(".panel").data();
        $(".note-container").empty();
        // Threw the modal creation into an Ajax call with the renderNotesList function following
        // attempting to bring the pieces together so that comments can fill when the modal loads

        // Commenting out for now
        // $.get("/api/notes/" + currentArticle._id)
        //     .then(function(data) {

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
        
                // renderNotesList(currentArticle);
        
                $("body").append(newModal);
                $(".modal").modal("show");

            // });
        
    }
    // CreateModal should be called within the function to viewNotes
    // that function should start by getting the panel data and calling the api route to pull all notes
    // then it needs to render them and their buttons. Finally, a click function needs to be added to
    // 'Add Comment' button that calls the route to post a new note to the database, then reload comments into the modal

    function pullNotes() {
        // var currentArticle = $(this).parents(".panel").data();

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