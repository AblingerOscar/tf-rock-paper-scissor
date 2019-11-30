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

import datetime

app = Flask(__name__)


def get_model():
    print(" * Loading Keras model...")
    global model
    model = keras.models.load_model("/tf/akt-model.h5")
    model.summary()
    print(" * Model loaded!")


def preprocess_image(image, target_size):
    image = image.resize(target_size)
    image = image.convert("L").convert("RGB")
    threshold = 80
    image = image.point(lambda p: p > threshold and 255)

    date_string = datetime.datetime.now().strftime("%Y-%m-%dT%H+%M+%SZ")
    image.save("debug_output/image__" + date_string + ".png")

    image = keras.preprocessing.image.img_to_array(image)
    image = np.expand_dims(image, axis=0)
    image = np.array(image).astype('float32') / 255

    return image


@app.route("/predict", methods=["POST"])
def predict():
    get_model()
    message = request.get_json(force=True)
    encoded = message['image']
    decoded = base64.b64decode(encoded)
    image = Image.open(io.BytesIO(decoded))
    processed_image = preprocess_image(image, target_size=(50, 50))

    prediction = model.predict(processed_image).tolist()

    response = {
        'prediction': {
            'rock': prediction[0][0],
            'paper': prediction[0][1],
            'scissors': prediction[0][2],
            'lizard': prediction[0][3],
            'spock': prediction[0][4]
        }
    }
    return jsonify(response)


# If we're running in stand alone mode, run the application
if __name__ == '__main__':
    app.run(port=8080, host="0.0.0.0")
