window.onload = function () {
	var dataRef = new Firebase("https://gameoflife.firebaseio.com");
	//dataRef.set("I am now writing data into Firebase!");

	dataRef.on('value', DataUpdated);
	dataRef.on('child_added', DataUpdated);

	var textbox = document.getElementById("textbox");
	textbox.onchange = function () {
		dataRef.set(textbox.value);
	};
};

function DataUpdated(data)
{
	var datalist = document.getElementById("datalist");
	var listitem = document.createElement('li');
	listitem.innerHTML = data.z.D;
	datalist.appendChild(listitem);
}

function GetValues(data)
{
	document.getElementById("info").innerHTML = 'child_added' + data.z.D;
}

