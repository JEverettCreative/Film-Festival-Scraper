# Film Festival Scraper

## Technology
- HTML5, CSS, Bootstrap, Handlebars
- Javascript, jQuery, Cheerio, Axios
- Node.js, Express.js, MongoDB, Mongoose

## About
Film Festival Scraper is a web scraping application that uses Cheerio to retrieve the title, summary, and URL of articles under the Festivals section of Screendaily.com, therefore providing a quick way for a filmmaker or enthusiast to get up-to-date information on happenings in that circuit. The application saves the articles to a MongoDB database using Mongoose to generate and handle schemas and queries. Users can choose to add articles to the Saved collection for easy access later, and from the Saved tab they may choose to permanently delete them from the database once they no longer need them. 

Future versions will include validation to ensure duplicate articles are not scraped into the database, functionality that allows users to empty all or many articles from the database at once.

The ability to leave notes or comments on articles is also currently in development. The modal container for this process is currently dynamically generated, but more work is needed to save or render comments within.

## License
- None

## How to use this code
- Open the app in the deployed Heroku environment listed below. 

## Deployed Project
https://radiant-island-59259.herokuapp.com/
  
## Contact
@JEverettCreative
- e-mail: jonathan@jonathaneverettcreative.com
- LinkedIn: https://www.linkedin.com/in/jonathan-everett-64725435/
