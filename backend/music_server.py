from fastapi import FastAPI
import subprocess
import platform
import threading

app = FastAPI()
current_process = None
lock = threading.Lock()

def play_file(file_path):
    global current_process
    system = platform.system()
    with lock:
        # Stop current music
        if current_process:
            stop_music()
        if system == "Windows":
            current_process = subprocess.Popen(["powershell", "-c", f"Start-Process '{file_path}'"])
        elif system == "Darwin":
            current_process = subprocess.Popen(["afplay", file_path])
        else:
            current_process = subprocess.Popen(["mpg123", file_path])

def stop_music():
    global current_process
    system = platform.system()
    with lock:
        if current_process:
            if system == "Windows":
                subprocess.call(["taskkill", "/IM", "powershell.exe", "/F"])
            elif system == "Darwin":
                subprocess.call(["killall", "afplay"])
            else:
                subprocess.call(["killall", "mpg123"])
            current_process = None

# API endpoints
@app.post("/play")
def play_song(song: str):
    threading.Thread(target=play_file, args=(song,)).start()
    return {"status": "playing", "song": song}

@app.post("/stop")
def stop_song():
    stop_music()
    return {"status": "stopped"}
