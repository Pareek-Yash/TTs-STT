# whisper_transcriber.py
# Module for handling audio transcription and audio gerneration.

import os
import torch
import whisper
from TTS.api import TTS

def transcribe_audio(file_path):
    """ Transcribe the audio file using the Whisper model. """
    torch.cuda.init()
    device = "cuda:1" if torch.cuda.is_available() else "cpu"

    model = whisper.load_model("base", device=device)
    result = model.transcribe(file_path)
    return result["text"]

def generate_audio(text, OUTPUT_FOLDER, filename):
    torch.cuda.init()
    device = "cuda:1" if torch.cuda.is_available() else "cpu"

    OUTPUT_PATH = os.path.join(OUTPUT_FOLDER, filename)

    # Init TTS with the target model name
    tts = TTS(model_name="tts_models/en/jenny/jenny", progress_bar=False).to(device)

    # Run TTS
    tts.tts_to_file(text=text, file_path=OUTPUT_PATH)

    return OUTPUT_PATH
