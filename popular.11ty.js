const Twitter = require("./src/twitter");
const dataSource = require("./src/DataSource");
const metadata = require("./_data/metadata.js");

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
			sidebarContent: "", // Will be populated in render
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
			${previousHref ? `<a href="${previousHref}">← More popular</a>` : '<span>← More popular</span>'}
			${nextHref ? `<a href="${nextHref}">Less popular →</a>` : '<span>Less popular →</span>'}
		</p>`;

		// Build sidebar content similar to index page
		data.sidebarContent = `
<div class="sidebar-section">
<h1 class="tweets-title">
<a href="/">
<img src="${metadata.avatar}" width="52" height="52" alt="${metadata.username}'s avatar" class="tweet-avatar">
${metadata.username}'s Twitter Archive
</a>
</h1>
</div>

<div class="sidebar-section">
<h2>Navigation</h2>
<ul class="sidebar-nav-list">
<li><a rel="home" href="${metadata.homeUrl}">← ${metadata.homeLabel}</a></li>
<li><a href="/">Home</a></li>
<li><a href="/recent/">Recent Tweets</a></li>
<li><a href="/popular/">Popular Tweets</a></li>
</ul>
<div style="margin-top: 1rem;">
<strong style="font-size: 0.9em; display: block; margin-bottom: 0.5rem;">Browse recent tweet pages:</strong>
<div class="sidebar-pagination">
${Array.from({length: 25}, (_, i) => {
	let pageNum = i + 1;
	let url = pageNum === 1 ? '/recent/' : `/recent/${pageNum}/`;
	return `<a href="${url}"${pageNum === data.pagination.pageNumber + 1 ? ' class="current"' : ''}>${pageNum}</a>`;
}).join(' ')}
</div>
</div>
</div>
`;

		return `<h2>Most Popular Tweets (Page ${pageNum} of ${totalPages})</h2>
		<p>Sorted by like and retweet counts. Showing tweets ${startTweet}-${endTweet} of ${totalTweets}.</p>
		${navHtml}

		<h3>Tweets</h3>
		<ol class="tweets tweets-linear-list h-feed hfeed">
			${tweetHtml.join("")}
		</ol>
		${navHtml}`;
	}
}

module.exports = Popular;
