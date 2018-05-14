// DEBUG
var trace = function(msg){ console.log(msg); };

// https://api.tfl.gov.uk/swagger/ui/index.html?url=/swagger/docs/v1#!/Line/Line_Disruption
// https://api.tfl.gov.uk/swagger/ui/index.html?url=/swagger/docs/v1#!/Line/Line_StatusByMode

var system;

function pageLoad_init()
{
	trace("pageLoad_init();");

	grid_init();
}

function grid_init()
{
	system = {};

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

	data_loaded_tfl_read();
}

function data_loaded_tfl_read()
{
	let dataTotal = system.data_tfl.length;

	for(let i = 0; i < dataTotal; i++)
	{
		let tubeName = system.data_tfl[i].id;
		let status = system.data_tfl[i].lineStatuses[0].statusSeverityDescription;
		let statusFormat = status.toLowerCase();

		if(statusFormat === "good service" || statusFormat === "no issues")
		{
			trace(tubeName.toUpperCase() + " LINE IS NOT FUCKED");
		}

		else if(statusFormat === "minor delays" || statusFormat === "reduced service" || statusFormat === "part suspended" || statusFormat ==="part closure")
		{
			trace(tubeName.toUpperCase() + " LINE IS A BIT FUCKED");
		}

		else if(statusFormat === "severe delays" || statusFormat === "not running" || statusFormat === "suspended" || statusFormat === "closed")
		{
			trace(tubeName.toUpperCase() + " LINE IS FUCKED");
		}

		else
		{
			trace(tubeName.toUpperCase() + " LINE IS NOT FUCKED");
		}

		trace(system.data_tfl[i].lineStatuses[0].statusSeverityDescription);
	}
}