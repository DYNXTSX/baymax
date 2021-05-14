

function drawCoords(o, offX, offY) {
  ctx.beginPath();
  ctx.moveTo(o.x - offX, o.y - offY);
  ctx.lineTo(o.x + offX, o.y + offY);
  ctx.stroke();
  ctx.fillText(o.val, o.x - 2 * offX, o.y + 2 * offY);
}

function animateChart() {
  requestId = window.requestAnimationFrame(animateChart);
  frames += speed;
  ctx.clearRect(60, 0, cw, ch - 60);
  for (var i = 0; i < oFlat.length; i++) {
    if (oFlat[i].y > oDots[i].y) {
      oFlat[i].y -= speed;
    }
  }
  drawCurve(oFlat);
  for (var i = 0; i < oFlat.length; i++) {
      ctx.fillText(oDots[i].val, oFlat[i].x, oFlat[i].y - 25);
      ctx.beginPath();
      ctx.arc(oFlat[i].x, oFlat[i].y, 3, 0, 2 * Math.PI);
      ctx.fill();
    }
  if (frames >= Max * verticalUnit) {
    window.cancelAnimationFrame(requestId);
  }
}

function output(m, i) {
  ctx.beginPath();
  ctx.arc(oDots[i].x, oDots[i].y, 20, 0, 2 * Math.PI);
  if (ctx.isPointInPath(m.x, m.y)) {
    label.style.display = "block";
    label.style.top = (m.y + 10) + "px";
    label.style.left = (m.x + 10) + "px";
    label.innerHTML = "<strong>" + propsRy[i] + "</strong>: " + valuesRy[i] + "%";
    c.style.cursor = "pointer";
  }
} 

function controlPoints(p) {
  var pc = [];
  for (var i = 1; i < p.length - 1; i++) {
    var dx = p[i - 1].x - p[i + 1].x;
    var dy = p[i - 1].y - p[i + 1].y;
    var x1 = p[i].x - dx * t;
    var y1 = p[i].y - dy * t;
    var o1 = {
      x: x1,
      y: y1
    };
    var x2 = p[i].x + dx * t;
    var y2 = p[i].y + dy * t;
    var o2 = {
      x: x2,
      y: y2
    };
    pc[i] = [];
    pc[i].push(o1);
    pc[i].push(o2);
  }
  return pc;
}

function drawCurve(p) {
  var pc = controlPoints(p);
  ctx.beginPath();
  ctx.lineTo(p[0].x, p[0].y);
  ctx.quadraticCurveTo(pc[1][1].x, pc[1][1].y, p[1].x, p[1].y);
  if (p.length > 2) {
    for (var i = 1; i < p.length - 2; i++) {
      ctx.bezierCurveTo(pc[i][0].x, pc[i][0].y, pc[i + 1][1].x, pc[i + 1][1].y, p[i + 1].x, p[i + 1].y);
    }
    var n = p.length - 1;
    ctx.quadraticCurveTo(pc[n - 1][0].x, pc[n - 1][0].y, p[n].x, p[n].y);
  }
  ctx.stroke();
  ctx.save();
  ctx.fillStyle = grd;
  ctx.fill();
  ctx.restore();
}

function arrayMax(array) {
  return Math.max.apply(Math, array);
};

function arrayMin(array) {
  return Math.min.apply(Math, array);
};

function oMousePos(canvas, evt) {
  var ClientRect = canvas.getBoundingClientRect();
  return { //objeto
    x: Math.round(evt.clientX - ClientRect.left),
    y: Math.round(evt.clientY - ClientRect.top)
  }
}


function snow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < flakeCount; i++) {
    var flake = flakes[i],
      x = mX,
      y = mY,
      minDist = 150,
      x2 = flake.x,
      y2 = flake.y;

    var dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)),
      dx = x2 - x,
      dy = y2 - y;

    if (dist < minDist) {
      var force = minDist / (dist * dist),
        xcomp = (x - x2) / dist,
        ycomp = (y - y2) / dist,
        deltaV = force / 2;

      flake.velX -= deltaV * xcomp;
      flake.velY -= deltaV * ycomp;
    } else {
      flake.velX *= 0.98;
      if (flake.velY <= flake.speed) {
        flake.velY = flake.speed;
      }
      flake.velX += Math.cos((flake.step += 0.05)) * flake.stepSize;
    }

    ctx.fillStyle = "rgba(255,255,255," + flake.opacity + ")";
    flake.y += flake.velY;
    flake.x += flake.velX;

    if (flake.y >= canvas.height || flake.y <= 0) {
      reset(flake);
    }

    if (flake.x >= canvas.width || flake.x <= 0) {
      reset(flake);
    }

    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(snow);
}

function reset(flake) {
  flake.x = Math.floor(Math.random() * canvas.width);
  flake.y = 0;
  flake.size = Math.random() * 3 + 2;
  flake.speed = Math.random() * 1 + 0.5;
  flake.velY = flake.speed;
  flake.velX = 0;
  flake.opacity = Math.random() * 0.5 + 0.3;
}

function init() {
  for (var i = 0; i < flakeCount; i++) {
    var x = Math.floor(Math.random() * canvas.width),
      y = Math.floor(Math.random() * canvas.height),
      size = Math.random() * 3 + 2,
      speed = Math.random() * 1 + 0.5,
      opacity = Math.random() * 0.5 + 0.3;

    flakes.push({
      speed: speed,
      velY: speed,
      velX: 0,
      x: x,
      y: y,
      size: size,
      stepSize: Math.random() / 30,
      step: 0,
      opacity: opacity
    });
  }
  snow();
}

function loadGraph(){
  //gestion test
  textAnim();
  setTimeout( function (){
    drawLine();
  }, 100);
  fadeIn(document.getElementById('content__graph'));
  drawGraph();
}

function textAnim(){
  //delete text
  setTimeout( function (){
    document.getElementById('contain__text__before').innerHTML = "";
    document.getElementById('button__launch').remove();
    document.getElementById('loading__dot').style.display = "block";
  }, 300);
  //apres
  setTimeout( function (){
    document.getElementById('loading__dot').style.display = "none";
    document.getElementById('contain__text__before').innerHTML = "Votre envie de faire la <strong> fête </strong> est en pleine évolution depuis plusieurs mois !";
  }, 4300);

  setTimeout( function (){
    document.getElementById('contain__text__before').innerHTML = "Êtes-vous satisfait de vos soins ?";
  }, 13300);
}

function fadeIn(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}

function fadeOut(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

function drawLine(){
  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  ctx.lineTo(B.x, B.y);
  ctx.lineTo(C.x, C.y);
  ctx.stroke();

  var a = [];
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (var i = 0; i <= vData; i++) {
    if (i == 0) {
      a[i] = {
        x: A.x,
        y: A.y + 25,
        val: Max
      }
    } else {
      a[i] = {}
      a[i].x = a[i - 1].x;
      a[i].y = a[i - 1].y + aStep;
      a[i].val = a[i - 1].val - aStepValue;
    }
    drawCoords(a[i], 3, 0);
  }

  var b = [];
  ctx.textAlign = "center";
  ctx.textBaseline = "hanging";
  var bStep = chartWidth / (hData + 1);
  for (var i = 0; i < hData; i++) {
    if (i == 0) {
      b[i] = {
        x: B.x + bStep,
        y: B.y,
        val: propsRy[0]
      };
    } else {
      b[i] = {}
      b[i].x = b[i - 1].x + bStep;
      b[i].y = b[i - 1].y;
      b[i].val = propsRy[i]
    }
    drawCoords(b[i], 0, 3)
  }
}

function drawGraph(){
    requestId = window.requestAnimationFrame(animateChart);
}







