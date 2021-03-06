// canvas-plus - Image Transformation Engine
// JPEG Output Format Mixin
// Copyright (c) 2017 Joseph Huckaby
// Released under the MIT License

var Class = require("pixl-class");
var toBuffer = require('blob-to-buffer');

module.exports = Class.create({
	
	output_jpeg: function(callback) {
		// output image in JPEG format to buffer
		var self = this;
		if (this.requireRGBA().isError) return callback( this.getLastError() );
		
		// look for standard API first
		if (this.get('useDataURLs')) {
			this.logDebug(6, "Compressing into JPEG format (using browser)", { quality: this.get('quality') } );
			
			var buf = Buffer.from( this.canvas.toDataURL('image/jpeg', this.get('quality') / 100).split(',')[1], 'base64' );
			this.logDebug(6, "JPEG compression complete");
			return callback(false, buf);
		}
		else if (this.canvas.toBlob) {
			this.logDebug(6, "Compressing into JPEG format (using browser)", { quality: this.get('quality') } );
			
			this.canvas.toBlob( 
				function(blob) {
					// got Blob, now convert to Buffer
					toBuffer(blob, function (err, buf) {
						if (err) return self.doError('jpeg', "JPEG Encode Error: " + err, callback);
						self.logDebug(6, "JPEG compression complete");
						callback(null, buf);
					});
				},
				'image/jpeg',
				this.get('quality') / 100
			);
		}
		else {
			// use node-canvas proprietary API
			var opts = {
				quality: this.get('quality') / 100,
				progressive: this.get('progressive'),
				chromaSubsampling: this.get('chromaSubsampling')
			};
			
			this.logDebug(6, "Compressing into JPEG format", opts );
			
			var buf = this.canvas.toBuffer('image/jpeg', opts );
			
			this.logDebug(6, "JPEG compression complete");
			return callback(false, buf);
		} // node-canvas
	}
	
});
