import cv2
import numpy as np
import mediapipe as mp
import serial
import time
from threading import Thread
from queue import Queue
import asyncio
import websockets

# ---------------- Arduino Setup ----------------
arduino_port = 'COM7'
arduino_baud = 115200
arduino = None

try:
    arduino = serial.Serial(arduino_port, arduino_baud, timeout=1)
    time.sleep(2)
    print("✅ Arduino connected.")
except serial.SerialException:
    print("⚠️ Arduino not connected. Continuing without serial...")

# ---------------- Serial Writer Thread ----------------
delta_queue = Queue()

def serial_writer():
    """Send latest delta_x or command to Arduino asynchronously."""
    global arduino
    while True:
        if not delta_queue.empty() and arduino:
            value = delta_queue.get()
            try:
                arduino.write(f"{value}\n".encode())
            except serial.SerialException:
                print("⚠️ Serial write failed. Closing port.")
                arduino.close()
                arduino = None

Thread(target=serial_writer, daemon=True).start()

# ---------------- MediaPipe Setup ----------------
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# ---------------- Webcam Setup ----------------
cap = cv2.VideoCapture(1, cv2.CAP_DSHOW)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
cap.set(cv2.CAP_PROP_FPS, 30)

if not cap.isOpened():
    print("❌ Camera not available — stopping chair.")
    if arduino:
        delta_queue.put(9999)
    exit()

cv2.namedWindow("MediaPipe Chair Tracker", cv2.WINDOW_NORMAL)
cv2.moveWindow("MediaPipe Chair Tracker", 100, 100)

# ---------------- Command Codes ----------------
COMMAND_STOP = 0
COMMAND_SCAN = 2
COMMAND_TRACK = 1  # optional, just for clarity

# ---------------- Global Command ----------------
current_command = "stop"  # default; will be updated via WebSocket

# ---------------- WebSocket Server ----------------
async def ws_handler(websocket):
    global current_command
    async for message in websocket:
        if message in ["stop", "track", "scan"]:
            print(f"✅ Received command from UI: {message}")
            current_command = message
        else:
            print("❌ Unknown command:", message)

async def ws_server():
    async with websockets.serve(ws_handler, "0.0.0.0", 8765):
        print("🌐 WebSocket server started on port 8765")
        await asyncio.Future()  # run forever

# Run WebSocket server in background thread
def start_ws():
    asyncio.run(ws_server())

Thread(target=start_ws, daemon=True).start()

# ---------------- Main Loop ----------------
while True:
    ret, frame = cap.read()
    if not ret:
        continue

    height, width, _ = frame.shape
    cross_x = width // 2
    cross_y = height // 2

    command_to_send = None
    delta_x = 9999  # default stop value

    if current_command == "stop":
        command_to_send = COMMAND_STOP

    elif current_command == "scan":
        # simple scanning placeholder (e.g., rotate in place)
        command_to_send = COMMAND_SCAN

    elif current_command == "track":
        # MediaPipe tracking
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        try:
            results = pose.process(rgb_frame)
        except Exception as e:
            print("MediaPipe error:", e)
            command_to_send = COMMAND_STOP
        else:
            torso_points = []

            if results.pose_landmarks:
                landmarks = results.pose_landmarks.landmark
                torso_indices = [
                    mp_pose.PoseLandmark.LEFT_HIP,
                    mp_pose.PoseLandmark.RIGHT_HIP,
                    mp_pose.PoseLandmark.LEFT_SHOULDER,
                    mp_pose.PoseLandmark.RIGHT_SHOULDER
                ]

                for idx in torso_indices:
                    lm = landmarks[idx]
                    if lm.visibility > 0.5:
                        x_px = int(lm.x * width)
                        torso_points.append(x_px)

                if torso_points:
                    com_x = int(np.mean(torso_points))
                    delta_x = com_x - cross_x

            command_to_send = delta_x

    # ---------------- Send to Arduino ----------------
    if arduino is not None and command_to_send is not None:
        while not delta_queue.empty():
            delta_queue.get_nowait()
        delta_queue.put(command_to_send)

    # ---------------- Display ----------------
    display_frame = cv2.flip(frame, 1)  # visual mirror
    cv2.drawMarker(display_frame, (cross_x, cross_y), (0, 0, 255),
                   markerType=cv2.MARKER_CROSS, markerSize=20, thickness=2)

    # Draw torso points and COM
    if current_command == "track" and results.pose_landmarks:
        for idx in torso_indices:
            lm = results.pose_landmarks.landmark[idx]
            if lm.visibility > 0.5:
                x_px = int(lm.x * width)
                y_px = int(lm.y * height)
                cv2.circle(display_frame, (width - x_px, y_px), 5, (0, 255, 0), -1)
        if torso_points:
            cv2.circle(display_frame, (width - com_x, height // 2), 8, (255, 0, 0), -1)

    # Display delta or command
    if command_to_send == COMMAND_STOP:
        text = "STOP"
        color = (0, 0, 255)
    elif command_to_send == COMMAND_SCAN:
        text = "SCAN"
        color = (0, 255, 255)
    else:
        text = f"Delta X: {command_to_send}"
        color = (255, 255, 255)

    cv2.putText(display_frame, text, (10, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

    cv2.imshow("MediaPipe Chair Tracker", display_frame)

    if cv2.waitKey(1) & 0xFF == 27:
        break

# ---------------- Cleanup ----------------
cap.release()
cv2.destroyAllWindows()
if arduino is not None:
    arduino.close()
