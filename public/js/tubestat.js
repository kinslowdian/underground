// DEBUG
var trace = function(msg){ console.log(msg); };

// https://api.tfl.gov.uk/swagger/ui/index.html?url=/swagger/docs/v1#!/Line/Line_Disruption
// https://api.tfl.gov.uk/swagger/ui/index.html?url=/swagger/docs/v1#!/Line/Line_StatusByMode

var system;
var displayList;
var lineTotal;
var goodMSG_ARR;

function pageLoad_init()
{
	trace("pageLoad_init();");

	grid_init();
}

function grid_init()
{
	system = {};

	displayList = {};

	data_init_tfl();
}

function data_init_tfl()
{
	load_data_json('https://api.tfl.gov.uk/Line/Mode/tube/Status?detail=true', data_loaded_tfl);
}

function data_loaded_tfl(data)
{
	system.data_tfl = JSON.parse(data);

	trace(system);
	trace(system.data_tfl.length);
	trace(system.data_tfl[0].lineStatuses[0].statusSeverityDescription);

	tfl_create();
}

function tfl_create()
{
	lineTotal = system.data_tfl.length;

	for(let i = 0; i < lineTotal; i++)
	{
		displayList["lineName" + i] = document.querySelector(".g" + i + " p");
		displayList["lineInfo" + i] = document.querySelector(".i" + i + " p");
	}

	goodMSG_ARR = new Array();
	goodMSG_ARR.push("OK");
	goodMSG_ARR.push("KINDA GOOD");
	goodMSG_ARR.push("NICE");
	goodMSG_ARR.push("BETTER THAN USUAL");

	tfl_run();
}

function tfl_run()
{
	for(let i = 0; i < lineTotal; i++)
	{
		let tubeName = system.data_tfl[i].id;
		let status = system.data_tfl[i].lineStatuses[0].statusSeverityDescription;
		let statusFormat = status.toLowerCase();
		let statusMsg = "";
		let tubeMsg = tubeName.toUpperCase();

		if(statusFormat === "good service" || statusFormat === "no issues")
		{
			statusMsg = goodMSG_ARR[Math.floor(Math.random() * goodMSG_ARR.length)];
		}

		else if(statusFormat === "minor delays" || statusFormat === "reduced service" || statusFormat === "part suspended" || statusFormat ==="part closure")
		{
			statusMsg = "A BIT FUCKED";
		}

		else if(statusFormat === "severe delays" || statusFormat === "not running" || statusFormat === "suspended" || statusFormat === "closed")
		{
			statusMsg = "VERY FUCKED";
		}

		else
		{
			statusMsg = "OK";
		}

		displayList["lineName" + i].innerHTML = tubeMsg;
		displayList["lineInfo" + i].innerHTML = statusMsg;

		trace(system.data_tfl[i].lineStatuses[0].statusSeverityDescription);
	}
}