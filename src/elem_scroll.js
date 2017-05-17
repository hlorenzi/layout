function ElemScroll(horizontal, vertical, inner)
{
	this.computedX = null;
	this.computedY = null;
	this.computedW = null;
	this.computedH = null;
	
	this.horizontal = horizontal;
	this.vertical = vertical;
	this.inner = inner;
	
	this.innerW = null;
	this.innerH = null;
	this.scrollX = 0;
	this.scrollY = 0;
	
	this.scrollbarW = 15;
}


ElemScroll.prototype.getElemsAt = function(elems, x, y)
{
	elems.push(this);
	if (this.inner != null)
		this.inner.getElemsAt(elems, x + this.scrollX, y + this.scrollY);
}


ElemScroll.prototype.eventScrollV = function(delta)
{
	let handled = false;
	
	if (this.horizontal)
	{
		let prevScrollX = this.scrollX;
		this.scrollX = Math.max(0, Math.min(this.innerW - this.computedW, this.scrollX + delta * 40));
		handled = handled || (this.scrollX != prevScrollX);
	}
	
	if (this.vertical)
	{
		let prevScrollY = this.scrollY;
		this.scrollY = Math.max(0, Math.min(this.innerH - this.computedH, this.scrollY + delta * 40));
		handled = handled || (this.scrollY != prevScrollY);
	}
	
	return handled;
}


ElemScroll.prototype.refreshBegin = function()
{
	this.computedX = null;
	this.computedY = null;
	this.computedW = null;
	this.computedH = null;
	
	this.innerW = null;
	this.innerH = null;
	
	if (this.inner != null)
		this.inner.refreshBegin();
}


ElemScroll.prototype.refresh = function(x, y, w, h)
{
	this.computedX = x;
	this.computedY = y;
	this.computedW = w || 32;
	this.computedH = h || 32;
	
	if (this.inner != null)
	{
		this.inner.refresh(
			0, 0,
			this.horizontal ? null : this.computedW - (this.vertical ? this.scrollbarW : 0),
			this.vertical ? null : this.computedH - (this.horizontal ? this.scrollbarW : 0));
		
		if (this.horizontal)
			this.innerW = this.inner.computedW;
		
		if (this.vertical)
			this.innerH = this.inner.computedH;
	}
	
	return true;
}


ElemScroll.prototype.redraw = function(ctx)
{
	let scrollbarMargin = 2;
	
	if (this.inner != null)
	{
		ctx.save();
		ctx.translate(-this.scrollX, -this.scrollY);
		this.inner.redraw(ctx);
		ctx.restore();
	}
	
	
	if (this.horizontal)
	{
		ctx.fillStyle = "#aaa";
		ctx.fillRect(this.computedX, this.computedY + this.computedH - this.scrollbarW, this.computedW, this.scrollbarW);
		
		let scrollbarH = 50;
		let scrollbarPosition = (this.computedW - scrollbarH) * (this.scrollX / (this.innerW - this.computedW));
		
		ctx.fillStyle = "#666";
		ctx.fillRect(
			this.computedX + scrollbarMargin + scrollbarPosition,
			this.computedY + this.computedH - this.scrollbarW + scrollbarMargin,
			scrollbarH - scrollbarMargin * 2,
			this.scrollbarW - scrollbarMargin * 2);
	}
	
	if (this.vertical)
	{
		ctx.fillStyle = "#aaa";
		ctx.fillRect(this.computedX + this.computedW - this.scrollbarW, this.computedY, this.scrollbarW, this.computedH);
		
		let scrollbarH = 50;
		let scrollbarPosition = (this.computedH - scrollbarH) * (this.scrollY / (this.innerH - this.computedH));
		
		ctx.fillStyle = "#666";
		ctx.fillRect(
			this.computedX + this.computedW - this.scrollbarW + scrollbarMargin,
			this.computedY + scrollbarMargin + scrollbarPosition,
			this.scrollbarW - scrollbarMargin * 2,
			scrollbarH - scrollbarMargin * 2);
	}
}