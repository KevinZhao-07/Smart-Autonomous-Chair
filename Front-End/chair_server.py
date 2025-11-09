
import serial
import time
from flask import Flask, jsonify, request
import threading

# --- Configuration ---
# IMPORTANT: Replace 'COM7' with the correct serial port for your Arduino.
# On Windows, it might be 'COM3', 'COM4', 'COM7' etc.
# On Linux or macOS, it might be '/dev/ttyACM0', '/dev/ttyUSB0', etc.
SERIAL_PORT = 'COM7'
BAUD_RATE = 115200
# --- End Configuration ---

app = Flask(__name__)

# --- Serial Connection ---
# Global serial object
ser = None

def init_serial():
    """Initializes the serial connection."""
    global ser
    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        time.sleep(2)  # Wait for the connection to establish
        print(f"✅ Successfully connected to serial port {SERIAL_PORT}")
    except serial.SerialException as e:
        print(f"⚠️ Error connecting to serial port {SERIAL_PORT}: {e}")
        print("Continuing without serial connection. API calls will be logged but not sent.")
        ser = None

# Initialize serial connection in a separate thread to not block the server startup
threading.Thread(target=init_serial, daemon=True).start()

# Define the mapping from web commands to deltaX values
# Note: "backward" and "stop" are not truly supported by the current Arduino sketch.
# They are mapped to a deltaX of 0, which stops turning but maintains forward motion.
COMMAND_MAP = {
    "forward": "0",
    "backward": "0",  # Not supported, mapped to stop turning
    "left": "-200",
    "right": "200",
    "stop": "0",      # Not supported, mapped to stop turning
}

def send_command(command_val):
    """Sends a command string to the Arduino."""
    global ser
    if ser and ser.is_open:
        try:
            ser.write(f"{command_val}\n".encode())
            print(f"Sent command: {command_val}")
            return {"status": "success", "command": command_val}
        except serial.SerialException as e:
            print(f"Error during serial write: {e}")
            return {"status": "error", "message": str(e)}
    else:
        print(f"Serial not connected. Mock sending command: {command_val}")
        return {"status": "mock", "command": command_val}

@app.route('/move/<string:direction>', methods=['POST'])
def move_chair(direction):
    """API endpoint for manual chair movement from the web UI."""
    direction = direction.lower()
    if direction in COMMAND_MAP:
        command_to_send = COMMAND_MAP[direction]
        result = send_command(command_to_send)
        return jsonify(result)
    else:
        return jsonify({"status": "error", "message": "Unknown command"}), 400

@app.route('/tracker_update', methods=['POST'])
def tracker_update():
    """API endpoint for the tracker script to send delta_x updates."""
    data = request.get_json()
    if data and 'delta_x' in data:
        delta_x = data['delta_x']
        result = send_command(str(delta_x))
        return jsonify(result)
    else:
        return jsonify({"status": "error", "message": "Invalid data"}), 400

if __name__ == '__main__':
    # Runs the Flask server
    # host='0.0.0.0' makes the server accessible from other computers on your network
    app.run(host='0.0.0.0', port=5000, debug=True)
