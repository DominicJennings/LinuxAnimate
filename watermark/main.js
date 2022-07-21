const cachéFolder = process.env.CACHÉ_FOLDER;
const exFolder = process.env.EXAMPLE_FOLDER;
const caché = require("../asset/caché");
const fUtil = require("../misc/file");
const nodezip = require("node-zip");
const parse = require("../movie/parse");
const util = require("../misc/util");
const fs = require("fs");

module.exports = {
	save(mId, wId) {
		return new Promise(async (res, rej) => {
			const i = mId.indexOf('-');
			const prefix = mId.substr(0, i);
			const suffix = mId.substr(i + 1);
			var path = fUtil.getFileIndex("watermark-", ".xml", suffix);
			var wXml;
			if (wId == "0dhteqDBt5nY") {
				wXml = '<?xml encoding="UTF-8"?><watermarks><watermark style="visualplugin"/></watermarks>';
			} else {
				wXml = '<?xml encoding="UTF-8"?><watermarks><watermark style="twoLines"/></watermarks>';
			}
			fs.writeFileSync(path, wXml);
			res(suffix);
		});
	},
	load(mId) {
		return new Promise((res) => {
			const i = mId.indexOf("-");
			const prefix = mId.substr(0, i);
			const suffix = mId.substr(i + 1);
			let numId = Number.parseInt(suffix);
			if (isNaN(numId)) res();
			var filePath = fUtil.getFileIndex("watermark-", ".xml", numId);
			if (!fs.existsSync(filePath)) res();

			const buffer = fs.readFileSync(filePath);
			res(numId);
		});
	},
	meta(movieId) {
		return new Promise(async (res, rej) => {
			if (!movieId.startsWith("w-")) return;
			const n = Number.parseInt(movieId.substr(2));
			const fn = fUtil.getFileIndex("watermark-", ".xml", n);

			const fd = fs.openSync(fn, "r");
			const buffer = Buffer.alloc(256);
			fs.readSync(fd, buffer, 0, 256, 0);

			fs.closeSync(fd);
			res({
				date: fs.statSync(fn).mtime,
				id: movieId,
			});
		});
	},
};
