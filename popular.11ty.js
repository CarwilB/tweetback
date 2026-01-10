const Twitter = require("./src/twitter");
const dataSource = require("./src/DataSource");

class Popular extends Twitter {
	async data() {
		let tweets = await dataSource.getAllTweets();
		// Get the most popular tweets and limit to exactly 400
		let popularTweets = this.getMostPopularTweets(tweets, 400).slice(0, 400);

		return {
			layout: "layout.11ty.js",
			pagination: {
				data: "popularTweets",
				size: 40,
				alias: "pageTweets"
			},
			popularTweets: popularTweets,
			permalink: function(data) {
				if (data.pagination.pageNumber === 0) {
					return "/popular/";
				}
				return `/popular/${data.pagination.pageNumber + 1}/`;
			}
		};
	}

	async render(data) {
		let tweetHtml = await Promise.all(data.pageTweets.map(tweet => this.renderTweet(tweet, {showPopularity: true, showSentiment: true})));
		let pageNum = data.pagination.pageNumber + 1;
		let totalTweets = data.popularTweets.length;
		let totalPages = Math.ceil(totalTweets / data.pagination.size);
		let startTweet = (data.pagination.pageNumber * data.pagination.size) + 1;
		let endTweet = Math.min((data.pagination.pageNumber + 1) * data.pagination.size, totalTweets);

		// Navigation links
		let previousHref = data.pagination.previousPageHref;
		let nextHref = data.pagination.nextPageHref;
		let navHtml = `<p class="tweets-pagination">
			${previousHref ? `<a href="${previousHref}">← More popular tweets</a>` : '<span>← More popular tweets</span>'}
			${nextHref ? `<a href="${nextHref}">Less popular tweets →</a>` : '<span>Less popular tweets →</span>'}
		</p>`;

		return `<h2>Most Popular Tweets (Page ${pageNum} of ${totalPages})</h2>
		<p>A list of popular tweets by retweets and favorites. Showing tweets ${startTweet}-${endTweet} of ${totalTweets}.</p>
		${navHtml}

		<h3>Tweets</h3>
		<ol class="tweets tweets-linear-list h-feed hfeed">
			${tweetHtml.join("")}
		</ol>
		${navHtml}`;
	}
}

module.exports = Popular;
