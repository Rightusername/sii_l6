var lineWidth = 15;
var dragging = false;
var canvas = document.getElementById('canvas');
var canSmall = document.getElementById('can-small');
var result = document.getElementById('result');
var noise = document.getElementById("noise");
var context = canvas.getContext("2d");
var smCtx = canSmall.getContext("2d");
var resCtx = result.getContext("2d");
var cfg = {height:30, width:30};
var sizeCanvas = 300;

var original;
var orCtx;


makeDroppable(document.body, (e)=>{
    console.log(e);
    var reader = new FileReader();
    reader.onload = function (e) {
        console.log(e.target.result);
        
        var image = new Image();
        image.onload = function() {
            context.drawImage(image, 0, 0,sizeCanvas,sizeCanvas);
            smallCanvas();
            copyCanvas();
        };
        image.src = e.target.result;

        };
    reader.readAsDataURL(e[0]);

})




$(function(){
    var url = "http://localhost:3000/"

    
    smCtx.webkitImageSmoothingEnabled = false;
    smCtx.mozImageSmoothingEnabled = false;
    smCtx.imageSmoothingEnabled = false; /// future


    $.get( "settings", function( data ) {
        data = JSON.parse( data );
        canSmall.setAttribute('width', data.width);
        canSmall.setAttribute('height', data.height);
        result.setAttribute('width', data.width);
        result.setAttribute('height', data.height);
        cfg.height = data.height;
        cfg.width = data.width;
        smCtx.scale(data.width/sizeCanvas,data.height/sizeCanvas);
        smCtx.drawImage(canvas,0,0);
        resCtx.scale(data.width/sizeCanvas,data.height/sizeCanvas);
    });


    canvas.addEventListener("mousemove", putPoint, false);
    canvas.addEventListener("mousedown", engage, false);
    canvas.addEventListener("mouseup", disengage, false);

    function putPixel(pixels){
        let x = Math.floor(Math.random()*cfg.width);
        let y = Math.floor(Math.random()*cfg.height);
        if( (x > cfg.width) ){
            x = cfg.width;
        }

        if(y > cfg.height){
            y = cfg.height;
        }

        let contain = false;
        for(let j = 0; j < pixels.length; j++){
            if(pixels[j].x == x && pixels[j].y == y){
                contain = true;
            }
        }

        if(contain){
            return putPixel(pixels);
        } else {
            pixels.push({x:x,y:y});
            return {x:x, y:y};
        }
    }

    noise.addEventListener("change", (e)=>{
        $('#noise-label').html('Noise ' + e.target.value + " %");
        console.log(original);
        smCtx.putImageData(original, 0, 0);

        

        //smCtx = orCtx;
        //canSmall = original;
        let p = cfg.width*cfg.height/100*e.target.value;
        let ink = 0;
        let pixels = [];
        
        for (var i = 0; i < p; i++) {
            let cords = putPixel(pixels);
            let x = cords.x;
            let y = cords.y;

            if(smCtx.getImageData(x, y, 1, 1).data[3] < 255 || !(smCtx.getImageData(x, y, 1, 1).data[3] > 30 && smCtx.getImageData(x, y, 1, 1).data[2] < 5 && smCtx.getImageData(x, y, 1, 1).data[1] <5 && smCtx.getImageData(x, y, 1, 1).data[0] <5 ) ){
                smCtx.fillStyle = "rgb(0,0,0)";
                ink++;
                smCtx.fillRect(x/smCtx.canvas.width*sizeCanvas,y/smCtx.canvas.height*sizeCanvas, sizeCanvas/smCtx.canvas.height, sizeCanvas/smCtx.canvas.width);
            }else{
                smCtx.fillStyle = "rgb(255,255,255)";
                ink++;
                smCtx.fillRect(x/smCtx.canvas.width*sizeCanvas,y/smCtx.canvas.height*sizeCanvas, sizeCanvas/smCtx.canvas.height, sizeCanvas/smCtx.canvas.width);
            }
            
        }


        // for (var i = 0; i < smCtx.canvas.height; i++) {
        //     for (var j = 0; j < smCtx.canvas.width; j++) {
        //         data = smCtx.getImageData(j, i, 1, 1).data;
        //         //console.log(data);
        //         if(Math.random()*100/1000000 <= e.target.value/1000000 ){
        //            // if(data[3] < 255){
        //             if(data[3] < 255 || !(smCtx.getImageData(j, i, 1, 1).data[3] > 30 && smCtx.getImageData(j, i, 1, 1).data[2] < 5 && smCtx.getImageData(j, i, 1, 1).data[1] <5 && smCtx.getImageData(j, i, 1, 1).data[0] <5 ) ){
        //                 smCtx.fillStyle = "rgb(0,0,0)";
        //                 ink++;
        //                 smCtx.fillRect(j/smCtx.canvas.width*sizeCanvas,i/smCtx.canvas.height*sizeCanvas, sizeCanvas/smCtx.canvas.height, sizeCanvas/smCtx.canvas.width);
        //             }else{
        //                 smCtx.fillStyle = "rgb(255,255,255)";
        //                 ink++;
        //                 smCtx.fillRect(j/smCtx.canvas.width*sizeCanvas,i/smCtx.canvas.height*sizeCanvas, sizeCanvas/smCtx.canvas.height, sizeCanvas/smCtx.canvas.width);
        //             }
        //         }
        //     }
            
        // }



        // console.log("in line " + line);
        // let ink = 0;

        // for (var i = 0; i < smCtx.canvas.height; i++) {
        //     for (var j = Math.floor(Math.random() ); j < smCtx.canvas.width; j+=cfg.width/line) {
        //         data = smCtx.getImageData(j, i, 1, 1).data;
        //         if(data[3] < 255 || !(smCtx.getImageData(j, i, 1, 1).data[3] > 30 && smCtx.getImageData(j, i, 1, 1).data[2] < 5 && smCtx.getImageData(j, i, 1, 1).data[1] <5 && smCtx.getImageData(j, i, 1, 1).data[0] <5 ) ){
        //             smCtx.fillStyle = "rgb(0,0,0)";
        //             ink++;
        //             smCtx.fillRect(j/smCtx.canvas.width*sizeCanvas,i/smCtx.canvas.height*sizeCanvas, sizeCanvas/smCtx.canvas.height, sizeCanvas/smCtx.canvas.width);
        //         }else{
        //             smCtx.fillStyle = "rgb(255,255,255)";
        //             ink++;
        //             smCtx.fillRect(j/smCtx.canvas.width*sizeCanvas,i/smCtx.canvas.height*sizeCanvas, sizeCanvas/smCtx.canvas.height, sizeCanvas/smCtx.canvas.width);
        //         }
        //     }
        // }

        console.log("pixels " + ink);
        sendCanvas();
    });

    context.lineWidth = lineWidth*2;


    function engage(e){
        dragging = true;
        putPoint(e);
    }


    function disengage(e){
        dragging = false;
        context.beginPath();
        smallCanvas();
        copyCanvas();
    }

    function putPoint(e){
        if(!dragging) return;
        context.lineTo(e.offsetX, e.offsetY);
        context.stroke();
        context.beginPath();
        context.arc(e.offsetX, e.offsetY, lineWidth, 0, Math.PI*2);
        context.fill();
        context.beginPath();
        context.moveTo(e.offsetX, e.offsetY);
    }
    
});


function smallCanvas(){

    smCtx.drawImage(canvas,0,0);
    sendCanvas();
}

function sendCanvas(){
    $.ajax({
        type: "POST",
        url: "canvas",
        data: "canvas=" + JSON.stringify( convertCanvas() ),
        success : (dataFromServer) =>{
            //if(dataFromServer == null)
            drawResult(dataFromServer);
        }
    });        
}

function copyCanvas(){
    var img  = smCtx.getImageData(0,0,smCtx.canvas.width, smCtx.canvas.height);
    // for (var i = 0; i <= img.data.length; i++ ){
    //     img.data[i] = 255;
    // }

    // for (var i = 0, k = 0; i < smCtx.canvas.height; i++) {
    //     for (var j = 0; j < smCtx.canvas.width; j++,k+=4) {
    //         var data = smCtx.getImageData(j, i, 1, 1).data;
    //         console.log(data);
    //         if(data[3] > 250){
    //             img.data[k] = 255;
    //             img.data[k+1] = 255;
    //             img.data[k+2] = 255;
    //             img.data[k+3] = 255;
    //             console.log('da');
    //         } else {
    //             img.data[k] = 0;
    //             img.data[k+1] = 0;
    //             img.data[k+2] = 0;
    //             img.data[k+3] = 0;
    //             console.log('net');
    //         }
            
    //     }
        
    //  }

    original = img;
    //orCtx.drawImage(smallCanvas,0,0);
    console.log("copy");
    console.log(img);
}

function drawResult(ar){

    for (var i = 0, a = 0; i < cfg.width; i++) {
        for (var j = 0; j < cfg.height; j++, a++) {
            if(ar[a] == -1){
                resCtx.fillStyle = "#FFFFFF";
                resCtx.fillRect(j/resCtx.canvas.width*sizeCanvas,i/resCtx.canvas.height*sizeCanvas, sizeCanvas/resCtx.canvas.height, sizeCanvas/resCtx.canvas.width);
            }else{
                resCtx.fillStyle = "#000000";
                resCtx.fillRect(j/resCtx.canvas.width*sizeCanvas,i/resCtx.canvas.height*sizeCanvas, sizeCanvas/resCtx.canvas.height, sizeCanvas/resCtx.canvas.width);
            }
            
        }
        
    }
}


function convertCanvas(){
    var ar = [];
    for (var i = 0; i < smCtx.canvas.width; i++) {
        for (var j = 0; j < smCtx.canvas.height; j++) {
            if( smCtx.getImageData(j, i, 1, 1).data[3] > 30 && smCtx.getImageData(j, i, 1, 1).data[2] < 5 && smCtx.getImageData(j, i, 1, 1).data[1] <5 && smCtx.getImageData(j, i, 1, 1).data[0] <5  ){
                ar.push( 1 );
            } else {
                ar.push( -1 );
            }
        }
    }
    return ar;
}



function clearCanvas(){
    //context.clearRect(0,0,300,300);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    //console.log(smCtx.canvas.width, smCtx.canvas.height);
    //smallCanvas();
    $('#answer').html('');
    var img = smCtx.createImageData(smCtx.canvas.width, smCtx.canvas.height);
    for (var i = img.data.length; --i >= 0; )
      img.data[i] = 0;
      smCtx.putImageData(img, 0, 0);
}


function makeDroppable(element, callback) {
    
      var input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('multiple', true);
      input.style.display = 'none';
    
      input.addEventListener('change', triggerCallback);
      element.appendChild(input);
      
      element.addEventListener('dragover', function(e) {
        e.preventDefault();
        //e.stopPropagation();
        element.classList.add('dragover');
      });
    
      element.addEventListener('dragleave', function(e) {
        e.preventDefault();
        //e.stopPropagation();
        element.classList.remove('dragover');
      });
    
      element.addEventListener('drop', function(e) {
        e.preventDefault();
        //e.stopPropagation();
        element.classList.remove('dragover');
        triggerCallback(e);
      });
      
      
    //   element.addEventListener('click', function() {
    //     input.value = null;
    //     input.click();
    //   });
    
      function triggerCallback(e) {
        var files;
        if(e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if(e.target) {
          files = e.target.files;
        }
        callback.call(null, files);
      }
    }