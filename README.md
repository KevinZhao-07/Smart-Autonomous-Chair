# 🤖 Smart Autonomous Chair

A real-time vision-guided robotics project integrating computer vision, embedded control, and custom mechanical hardware to enable human-following behavior.

---

## Overview

This project explores how camera-based perception can be integrated with embedded motor control to drive powered motion on an existing chair platform. The system detects and tracks a human target in real time and commands motor outputs accordingly, emphasizing safe operation and system stability.

---

## System Architecture

- **Perception**: Python + OpenCV and MediaPipe for real-time human detection and position estimation
- **Control**: Proportional control loop converting target position into motion commands
- **Embedded**: Arduino-based motor control driving high-current DC motors via IBT-2 motor drivers
- **Mechanical**: Custom CAD-designed, 3D-printed motor mounts integrated onto an existing chair frame

---

## Implementation Details

### Vision & Control
- Processes camera input to estimate relative target position
- Applies proportional control to compute speed and direction commands
- Implements speed limiting to maintain stable behavior

### Embedded System
- Receives serial commands from the vision pipeline
- Drives DC motors through IBT-2 drivers
- Enforces motion smoothing and safety limits

### Mechanical Design
- Designed and 3D-printed custom motor mounts
- Integrated motors without modifying the original chair structure

---

## Challenges

- Maintaining stable tracking under variable lighting conditions
- Synchronizing real-time vision processing with embedded actuation
- Managing torque and power constraints to avoid stalling or overheating
- Ensuring safe behavior during continuous operation

---

## Outcome

The project demonstrates an end-to-end robotics system combining perception, control, and hardware integration, emphasizing practical engineering tradeoffs and system reliability.
