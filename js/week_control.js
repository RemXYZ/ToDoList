let set_date = function () {

const date = getEl(".wc_date");
let my__time = get_my_time("en");
const my_date = my__time.wk_name + " / " + my__time.d+"."+my__time.mo+"."+my__time.s_yr+ " / " + my__time.h+ ":" + my__time.min + ":" + my__time.s;

date.innerHTML = my_date;
}

const setMtvWords = function () {
//mtv = motivational
const mtv = getEl(".motivational_words");
//mtv_sn = motivational !span!
const mtv_sn = mtv.children[0];

const mtv_words_set = [
    "a beautiful day",
    "the day to conquer the stars!",
    "the day where you will win!"
]
let rand_attachment = getRandomInt(0,mtv_words_set.length-1);
mtv_sn.innerHTML = mtv_words_set[rand_attachment];

set_date();

}