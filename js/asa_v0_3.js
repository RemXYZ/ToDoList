//!!!
//The whole script was written by an individual Rem Karablin except for sources from internet that are highlighted as //sourse [url] ... //sourceEnd
//!!!

//SETTING

const javava_setting = {
D_D:{stop_before_the_border:false}
}

//GET ELEMENT 
function getEl (mix) {
	let result;
	if (mix instanceof Element & typeof mix == "object") {
		
		result = mix;
	}else {
		result = document.querySelectorAll(mix);
		if (result.length == 1) {
			result = result[0];
		}
		
	}
	result.__proto__.CSSinfo = CSSinfo;
	result.__proto__.setCSS = setCSS;
	result.__proto__.find_top_node = find_top_node;
	// result.__proto__.replaceAt = replaceAt;
	return result;
}


//SHOW CSS STYLE OF ELEMENT
const CSSinfo =  function() {
return window.getComputedStyle(this,null);
}
// Object.prototype.CSSinfo = CSSinfo;

//SET CSS STYLE
const setCSS = function (mix,arg2) {
	if (typeof mix == "object") {
		for (const [key, value] of Object.entries(mix)) {
			this.style[key] = value;
		}
	}else if (typeof mix == "string" && typeof arg2 == "string") {
		this.style[mix] = arg2;
	}
}
// Object.prototype.setCSS = setCSS;

//Find top element
const find_top_node = function (mix) {
let el_par = this,
stop = true;
while(stop) {
	el_par = el_par.parentNode;
	if (!el_par.classList.contains(mix) || el_par.id != mix) {
		let el_chd = el_par.children;
		for (let chld of el_chd) {
			if (chld.classList.contains(mix) || chld.id == mix) {
				return chld;
				stop = false;
			}
		}
	}else {
		return el_par;
		break;
	}
	if (el_par == document.body) {
		stop = false;
	}
}
}
// Object.prototype.find_top_node = find_top_node;

//ADDED***
//replace sign with index
//Source https://coderoad.ru/1431094/%D0%9A%D0%B0%D0%BA-%D0%B7%D0%B0%D0%BC%D0%B5%D0%BD%D0%B8%D1%82%D1%8C-%D1%81%D0%B8%D0%BC%D0%B2%D0%BE%D0%BB-%D0%B2-%D0%BE%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%BD%D0%BE%D0%BC-%D0%B8%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%D0%B5-%D0%B2-JavaScript

// const replaceAt = function(i, repl) {
//     return this.substr(0, i) + repl + this.substr(i + repl.length);
// }

const replaceAt = function(txt, i, repl) {
    if (repl == "" || repl == undefined) {
        return String(txt).substr(0, i) + String(txt).substr(i+1);
    }
    return String(txt).substr(0, i) + repl + String(txt).substr(i + repl.length);
}
//sourceEnd

function stopEvent (e) {
	//*cross-browser stop
	e.stopPropagation ? e.stopPropagation() : (e.cancelBubble=true);
	e.preventDefault();
}
//Source https://ru.stackoverflow.com/questions/454972/%D0%9A%D0%B0%D0%BA-%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%B8%D1%82%D1%8C-%D1%87%D1%82%D0%BE-%D0%BE%D0%B1%D1%8A%D0%B5%D0%BA%D1%82-%D0%BD%D0%B5-%D0%BF%D1%83%D1%81%D1%82%D0%BE%D0%B9
function isEmptyObject(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}
//sourceEnd

//**WAS

//CREATE(MAKE) A ELEMENT
function mkEl (tag,att) {
	//att mast be a object
	//expample {"class":"input","type":"number"}
	let node = document.createElement(tag);
	if (typeof att == 'object') {
		for(var key in att) {
			if (att.hasOwnProperty(key)){
				node.setAttribute(key,att[key]);
			}
		}
	}
	return node;
}

//DRAG AND DROP PART

//D_D it's function for start Drag&drop elements
//element has to be DOM object, with style : postition absolute!
//parent of element has to be DOM object


const getElCrd = function (el,par) {
	if (par === undefined) {
		par = document.body;
	}
	var el = {
		X:getCoords(el).left,
		Y:getCoords(el).top,
		x:el.offsetLeft,
		y:el.offsetTop,
		x_par:getCoords(el).left - getCoords(par).left - (par.offsetWidth - par.clientWidth)/2,
		y_par:getCoords(el).top - getCoords(par).top - (par.offsetWidth - par.clientWidth)/2,
		w:el.clientWidth,
		h:el.clientHeight,
		'x_bd':function(){return this.x+this.w},
		'y_bd':function(){return this.y+this.h}
	}
	return el;
}

//ADDED***
//sourse https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}
function getRandomInt(min, max, round) {
	let result = Math.random() * (max - min) + min;
	if (round === undefined || round == "" || round == 0) {
		round = 0;
	}
	return result.toFixed(round);
  }
//sourceEnd

//if less then 10
function if_lt_10 (unit) {
	if (unit < 10) {
		return "0"+unit;
	}
	return unit;
}

const get_my_time = function (lg) {

	let week_names = {
		ru:["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"],
		en:["Sunday","Suturday","Friday","Thursday","Wadnesday","Tuesday","Monday"],
		ang:["Sunday","Suturday","Friday","Thursday","Wadnesday","Tuesday","Monday"]
	}

	//yr = year, s_yr = short year, mo = month, wk = weak, d = day, h = hour, min = minute, s = secund
    const date = {};

    let NewDate = new Date();
    date.yr = NewDate.getFullYear();
    date.s_yr = date.yr;
    date.mo = NewDate.getMonth()+1;
    date.wk = NewDate.getDay();
	date.wk_name = false;
    date.d = NewDate.getDate();
    date.h = NewDate.getHours();
    date.min = NewDate.getMinutes();
    date.s = NewDate.getSeconds();

	if (lg !== undefined) {
		if (week_names[lg] !== undefined) {
			date.wk_name = week_names[lg][date.wk];
		}
	}

	if(date.mo > 12) {
		date.mo = 1;
	}
    
	//Check for correct DD.MM.YYYY format
    for (let key of Object.keys(date)) {
        if (key == "r") {
            continue;
        }
		if (key == "wk_name") {
            continue;
        }
        if (key == "s_yr") {
            let str = String(date.s_yr);
            date.s_yr = str.substr(2);
            continue;
        }
        date[key] = if_lt_10(date[key])
    }

    return date;
}
//WAS***

// Drag&Drop PART

function internalColision (el,speedX,speedY,par) {
//SPEED must be a difference between first mouse coordinate and second coordinate
//for exaple, we have fisrt x coordinate of the mouse (event.x) and after triggering by some function, we set another  x coordinate of the mouse, then we calculate difference between them. So the first x coodrinate f.e. was 200, then we run some function, where we get another x coordinate, f.e. 205, after that we calculate difference between these 2 number, and it will be 205 - 200 = 5, and 5 is the speed.

let speed = {
x:speedX,
y:speedY
}

let outSpeed = {
	X:0,
	Y:0
}
let report = {
	top:false,
	right:false,
	bottom:false,
	left:false
};

let parCrd = getElCrd(par);

let elCrd = {
	X:getCoords(el).left,
	Y:getCoords(el).top,
	x:getCoords(el).left - parCrd.X - (par.offsetWidth - par.clientWidth)/2,
	y:getCoords(el).top - parCrd.Y - (par.offsetWidth - par.clientWidth)/2,
	w:el.offsetWidth,
	h:el.offsetHeight,
	moveXL: true,
	moveXR: true,
	moveYB: true,
	moveYT: true
}

// total displacement
let tldp = {
	x: elCrd.x + elCrd.w + speed.x,
	y: elCrd.y + elCrd.h + speed.y
}

//collision calculation

if (tldp.x >= parCrd.w) {
	outSpeed.X = speed.x - (tldp.x - parCrd.w);
	elCrd.moveXL = false;
	report.right = true;
} 
if (elCrd.x + speed.x <= 0) {
	outSpeed.X = speed.x - (elCrd.x + speed.x);
	elCrd.moveXR = false;
	report.left = true;
} 

if (tldp.y >= parCrd.h) {
	outSpeed.Y = speed.y - (tldp.y - parCrd.h);
	elCrd.moveYB = false;
	report.bottom = true;
}
if (elCrd.y + speed.y < 0) {
	outSpeed.Y = speed.y - (elCrd.y + speed.y);
	elCrd.moveYT = false;
	report.top = true;
}


//speed entry 

if (speed.x > 0 && elCrd.moveXL ) {
	outSpeed.X += speed.x;
}
if (speed.x < 0 && elCrd.moveXR ) {
	outSpeed.X += speed.x;
}

if (speed.y > 0 && elCrd.moveYB ) {
	outSpeed.Y += speed.y;
}
if (speed.y < 0 && elCrd.moveYT ) {
	outSpeed.Y += speed.y;
}

return {
	//here I return the speed relative to the parent
	x:outSpeed.X,
	y:outSpeed.Y,
	report:report
}

}

//D_D it's the function for start Drag&drop DOM elements

function D_D (main_el,par,fdfex,def_el,pos_x,pos_y) {
//main_el is a trigger, elemet that start drag&drop
//par is for collision, so element can't go out of parent
//with pos_x and pos_y you can set position for element
//with def_el you can move another element
//*fdfex is a function definition expression. And a function definition expression it is a function is passed as an argument to another function

const el = main_el;
el.__proto__.isDraging = true;
el.__proto__.isResizing = false;

//If User hasn't set the position of the element, this function will set it instead of User.
const CSSinfo = el.CSSinfo();
{
	if (CSSinfo.position == "static") {
		el.style.position = "absolute";
	}
}
//This will help not to highlight the text
el.setAttribute('onselectstart',"return false");

el.addEventListener('mousedown',mDownD_D);

if (def_el !== undefined && def_el != 0 && def_el != ""){
	el = def_el;
}

if (pos_x !== undefined && !isNaN(pos_x) && pos_x != 0) {
	el.style.left = Number(pos_x)+"px";
}
if (pos_y !== undefined && !isNaN(pos_x) && pos_x != 0) {
	el.style.top = Number(pos_y)+"px";
}

function mDownD_D (e) {
	window.addEventListener('mousemove',mMoveD_D);
	window.addEventListener('mouseup',mUpD_D);

let parentOut = false;

if (par && javava_setting.D_D.stop_before_the_border == true) {
	//If mouse is out of parent territory, the element will not move
	par.addEventListener("mouseout",par_out);
	function par_out () {
		window.removeEventListener('mousemove',mMoveD_D);
	}

	//If mouse is over of parent territory, the element will move
	par.addEventListener("mouseover",par_over);
	function par_over () {
			window.addEventListener('mousemove',mMoveD_D);
		
	}

}

	let elCrd = {
		x:el.offsetLeft,
		y:el.offsetTop,
		w:el.offsetWidth,
		h:el.offsetHeight
	}

	let mouse = {
		x:e.x,
		y:e.y
	}

function mMoveD_D (e) {

if (!el.isResizing){

mouse.x = e.x - mouse.x;
mouse.y = e.y - mouse.y;

if (par) {
//this if is for collision with parent
let new_speed = internalColision (el,mouse.x,mouse.y,par);

//and this for change coords of element
elCrd.x += new_speed.x;
elCrd.y += new_speed.y;

}else {
	elCrd.x += mouse.x;
	elCrd.y += mouse.y;
}

//FDFEX part
//here I set another position of element with css
	elCrd.X = getCoords(el).left;
	elCrd.Y = getCoords(el).top;
	if (fdfex !== undefined && fdfex !== "" && fdfex !== 0) {
		// 1 is moving
		let status = 1;
		if (typeof fdfex == "function") {
			fdfex({'event':e,'el':el, 'status':status, 'position':{'x':elCrd.X,'y':elCrd.Y}});
		}
	}

	{
		//here I set position for element
		el.style.left = elCrd.x + "px";
		el.style.top = elCrd.y + "px";
		//this function makes a loop
		mouse.x = e.x;
		mouse.y = e.y;
	}
}

//END OF MOVE DRAG AND DROP
}
//END OF MOVE DRAG AND DROP

function mUpD_D (e) {
	window.removeEventListener('mousemove',mMoveD_D);
	window.removeEventListener('mouseup',mUpD_D);
	if (par) {
		par.removeEventListener("mouseout",par_out);
		par.removeEventListener("mouseover",par_over);
	}

//here I set another position of element with css

	if (fdfex !== undefined && fdfex !== "" && fdfex !== 0) {
		// 0 is moving
		let status = 0;
		if (typeof fdfex == "function") {
			fdfex({'event':e,'el':el, 'status':status, 'position':{'x':elCrd.X,'y':elCrd.Y}});
		}
	}

	el.style.boxShadow = "none";
	}
}

el.ondragstart = function() {
  return false;
};

//END OF STOP DRAG AND DROP
}
//END OF STOP DRAG AND DROP



//RESIZE PART
//RESIZE START
function resizeEl (el,par,fdfex,minX,minY,maxX,maxY,notSquare) {
//RESIZE START
let isMouseOver = false;

let Relements = [];


{
//CREATE RESIZER
let Rdirection = ["se","sw","nw", "ne"];

for (let i=0;i<4;i++) {
	if (document.querySelectorAll(".resizer").length < 4) {
		Relements[i] = document.createElement("div");
		Relements[i].classList.add("resizer");
		Relements[i].classList.add(Rdirection[i]);
		el.append(Relements[i])
	}
}

}//END CREATE RESIZER

el.addEventListener("mouseover",mover_R);
el.addEventListener("mouseout",mout_R);

function mover_R () {
	isMouseOver = true;
}
		
function mout_R () {
	isMouseOver = false;
}


const resizers = el.querySelectorAll(".resizer");
let currentResizer;

//resizer diraction
let rzr_dirct = {}

for (let resizer of resizers) {
resizer.addEventListener("mousedown", mDown_Rz);
let t_rzr = resizer.classList[1];
//layout ["+","+",0,0] means which value to remove and where to add (width and height)
//["right","bottom","left","top"]
//["east","south","west","north"]
//["width","height","x_crd","y_crd"]
if (t_rzr == "se") {rzr_dirct[t_rzr] = ["+","+",0,0];}
if (t_rzr == "sw") {rzr_dirct[t_rzr] = ["-","+","+",0];}
if (t_rzr == "ne") {rzr_dirct[t_rzr] = ["+","-",0,"+"];}
if (t_rzr == "nw") {rzr_dirct[t_rzr] = ["-","-","+","+"];}
if (t_rzr == "north") {rzr_dirct[t_rzr] = [0,"-",0,"+"];}
if (t_rzr == "west") {rzr_dirct[t_rzr] = ["-",0,"+",0];}
if (t_rzr == "south") {rzr_dirct[t_rzr] = [0,"+",0,0];}
if (t_rzr == "east") {rzr_dirct[t_rzr] = ["+",0,0,0];}
}

function mDown_Rz (e) {
	el.isResizing = true;
	currentResizer = e.target;
	window.addEventListener("mousemove", mMove_Rz);
	window.addEventListener("mouseup", mUp_Rz);

	let speed = {
		x:e.x,
		y:e.y
	}

function mMove_Rz (e) {
let elCrd = getElCrd(el);

// console.log(elCrd)

	speed.x = e.x - speed.x;
	speed.y = e.y - speed.y;


	// console.log (speed.x, speed.y)

	//Free resize
	// if (notSquare == 1 || notSquare == true) { 
	function set_dctn (out_speed) {
		let s = {
			'w': out_speed.x,
			'h': out_speed.y,
			'x': out_speed.x,
			'y': out_speed.y,
			colision:{
				top:false,
				right:false,
				bottom:false,
				left:false
			}
		}
		function set_spd (op_w,op_h,op_x,op_y) {
			//Look, s.x and s.w is the same, only they are intended for another, c.x increases the !!width!!, and c.x increases / decreases the !!left!! position
			if (op_w == "+") {
				//MIN
				if (elCrd.w+s.w <= minX && s.w < 0) {
					s.w = s.w+(minX - (elCrd.w+s.w));
					s.x = 0;
					s.y = 0;
					s.h = 0;
				}
				//MAX
				if ((elCrd.w+s.w >= maxX && s.w > 0) & maxX != 0) {
					s.w = s.w - (elCrd.w+s.w - maxX);
					s.x = 0;
					s.y = 0;
					s.h = 0;
					s.colision.right = true;
				}
			}
			if (op_h == "+") {
				//MIN
				if (elCrd.h+s.h <= minY && s.h < 0) {
					s.h = s.h+(minY-(elCrd.h+s.h));
					s.x = 0;
					s.y = 0;
					s.w = 0;
				}
				//MAX
				if ((elCrd.h+s.h >= maxY && s.h > 0) & maxY != 0) {
					s.h = s.h - (elCrd.h+s.h - maxY);
					s.x = 0;
					s.y = 0;
					s.w = 0;
					s.colision.bottom = true;
				}
			}
			if (op_w == "-") {
				//MIN
				if (elCrd.w-s.w <= minX && s.w > 0) {
					s.w = s.w-(minX - (elCrd.w-s.w));
					s.x = 0;
					s.y = 0;
					s.h = 0;
				}
				//MAX
				if ((elCrd.w-s.w > maxX && s.w < 0) & maxX != 0) {
					s.w = maxX - elCrd.w;
					s.x = 0;
					s.y = 0;
					s.h = 0;
					s.colision.left = true;
				}
				s.w *= -1;
			}
			if (op_h == "-") {
				//MIN
				if (elCrd.h-s.h <= minY && s.h > 0) {
					s.h = s.h-(minY-(elCrd.h-s.h));
					s.x = 0;
					s.y = 0;
					s.w = 0;
				}
				//MAX
				if ((elCrd.h-s.h > maxY && s.h < 0) & maxY != 0) {
					s.h = maxY - elCrd.h;
					s.x = 0;
					s.y = 0;
					s.w = 0;
					s.colision.top = true;
				}
				s.h *= -1;
			}
			if (op_x == "-") {s.x *= -1;}
			if (op_y == "-") {s.y *= -1;}
			if (op_w == 0) {s.w = 0;}
			if (op_h == 0) {s.h = 0;}
			if (op_x == 0) {s.x = 0;}
			if (op_y == 0) {s.y = 0;}

			//Square
			if (notSquare === undefined || notSquare == 0 || notSquare == "") {
				const className = currentResizer.classList[1];

				if (className == "se") {
					if (Math.abs(s.w) >= Math.abs(s.h)) {
						s.h = s.w;
					}
					if (Math.abs(s.h) > Math.abs(s.w)) {
						s.w = s.h;
					}
				}

				if (className == "sw") {
					if (Math.abs(s.w) >= Math.abs(s.h)) {
						s.h = s.w;
					}
					if (Math.abs(s.h) > Math.abs(s.w)) {
						s.w = s.h;
						s.x = -1*s.h;
					}
				}

				if (className == "nw") {
					if (Math.abs(s.w) >= Math.abs(s.h)) {
						s.y = -1*s.w;
						s.h = s.w;
					}
					if (Math.abs(s.h) > Math.abs(s.w)) {
						s.w = s.h;
						s.x = -1*s.h;
					}
				}

				if (className == "ne") {
					if (Math.abs(s.w) >= Math.abs(s.h)) {
						s.h = s.w;
						s.y = -1*s.w;
					}
					if (Math.abs(s.h) > Math.abs(s.w)) {
						s.w = s.h;
					}
				}

				if (className == "north" || className == "south") {
					s.x = -1*s.h/2;
					s.w = s.h;
				}

				if (className == "east" || className == "west") {
					s.y = -1*s.w/2;
					s.h = s.w;
				}

				if (elCrd.w != elCrd.h) {
					elCrd.w = elCrd.h;
				}
				if (elCrd.h != elCrd.w) {
					elCrd.h = elCrd.w;
				}

			}

			return s;
		}
		for (let key in rzr_dirct) {
			//here the script looks for names like "sw","se"...
			if (currentResizer.classList.contains(key)) {
				//ictn = instruction;
				let ictn = rzr_dirct[key];
				let speed = set_spd(ictn[0],ictn[1],ictn[2],ictn[3]);
				return speed;
			}
		}
	}
		
	let new_speed = set_dctn(speed);

	// console.log(speed,new_speed)

	//COLITION FOR RESIZER, NOT FOR ELEMENT
	// new_par_speedSize = internalColision (currentResizer,new_speed.w,new_speed.h,par);
	// new_par_speedCrd = internalColision (currentResizer,new_speed.x,new_speed.y,par);
	let inpSpeed = {
		w:new_speed.w,
		h:new_speed.h,
		x:new_speed.x,
		y:new_speed.y
	}
if (par instanceof Element) {
	new_par_speedSize = internalColision (currentResizer,new_speed.w,new_speed.h,par);
	new_par_speedCrd = internalColision (currentResizer,new_speed.x,new_speed.y,par);

	if (new_par_speedCrd.report.top) {
		new_par_speedSize.y = 0;
	}
	if (new_par_speedCrd.report.left) {
		new_par_speedSize.x = 0;
	}
	if (notSquare === undefined || notSquare == 0 || notSquare == "") {
		if (new_par_speedCrd.report.right) {
			new_par_speedSize.y = 0;
			new_par_speedCrd.y = 0;
		}
		if (new_par_speedCrd.report.bottom) {
			new_par_speedSize.x = 0;
			new_par_speedCrd.x = 0;
		}
	}
	

	inpSpeed.w = new_par_speedSize.x;
	inpSpeed.h = new_par_speedSize.y;
	inpSpeed.x = new_par_speedCrd.x;
	inpSpeed.y = new_par_speedCrd.y;	
	
}
	elCrd.w += inpSpeed.w;
	elCrd.h += inpSpeed.h;
	elCrd.x += inpSpeed.x;
	elCrd.y += inpSpeed.y;	


// }

	
	// let inpW = speed.x + elCrd.w;
	// let inpH = speed.y + elCrd.h;

	// elCrd.w += speed.x;
	// elCrd.h += speed.y;
	// elCrd.x_par += speed.x;
	// elCrd.y_par += speed.y;	
	
	el.style.width = elCrd.w + "px";
	el.style.height = elCrd.h + "px";

	el.style.left = elCrd.x + "px";
	el.style.top = elCrd.y + "px";

	speed.x = e.x;
	speed.y = e.y;
	
}

	function mUp_Rz (e) {
		window.removeEventListener("mousemove", mMove_Rz);
		window.removeEventListener("mouseup", mUp_Rz);
		el.isResizing = false;
	}

}

//END OF RESZIEEL
}
//END OF RESZIEEL






//source https://learn.javascript.ru/coordinates-document

// function getCoords(elem) { // кроме IE8-
//   var box = elem.getBoundingClientRect();

//   return {
//     top: box.top + pageYOffset,
//     left: box.left + pageXOffset
//   };

// }

//cross-browser option
function getCoords(elem) {
  // (1)
  var box = elem.getBoundingClientRect();

  var body = document.body;
  var docEl = document.documentElement;

  // (2)
  var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  // (3)
  var clientTop = docEl.clientTop || body.clientTop || 0;
  var clientLeft = docEl.clientLeft || body.clientLeft || 0;

  // (4)
  var top = box.top + scrollTop - clientTop;
  var left = box.left + scrollLeft - clientLeft;

  return {
    top: top,
    left: left
  };
}

//sourseEnd