export function TimestampToNormal(t) {
  var now = new Date(t * 1000),
    y = now.getFullYear(),
    m = now.getMonth() + 1,
    d = now.getDate();
  return (
    // y +
    // "-" +
    // (m < 10 ? "0" + m : m) +
    // "-" +
    // (d < 10 ? "0" + d : d) +
    // " " +
    now.toTimeString().substr(0, 5)
  );
}

// let rule_start_time = "2019-10-22 07:40:06";
// let start = "07:45:00";

function calculateSeconds(t) {
  let seconds = 0;
  t = t.substr(-8, 5);
  let tList = t.split(":");
  for (let i = 0; i < tList.length; i++) {
    if (i === 0) {
      seconds = tList[i] * 60 * 60;
    } else {
      seconds += tList[i] * 60;
    }
  }
  return seconds;
}

export function calculateMorning(start, rule_start_time) {
  let result = "";
  console.log("start", start);
  console.log("rule_start_time", rule_start_time);
  let startSeconds = calculateSeconds(start);
  console.log("startSeconds", startSeconds);
  let startRuleTime = calculateSeconds(rule_start_time);
  console.log("startRuleTime", startRuleTime);
  if (startSeconds - startRuleTime < 0) {
    result += "正常";
  } else {
    result += "迟到";
    result += Math.abs(startRuleTime - startSeconds) / 60 + "分钟";
  }
  return result;
}

export function calculateAfternoon(end, rule_end_time) {
  let result = "";
  let endSeconds = calculateSeconds(end);
  console.log("end", endSeconds);
  let endRuleTime = calculateSeconds(rule_end_time);
  console.log("rule_end_time", endRuleTime);
  if (endSeconds - endRuleTime > 0) {
    result += "正常";
  } else {
    result += "早退";
    result += Math.abs(endSeconds - endRuleTime) / 60 + "分钟";
  }
  return result;
}

export function getDate(date) {
  let result = "";
  let Y = date.getFullYear() + "-";
  let M =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1) + "-"
      : date.getMonth() + 1 + "-";
  let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  result = Y + M + D;
  return result;
}

export function getStatus(rule, record, day) {
  console.log(rule, record, day);
  // console.log("======");
  // console.log(getDate(new Date()), day);

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
    // 只有一个的情况
    record = record.split(":");
    let totalRecord = record[0] * 60 + parseInt(record[1]);
    if (totalRecord >= 720) {
      return StatusMap[9];
    } else {
      if (getDate(new Date()) === day) {
        rule = rule.slice(2).split("-");

        console.log(rule[0], record.join(":"));
        let morningRule = rule[0];
        let afternoonRule = rule[1];
        let morningRecord = record.join(":");
        if (
          computeTime(morningRule) < computeTime(morningRecord) &&
          computeTime(morningRecord) < computeTime(afternoonRule)
        ) {
          let result = [
            StatusMap[2],
            "迟到" +
              Math.abs(computeTime(morningRule) - computeTime(morningRecord)) +
              "分钟"
          ];
          return result;
        } else if (computeTime(morningRecord) > computeTime(afternoonRule)) {
          return "上午缺勤";
        }
        return "";
      }
      return StatusMap[4];
    }
  }
  if (rule.length >= 12) {
    rule = rule.slice(2).split("-");
  }
  let morningRule = rule[0];
  let afternoonRule = rule[rule.length - 1];

  if (record.length >= 10) {
    record = record.trim().split("  ");
    record.sort();
  }
  let morningRecord = record[0];
  let afternoonRecord = record[record.length - 1];
  if (
    computeTime(morningRule) >= computeTime(morningRecord) &&
    computeTime(afternoonRule) <= computeTime(afternoonRecord)
  ) {
    return StatusMap[1];
  } else if (
    computeTime(morningRule) < computeTime(morningRecord) &&
    computeTime(afternoonRule) <= computeTime(afternoonRecord)
  ) {
    let result = [
      StatusMap[2],
      "迟到" +
        Math.abs(computeTime(morningRule) - computeTime(morningRecord)) +
        "分钟"
    ];
    return result;
  } else if (
    computeTime(morningRule) >= computeTime(morningRecord) &&
    computeTime(afternoonRule) > computeTime(afternoonRecord)
  ) {
    let result = [
      StatusMap[3],
      "早退" +
        Math.abs(computeTime(afternoonRule) - computeTime(afternoonRecord)) +
        "分钟"
    ];

    return result;
  } else {
    let result = [
      StatusMap[6],
      "迟到" +
        Math.abs(computeTime(morningRule) - computeTime(morningRecord)) +
        "分钟;" +
        "早退" +
        Math.abs(computeTime(afternoonRule) - computeTime(afternoonRecord)) +
        "分钟"
    ];
    // let result =
    return result;
  }
}
