var webpack = require("../../../");
module.exports = {
	entry: "./index",
	stats: "verbose",
	plugins: [
		new webpack.optimize.InlinePlugin()
	]
};
