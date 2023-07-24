let data = {
	username: "CarwilBJ", // No leading @ here
	homeLabel: "Carwil's Website",
	homeUrl: "https://carwilb.github.io/",
};

data.avatar = `https://v1.indieweb-avatar.11ty.dev/${encodeURIComponent(data.homeUrl)}/`;

module.exports = data;