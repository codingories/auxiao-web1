// let obj = [
//   {
//     id: 23254,
//     user_id: 45,
//     job_number: "10009",
//     name: "李利民",
//     kaoqin: "06:45  06:45",
//     kaoqin_date: "2019-11-06",
//     start_time: "07:45:00",
//     end_time: "15:30:00",
//     rule_txt: "周三07:45-15:30"
//   },
//   {
//     workno: "10064",
//     name: "周丽英",
//     start_time: "07:45:00",
//     end_time: "16:20:00",
//     rule_txt: "周三07:45-16:20"
//   },
//   {
//     workno: "10063",
//     name: "陆君莉",
//     start_time: "07:45:00",
//     end_time: "16:20:00",
//     rule_txt: "周三07:45-16:20"
//   }
// ];

// for (let i of obj) {
//   //   console.log(i);
//   if ("kaoqin" in i) {
//     console.log(i);
//   }
// }

// let date = new Date();
// Y = date.getFullYear() + "-";
// M =
//   date.getMonth() + 1 < 10
//     ? "0" + (date.getMonth() + 1)
//     : date.getMonth() + 1 + "-";
// D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
// console.log(Y + M + D);

let rule = "周三07:45-16:20";
let record = "07:50 13:18";
// let record = "07:34 18:18";

function getStatus(rule, record) {
  function computeTime(time) {
    time = time.split(":");
    let totalTime = time[0] * 60 + parseInt(time[1]);
    return totalTime;
  }

  let StatusMap = {
    1: "正常", //
    2: "迟到", //
    3: "早退", //
    4: "下午缺勤", //
    5: "缺勤", //
    6: "迟到并早退", //
    9: "上午缺勤" //
  };

  if (!record) {
    return StatusMap[5];
  }
  if (record.length >= 4 && record.length <= 7) {
    record = record.split(":");
    let totalRecord = record[0] * 60 + parseInt(record[1]);
    console.log("totalRecord");
    console.log(totalRecord);
    if (totalRecord >= 720) {
      return StatusMap[9];
    } else {
      return StatusMap[4];
    }
  }
  if (rule.length >= 12) {
    rule = rule.slice(2).split("-");
  }
  let morningRule = rule[0];
  let afternoonRule = rule[rule.length - 1];

  if (record.length >= 10) {
    record = record.split(" ");
  }
  let morningRecord = record[0];
  let afternoonRecord = record[record.length - 1];
  if (morningRule >= morningRecord && afternoonRule <= afternoonRecord) {
    return StatusMap[1];
  } else if (morningRule < morningRecord && afternoonRule <= afternoonRecord) {
    return StatusMap[2];
  } else if (morningRule >= morningRecord && afternoonRule > afternoonRecord) {
    return StatusMap[3];
  } else {
    return StatusMap[6];
  }
}

console.log(getStatus(rule, record));
// getStatus(rule, record);
