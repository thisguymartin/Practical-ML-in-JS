
async function app()
{

  // pull all elements from the DOM 
  const webcamElement = document.getElementsByTagName('video')[0];
  const predictButton = document.getElementsByClassName('predict')[0];
  const predictParagraph = document.getElementsByClassName('prediction')[0];

  // pull all the capture buttons from the DOM
  const captureSection = document.querySelector('.buttons-def');
  const captureButton = captureSection.getElementsByTagName('button')

  // load the model and webcam
  const classifier = knnClassifier.create()
  const net = await mobilenet.load()
  const webcam = await tf.data.webcam(webcamElement);

  // add event listeners to the capture buttons 
  // and the predict button 
  for (let index = 0; index < captureButton.length; index++)
  {
    if (captureButton[index] !== predictButton)
    {
      captureButton[index].onclick = () => addExample(index)
    }
  }

  // add event listener to the predict button 
  predictButton.onclick = async () => runPredictions()

  const runPredictions = async () =>
  {
    // while the predict button is clicked it will continue to run
    while (true)
    {
      if (classifier.getNumClasses() > 0)
      {
        const img = await webcam.capture();
        const activation = net.infer(img, 'conv_preds');

        // Get the most likely class and confidences from the classifier module. 
        // The higher the classId the more likely it is the class prediction.
        const result = await classifier.predictClass(activation);

        predictParagraph.innerText = `
          prediction: ${result.label}\n
          probability: ${result.confidences[result.label]}
        `

        img.dispose();

      }

      // Give some breathing room by waiting for the next animation frame to fire.
      // This is not required since predictClass() is async and returns a promise.
      await tf.nextFrame();
    }
  }


  const addExample = async (classId) =>
  {
    console.log("start addExample", classId)
    // Capture image from webcam
    const img = await webcam.capture();

    // Get predictions from model
    const activation = await net.infer(img, 'conv_preds');

    // Add example to classifier
    classifier.addExample(activation, classId);

    // Dispose the tensor to release the memory.
    img.dispose();
    console.log("done addExample", classId)

  }


}



app()
