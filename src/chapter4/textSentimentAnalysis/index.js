async function app()
{

  const buttonElement = document.getElementById("analyzeButton")

  buttonElement.onclick = async () =>
  {
    const text = document.getElementById("text").value
    const resultElement = document.getElementById("result")
    // analyze the text and get the score from 0 to 1 (0 is negative, 1 is positive)
    const scoreAnalysis = await analyze(text)

    resultElement.innerText = `Sentiment score: ${getSentiment(scoreAnalysis)}`
  }
  

  const analyze = async (text) =>
  {
    const trimmedText = text.trim().toLowerCase().replace(/(\.|\,|\!)/g, "").split(" ")

    // extract model 
    const loadModel = async () =>
    {
      const model = await tf.loadLayersModel("https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json")
      return model
    }


    const loadModelMetaData = async () =>
    {
      // load model metadata to convert text to sequence of numbers 
      const response = await fetch("https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json")
      return await response.json()
    }

    // convert text to sequence based on the pre existing model metadata
    //  Example:
    //  [
    //    13, 2051, 6, 176, 39, 14, 740
    //  ]
    const sequence = await Promise.all(trimmedText.map(async (word) =>
    {
      const metaData = await loadModelMetaData();
      const wordIndex = metaData.word_index[word]
    
      // if word is not in the dictionary, return 2
      if (wordIndex === 'undefined' || wordIndex === null)
      {
        return 2
      }

      console.log({
        metaDataIndex: metaData.index_from,
        wordIndex: wordIndex || undefined,
        word
      })

      return wordIndex + metaData.index_from

    }))
    
    // pad sequence to 100 length with 0 if sequence is less than 100
    // truncate sequence to 100 length if sequence is more than 100
    //  Example:
    //   [
    //     0,  0,  0,   0, 0, 0, 0, 0, 0,  0,    0, 0,
    //     0,  0,  0,   0, 0, 0, 0, 0, 0,  0,    0, 0,
    //     0,  0,  0,   0, 0, 0, 0, 0, 0,  0,    0, 0,
    //     0,  0,  0,   0, 0, 0, 0, 0, 0,  0,    0, 0,
    //     0,  0,  0,   0, 0, 0, 0, 0, 0,  0,    0, 0,
    //     0,  0,  0,   0, 0, 0, 0, 0, 0,  0,    0, 0,
    //     0,  0,  0,   0, 0, 0, 0, 0, 0,  0,    0, 0,
    //     0,  0,  0,   0, 0, 0, 0, 0, 0, 13, 2051, 6,
    //   176, 39, 14, 740
    // ]
  
    const padSequence = (sequence, metaDataMaxLength) =>
    {

      if (sequence.length > metaDataMaxLength)
      {
        sequence.splice(0, sequence.length - metaDataMaxLength)
      }
      if (sequence.length < metaDataMaxLength)
      {
        const pad = []
        for (let i = 0; i < metaDataMaxLength - sequence.length; ++i)
        {
          pad.push(0)
        }

        sequence = pad.concat(sequence)
      }
      return sequence
    }

    // load model metadata 
    const metadata = await loadModelMetaData()

    const padSequenceResult = padSequence(sequence, metadata.max_len)
  
    console.log(sequence)
    console.log(padSequenceResult)
    console.log(padSequenceResult.length)

    const model = await loadModel()

    // convert sequence to tensor 
    const tfInput = tf.tensor2d([padSequenceResult], [1, metadata.max_len])
  
    const prediction = model.predict(tfInput)

    console.log(prediction)
    const score = prediction.dataSync()

    console.log("score", score[0])

    return score[0]
  }


  const getSentiment = (score) =>
  {
    // score is from 0 to 1 (0 is negative, 1 is positive) 
    if (score > 0.66)
    {
      return "Positive"
    }
    else if (score > 0.33)
    {
      return "Neutral"
    }
    else
    {
      return "Negative"
    }
  }
}

app()