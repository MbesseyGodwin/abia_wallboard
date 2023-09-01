
from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
#from starlette.middleware.cors import CORSMiddleware
from app.api import api
import os

app = FastAPI(
    title='Abia Wallboard'
)

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/upload_csv/{directory}")
async def upload_csv_file(directory: str, file: UploadFile = UploadFile(...)):
    # Determine the file path within the custom directory
    file_path = os.path.join(directory, file.filename)
    
    # Save the uploaded file to the custom directory, overriding the file if it exists
    with open(file_path, "wb") as csv_file:
        contents = await file.read()
        csv_file.write(contents)
    
    return {"message": f"File '{file.filename}' uploaded to directory '{directory}'."}

@app.get("/api/wallboard/GetSpectrumModel")
def get_spectrum_model():
    return api.read_spectrum_model()

@app.get("/api/wallboard/GetStateVlcascade")
def get_state_vl_cascade():
    return api.read_state_vl_cascade()

@app.get("/api/wallboard/Getlgavlcascade")
def get_lga_vl_cascade():
    return api.read_lga_vl_cascade()

@app.get("/api/wallboard/GetNumberToReach")
def get_number_to_reach():
    return api.read_num_to_reach()

@app.get("/api/wallboard/GetTxNewByWeek")
def get_tx_new_by_week():
    return api.read_tx_new_by_week()

@app.get("/api/wallboard/GetQuarterPosToLinkage")
def get_quarter_pos_to_linkage():
    return api.read_quater_pos_to_linkage()

@app.get("/api/wallboard/GetAbiaMap")
def get_abia_map():
    return api.read_abia_map()

@app.get('/api/wallboard/GetRetention')
def get_abia_retention():
    return api.read_state_retention
