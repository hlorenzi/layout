function Layout()
{
	this.x = 0;
	this.y = 0;
	this.w = 0;
	this.h = 0;
	this.elem = null;
}


Layout.prototype.setBounds = function(x, y, w, h)
{
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}


Layout.prototype.setElem = function(elem)
{
	this.elem = elem;
}


Layout.prototype.getElemsAt = function(x, y)
{
	let elems = [];
	
	if (this.elem != null)
		this.elem.getElemsAt(elems, x - this.x, y - this.y);
	
	return elems;
}


Layout.prototype.eventScrollV = function(x, y, delta)
{
	let elems = this.getElemsAt(x, y);
	for (let i = elems.length - 1; i >= 0; i--)
	{
		if (elems[i].eventScrollV)
		{
			if (elems[i].eventScrollV(delta))
				break;
		}
	}
}


Layout.prototype.refresh = function()
{
	if (this.elem != null)
	{
		this.elem.refreshBegin();
		if (!this.elem.refresh(0, 0, this.w, this.h))
			throw "could not fully resolve layout";
	}
}


Layout.prototype.redraw = function(canvas)
{
	let ctx = canvas.getContext("2d");
	
	ctx.fillStyle = "#666";
	ctx.fillRect(0, 0, 640, 480);
	
	ctx.fillStyle = "#000";
	ctx.fillRect(this.x + 5, this.y + 5, this.w, this.h);
	
	ctx.fillStyle = "#fff";
	ctx.fillRect(this.x, this.y, this.w, this.h);
	
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.beginPath();
	ctx.rect(0, 0, this.w, this.h);
	ctx.clip();
	
	if (this.elem != null)
		this.elem.redraw(ctx);
	
	ctx.restore();
}