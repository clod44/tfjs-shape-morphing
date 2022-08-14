

const ctxSize =  Math.min(Math.max(parseInt(document.getElementById("sldr-ctx-size").value), 16), 128);
//16x16 256  outputs
//32x32 1024 outputs
//64x64 4048 outputs

let model = tf.sequential();

const hiddenLayer1 = tf.layers.dense({
    inputShape: [4],    //input layer = [circleFactor, squareFactor, sizeFactor]
    units: Math.ceil(ctxSize*ctxSize*0.15),
    activation: "relu"
});

const hiddenLayer2 = tf.layers.dense({
    units: Math.ceil(ctxSize*ctxSize*0.5),
    activation: "relu"
});

const outputLayer = tf.layers.dense({
    units: ctxSize*ctxSize,
    activation: "sigmoid"
});


model.add(hiddenLayer1);
model.add(hiddenLayer2);
model.add(outputLayer);

model.compile({
    optimizer: tf.train.adam(0.01),
    loss: "meanSquaredError"
});


async function nnStartTraining(){
    const memInfo = document.getElementById("mem-info");
    console.log("training starting.");
    
    console.log("creating inputDatas and outputDatas...");
    const trainingData = createTrainingDatas(parseInt(document.getElementById("sldr-data-pool").value));
    const inputTensor = tf.tensor2d(trainingData[0]);
    const outputTensor = tf.tensor2d(trainingData[1]);

    console.log("training started...");
    const epochs = parseInt(document.getElementById("sldr-epochs").value);
    const history = await model.fit(inputTensor, outputTensor,{
        epochs: epochs,
        shuffle: true,
        callbacks: {
            onEpochEnd: async (epoch,logs) => {
                console.log("epoch: "+epoch+"/"+epochs+", loss: "+logs.loss);
                btnStartTraining.textContent = Math.ceil(epoch/epochs*100)+"% loss: "+round(logs.loss*10000)/10000.0;
                mem();
                memInfo.textContent = "memory allocated: "+Math.ceil(tf.memory().numBytes/1024.0/1024.0)+" mb";
                
            }
        }

    });
    inputTensor.dispose();
    outputTensor.dispose();
    console.log("training completed");
    memInfo.textContent = "";

    btnStartTraining.textContent = "Train More";
    btnStartTraining.disabled = false;
    mem();
}


function nnPredict(){
    tf.tidy(()=>{
        console.log("predicting...");
        const inputData = [
            parseFloat(document.getElementById("sldr-circle-factor").value),
            parseFloat(document.getElementById("sldr-square-factor").value),
            parseFloat(document.getElementById("sldr-triangle-factor").value),
            parseFloat(document.getElementById("sldr-size-factor").value)
        ];
        const inputTensor = tf.tensor2d([inputData]);
        const outputData = tf.tidy(()=>model.predict(inputTensor).dataSync());
        inputTensor.dispose();

        console.log(outputData)
        showOutput(outputData);


    });
    mem();
}


function mem(){
    console.log("memory allocated: "+Math.ceil(tf.memory().numBytes/1024.0/1024.0)+" mb");
}

