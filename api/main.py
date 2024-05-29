from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from PIL import Image
import numpy as np
import tensorflow as tf 

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       
    allow_credentials=True,      
    allow_methods=["*"],         
    allow_headers=["*"],         
)

# Load the TensorFlow SavedModel
MODEL_PATH = 'C:/Users/aryan/Desktop/Study/Project/Potato-class/saved_models/1/'
MODEL = tf.saved_model.load(MODEL_PATH)

# Define class names
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Read the uploaded image file
    image = read_file_as_image(await file.read())
    
    # Preprocess the image (e.g., resize, normalize)
    # You may need to adjust preprocessing based on your model's requirements
    
    # Expand dimensions to create a batch of size 1
    img_batch = np.expand_dims(image, axis=0)
    
    # Convert NumPy array to TensorFlow tensor
    img_tensor = tf.convert_to_tensor(img_batch, dtype=tf.float32)
    
    # Make prediction using the loaded model
    prediction = MODEL(img_tensor)
    
    # Convert prediction to class label
    predicted_class_index = np.argmax(prediction, axis=1)[0]
    predicted_class = CLASS_NAMES[predicted_class_index]

    return {"predicted_class": predicted_class}

if __name__ == "__main__":
    import uvicorn 
    uvicorn.run(app, host='localhost', port=8000)
