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

  this.renderPasses.push({ id: id, pass: pass });
};

MediaCanvas.prototype.removePass = function(id) {

  this.renderPasses = this.renderPasses.filter(function(pass){
    return pass.id !== id;
  });

};

// Present to the presentation canvas
MediaCanvas.prototype.renderToCanvas = function(imgData) {

  // clear canvas
  this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.canvasCtx.putImageData(imgData, 0, 0);

};

MediaCanvas.prototype.render = function(img) {

  //this.reqId = window.requestAnimationFrame(this.render);
  this.bufferCtx.drawImage(img, 0, 0, this.buffer.width, this.buffer.height);
  var imgData = this.bufferCtx.getImageData(0, 0, this.buffer.width, this.buffer.height);

  // render everything to the buffer
  this.renderPasses.forEach(function(pass){

    pass.pass.render(imgData, this.bufferCtx, this.buffer.width, this.buffer.height);

  }.bind(this));

  this.renderToCanvas(imgData);
};

window.MediaCanvas = MediaCanvas;
