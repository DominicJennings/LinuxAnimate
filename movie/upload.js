const formidable = require("formidable");
const fUtil = require("../misc/file");
const loadPost = require("../misc/post_body");
const parse = require("./parse");
const http = require("http");
const fs = require("fs");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "POST") return;
	switch (url.pathname) {
		case "/upload_movie": {
			new formidable.IncomingForm().parse(req, (e, f, files) => {
				if (!files.import) return;
				var path = files.import.path;
				var buffer = fs.readFileSync(path);
				fUtil.generateId();
				parse.unpackXml(buffer, `${numId}`);
				fs.unlinkSync(path);

				res.statusCode = 302;
				// why
				var apiPath, url;
				if (req.headers.host != "localhost:4343") {
					apiPath = `https://${req.headers.host}`;
					url = `https://josephanimate2021.github.io/lvm-static/2014?api=${apiPath}&action=edit&movieId=${numId}`;
				} else {
					apiPath = `http://${req.headers.host}`;
					url = `https://josephanimate2021.github.io/lvm-static/2014?api=${apiPath}&action=edit&movieId=${numId}`;
				}
				res.setHeader("Location", url);
				res.end();
			});
			return true;
		}
		case "/goapi/getInitParams/": {
			loadPost(req, res).then(([data]) => console.log(data));
			return true;
		}
		default: return true;
	}
};
