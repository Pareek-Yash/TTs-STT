# TTs-STT

## Installation

```cli
pip install requirements.txt
```

## Usage

Runs app.py as a falsk app.
```cli
python app.py
```

App runs on port 5000. \
Change port from config.py

## Information before use

First run requires whisper STT to download models. \
Visit [Whisper docs](https://github.com/openai/whisper) for more info.

View all TTS models here:
```
! tts --list_models
```
Download tts models in python.
```python
tts = TTS(model_name="tts_models/en/jenny/jenny", progress_bar=False)
```

Make sure Browser enables use of mic and audio ports.