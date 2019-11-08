#! python3

import base64
import numpy as np
import io

import tensorflow as tf
from tensorflow import keras

from PIL import Image
from flask import request
from flask import jsonify
from flask import Flask

app = Flask(__name__)


def get_model():
    print(" * Loading Keras model...")
    global model
    model = keras.models.load_model("/tf/akt-model.h5")
    model.summary()
    print(" * Model loaded!")


def preprocess_image(image, target_size):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size)
    image = keras.preprocessing.image.img_to_array(image)
    image = np.expand_dims(image, axis=0)
    image = np.array(image).astype('float32')/255

    return image


@app.route("/predict", methods=["POST"])
def predict():
    # CHECK
    get_model()
    message = request.get_json(force=True)
    encoded = message['image']
    decoded = base64.b64decode(encoded)
    image = Image.open(io.BytesIO(decoded))
    processed_image = preprocess_image(image, target_size=(200, 200))

    # CHECK
    # graph = tf.get_default_graph()
    # with graph.as_default():
    prediction = model.predict(processed_image).tolist()

    response = {
        'prediction': {
            'paper': prediction[0][0],
            'rock': prediction[0][1],
            'scissors': prediction[0][2]
        }
    }
    return jsonify(response)


# If we're running in stand alone mode, run the application
if __name__ == '__main__':
    # CHECK
    # get_model()
    app.run(port=8080, host="0.0.0.0")
