window.onload = function () {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;

  // 중심점 설정, 그리기
  var xc = -0.6;
  var yc = 0;
  draw();

  document.getElementById("btn").onclick = draw;
  document.getElementById("myCanvas").onclick = function (event) {
    var ix = event.offsetX;
    var iy = event.offsetY;
    var mag = parseFloat(document.getElementById("magnification").value);

    xc += ((2 * ix) / width - 1) / mag;
    yc += (2 * iy - height) / mag / width;
    draw();
  };

  function draw() {
    // 확대 배율
    var mag = document.getElementById("magnification").value;
    // 최대 반복 횟수
    var maxit = document.getElementById("maxit").value;

    displayCenter(xc, yc);

    mandelbrot(ctx, xc, yc, mag, maxit);
  }
};

function displayCenter(xc, yc) {
  document.getElementById("xc").innerHTML = xc.toFixed(3);
  document.getElementById("yc").innerHTML = yc.toFixed(3);
}

// 망델브로 집합을 그리는 함수
// c : canvas의 rendering context
// xc, yc : 중심좌표
// mag : 확대 배율
// maxit : 최대 반복 횟수
function mandelbrot(c, xc, yc, mag, maxit) {
  var w = c.canvas.width;
  var h = c.canvas.height;
  var xmin = xc - 1 / mag;
  var xmax = xc + 1 / mag;
  var ymin = yc - ((xmax - xmin) * h) / w / 2;
  var ymax = yc + ((xmax - xmin) * h) / w / 2;
  var dx = (xmax - xmin) / w;
  var dy = (ymax - ymin) / h;

  // 색상 구분
  var color = [];
  color[0] = "black";
  var L = 255;
  var dL = 255 / maxit;

  for (var i = maxit; i > 0; i--) {
    color[i] = `rgb(255, ${Math.floor(L)}, 255)`;
    L -= dL;
  }
  // x축 방향 픽셀 검사
  for (var p = 0; p < w; p++) {
    var x = xmin + p * dx;
    // y축 방향 픽셀 검사
    for (var j = 0; j < h; j++) {
      var y = ymin + j * dy;
      var a = x;
      var b = y;
      var a2 = a * a;
      var b2 = b * b;

      for (var count = maxit; a2 + b2 <= 4 && count; count--) {
        b = 2 * a * b + y;
        a = a2 - b2 + x;
        a2 = a * a;
        b2 = b * b;
      }

      // count 값에 따라 색을 구분하여 점을 그린다.
      c.fillStyle = color[count];
      c.fillRect(p, j, 1, 1);
    }
  }
}
