async function app()
{
 // This code uses the mobilenet model to classify images from the webcam.
// It uses the webcam to capture an image, then uses the model to classify the image.
// The predictions are logged to the console.

  const webcamElement = document.getElementsByTagName('video')[0];
  const model = await mobilenet.load();

  const webcam = await tf.data.webcam(webcamElement);
  const captureButton = document.getElementsByTagName('button')[0];

  captureButton.onclick = async () =>
  {
    // Capture image from webcam
    const img = await webcam.capture();

    // Get predictions from model
    const predictions = await model.classify(img);

    console.log('Predictions: ', predictions);
    img.dispose();

  
    return predictions;
  }
}

app()