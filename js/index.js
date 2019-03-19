var isMobile = false;
var orientationData = { gamma: 0, beta: 0, alpha: 0 };
var motionData = { z: 0, y: 0, x: 0, zr: 0 };
var socket = io("https://awiclass.monoame.com:4040");
var temp = 0;
function orientation(event) {
  if (event.gamma) {
    orientationData = {
      gamma: event.gamma || 0,
      beta: event.beta || 0,
      alpha: event.alpha || 0

      //console.log(JSON.stringify(orientationData))
    };}
}

function handleMotion(event) {
  motionData = {
    z: event.acceleration.z || 0,
    y: event.acceleration.y || 0,
    x: event.acceleration.x || 0 };

}

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  isMobile = true;
  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", orientation, false);
  } else {
    console.log("DeviceOrientationEvent is not supported");
  }
  if (window.DeviceMotionEvent) {
    window.addEventListener("devicemotion", handleMotion, true);
  }
}

var g, g1, g2, guide;
var phoneImg;
var phoneVideo;

function setup() {

  g = createCanvas(windowWidth, windowHeight);
  g.parent("#canvas")
  g1 = createGraphics(windowWidth, windowHeight);
  g2 = createGraphics(windowWidth, windowHeight);
  guide = createGraphics(windowWidth, windowHeight);
  //phoneImg = loadImage('https://www.pngrepo.com/png/5145/170/hand-graving-smartphone.png');
  //phoneImg = loadImage('src/smartphone.png');
  // phoneVideo = createVideo('src/shake_phone.mov');
  // phoneVideo.size(100, 100)
  // phoneVideo.loop();
  frameRate(120);
  //$("video").play();
}

var values = {
  p: 0,
  v: 0,
  a: 0,
  lastP: 0,
  lastV: 0,
  xyzA: 0 };

var countHit = 0;

let lastTriggerTime = 0;
function draw() {
  //phoneVideo.play();
  //phoneVideo.position(100, 100);
  
  g1.background(0);
  g1.noStroke();
  g1.fill(255);

  g1.image(g2, -3, 0);

  values.lastP = values.p;
  values.lastV = values.v;
  values.lastA = values.a;

  if (isMobile) {
    values.p = orientationData.beta;
    values.xyzA = Math.sqrt(Math.pow(motionData.x, 2) + Math.pow(motionData.y, 2) + Math.pow(motionData.z, 2));

  } else {

    values.p = mouseY;

  }
  values.v = values.p - values.lastP;
  values.a = values.v - values.lastV;
  if (!isMobile) values.xyzA = values.a;

  g1.push();
  g1.translate(width / 2 - 50, height / 2);

  g1.ellipse(width / 2, values.p, 3, 3);
  g1.fill('red');
  g1.stroke('red');
  g1.line(width / 2 - 5, values.lastV, width / 2, values.v);
  g1.ellipse(width / 2, values.v, 3, 3);

  g1.fill("yellow");
  g1.stroke('yellow');
  g1.line(width / 2 - 5, values.lastA, width / 2, values.a);
  g1.ellipse(width / 2, values.a, 3, 3);

  if (values.xyzA > 20 && frameCount - lastTriggerTime > 5) {
    g1.noStroke();
    g1.fill(255, 100);
    g1.rect(width / 2 + width / 20, 0 - height / 2, -width / 20, height);
    lastTriggerTime = frameCount;
    checkHit(countHit);
    countHit++;
    stopAnime(0);
  }

  if (values.xyzA > 50) {
    stopAnime(1);
  }

  g1.pop();

  sendOsc("/testGyro/a", values.xyzA * 3);

  g2.image(g1, 0, 0);
  image(g1, 0, 0, windowWidth, windowHeight);
  //   textSize(20);
  //   fill(255, 255, 255);
  //   text(temp, 100, 100);
  //   if (isMobile) {
  //     textSize(20);
  //     fill(255, 255, 255);
  //     text("g: "+orientationData.gamma.toFixed(2) + 
  //          ", b:"+orientationData.beta.toFixed(2) + 
  //          ", a: "+orientationData.alpha.toFixed(2) , 10, 30);  
  //     text("z: "+motionData.z.toFixed(2) + 
  //          ", y:"+motionData.y.toFixed(2) + 
  //          ", x: "+motionData.x.toFixed(2) , 10, 50); 

  //   } 
}


function sendOsc(address, message) {

  socket.emit("osc", {
    address: address,
    args: [
    { value: message }] });

}


function checkHit(t) {
  setTimeout(function () {
    if (countHit - t > 1) {
      temp = countHit - t;
      // sendOsc("/testGyro/hit", "hit");
      console.log("hit");
      stopAnime(1);
    }
    countHit = t;
  }, 600);

}