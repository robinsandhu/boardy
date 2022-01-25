// let canvas = document.getElementById('main-canvas');

// canvas.width = 0.9999999*window.innerWidth;
// canvas.height = 0.999999*window.innerHeight;

// let ctx = canvas.getContext('2d');

// var flag = false,
//         prevX = 0,
//         currX = 0,
//         prevY = 0,
//         currY = 0,
//         dot_flag = false;

//     var x = "blue",
//         y = 3;

// canvas.addEventListener("mousemove", function (e) {
//     findxy('move', e)
// }, false);
// canvas.addEventListener("mousedown", function (e) {
//     findxy('down', e)
// }, false);
// canvas.addEventListener("mouseup", function (e) {
//     findxy('up', e)
// }, false);
// canvas.addEventListener("mouseout", function (e) {
//     findxy('out', e)
// }, false);

// function draw() {
//     ctx.beginPath();
//     ctx.moveTo(prevX, prevY);
//     ctx.lineTo(currX, currY);
//     ctx.strokeStyle = x;
//     ctx.lineWidth = y;
//     ctx.stroke();
//     ctx.closePath();
// }

// function findxy(res, e) {
//     if (res == 'down') {
//         prevX = currX;
//         prevY = currY;
//         currX = e.clientX - canvas.getBoundingClientRect().left;
//         currY = e.clientY - canvas.getBoundingClientRect().top;

//         flag = true;
//         dot_flag = true;
//         if (dot_flag) {
//             ctx.beginPath();
//             ctx.fillStyle = x;
//             ctx.fillRect(currX, currY, 2, 2);
//             ctx.closePath();
//             dot_flag = false;
//         }
//     }
//     if (res == 'up' || res == "out") {
//         flag = false;
//     }
//     if (res == 'move') {
//         if (flag) {
//             prevX = currX;
//             prevY = currY;
//             currX = e.clientX - canvas.getBoundingClientRect().left;
//             currY = e.clientY - canvas.getBoundingClientRect().top;
//             draw();
//         }
//     }
// }



var canvas = new fabric.Canvas('main-canvas');

canvas.setHeight(0.9999999*window.innerHeight);
canvas.setWidth(0.999999*window.innerWidth)
// create a rectangle object
var rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: 'red',
    width: 20,
    height: 20
});
   
// "add" rectangle onto canvas
canvas.add(rect);