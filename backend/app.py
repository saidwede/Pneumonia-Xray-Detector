from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Api
import tensorflow as tf
import numpy as np
import pickle
import requests
import os


app = Flask(__name__)
CORS(app)
api = Api(app)

# URLs for the models hosted on GitHub
cnn_model_url = "https://raw.githubusercontent.com/saidwede/Pneumonia-Xray-Detector/main/models/model_final.keras"
knn_model_url = "https://raw.githubusercontent.com/saidwede/Pneumonia-Xray-Detector/main/models/knn.pkl"

# Local paths where the models will be saved (relative to current working directory)
cnn_model_path = "./models/model_final.keras"
knn_model_path = "./models/knn.pkl"

# Function to download models
def download_model(url, local_path):
    response = requests.get(url)
    response.raise_for_status()
    with open(local_path, 'wb') as file:
        file.write(response.content)

# Ensure the models directory exists
os.makedirs("./models", exist_ok=True)

# Download the models if they don't exist locally
if not os.path.exists(cnn_model_path):
    download_model(cnn_model_url, cnn_model_path)
if not os.path.exists(knn_model_path):
    download_model(knn_model_url, knn_model_path)


# Load Model
cnn_model = tf.keras.models.load_model(cnn_model_path)

with open(knn_model_path, 'rb') as file:
    knn_model = pickle.load(file)


# Routing
@app.route('/')
def index():
    return 'Welcome to T-DEV-810'


@app.route('/predict-with-cnn', methods=['POST'])
def predict_with_cnn():
    try:
        # Vérifier si le fichier est présent dans la requête
        if 'image' not in request.files:
            return jsonify({'error': 'No file part'})

        # Lire l'image envoyée dans la requête POST
        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({'error': 'No selected file'})

        image = tf.io.decode_image(image_file.read(), channels=1)
        image = tf.image.resize(image, [256, 256])
        image = tf.expand_dims(image, 0)

        # Make a prediction
        predictions = cnn_model.predict(image)
        predicted_class = np.argmax(predictions, 1)[0]

        # Return result
        if int(predicted_class) == 0:
            return jsonify({'predicted_class': 'NORMAL'})
        else:
            return jsonify({'predicted_class': 'PNEUMONIA'})
    except Exception as e:
        return jsonify({'error': str(e)})


@app.route('/predict-with-knn', methods=['POST'])
def predict_with_knn():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No file part'})

        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({'error': 'No selected file'})

        image = tf.io.decode_image(image_file.read(), channels=1)
        image = tf.image.resize(image, [256, 256])
        image = tf.expand_dims(image, 0)

        image = tf.reshape(image, [image.shape[0], -1])

        predictions = knn_model.predict(image)
        predicted_class = predictions[0]

        if int(predicted_class) == 0:
            return jsonify({'predicted_class': 'NORMAL'})
        else:
            return jsonify({'predicted_class': 'PNEUMONIA'})
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=True)
