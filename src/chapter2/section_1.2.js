'use strict';

const tf = require('@tensorflow/tfjs-node');
const logger = require('../../lib/logger');

// first array
const arrayA = tf.tensor([1, 2, 3]);
// second array
const arrayB = tf.tensor([5, 6, 7]);

// combine them
const arrayCombined = tf.add(arrayA, arrayB);
logger.withFields({ arrayCombined: arrayCombined.arraySync() }).message('Added arrays');

// dispose and clear tensor memory
arrayCombined.dispose();


// Creates a single-dimensional tensor with the values 1 through 6
// and then logs the tensor to the console.
const singleArray = tf.tensor([1, 2, 3, 4, 5, 6]);
logger.withFields({ singleArray }).message('single array');



const tensorInt32 = tf.tensor([[1, 2], [4, 5]], [2,2], "int32");
logger.withFields({ tensorInt32 }).message('tensor int32'); 



// both are the same as second part of the code is just a shorthand
const arrayTensorA = tf.tensor([ [ 1, 2, 3 ], [ 4, 5, 6 ] ])
const arrayTensorB = tf.tensor([1, 2, 3, 4, 5, 6], [2, 3])

logger.withFields({ arrayTensorA, arrayTensorB }).message('Both tensors are equal');



const tensorA = tf.tensor([1, 2, 3]);
const tensorB = tf.tensor([5, 6, 7])
const tensorCombined = tf.add(tensorA, tensorB);


// combined tensor
logger.withFields({ tensorCombined: tensorCombined.arraySync() }).message('Added tensors');


// dispose and clear tensor memory

tensorCombined.dispose();


