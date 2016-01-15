'use strict';

function MediaCanvas(canvas, buffer) {

  if (!canvas) {
    throw new Error('No Canvas Supplied as Render Canvas');
  }

  this.canvas = canvas;
  this.canvasCtx = this.canvas.getContext('2d');

  this.buffer = buffer || document.createElement('canvas');
  this.bufferCtx = this.buffer.getContext('2d');

  this.renderPasses = [];

  // render loop handle
  this.reqId = null;
}

MediaCanvas.prototype.setSize = function(width, height) {

  this.canvas.width = this.buffer.width = width;
  this.canvas.height = this.buffer.height = height;

};


MediaCanvas.prototype.addPass = function(id, pass) {
  this.renderPasses[id] = pass;
};

MediaCanvas.prototype.removePass = function(id) {
  delete this.renderPasses[id];
};

// Present to the presentation canvas
MediaCanvas.prototype.renderToCanvas = function() {

  // clear canvas
  this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  var imgData = this.bufferCtx.getImageData(0, 0, this.buffer.width, this.buffer.height);

  this.canvasCtx.putImageData(imgData, 0, 0);

};

MediaCanvas.prototype.render = function(img) {

  //this.reqId = window.requestAnimationFrame(this.render);
  this.bufferCtx.drawImage(img, 0, 0, this.buffer.width, this.buffer.height);

  // render everything to the buffer
  Object.keys(this.renderPasses).forEach(function(passKey){

    this.renderPasses[passKey].render(this.buffer, this.bufferCtx, this.buffer.width, this.buffer.height);

  }.bind(this));

  this.renderToCanvas();
};

window.MediaCanvas = MediaCanvas;
