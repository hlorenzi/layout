function ElemTable(xNum, yNum)
{
	this.computedX = null;
	this.computedY = null;
	this.computedW = null;
	this.computedH = null;
	this.computedWs = [];
	this.computedHs = [];
	this.computedUnboundedWs = [];
	this.computedUnboundedHs = [];
	
	this.xNum = xNum;
	this.yNum = yNum;
	this.xSizes = [];
	this.ySizes = [];
	
	this.cells = [];
	for (let j = 0; j < yNum; j++)
	{
		let row = [];
		for (let i = 0; i < xNum; i++)
			row.push(null);
		
		this.cells.push(row);
	}
}


ElemTable.prototype.xSize = function(index, size)
{
	this.xSizes[index] = size;
	this.computedWs[index] = null;
	return this;
}


ElemTable.prototype.ySize = function(index, size)
{
	this.ySizes[index] = size;
	this.computedHs[index] = null;
	return this;
}


ElemTable.prototype.append = function(x, y, elem)
{
	this.cells[y][x] = elem;
	return this;
}


ElemTable.prototype.getElemsAt = function(elems, x, y)
{
	elems.push(this);
	
	let yAccum = 0;
	for (let j = 0; j < this.yNum; j++)
	{
		let xAccum = 0;
		for (let i = 0; i < this.xNum; i++)
		{
			if (this.cells[j][i] == null)
				continue;
			
			if (x >= xAccum && x < xAccum + this.computedWs[i] &&
				y >= yAccum && y < yAccum + this.computedHs[j])
			{
				this.cells[j][i].getElemsAt(elems, x - xAccum, y - yAccum);
			}
			
			xAccum += this.computedWs[i];
		}
		
		yAccum += this.computedHs[j];
	}
}


ElemTable.prototype.refreshBegin = function()
{
	this.computedX = null;
	this.computedY = null;
	this.computedW = null;
	this.computedH = null;
	this.computedUnboundedWs = [];
	this.computedUnboundedHs = [];
	this.computedWs = [];
	this.computedHs = [];
	
	
	for (let j = 0; j < this.yNum; j++)
	{
		for (let i = 0; i < this.xNum; i++)
		{
			if (this.cells[j][i] != null)
				this.cells[j][i].refreshBegin();
		}
	}
}


ElemTable.prototype.refresh = function(x, y, w, h)
{
	this.computedX = x;
	this.computedY = y;
	this.computedW = w;
	this.computedH = h;
	this.computedWs = this.computeArraySizes(this.xSizes, this.computedUnboundedWs, w);
	this.computedHs = this.computeArraySizes(this.ySizes, this.computedUnboundedHs, h);
	
	for (let j = 0; j < this.yNum; j++)
	{
		for (let i = 0; i < this.xNum; i++)
		{
			if (!(this.xSizes[i] instanceof SizeUnbounded || this.ySizes[j] instanceof SizeUnbounded))
				continue;
			
			if (this.cells[j][i] == null)
				continue;
			
			this.cells[j][i].refresh(0, 0, min(this.computedWs[i], w), min(this.computedHs[j], h));
			
			this.computedUnboundedWs[i] = max(this.computedUnboundedWs[i], this.cells[j][i].computedW);
			this.computedUnboundedHs[j] = max(this.computedUnboundedHs[j], this.cells[j][i].computedH);
		}
	}
	
	this.computedWs = this.computeArraySizes(this.xSizes, this.computedUnboundedWs, w);
	this.computedHs = this.computeArraySizes(this.ySizes, this.computedUnboundedHs, h);
	
	let yAccum = 0;
	for (let j = 0; j < this.yNum; j++)
	{
		for (let i = 0; i < this.xNum; i++)
		{
			if (this.xSizes[i] instanceof SizeUnbounded || this.ySizes[j] instanceof SizeUnbounded)
				continue;
			
			if (this.cells[j][i] == null)
				continue;
			
			if (!this.cells[j][i].refresh(0, 0, this.computedWs[i], this.computedHs[j]))
				return false;
			
		}
		
		yAccum += this.computedHs[j];
	}
	
	let xAccum = 0;
	for (let i = 0; i < this.xNum; i++)
		xAccum += this.computedWs[i];
	
	this.computedW = xAccum;
	this.computedH = yAccum;
	return true;
}


ElemTable.prototype.computeArraySizes = function(array, unboundedArray, fullsize)
{
	let computedSizes = [];
	let usedUpUnits = 0;
	let remainingTally = 0;
	
	for (let i = 0; i < array.length; i++)
	{
		if (array[i] instanceof SizeAbsolute)
		{
			computedSizes[i] = array[i].units;
			usedUpUnits += computedSizes[i];
		}
		
		else if (array[i] instanceof SizeRelative)
		{
			if (fullsize == null)
				computedSizes[i] = 0;
			else
				computedSizes[i] = fullsize * array[i].parts;
			
			usedUpUnits += computedSizes[i];
		}
		
		else if (array[i] instanceof SizeRemaining)
			remainingTally += array[i].parts;
		
		else if (array[i] instanceof SizeUnbounded)
		{
			if (unboundedArray[i] != undefined)
			{
				computedSizes[i] = unboundedArray[i];
				usedUpUnits += computedSizes[i];
			}
			else
				computedSizes[i] = null;
		}
	}
	
	for (let i = 0; i < array.length; i++)
	{
		if (array[i] instanceof SizeRemaining)
		{
			if (fullsize == null)
				computedSizes[i] = 0;
			else
				computedSizes[i] = (array[i].parts / remainingTally) * (fullsize - usedUpUnits);
		}
	}
	
	return computedSizes;
}


ElemTable.prototype.redraw = function(ctx)
{
	ctx.strokeStyle = "#bbb";
			
	let yAccum = 0;
	for (let j = 0; j < this.yNum; j++)
	{
		let xAccum = 0;
		for (let i = 0; i < this.xNum; i++)
		{
			ctx.save();
			ctx.beginPath();
			ctx.rect(xAccum, yAccum, this.computedWs[i], this.computedHs[j]);
			ctx.clip();
			
			ctx.strokeRect(xAccum, yAccum, this.computedWs[i], this.computedHs[j]);
			
			if (this.cells[j][i] != null)
			{
				ctx.translate(xAccum, yAccum);
				this.cells[j][i].redraw(ctx);
			}
			
			ctx.restore();
			xAccum += this.computedWs[i];
		}
		
		yAccum += this.computedHs[j];
	}
}