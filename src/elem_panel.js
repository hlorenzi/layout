function ElemPanel(color)
{
	this.computedX = null;
	this.computedY = null;
	this.computedW = null;
	this.computedH = null;
	
	this.color = color;
}


ElemPanel.prototype.refreshBegin = function()
{
	this.computedX = null;
	this.computedY = null;
	this.computedW = null;
	this.computedH = null;
}


ElemPanel.prototype.refresh = function(x, y, w, h)
{
	this.computedX = x;
	this.computedY = y;
	this.computedW = w || 32;
	this.computedH = h || 32;
	return true;
}


ElemPanel.prototype.redraw = function(ctx)
{
	ctx.fillStyle = this.color;
	ctx.fillRect(this.computedX, this.computedY, this.computedW, this.computedH);
}