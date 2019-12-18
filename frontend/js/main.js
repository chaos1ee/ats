document.addEventListener('DOMContentLoaded', function() {
  // charts
  Charts.ring('#node-chart', [
    {
      name: '数学',
      value: 100
    },
    {
      name: '历史',
      value: 50
    },
    {
      name: '英语',
      value: 0
    }
  ]);

  Charts.ring('#etcd-chart', [
    {
      name: '儿童',
      value: 35
    },
    {
      name: '青年',
      value: 69
    },
    {
      name: '成年',
      value: 55
    },
    {
      name: '老年',
      value: 60
    }
  ]);

  Charts.ring('#master-chart', [
    {
      name: 'JavaScript',
      value: 68
    },
    {
      name: 'Python',
      value: 56
    },
    {
      name: 'Go',
      value: 53
    }
  ]);

  // progress bars
  Charts.bar('#bar1', (10 / 30) * 100);
  Charts.bar('#bar2', (10 / 40) * 100);
});
