function load_data_json(file, callbackFunct)
{
	var xobj = new XMLHttpRequest();

	xobj.overrideMimeType("application/json");
	xobj.open('GET', file, true);

	xobj.onreadystatechange = function()
	{
		if(xobj.readyState == 4 && xobj.status == "200")
		{
			callbackFunct(xobj.responseText);
		}
	};

	xobj.send(null);
}