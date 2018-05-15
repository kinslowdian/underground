// DEBUG
var trace = function(msg){ console.log(msg); };

// https://api.tfl.gov.uk/swagger/ui/index.html?url=/swagger/docs/v1#!/Line/Line_Disruption
// https://api.tfl.gov.uk/swagger/ui/index.html?url=/swagger/docs/v1#!/Line/Line_StatusByMode

var system;
var displayList;
var lineTotal;
var firstRun;
var timer;
var jsonDataURL = 'https://api.tfl.gov.uk/Line/Mode/tube/Status?detail=true';

function pageLoad_init()
{
	firstRun = true;

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
	load_data_json(jsonDataURL, data_loaded_tfl);
}

function data_loaded_tfl(data)
{
	system.data_tfl = JSON.parse(data);

	if(firstRun)
	{
		firstRun = false;

		tfl_create();
	}

	else
	{
		tfl_run();
	}
	
}

function tfl_create()
{
	lineTotal = system.data_tfl.length;

	for(let i = 0; i < lineTotal; i++)
	{
		displayList["lineName" + i] = document.querySelector(".g" + i + " p");
		displayList["lineInfoMain" + i] = document.querySelector(".i" + i);
		displayList["lineInfo" + i] = document.querySelector(".i" + i + " p");
	}

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
			statusMsg = "KINDA GOOD";
		
			displayList["lineInfoMain" + i].classList.remove("highlight");
		}

		else if(statusFormat === "minor delays" || statusFormat === "reduced service" || statusFormat === "part suspended" || statusFormat ==="part closure")
		{
			statusMsg = "A BIT FUCKED";

			displayList["lineInfoMain" + i].classList.add("highlight");
		}

		else if(statusFormat === "not running" || statusFormat === "closed")
		{
			statusMsg = "FUCKED BY OTHERS";

			displayList["lineInfoMain" + i].classList.add("highlight");
		}

		else if(statusFormat === "severe delays" || statusFormat === "suspended")
		{
			statusMsg = "VERY FUCKED";

			displayList["lineInfoMain" + i].classList.add("highlight");
		}

		else
		{
			statusMsg = "KINDA GOOD";
		}

		displayList["lineName" + i].innerHTML = tubeMsg;
		displayList["lineInfo" + i].innerHTML = statusMsg;
	}

	refresher();
}

function refresher()
{
	timer = setTimeout(data_init_tfl, 120 * 1000);
}