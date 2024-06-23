# PneumoScan-Xray

![PneumoScan-Xray](path-to-your-image.png)

## Introduction
PneumoScan-Xray is an Artificial Intelligence-powered application designed to detect pneumonia from X-ray images. The app utilizes a deep learning model based on Convolutional Neural Networks (CNN) and a K-Nearest Neighbors (KNN) model for cross-validation.

## Application URL
You can access the application at [http://zoidberg.vercel.app](zoidberg.vercel.app).

## Project Structure
The project is structured into two main parts:
- **Frontend**: A Next.js application located in the `frontend` folder.
- **Backend**: A Flask application located in the `backend` folder.

### Frontend
The frontend is built using Next.js, a powerful React framework that enables server-side rendering and static site generation. It provides a user-friendly interface for uploading X-ray images and displaying the results.

### Backend
The backend is powered by Flask, a lightweight WSGI web application framework in Python. It handles the processing of X-ray images, communicates with the machine learning models, and returns the results to the frontend.

### Models
The application uses two different models for detecting pneumonia:
- **CNN Model**: Built using Keras, this Convolutional Neural Network is trained to identify pneumonia in X-ray images.
- **KNN Model**: A K-Nearest Neighbors model (`knn.pkl`) used for cross-validation to ensure the accuracy and reliability of the predictions.

## How the App Works
1. **Upload X-ray Image**: Users can upload an X-ray image through the user interface.
2. **Image Processing**: The backend processes the uploaded image and feeds it into the CNN model.
3. **Prediction**: The CNN model analyzes the image and predicts whether pneumonia is present.
4. **Cross-Validation**: The KNN model cross-validates the result to ensure accuracy.
5. **Display Results**: The frontend displays the prediction results to the user.

## Installation and Setup
To run the application locally, follow these steps:

### Prerequisites
- Node.js
- Python
- pip

### Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
