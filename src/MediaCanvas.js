'use strict';

function MediaCanvas(canvas, buffer) {

  if (!canvas) {
    throw new Error('No Canvas Supplied as Render Canvas');
  }

  this.canvas = canvas;
  this.canvasCtx = this.canvas.getContext('2d');

  this.buffer = buffer || document.createElement('canvas');
  this.bufferCtx = this.buffer.getContext('2d');

  this.setSize(this.canvas.width, this.canvas.height);

  this.renderPasses = [];

  // render loop handle
  this.reqId = null;
}

// set the size of the back buffer
MediaCanvas.prototype.setSize = function(width, height) {

  this.buffer.width = width;
  this.buffer.height = height;

};


MediaCanvas.prototype.addPass = function(id, pass) {

  this.renderPasses.push({ id: id, pass: pass });
};

MediaCanvas.prototype.removePass = function(id) {

  this.renderPasses = this.renderPasses.filter(function(pass){
    return pass.id !== id;
  });

};

// Present to the presentation canvas
MediaCanvas.prototype.renderToCanvas = function(imgData) {

  //need to render into canvas, so we can easily scale it into the presentation buffer!
  this.bufferCtx.putImageData(imgData, 0, 0);
  // clear canvas
  this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.canvasCtx.drawImage(this.buffer, 0, 0, this.canvas.width, this.canvas.height);

};

MediaCanvas.prototype.renderImage = function(image) {

  this.bufferCtx.drawImage(image, 0, 0, this.buffer.width, this.buffer.height);
  var imgData = this.bufferCtx.getImageData(0, 0, this.buffer.width, this.buffer.height);

  this.render(imgData);

};

// Render an image to the canvas
//
MediaCanvas.prototype.render = function(imgData) {

  // render everything to the buffer
  this.renderPasses.forEach(function(pass){

    pass.pass.render(imgData, this.bufferCtx, this.buffer.width, this.buffer.height);

  }.bind(this));

  this.renderToCanvas(imgData);
};

window.MediaCanvas = MediaCanvas;
