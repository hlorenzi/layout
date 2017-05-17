function ElemText(measureCtx, text)
{
	this.computedX = null;
	this.computedY = null;
	this.computedW = null;
	this.computedH = null;
	
	this.text = text;
	this.glyphs = [];
	
	this.measureCtx = measureCtx;
}


ElemText.prototype.refreshBegin = function()
{
	this.computedX = null;
	this.computedY = null;
	this.computedW = null;
	this.computedH = null;
}


ElemText.prototype.refresh = function(x, y, w, h)
{
	this.computedX = x;
	this.computedY = y;
	
	let lineH = 16;
	let lineMaxW = 0;
	let penX = 0;
	let penY = 0;
	let lastPotentialLineBreakIndex = 0;
	let lastLineStartIndex = 0;
	
	this.measureCtx.font = "14px Verdana";
	this.measureCtx.textAlign = "left";
	this.measureCtx.textBaseline = "top";
	
	this.glyphs = [];
	for (let i = 0; i < this.text.length; i++)
	{
		let c = this.text.charAt(i);
		let glyphW = this.measureCtx.measureText(c).width;
		let glyphH = lineH;
		
		this.glyphs[i] =
		{
			c: c,
			x: penX,
			y: penY,
			w: glyphW,
			h: glyphH
		};
		
		if (w != null && penX + glyphW >= w &&
			lastLineStartIndex < i)
		{
			if (penX > lineMaxW)
				lineMaxW = penX;
			
			penX = 0;
			penY += lineH;
			
			if (lastPotentialLineBreakIndex <= lastLineStartIndex)
				lastPotentialLineBreakIndex = i;
			
			lastLineStartIndex = i;
			i = lastPotentialLineBreakIndex - 1;
		}
		else
		{
			if (c == ' ' || c == '-')
				lastPotentialLineBreakIndex = i + 1;
			
			penX += glyphW;
			if (penX > lineMaxW)
				lineMaxW = penX;
		}
	}
	
	this.computedW = lineMaxW;
	this.computedH = penY + lineH;
	return true;
}


ElemText.prototype.redraw = function(ctx)
{
	ctx.fillStyle = "#000";
	ctx.font = "14px Verdana";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	
	for (let i = 0; i < this.glyphs.length; i++)
	{
		let glyph = this.glyphs[i];
		if (glyph.c == ' ')
			continue;
		
		ctx.fillText(glyph.c, glyph.x, glyph.y);
		//ctx.fillRect(glyph.x + 1, glyph.y + 1, glyph.w - 2, glyph.h - 2);
	}
}