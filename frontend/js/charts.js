const FONT_SIZE = 12;
const COLORS = ["#e54545", "#0abf5b", "#006eff", "#ff9d00"];

const CHARTS = [
  {
    type: "doughnut",
    method: "_doughnut"
  },
  {
    type: "bar",
    method: "_bar"
  }
];

class Legend {
  constructor(ctx, text, x, y, color) {
    const r = 4;
    const startAngle = 0;
    const endAngle = 2 * Math.PI;

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, r, startAngle, endAngle);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.textBaseline = "middle";
    ctx.fillStyle = "Black";
    ctx.font = `${FONT_SIZE}px serif`;
    ctx.fillText(text, x + 10, y);
    ctx.closePath();
  }
}

class Chart {
  constructor(selector, options) {
    this.options = options;

    const ctx = this._init(selector);

    const chart = CHARTS.find(chart => chart.type === options.type);

    if (options.type && chart) {
      this[chart.method].call(this, ctx, this.options);
    }
  }

  _init(selector) {
    const canvas = document.querySelector(selector);
    const ctx = canvas.getContext("2d");
    const ratio = getPixelRatio(ctx);

    this.width = canvas.width;
    this.height = canvas.height;

    canvas.style.width = this.width + "px";
    canvas.style.height = this.height + "px";

    canvas.width = this.width * ratio;
    canvas.height = this.height * ratio;

    ctx.scale(ratio, ratio);

    ctx.lineWidth = 10;

    return ctx;
  }

  _doughnut(ctx) {
    this._drawArcs(ctx, this.options.data);
    this._drawLegends(ctx, this.options.legend);
    this._drawLabel(ctx);
  }

  _bar(ctx) {
    const x = 0;
    const y = 2;

    ctx.font = "14px serif";
    const font = ctx.measureText("100.00%");

    const distance = 6;
    const borderWidth = 1;

    const barWidth = this.width - font.width - distance;
    const barHeight = this.height - 4;

    let data = this.options.data;

    data = data >= 0 && data <= 1 ? data : 0;

    const color = COLORS[1];

    const ratio = 1 - data;
    const maxClearRectWidth = barWidth - 2 * borderWidth;
    const clearRectWidth = ratio * maxClearRectWidth;
    const clearRectX = barWidth - borderWidth - clearRectWidth;

    ctx.beginPath();
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.strokeRect(x, y, barWidth, barHeight);
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.clearRect(clearRectX, y, clearRectWidth, barHeight);
    ctx.closePath();

    let text = (data * 100).toFixed(2) + "%";

    ctx.beginPath();
    ctx.textBaseline = "top";
    ctx.fillStyle = "#000000";
    ctx.fillText(text, barWidth + distance, 0);
    ctx.closePath();
  }

  _drawArcs(ctx, data) {
    let x = 0;
    let y = 0;
    let r = 60;
    let startAngle = 0;
    let endAngle = 0;
    let color;
    const degree = Math.PI / 180;

    const arr = data.filter(item => item > 0);
    const total = sum(arr);

    ctx.translate(this.width / 2, this.height / 2);
    ctx.rotate(-90 * degree);

    for (let i = 0; i < arr.length; i++) {
      startAngle = endAngle;
      endAngle = startAngle + (arr[i] * 2 * Math.PI) / total;

      color = COLORS[i % COLORS.length];

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.arc(x, y, r, startAngle + degree, endAngle - degree);
      ctx.stroke();
      ctx.closePath();
    }
  }

  _drawLegends(ctx, data) {
    let x = 100;
    let y = 0;

    const DISTANCE = 8;
    const count = data.length;

    ctx.translate(0, 0);
    ctx.rotate((90 * Math.PI) / 180);

    for (let i = 0; i < count; i++) {
      y = (FONT_SIZE + DISTANCE) * (0.5 - count / 2 + i);

      new Legend(ctx, data[i], x, y, COLORS[i % COLORS.length]);
    }
  }

  _drawLabel(ctx) {
    const x = 0;
    const y = 0;
    const font_size = 22;
    const text = this.options.label.text;
    const color = this.options.label.color;

    ctx.beginPath();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.font = `${font_size}px serif`;
    ctx.fillText(text, x, y);
    ctx.closePath();
  }
}
