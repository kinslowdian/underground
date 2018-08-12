// DEBUG
var trace = function(msg){ console.log(msg); };

// https://api.tfl.gov.uk/swagger/ui/index.html?url=/swagger/docs/v1#!/Line/Line_Disruption
// https://api.tfl.gov.uk/swagger/ui/index.html?url=/swagger/docs/v1#!/Line/Line_StatusByMode

var system;
var displayList;
var lineTotal;
var firstRun;
var timer;
var jsonMainURL = 'public/data/message.json';
var jsonDataURL = 'https://api.tfl.gov.uk/Line/Mode/tube/Status?detail=true';
var currentNum = false;

function pageLoad_init()
{
	firstRun = true;

	setup_init();
}

function setup_init()
{
	system = {};

	displayList = {};

	load_data_json(jsonMainURL, setup_loaded);
}

function setup_loaded(data)
{
	system.data_main = JSON.parse(data);

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
		displayList["lineNameMain" + i] = document.querySelector(".g" + i);
		displayList["lineName" + i] = document.querySelector(".g" + i + " p");

		displayList["lineName" + i].addEventListener("click", tfl_event, false);

		displayList["lineInfoMain" + i] = document.querySelector(".i" + i);
		displayList["lineInfo" + i] = document.querySelector(".i" + i + " p");
		displayList["lineInfoBlock" + i] = document.querySelector(".i" + i + " > div");

		displayList["lineInfoBlock" + i].addEventListener("click", tfl_event, false);
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
		let statusCode = 99;

		if(statusFormat === "good service" || statusFormat === "no issues")
		{
			statusMsg = system.data_main.main.output3;
			statusCode = 3;
		
			displayList["lineInfoMain" + i].classList.remove("highlight");
		}

		else if(statusFormat === "minor delays" || statusFormat === "reduced service" || statusFormat === "part suspended" || statusFormat ==="part closure")
		{
			statusMsg = system.data_main.main.output0;
			statusCode = 0;

			displayList["lineInfoMain" + i].classList.add("highlight");
		}

		else if(statusFormat === "not running" || statusFormat === "closed")
		{
			statusMsg = system.data_main.main.output1;
			statusCode = 1;

			displayList["lineInfoMain" + i].classList.add("highlight");
		}

		else if(statusFormat === "severe delays" || statusFormat === "suspended")
		{
			statusMsg = system.data_main.main.output2;
			statusCode = 2;

			displayList["lineInfoMain" + i].classList.add("highlight");
		}

		else
		{
			statusMsg = system.data_main.main.output_good;
			statusCode = 3;
		}

		displayList["lineNameMain" + i].setAttribute("data-status", statusCode);
		displayList["lineInfoMain" + i].setAttribute("data-status", statusCode);

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

	// trace(event);

	let targetNum = event.target.parentNode.dataset.num;
	let targetStatusNum = event.target.parentNode.dataset.status;

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
	displayList.info_description.innerHTML = system.data_main.info["output" + targetStatusNum].main;
	displayList.info_description_sub.innerHTML = system.data_main.info["output" + targetStatusNum].sub;

	displayList.info_close.classList.add("close-active");

	displayList.info.classList.remove("info-off");

	displayList.infoContent.classList.remove("info-content-off");

	displayList.info_close.addEventListener("click", tfl_close, false);

	currentNum = targetNum;

	trace(system.data_tfl[targetNum]);
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
	displayList.info_description.innerHTML = "";
	displayList.info_description_sub.innerHTML = "";

	displayList.info.classList.add("info-off");
}



