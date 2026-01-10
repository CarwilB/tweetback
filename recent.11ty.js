const Twitter = require("./src/twitter");
const dataSource = require("./src/DataSource");
const metadata = require("./_data/metadata.js");

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
			sidebarContent: "", // Will be populated in render
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

		return `<h2>Most Recent Tweets (Page ${pageNum} of ${totalPages})</h2>
		<p style="margin: 0.5em 0;">Not including replies or retweets or mentions. Showing tweets ${startTweet}-${endTweet} of ${totalTweets}.</p>
		${navHtml}

		<ol class="tweets tweets-linear-list h-feed hfeed">
			${tweetHtml.join("")}
		</ol>
		${navHtml}`;
	}
}

module.exports = Recent;
