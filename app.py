#!/home/remotessh/miniconda3/envs/testenv/bin/python
# -*-coding:utf-8 -*-
'''
@File    :   app.py
@Modified:   2024/01/24 17:25:21
@Author  :   Yash Pareek 
@Version :   1.0
@Contact :   yashpareek.workmail@gmail.com
@License :   MIT
@Desc    :   None
'''

# app.py
# Improved version with best practices and professional standards

import os
import logging
from datetime import datetime
from flask import Flask, render_template, request, jsonify
from whisper_transcriber import transcribe_audio, generate_audio
from utils import create_directory_if_not_exists
from config import UPLOAD_FOLDER, OUTPUT_FOLDER, SSL_CONTEXT, HOST, PORT

import logging

logging.basicConfig(filename='logs/ui-error.log',
                    level=logging.ERROR,
                    format='%(asctime)s - %(levelname)s - %(message)s')

# Initialize Flask application
app = Flask(__name__)

app.logger.setLevel(logging.ERROR)
logging.getLogger('werkzeug').setLevel(logging.ERROR)

@app.route('/')
def index():
    """ Render the main page. """
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    """ Handle the audio file upload and transcription. """
    if 'audio_data' not in request.files:
        return 'No file part', 400

    file = request.files['audio_data']

    if file:
        timestamp = datetime.now().strftime("%Y-%m-%d-%H:%M:%S")
        filename = f'recording-{timestamp}.wav'
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        create_directory_if_not_exists(UPLOAD_FOLDER)
        create_directory_if_not_exists(OUTPUT_FOLDER)
        file.save(file_path)

        try:
            transcript = transcribe_audio(file_path)
            
            # Audio generation (assuming generate_audio returns the filename)
            audio_output_filename = generate_audio(transcript, OUTPUT_FOLDER, filename)

            # Return both transcript and audio file name
            return jsonify(transcript=transcript, audio_filename=audio_output_filename)
        except Exception as e:
            # Log the error for debugging
            logging.error(f"Error during transcription: {e}", exc_info=True)
            return "Error processing the audio file", 500

if __name__ == '__main__':
    app.run(host=HOST, port=PORT, debug=False)
