function parseLayout(str)
{
	let lines = str.split("\n");
	let elem = parseElement(getHierarchy(lines, 0).elem);
	return elem;
}


function getIndent(str)
{
	let i = 0;
	
	while (i < str.length)
	{
		if (str[i] != " ")
			break;
		
		else
			i++;
	}
	
	return i;
}


function getHierarchy(lines, curLine)
{
	if (curLine > lines.length)
		return {};
	
	let elem = lines[curLine];
	curLine++;
	
	let elemIndent = getIndent(elem);
	let children = [];
	
	while (curLine < lines.length)
	{
		let nextElem = lines[curLine];
		let nextElemIndent = getIndent(nextElem);
		
		if (nextElem.trim() == "")
		{
			curLine++;
			continue;
		}
		
		if (nextElemIndent > elemIndent)
		{
			let inner = getHierarchy(lines, curLine);
			children.push(inner.elem);
			curLine = inner.curLine;
		}
		else
			break;
	}
	
	let fragments = elem.trim().split(" ");
	let tag = fragments[0].trim();
	let params = {};
	for (let i = 1; i < fragments.length; i++)
	{
		let paramFragments = fragments[i].trim().split(":");
		
		if (paramFragments.length == 1)
			params[paramFragments[0].trim()] = true;
		
		else if (paramFragments.length == 2)
			params[paramFragments[0].trim()] = paramFragments[1].trim();
	}
	
	return {
		elem: { tag: tag, params: params, children: children },
		curLine: curLine
	};
}


function parseElement(elem)
{
	switch (elem.tag)
	{
		case "table": return parseTable(elem);
		case "panel": return parsePanel(elem);
		case "scroll": return parseScroll(elem);
		case "p": return parseText(elem);
		default: throw "unknown tag `" + elem.tag + "`";
	}
}


function parseSize(str)
{
	switch (str.substring(str.length - 1))
	{
		case "p": return new SizeAbsolute(parseFloat(str));
		case "x": return new SizeRelative(parseFloat(str));
		case "r": return new SizeRemaining(parseFloat(str));
		case "u": return new SizeUnbounded();
		default: return new SizeAbsolute(parseFloat(str));
	}	
}


function parseTable(elem)
{
	let xSizes = [];
	let ySizes = [];
	
	let xSizesSrc = elem.params.ws.split("|");
	let ySizesSrc = elem.params.hs.split("|");
	
	for (let i = 0; i < xSizesSrc.length; i++)
		xSizes.push(parseSize(xSizesSrc[i]));
		
	for (let i = 0; i < ySizesSrc.length; i++)
		ySizes.push(parseSize(ySizesSrc[i]));
	
	let table = new ElemTable(xSizes.length, ySizes.length);
	
	for (let i = 0; i < xSizes.length; i++)
		table.xSize(i, xSizes[i]);
	
	for (let i = 0; i < ySizes.length; i++)
		table.ySize(i, ySizes[i]);
	
	for (let i = 0; i < elem.children.length; i++)
	{
		let x = 0;
		let y = 0;
		let inner = null;
		
		x = parseInt(elem.children[i].params.x);
		y = parseInt(elem.children[i].params.y);
		inner = parseElement(elem.children[i]);
		
		table.append(x, y, inner);
	}
	
	return table;
}


function parsePanel(elem)
{
	return new ElemPanel(elem.params.color);
}


function parseScroll(elem)
{
	let inner = null;
	if (elem.children.length > 0)
		inner = parseElement(elem.children[0]);
	
	return new ElemScroll(elem.params.h, elem.params.v, inner);
}


function parseText(elem)
{
	let text = elem.params.text;
	if (text.charAt(0) == '#')
	{
		let words = ["Lorem", "ipsum", "dolor", "sit", "amet", "content"];
		let repeat = parseInt(text.substring(1));
		text = "";
		for (let i = 0; i < repeat; i++)
		{
			text += words[Math.floor(Math.random() * words.length)] + " ";
		}
	}
	
	return new ElemText(document.getElementById("canvasMain").getContext("2d"), text);
}