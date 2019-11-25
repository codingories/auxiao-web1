// let a = [
//   { flowName: "请假", flowId: 7 },
//   { flowName: "采购", flowId: 8 },
//   { flowName: "报损", flowId: 10 },
//   { flowName: "看病", flowId: 11 },
//   { flowName: "请假", flowId: 7, checked: true },
//   { flowName: "采购", flowId: 8, checked: true },
//   { flowName: "报损", flowId: 10, checked: true },
//   { flowName: "看病", flowId: 11, checked: true }
// ];

// let temp = {};
// a = a.reduce((prev, curv) => {
//   if (temp[curv.flowId]) {
//   } else {
//     temp[curv.flowId] = true;
//     prev.push(prev);
//   }
//   return prev;
// }, []);
// console.log(a);

let a = { Leave_days: "4", Leave_name: "2", Leave_reason: "3", title: "1" };
let b = {
  Restorder_endtime: "3",
  Restorder_name: "2",
  Restorder_starttime: "4",
  title: "1"
};

console.log(a["title"]);
console.log(b["title"]);
for (let key in a) {
  if (key.indexOf("name") !== -1) {
    console.log(key);
    if (a[key] !== "" && a[["title"]] !== "") {
      console.log("123");
    }
  }
  // console.log(key);
}

let p = 0;
for (let key in tpl) {
  if (key.indexOf("name") !== -1) {
    if (tpl[key] !== "" && tpl[["title"]] !== "") {
      p = "1";
    }
  }
  // console.log(key);
}
console.log("p", p);
