let g_Layout = null;
let g_CanvasMouseIsDown = false;


function main()
{
	let textarea = document.getElementById("textareaMain");
	textarea.value =
		"table ws:1r hs:u|u|1r\n" +
		"    table x:0 y:0 ws:u|1r|u|u|u hs:u\n" +
		"        p x:0 y:0 text:Company-Name\n" +
		"        p x:2 y:0 text:NavButtons--\n" +
		"        p x:3 y:0 text:Profile--\n" +
		"        p x:4 y:0 text:Logout\n\n" +

		"    p x:0 y:2 text:Footer\n\n" +

		"    table x:0 y:1 ws:1r|0.5x|1r hs:u\n" +
		"        table x:0 y:0 ws:1r hs:u|u|u\n" +
		"            p x:0 y:0 text:SideNav\n" +
		"            p x:0 y:1 text:Home\n" +
		"            p x:0 y:2 text:About\n\n" +

		"        p x:1 y:0 text:Content-Content-Content-Lorem-Ipsum-Dolor-Sit-Amet-Ipsum-Lorem-Sit-Dolor-Amet-Sit-Lorem-Dolor-Amet-Ipsum-Lorem-Ipsum-Dolor-Sit-Amet-Ipsum-Lorem-Sit-Dolor-Amet-Sit-Lorem-Dolor-Amet-Ipsum-Lorem-Ipsum-Dolor-Sit-Amet-Ipsum-Lorem-Sit-Dolor-Amet-Sit-Lorem-Dolor-Amet-Ipsum-Lorem-Ipsum-Dolor-Sit-Amet-Ipsum-Lorem-Sit-Dolor-Amet-Sit-Lorem-Dolor-Amet-Ipsum-Lorem-Ipsum-Dolor-Sit-Amet-Ipsum-Lorem-Sit-Dolor-Amet-Sit-Lorem-Dolor-Amet-Ipsum-Lorem-Ipsum-Dolor-Sit-Amet-Ipsum-Lorem";
	
	g_Layout = new Layout();
	g_Layout.setBounds(40, 60, 560, 360);
	
	let canvas = document.getElementById("canvasMain");
	canvas.onmousedown = handleCanvasMouseDown;
	canvas.onmouseup = handleCanvasMouseUp;
	canvas.onmousemove = handleCanvasMouseMove;
	
	allowTabInTextarea(textarea);
	textarea.onkeyup = refreshLayoutFromCode;
	
	refreshLayoutFromCode();
}


function refreshLayoutFromCode()
{
	let textarea = document.getElementById("textareaMain");
	
	try
	{
		g_Layout.setElem(parseLayout(textarea.value));
		g_Layout.refresh();
		g_Layout.redraw(document.getElementById("canvasMain"));
	}
	catch (err)
	{
		console.log(err);
	}
}


function allowTabInTextarea(textarea)
{
	textarea.onkeydown = function(ev)
	{
		if (ev.keyCode == 9 || ev.which == 9)
		{
			ev.preventDefault();
			let s = this.selectionStart;
			this.value = this.value.substring(0, this.selectionStart) + "  " + this.value.substring(this.selectionEnd);
			this.selectionEnd = s + 2; 
		}
	}
}


function handleCanvasMouseDown(ev)
{
	ev.preventDefault();
	g_CanvasMouseIsDown = true;
}


function handleCanvasMouseUp(ev)
{
	ev.preventDefault();
	g_CanvasMouseIsDown = false;
}


function handleCanvasMouseMove(ev)
{
	ev.preventDefault();
	
	if (!g_CanvasMouseIsDown)
		return;
	
	let rect = this.getBoundingClientRect();
	let mouseX = ev.clientX - rect.left;
	let mouseY = ev.clientY - rect.top;
	
	let w = Math.abs(mouseX - 640 / 2) * 2;
	let h = Math.abs(mouseY - 480 / 2) * 2;
	
	g_Layout.setBounds(
		640 / 2 - w / 2,
		480 / 2 - h / 2,
		w, h);
	g_Layout.refresh();
	g_Layout.redraw(this);
}


function max()
{
	let result = -Infinity;
	
	for (var i = 0; i < arguments.length; i++)
	{
		if (arguments[i] != null && arguments[i] != undefined)
			result = Math.max(result, arguments[i]);
	}
	
	return result;
}


function min()
{
	let result = Infinity;
	
	for (var i = 0; i < arguments.length; i++)
	{
		if (arguments[i] != null && arguments[i] != undefined)
			result = Math.min(result, arguments[i]);
	}
	
	return result;
}