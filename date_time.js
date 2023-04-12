var month = 3;
var day = 25;
// Time as a float, message as string
var time = {value: 9.5, message: "task"};
var output = {};

var month_day = {1:31,2:28,3:31,4:30,5:31,6:30,7:31,8:31,9:30,10:31,11:30,12:31};

if(!(month in month_day) || month_day[month] < day || day < 1){
  throw new Error("bad date")
}

var date_str = month + "-" + day;

if(date_str in output){
  output[date_str].push(time);
  output[date_str].sort((a, b) => (a.value > b.value) ? 1 : -1);
} else {
  output[date_str] = [time];
}
// output is in the format of {date: [{time, task},.......]} and its sorted
return output

