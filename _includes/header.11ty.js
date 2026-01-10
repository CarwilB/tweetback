const metadata = require("../_data/metadata.js");

module.exports = function(data) {
	// Determine if this is the current page for navigation highlighting
	const isHome = data.page.url === "/" || data.page.fileSlug === "index";
	const isRecent = data.page.url.startsWith("/recent");
	const isPopular = data.page.url.startsWith("/popular");

	return `
		<header class="site-header" role="banner">
			<div class="site-header-content">
				<h1 class="site-title">
					<a href="/" aria-label="Home - ${metadata.username}'s Twitter Archive">
						<img src="${metadata.avatar}" width="40" height="40" alt="" class="site-avatar" aria-hidden="true">
						<span class="site-title-text">${metadata.username}'s Twitter Archive</span>
					</a>
				</h1>
				<nav class="site-nav" aria-label="Main navigation">
					<ul class="site-nav-list">
						<li><a href="/" ${isHome ? 'aria-current="page"' : ''}>Home</a></li>
						<li><a href="/recent/" ${isRecent ? 'aria-current="page"' : ''}>Recent</a></li>
						<li><a href="/popular/" ${isPopular ? 'aria-current="page"' : ''}>Popular</a></li>
						<li><a href="${metadata.homeUrl}" rel="external">${metadata.homeLabel}</a></li>
					</ul>
				</nav>
			</div>
		</header>
	`;
};
