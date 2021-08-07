const reminders = {}

//In case the weeks are recorded separately
let week_data = localStorage;

let dates = {};

let my_time = get_my_time();

let audio;
let alarm_on = false;

let my_seconds = 0;

//Turn on pop up window
const pop_out = {};

pop_out.timer = function (treck,rdr,timer) {
    const popup_timer = getEl("#popup_timer");
    const turn_off_but = getEl(".turn_off_timer");
    const rdr_content = getEl(".popup_rdr_content");
    const delete_rdr = getEl('.popup_timer_delete');
    let timeout = (60 - Number(my_time.s)) * 1000;

    popup_timer.setCSS("display","flex");
    rdr_content.innerHTML = rdr.data.v;

    const turn_off_audio = function (e) {
        if (e.target == this) {
            popup_timer.setCSS("display","none");
            audio.pause();
            setTimeout(() => {
                alarm_on = false;
            }, timeout);   
        }
    }
    turn_off_but.onclick = turn_off_audio;
    popup_timer.onclick = turn_off_audio;
    delete_rdr.onclick = (e) => {
        let isDelete = rdr.delete_reminder();
        if(isDelete) {
            audio.pause();
            popup_timer.setCSS("display","none");
        }
    }
}

//*AUDO PART
const playlist = [
    'melody/Very_loud_alarm_clock.mp3'
]

//Source: https://prognote.ru/web-dev/front-end/html-and-javascript-audio-player/
function alarm_clock (treck,rdr,timer) {
    audio.src = playlist[treck];
    audio.currentTime = 0;
    audio.play();

    pop_out.timer(treck,rdr,timer);
}
//Source End

window.onload = function() {
audio = document.getElementById("audio"); 

setMtvWords();

//*TIMER PART
let timer = setInterval(() => {
    my_seconds++;
    //insert new date to header
    set_date();

    my_time = get_my_time();
    week_data = localStorage;
    for (let [k,v] of Object.entries(week_data)) {
        if (k.slice(0,-1) == "day") {
            //check for audio
            let day = JSON.parse(v);
            //vkey = key of value and vv = value of value
            for (let [vk,vv] of Object.entries(day)) {
                if (vv.timer !== undefined) {
                    let my_dateYY = my_time.d+"."+my_time.mo+"."+my_time.s_yr;
                    let my_date = my_time.d+"."+my_time.mo+"."+my_time.yr;
                    let my_day = "";
                    if (dates[my_date] !== undefined) my_day = dates[my_date];
                    if (dates[my_dateYY] !== undefined) my_day = dates[my_dateYY];
                    if(k == my_day) {
                        let rdr = reminders[k][vk];
                        let my_hour = my_time.h+":"+my_time.min;
                        if ((vv.timer == my_hour)& !alarm_on) {  
                            alarm_on = true;
                            alarm_clock(vv.melody,rdr,vv.timer);
                        }
                    }
                }
            }
        }
    }
},1000);//end of timer

}


class Week_control {
constructor (days) {
    this.days = days;
    this.days_id = {};
    this.adding_days_to_week ();
    this.memory_is_pasted = false;
    this.numDateClassNm = ".date_of_week";
    this.numDate = {};
    this.setDate();
    if (week_data.date !== undefined) {
        this.setDate(true);
    }
}
adding_days_to_week () {
    for (let i=0;this.days.length>i;i++) {

        let day_id = this.days[i].classList[0];
        this.days_id[day_id] = this.days[i];

        reminders[this.days[i].classList[0]] = {};
    }
}

insert_adding_rdr (root_pattern,insert_place,fdfex_click) {
    if (insert_place == 0 || insert_place === undefined) {
        insert_place = this.days;
    }
    //*fdfex is a function definition expression. And a function definition expression it is a function is passed as an argument to another function
        
    let rdr = "";
    //root_parent instanceof Element = checks if it is an element
    if (root_pattern instanceof Element === false 
    || typeof insert_place != "object"
    ){
        console.error("arguments is not nodes")
        return false;
    }
    if (insert_place instanceof Element) {
        insert_place = [insert_place];
    }

    //ADD REMINDER FROM MEMORY
    if (this.memory_is_pasted == false & week_data.length != 0){
        //insert an existing reminder from memory
        for (const Dkey of Object.keys(week_data)){
            if (this.days_id[Dkey] === undefined) {
                continue;
            }
            const DayClassName = Dkey;
            let new_data_id = week_data.getItem(DayClassName);
            const parse_dataJ = JSON.parse(new_data_id);

            for (const [key,v] of Object.entries(parse_dataJ)) {
                if (key.slice(0,-1) != "rdr_") {
                    console.log("ok")
                }
                let pattern = root_pattern.cloneNode(true);
                const wrk_spc = pattern.querySelector(".working_space_reminder");
                const crt_rdr = pattern.querySelector(".create_reminder_block");
                pattern.wrk_spc = wrk_spc;
                pattern.crt_rdr = crt_rdr;
                pattern.my_week = this;

                rdr = new Reminder(pattern,root_pattern,this.days_id[Dkey]);
                rdr.insert_reminder(v.v,key);

                pattern.style.display = "block";
                this.days_id[Dkey].append(pattern);
            }

            
            this.memory_is_pasted = true;
        }
    }

    //ADD EMPTY REMINDER
    for (let i=0;insert_place.length>i;i++) {
        let pattern = root_pattern.cloneNode(true);
        const DayClassName = insert_place[i].classList[0];
        //Now I'm adding a function that transform the creation part to the active part of the reminder
        {
            const wrk_spc = pattern.querySelector(".working_space_reminder");
            const crt_rdr = pattern.querySelector(".create_reminder_block");
            pattern.wrk_spc = wrk_spc;
            pattern.crt_rdr = crt_rdr;
            pattern.my_week = this;

            crt_rdr.addEventListener("click",function(){
                rdr = new Reminder(pattern,root_pattern,insert_place[i]);
                rdr.create_reminder();
                if (fdfex_click != 0 && fdfex_click !== undefined) {
                    fdfex_click();
                }
            });
        }

        pattern.style.display = "block";
        
        insert_place[i].append(pattern);

        this.memory_is_pasted = true;
    }
}

setDate (insert) {
const week = this;
function set_time_to_others (my_date_name,my_date) {
    const maxDays_of_Mth = {
        '1':31,
        '2':29,
        '3':31,
        '4':30,
        '5':31,
        '6':30,
        '7':31,
        '8':31,
        '9':30,
        '10':31,
        '11':30,
        '12':31
    }

    let splited_date = my_date.split(".");
    let num_of_my_day = Number(my_date_name.substr(-1));
    let i = 0;
    for (let [key,v] of Object.entries(week.numDate)) {
        
        let num_of_day = num_of_my_day-Number(key.substr(-1));
        num_of_day = -1*num_of_day;
        let inp_day = Number(splited_date[0]) + num_of_day;
        let inp_month = Number(splited_date[1]);
        let inp_year = Number(splited_date[2]);

        if (inp_day > maxDays_of_Mth[inp_month]) {
            inp_day = inp_day - maxDays_of_Mth[inp_month];
            inp_month += 1;
        }
        if (inp_month > 12) {
            inp_month = "1";
            inp_year = +inp_year + 1;
        } 

        if (inp_day <= 0) {
            inp_month -= 1;
            if (inp_month == 0) {
                inp_month = "12";
                inp_year = +inp_year - 1;
            } 
            inp_day = maxDays_of_Mth[inp_month] + inp_day;
        }
        
        //This will add days to the var dates and to each innerHTML
        let date = if_lt_10 (inp_day)+"."+if_lt_10 (inp_month)+"."+if_lt_10 (inp_year);
        dates[date] = key;
        v.innerHTML = if_lt_10 (inp_day)+"."+if_lt_10 (inp_month)+"."+if_lt_10 (inp_year);
    }
}

if (insert) {
    let date_info = week_data.date;
    date_info = JSON.parse(date_info);
    date_info = Object.entries(date_info);
    set_time_to_others(date_info[0][0],date_info[0][1]);
    return 0;
}

this.days.forEach(element => {
    let name_of_day = Object.keys(this.days_id).filter(el => this.days_id[el] == element);
    name_of_day = name_of_day[0];

    const numDate = element.querySelector(this.numDateClassNm);
    this.numDate[name_of_day] = numDate;
    
    //editing on false allows to not loop date editing
    let editing = false;
    numDate.addEventListener("click",(e)=>{
        if (editing == false) {
            editing = true;
            const my_start_date = numDate.innerHTML;
            let new_date = my_start_date;
            const my_input = mkEl("input",{"class":"chg_date","placeholder":my_start_date});
            numDate.innerHTML = "";
            numDate.append(my_input);
            my_input.focus();

            //splt_dt = splited date
            let splt_dt = my_start_date.split(".");
            my_input.value = "";
            my_input.select()

            //*THIS WILL SET NEW DATE
            function edit_date(e) {
                const regexp = new RegExp("[0-9\.]","ig");
                let check_v = regexp.test(e.key);
                const el = this;
                let my_sting = el.value;

                let ignore = false;
                if (e.key == "Backspace" | e.key == "Delete" | e.key == "ArrowRight" | e.key == "ArrowLeft") {
                    ignore = true;
                }

                if ((!check_v || el.value.length == 10) & !ignore ) {
                    //*cross-browser stop
                    e.stopPropagation ? e.stopPropagation() : (e.cancelBubble=true);
                    e.preventDefault();
                    return 0;
                }

                if (my_sting.length == 2 & !ignore & e.key != ".") {
                    
                    if (my_sting > 31) {
                        my_sting = 31;
                    }
                    el.value = my_sting+".";
                }
                if (my_sting.length == 5 & !ignore & e.key != ".") {
                    let splited_str = my_sting.split(".");
                    if (splited_str[1] > 12) {
                        my_sting = replaceAt(my_sting,3,"12");
                    }
                    el.value = my_sting+".";
                }

            }

            function edit_date_up() {
                let my_sting = this.value;
                // function no_mistakes (i,input) {
                //     if (my_sting[i] != "." & my_sting[i] !== undefined) {
                //         my_sting = replaceAt(my_sting,i,".");
                //         input.value = my_sting;
                //     }
                //     if (my_sting[i+1] == "." & my_sting[i+1] !== undefined) {
                //         my_sting = replaceAt(my_sting,i,"");
                //         input.value = my_sting;
                //     }
                // }
                //no_mistakes(2,this);
                //no_mistakes(5,this);

                new_date = my_sting;
            }
            my_input.addEventListener("keydown",edit_date);
            my_input.addEventListener("keyup",edit_date_up);

            //*To let go editing by clicking to any place using the window event
            //*This will end editing and save the score to the localStorage
            function detect_my_el () {
                let e = event;
                if (e.target != numDate & e.target.parentElement != numDate) {
                    numDate.innerHTML = my_start_date;

                    let splited_date = new_date.split(".");
                    if (splited_date.length == 3) {
                        if (
                            (splited_date[0].length == 2 & !isNaN(splited_date[0])) & 
                            (splited_date[1].length  == 2 & !isNaN(splited_date[1]))& 
                            ((splited_date[2].length  == 2 || splited_date[2].length  == 4 & !isNaN(splited_date[2])))) {
                                //new date is successful
                                numDate.innerHTML = new_date;
                                // console.log(isNaN(inp_day))
                                
                                set_time_to_others(name_of_day,new_date);
                                
                                //SAVING DATE TO THE MEMORY
                                let memory_date = {};
                                memory_date[name_of_day] = new_date;
                                memory_date = JSON.stringify(memory_date);
                                localStorage.setItem("date",memory_date);
                        }
                    }
                    
                    // get_my_time();
                    
                    editing = false;
                    window.removeEventListener("click",detect_my_el);

                }
            }
            window.addEventListener("click",detect_my_el);
        }
    }); 
});
    
}//END OF setDate()

}//END OF CLASS Week_control

class Reminder {
//START CLASS

constructor (el,reminder_pattern,day) {
    //super это функция для того, чтобы заполнить дыру в переменных в родительском классе
    // super();
    //el is the parent block of reminder
    this.el = el;
    this.reminder_pattern = reminder_pattern;
    this.my_day = day;
    this.my_week = this.el.my_week;
    this.day_id = this.my_day.classList[0];
    this.id = 0;
    this.name_id = 0;
    let id = Object.keys(reminders[this.day_id]).length;
    this.check_id(id);
}
//1
check_id (arg_id) {
    let var_id = "rdr_"+arg_id;
    if (reminders[this.day_id][var_id] === undefined) {
        this.id = arg_id;
        this.name_id = var_id;
    }else {
        arg_id++;
        this.check_id(arg_id);
    }
}
//5
delete_reminder() {
    const dayId = this.day_id;
    let parsed_data = false;
    if (week_data.getItem(dayId) !== null) {
        parsed_data = JSON.parse(week_data[dayId]);
    }

    let result = confirm("Delte ?");
    if (result == false) {
        // e.stopPropagation ? e.stopPropagation() : (e.cancelBubble=true);
        // e.preventDefault();
        return 0;
    }

    delete reminders[this.day_id][this.name_id];

    if (parsed_data != false) {
        delete parsed_data[this.name_id];
        const my_new_dataJ = JSON.stringify(parsed_data);
        localStorage.setItem(dayId,my_new_dataJ);
    }

    this.el.remove();

    return true;
}

//3 
add_events() {

const dayId = this.day_id;
let parsed_data = false;

//SAVE REMINDER
//When I wrote something into textarea, this will be saved in the localStorage
this.text = this.el.querySelector (".reminder_text");
this.text.focus();
this.text.addEventListener("input",(event)=> {
    //updating data
    if (week_data.getItem(dayId) !== null) {
        //parsed_data = true if other reminders exist in localStorage
        parsed_data = JSON.parse(week_data[dayId]);
        if (JSON.parse(week_data[dayId])[this.name_id] !== undefined) {
            //parsed_data = my data if MY reminder exists in localStorage
            var my_new_parsed_data = false;
        }else {
            var my_new_parsed_data = true;
        }
    }

    //here I create a data, which means I'm putting text from textarea into local cookie
    let my_id = this.name_id;
    let my_data = {v:event.target.value};
    let my_dataJ = "";
    
    reminders[dayId][my_id].data = my_data;
    
    if (parsed_data != false) {
        //updating data if my reminder do not exist in the localStorage
        if (my_new_parsed_data == true) {
            parsed_data[this.name_id] = {};
        }
        //updating data if my reminder already exists in the localStorage
        parsed_data[this.name_id].v = event.target.value;
        my_dataJ = JSON.stringify(parsed_data);
    }else {
    //Here I take info from reminders to insert it into localStorage
        let day_data = {};
        for (const [key,v] of Object.entries(reminders[dayId])) {
            day_data[key] = v.data;
        }
        my_dataJ = JSON.stringify(day_data);
    }   
    localStorage.setItem(dayId,my_dataJ);
});


//TIMER(timer) CONFIGURATION
const rdr_timer = this.el.querySelector(".timer_of_reminder");
const timer_control = this.el.querySelector(".timer_control");
const save_timer = this.el.querySelector(".save_timer");
const melody = this.el.querySelector(".select_melody");
var show = true;

rdr_timer.addEventListener("click", (e)=> {
    if (week_data.getItem(dayId) !== null) {
        parsed_data = JSON.parse(week_data[dayId]);
    }
    if (parsed_data == false) {
        stopEvent(e);
        return false;
    }
    if (show) {
        
        //SETING CSS TO timer_control
        timer_control.style.display = "flex";
        //SETING CSS TO rdr_timer
        rdr_timer.style.background = "#e8f7ff";

        let input = Object.values(timer_control.children).filter (e=>e.tagName == "INPUT");
        input = input[0];

        //INSERT TIMER
        {
            if (parsed_data[this.name_id].timer !== undefined) {
                input.value = parsed_data[this.name_id].timer;
            }else {
                input.value = my_time.h+":"+my_time.min;
            }
        }

        //source learn https://learn.javascript.ru/selection-range
        //!*Selection part
        // //set cursor on posiotion 0
        // input.selectionStart = input.selectionEnd = 0;
        
        //Select the text
        input.setSelectionRange(0, input.value.length);
        //or
        // input.select();

        input.focus();
        // input.addEventListener("select", function (e){
        //     const el = this;
        // });

        //*text input part
        let my_string = "";
        
        input.addEventListener("keydown",(e)=> {
            const regexp = new RegExp("[0-9]","ig");
            let check_v = regexp.test(e.key);
            const el = e.target;
            my_string = el.value;

            //*Verifier variables
            let isSelected = false;
            let ignore = false;

            if (e.key == "Backspace" | e.key == "Delete" | e.key == "ArrowRight" | e.key == "ArrowLeft") {
                ignore = true;
            }

            if (e.key == ":" & el.value.length == 1) {
                el.value = "0" + my_string+":";
            }
            
            if (my_string.length == 2 & !ignore) {
                    
                if (my_string >= 24) {
                    my_string = 24;
                }
                el.value = my_string+":";
            }
            

            //*Checks for a selection so that a character can be inserted at that location in the selection
            if ((el.selectionStart != el.selectionEnd) & check_v) {
                isSelected = true;
            }else {
                isSelected = false;
            }

            //Do not allow delete ":"
            if (el.value.indexOf(":") != -1) {

                if (
                    el.selectionStart == el.value.indexOf(":") && 
                    el.selectionEnd == el.value.indexOf(":")+1) 
                {
                    stopEvent(e);
                }
            } 

            if ((!check_v || el.value.length == 5) & !ignore & !isSelected) {    
                stopEvent(e);
                return 0;
            }
        //END OF INPUT
        });

        input.addEventListener("keyup",(e)=>{
            const el = e.target;
            my_string = el.value;

            let splited_str = my_string.split(":");
            //max minute is 60
            if (splited_str[1] !== undefined) {
                if (Number(splited_str[1]) > 59) {
                    splited_str[1] = 59
                    el.value = my_string.slice(0,-2) + splited_str[1];
                }
            }
        });

        save_timer.addEventListener("click",(e)=>{
            let ngb_input = getEl(input);
            let inp_vl = ngb_input.value;
            let melody_vl = melody.value;
            //continue saving
            let cnt_saving = true;

            //*Validate inp_vl
            const splited_vl = inp_vl.split(":");
            if (splited_vl[0].length != 2) {   
                cnt_saving = false;
                let new_piece = "0"+splited_vl[0];
                ngb_input.value = new_piece + inp_vl.slice(1);
                
            }
            if (splited_vl[1].length != 2) {
                cnt_saving = false;
                let new_piece = splited_vl[1]+"0";
                ngb_input.value = inp_vl.slice(0,-1) + new_piece;
            }

            let inpbd = ngb_input.CSSinfo().borderColor;
            if (cnt_saving) {
                ngb_input.setCSS("borderColor","#5bf24b");
                setTimeout(() => {
                    ngb_input.setCSS("borderColor",inpbd);
                    //and close timer_control
                    timer_control.style.display = "none";
                    rdr_timer.style.background = "white";
                }, 1000);
            }else {
                ngb_input.setCSS("borderColor","#f77474"); 
                setTimeout(() => {
                    ngb_input.setCSS("borderColor",inpbd);
                }, 1000);
                stopEvent(e);
                return 0;
            }

            parsed_data[this.name_id].timer = inp_vl;
            parsed_data[this.name_id].melody = melody_vl;

            let archived_data = JSON.stringify(parsed_data);
            localStorage.setItem(dayId,archived_data);


        //END OF SAVE TIMER
        });

        show = false;  
    } else {
        timer_control.style.display = "none";
        //SETING CSS TO rdr_timer
        rdr_timer.style.background = "white";
        show = true;
    }
    
});

//DELETE REMINDER
let remove_but = this.el.querySelector(".remove_reminder");
remove_but.addEventListener("click",(e)=> {
    this.delete_reminder();
});

}
//2
create_reminder() {
    this.el.wrk_spc.style.display = "inline-flex";
    this.el.crt_rdr.remove();

    this.add_events();

    this.my_week.insert_adding_rdr(this.reminder_pattern,this.my_day);
    reminders[this.day_id][this.name_id] = this;
}
//4 
insert_reminder(text,id) {
    this.el.wrk_spc.style.display = "inline-flex";
    this.el.crt_rdr.remove();

    //Set values from localStorage
    const my_id = this.name_id;
    this.data = {};
    this.data.v = text;
    this.name_id = id;

    this.add_events();

    this.text.value = text;

    // this.my_week.insert_adding_rdr(this.reminder_pattern,this.my_day);
    reminders[this.day_id][this.name_id] = this;
}

//END CLASS
}

