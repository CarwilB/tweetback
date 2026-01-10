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
		let startTweet = (data.pagination.pageNumber * data.pagination.size) + 1;
		let endTweet = Math.min((data.pagination.pageNumber + 1) * data.pagination.size, totalTweets);

		// Navigation links
		let previousHref = data.pagination.previousPageHref;
		let nextHref = data.pagination.nextPageHref;
		let navHtml = `<p class="tweets-pagination">
			${previousHref ? `<a href="${previousHref}">← Newer tweets</a>` : '<span>← Newer tweets</span>'}
			${nextHref ? `<a href="${nextHref}">Older tweets →</a>` : '<span>Older tweets →</span>'}
		</p>`;

		return `<h2>Most Recent Tweets (Page ${pageNum} of ${totalPages})</h2>
		<p>Not including replies or retweets or mentions. Showing tweets ${startTweet}-${endTweet} of ${totalTweets}.</p>
		${navHtml}

		<h3>Tweets</h3>
		<ol class="tweets tweets-linear-list h-feed hfeed">
			${tweetHtml.join("")}
		</ol>
		${navHtml}`;
	}
}

module.exports = Recent;
