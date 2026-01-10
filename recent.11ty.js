const Twitter = require("./src/twitter");
const dataSource = require("./src/DataSource");

class Recent extends Twitter {
	async data() {
		let tweets = await dataSource.getAllTweets();
		let recentTweets = tweets.filter(tweet => this.isOriginalPost(tweet)).sort(function(a,b) {
			return b.date - a.date;
		}).slice(0, 1000);

		return {
			layout: "layout.11ty.js",
			pagination: {
				data: "recentTweets",
				size: 40,
				alias: "pageTweets"
			},
			recentTweets: recentTweets,
			permalink: function(data) {
				if (data.pagination.pageNumber === 0) {
					return "/recent/";
				}
				return `/recent/${data.pagination.pageNumber + 1}/`;
			}
		};
	}

	async render(data) {
		let tweetHtml = await Promise.all(data.pageTweets.map(tweet => this.renderTweet(tweet, {showSentiment: true})));
		let pageNum = data.pagination.pageNumber + 1;
		let totalTweets = data.recentTweets.length;
		let totalPages = Math.ceil(totalTweets / data.pagination.size);
		let startTweet = (data.pagination.pageNumber * 40) + 1;
		let endTweet = Math.min((data.pagination.pageNumber + 1) * 40, totalTweets);

		return `<h2>Most Recent Tweets (Page ${pageNum} of ${totalPages})</h2>
		<p>Not including replies or retweets or mentions. Showing tweets ${startTweet}-${endTweet} of ${totalTweets}.</p>

		<h3>Tweets</h3>
		<ol class="tweets tweets-linear-list h-feed hfeed">
			${tweetHtml.join("")}
		</ol>`;
	}
}

module.exports = Recent;
