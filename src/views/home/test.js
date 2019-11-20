let a = [
  { flowName: "请假", flowId: 7 },
  { flowName: "采购", flowId: 8 },
  { flowName: "报损", flowId: 10 },
  { flowName: "看病", flowId: 11 },
  { flowName: "请假", flowId: 7, checked: true },
  { flowName: "采购", flowId: 8, checked: true },
  { flowName: "报损", flowId: 10, checked: true },
  { flowName: "看病", flowId: 11, checked: true }
];

let temp = {};
a = a.reduce((prev, curv) => {
  if (temp[curv.flowId]) {
  } else {
    temp[curv.flowId] = true;
    prev.push(prev);
  }
  return prev;
}, []);
console.log(a);
