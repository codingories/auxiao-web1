function getM(y, m, d) {
  let M = [];
  // 创建当前时间对象
  let nowDate = new Date(y, m - 1, d);
  console.log(nowDate);
  // 获取当前月份
  let month = nowDate.getMonth() + 1;
  // 获取当前年份
  let year = nowDate.getFullYear();
  console.log(year, month);
  // 创建当前年的当前月份的第一天对象
  firstDate = new Date(year, month - 1, 1);
  console.log(firstDate);
  console.log("第一天是星期几:");
  console.log(firstDate.getDay());
  weekDay = firstDate.getDay();
  // 创建当前年的当前月份的最后一天对象
  lastDate = new Date(new Date(year, month, 1).getTime() - 100);
  console.log(lastDate);
  firstDateDay = firstDate.getDate();
  console.log(firstDateDay);
  lastDateDay = lastDate.getDate();
  console.log(lastDateDay);
  //  接下去两个相减，计算出有几天
  monthTotalDays = lastDateDay - firstDateDay + 1;

  for (let i = 0; i < monthTotalDays; i++) {
    let hashDay = {
      0: "日",
      1: "一",
      2: "二",
      3: "三",
      4: "四",
      5: "五",
      6: "六"
    };
    // M.push(month + "月" + (i + 1) + "日" + "星期" + hashDay[(weekDay + i) % 7]);
    M.push(i + 1 + "(" + hashDay[(weekDay + i) % 7] + ")");
  }
  return M;
}

console.log(getM(2019, 9, 1));
