from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from PIL import Image
import io

app = FastAPI()

# CORS (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models ONCE
face_model = pipeline("image-classification", model="trpakov/vit-face-expression")
text_model = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base")

@app.get("/")
def home():
    return {"message": "Backend running"}

@app.post("/face-emotion")
async def face_emotion(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    result = face_model(image)[0]

    return {
        "emotion": result["label"],
        "confidence": result["score"]
    }

@app.post("/text-emotion")
def text_emotion(text: str):
    result = text_model(text)[0]

    return {
        "emotion": result["label"],
        "confidence": result["score"]
    }