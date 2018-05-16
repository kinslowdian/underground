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
var currentNum = false;

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

		displayList["lineName" + i].addEventListener("click", tfl_event, false);

		displayList["lineInfoMain" + i] = document.querySelector(".i" + i);
		displayList["lineInfo" + i] = document.querySelector(".i" + i + " p");
	}

	displayList.info 					= document.querySelector(".info");
	displayList.infoContent 			= document.querySelector(".info-content");
	displayList.info_bg 				= document.querySelector(".info-bg");
	displayList.info_line 				= document.querySelector(".info-line");
	displayList.info_close 				= document.querySelector(".info-close");
	displayList.info_description 		= document.querySelector(".info-description");
	displayList.info_description_sub 	= document.querySelector(".info-description-sub");

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

function tfl_event(event)
{
	event.preventDefault();

	trace(event);
	trace(event.target.parentNode.dataset.num);
	trace(event.target.parentNode.style);
	trace(event.target.innerHTML);

	let targetNum = event.target.parentNode.dataset.num;

	if(!currentNum)
	{

	}

	else
	{
		displayList.info_bg.classList.remove("type" + currentNum + "-bg");
		displayList.info_line.classList.remove("type" + currentNum + "-color");
		displayList.info_close.classList.remove("type" + currentNum + "-color");
		displayList.info_description.classList.remove("type" + currentNum + "-color");
		displayList.info_description_sub.classList.remove("type" + currentNum + "-color");
	}

	displayList.info_bg.classList.add("type" + targetNum + "-bg");
	displayList.info_line.classList.add("type" + targetNum + "-color");
	displayList.info_close.classList.add("type" + targetNum + "-color");
	displayList.info_description.classList.add("type" + targetNum + "-color");
	displayList.info_description_sub.classList.add("type" + targetNum + "-color");

	displayList.info_line.innerHTML = "THE " + system.data_tfl[targetNum].id + " LINE";

	displayList.info_close.classList.add("close-active");

	displayList.info.classList.remove("info-off");

	displayList.infoContent.classList.remove("info-content-off");

	displayList.info_close.addEventListener("click", tfl_close, false);

	currentNum = targetNum;
}

function tfl_close(event)
{
	displayList.info_close.removeEventListener("click", tfl_close, false);

	displayList.info_close.classList.remove("close-active");

	displayList.infoContent.addEventListener("transitionend", tfl_purge, false);

	displayList.infoContent.classList.add("info-content-off");
}

function tfl_purge(event)
{
	displayList.infoContent.removeEventListener("transitionend", tfl_purge, false);

	displayList.info_line.innerHTML = "";

	displayList.info.classList.add("info-off");
}



