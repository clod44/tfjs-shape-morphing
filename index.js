


function changeCanvasSmooth(val){

    if(val){
        smooth();
    }else{
        noSmooth();
    }
}
const chckboxSmooth = document.getElementById("chckbox-smooth");
chckboxSmooth.addEventListener("click",()=>{
    changeCanvasSmooth(chckboxSmooth.checked);
});
let c;
let ctx;
let sw;
function setup(){
    const canvasHolder = document.getElementById("canvas-holder");
    c = createCanvas(canvasHolder.clientWidth, canvasHolder.clientHeight);
    c.parent("canvas-holder");
    background(0);
    changeCanvasSmooth(chckboxSmooth.checked);
    
}

let ctxSizeAssigned = false;
function draw(){
    if(ctxSize && !ctxSizeAssigned){
        ctxSizeAssigned = true;
        console.log("s");
        ctx = createGraphics(ctxSize,ctxSize);
        sw = ctx.width*0.1;
        ctx.noSmooth();
        ctx.background(0);
        ctx.loadPixels();
        drawCircle(1);
    }
    
    if(ctxSize > 0 || ctxSizeAssigned){
     
    background(0);
    push();
    translate(width*0.5, height*0.5);
    const ctxSize = min(width, height)*0.5;
    image(ctx,-ctxSize,-ctxSize,ctxSize*2,ctxSize*2);
    pop();

    //debugMouseFollow();

   
    }
}

function debugMouseFollow(){

    const col = ctx.get(
        constrain(floor(mouseX/width*ctx.width),0,ctx.width),
        constrain(floor(mouseY/height*ctx.height),0,ctx.height)
    );
    stroke(0);
    strokeWeight(2);
    textSize(20);
    fill(255);
    text("color: "+red(col), mouseX+20, mouseY+20);
}


function drawCircle(sizeMult=parseFloat(document.getElementById("sldr-size-factor").value)){
    const ellipseSize = min(ctx.width*0.7,ctx.height*0.7)*sizeMult;
    ctx.background(0);
    ctx.stroke(255);
    ctx.strokeWeight(sw);
    ctx.noFill();
    //ctx.noStroke();
    //ctx.fill(255);
    ctx.ellipse(ctx.width*0.5, ctx.height*0.5, ellipseSize, ellipseSize);
}

function drawSquare(sizeMult=parseFloat(document.getElementById("sldr-size-factor").value)){
    const squareSize = min(ctx.width*0.7,ctx.height*0.7)*sizeMult;
    ctx.background(0);
    ctx.stroke(255);
    ctx.strokeWeight(sw);
    ctx.noFill();

    //ctx.noStroke();
    //ctx.fill(255);
    ctx.rectMode(CENTER);
    ctx.rect(ctx.width*0.5, ctx.height*0.5, squareSize, squareSize);
}

function drawTriangle(sizeMult=parseFloat(document.getElementById("sldr-size-factor").value)){
    const triangleSize = min(ctx.width*0.3,ctx.height*0.3)*sizeMult;
    ctx.background(0);
    ctx.stroke(255);
    ctx.strokeWeight(sw);
    ctx.noFill();

    //ctx.noStroke();
    //ctx.fill(255);
    ctx.push();
    ctx.translate(ctx.width*0.5, ctx.height*0.5);
    ctx.triangle( 
        -triangleSize, triangleSize, 
        triangleSize, triangleSize, 
        0, -triangleSize);
    ctx.pop();
}

function createTrainingDatas(N){
    //[inputDataArray, outputDataArray]
    //inputDataArray = [[aFactor, bFactor, ..., sizeFactor], ...]
    //outputDataArray = [[pixel0Col, pixel1Col, ...], ...]
    const data = [[],[]];


    for (let i = 0; i < N; i++) {
        //case: circle
        const r1 = random(0.1,1.0);
        data[0].push([1.0, 0.0, 0.0, r1]);
        drawCircle(r1);
        data[1].push(getCanvasData());

        //case square
        const r2 = random(0.1,1.0);
        data[0].push([0.0, 1.0, 0.0, r2]);
        drawSquare(r2);
        data[1].push(getCanvasData());

        //case triangle
        const r3 = random(0.1,1.0);
        data[0].push([0.0, 0.0, 1.0, r3]);
        drawTriangle(r3);
        data[1].push(getCanvasData());
        /*
        //case: nothing
        const r3 = random(0.1,1.0);
        ctx.background(0);
        data[0].push([0.0, 0.0, r3]);
        data[1].push(getCanvasData());
        */
    }

    return data;
}

function getCanvasData(){
    ctx.loadPixels();
    
    const data = [];
    /*
    ctx.pixels[0] = pixel 0's red value
    ctx.pixels[1] = pixel 0's green value
    ctx.pixels[2] = pixel 0's blue value
    ctx.pixels[3] = pixel 0's alpha value
    ctx.pixels[4] = pixel 1's red value
    ...
    */

    //assuming the canvas is black and white
    for (let i = 0; i < ctx.pixels.length; i+=4) {
        data.push(ctx.pixels[i]/255.0);    
    }
    return data;
}

function showOutput(data){
    ctx.loadPixels();
    for (let i = 0; i < data.length; i++) {
        const val = abs(data[i])*255;
        ctx.pixels[i*4] = val;
        ctx.pixels[i*4+1] = val;
        ctx.pixels[i*4+2] = val;
        ctx.pixels[i*4+3] = 255;
    }
    ctx.updatePixels();
}


const btnPredict = document.getElementById("btn-predict");
btnPredict.addEventListener("click",()=>{
    nnPredict();
});

const chckboxAutoPredict = document.getElementById("chckbox-auto-predict");
chckboxAutoPredict.addEventListener("click",()=>{
    if(chckboxAutoPredict.checked){
        btnPredict.style.display = "none";
    }else{
        btnPredict.style.display = "inline";
    }
});
if(chckboxAutoPredict.checked){
    btnPredict.style.display = "none";
}else{
    btnPredict.style.display = "inline";
}

const btnDrawCircle = document.getElementById("btn-draw-circle");
btnDrawCircle.addEventListener("click", ()=>{
    drawCircle();
});

const btnDrawSquare = document.getElementById("btn-draw-square");
btnDrawSquare.addEventListener("click", ()=>{
    drawSquare();
});

const btnDrawTriangle = document.getElementById("btn-draw-triangle");
btnDrawTriangle.addEventListener("click", ()=>{
    drawTriangle();
});

const btnStartTraining = document.getElementById("btn-start-training");
btnStartTraining.addEventListener("click", ()=>{
    btnStartTraining.disabled = true;
    btnStartTraining.textContent = "Training is Starting";
    nnStartTraining();
});


const sldrCtxSize = document.getElementById("sldr-ctx-size");
const sldrCtxSizeValue = document.getElementById("sldr-ctx-size-value");
sldrCtxSize.addEventListener("change",()=>{
    sldrCtxSizeValue.textContent = sldrCtxSize.value;
});
sldrCtxSizeValue.textContent = sldrCtxSize.value;

const sldrCircleFactor = document.getElementById("sldr-circle-factor");
const sldrCircleFactorValue = document.getElementById("sldr-circle-factor-value");
sldrCircleFactor.addEventListener("change",()=>{
    sldrCircleFactorValue.textContent = sldrCircleFactor.value;
    if(chckboxAutoPredict.checked){
        nnPredict();
    }
});
sldrCircleFactorValue.textContent = sldrCircleFactor.value;

const sldrSquareFactor = document.getElementById("sldr-square-factor");
const sldrSquareFactorValue = document.getElementById("sldr-square-factor-value");
sldrSquareFactor.addEventListener("change",()=>{
    sldrSquareFactorValue.textContent = sldrSquareFactor.value;
    if(chckboxAutoPredict.checked){
        nnPredict();
    }
});
sldrSquareFactorValue.textContent = sldrSquareFactor.value;

const sldrTriangleFactor = document.getElementById("sldr-triangle-factor");
const sldrTriangleFactorValue = document.getElementById("sldr-triangle-factor-value");
sldrTriangleFactor.addEventListener("change",()=>{
    sldrTriangleFactorValue.textContent = sldrTriangleFactor.value;
    if(chckboxAutoPredict.checked){
        nnPredict();
    }
});
sldrTriangleFactorValue.textContent = sldrTriangleFactor.value;

const sldrSizeFactor = document.getElementById("sldr-size-factor");
const sldrSizeFactorValue = document.getElementById("sldr-size-factor-value");
sldrSizeFactor.addEventListener("change",()=>{
    sldrSizeFactorValue.textContent = sldrSizeFactor.value;
    if(chckboxAutoPredict.checked){
        nnPredict();
    }
});
sldrSizeFactorValue.textContent = sldrSizeFactor.value;



const sldrEpochs = document.getElementById("sldr-epochs");
const sldrEpochsValue = document.getElementById("sldr-epochs-value");
sldrEpochs.addEventListener("change",()=>{
    sldrEpochsValue.textContent = sldrEpochs.value;
});
sldrEpochsValue.textContent = sldrEpochs.value;

const sldrDataPool = document.getElementById("sldr-data-pool");
const sldrDataPoolValue = document.getElementById("sldr-data-pool-value");
sldrDataPool.addEventListener("change",()=>{
    sldrDataPoolValue.textContent = sldrDataPool.value;
});
sldrDataPoolValue.textContent = sldrDataPool.value;

const btnDownloadModel = document.getElementById("btn-download-model");
btnDownloadModel.addEventListener("click", async ()=>{
    const d = new Date();
    const saveResult = await model.save(`downloads://tsfjs_shape_morphing_model_canvas${ctxSize}_${d.getTime()}`, {
        includeOptimizer: true
    });
});

const btnUploadModel = document.getElementById("btn-upload-model");
btnUploadModel.addEventListener("click", async ()=>{

    const uploadJSONInput = document.getElementById('file-upload-json');
    const uploadWeightsInput = document.getElementById('file-upload-weights');
    //model = await tf.loadModel(tf.io.browserFiles(
    //    [uploadJSONInput.files[0], uploadWeightsInput.files[0]]));
    try {
        model = await tf.loadLayersModel(tf.io.browserFiles([uploadJSONInput.files[0],uploadWeightsInput.files[0]]));
        model.compile({
            optimizer: tf.train.adam(0.01),
            loss: "meanSquaredError"
        });
    } catch (error) {
        alert(error+"\n\nMake sure you pick the correct files. files must be in the same directory");
        console.log(error)
    }

    //model = await tf.loadLayersModel('http://model-server.domain/download/model.json');
});

const btnSaveImage = document.getElementById("btn-save-image");
btnSaveImage.addEventListener("click", ()=>{
    //create a temporary square canvas
    const p = createGraphics(min(width,height),min(width,height));
    p.background(0);
    if(chckboxSmooth.checked){
        p.smooth();
    }else{
        p.noSmooth();
    }
    p.image(ctx,0,0,p.width,p.height);
    window.open(p.canvas.toDataURL(), '_blank');
});
