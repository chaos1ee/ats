window.addEventListener("load", function() {
  new Chart("#node-chart", {
    type: "doughnut",
    legend: ["数学", "历史", "英语"],
    data: [100, 50, 50],
    label: { text: "50%", color: COLORS[1] }
  });

  new Chart("#etcd-chart", {
    type: "doughnut",
    legend: ["人工智能", "大数据", "前端", "后端"],
    data: [2132, 1247, 3246, 4223],
    label: { text: "34%", color: COLORS[1] }
  });

  new Chart("#master-chart", {
    type: "doughnut",
    legend: ["Javascript", "Python", "Go"],
    data: [80, 30, 20],
    label: { text: "23%", color: COLORS[1] }
  });

  new Chart("#bar1", {
    type: "bar",
    data: -1
  });

  new Chart("#bar2", {
    type: "bar",
    data: 0.7523
  });

  new Chart("#bar3", {
    type: "bar",
    data: 1.0
  });
});
