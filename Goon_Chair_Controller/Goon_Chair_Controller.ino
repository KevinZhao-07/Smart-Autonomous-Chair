// -------------------- Motor pins --------------------
const int leftForward  = 11;
const int leftReverse  = 10;
const int rightForward = 9;
const int rightReverse = 8;

// -------------------- Constants --------------------
const int MAX_SPEED = 200;
const float kP = 0.5;            // proportional gain for X-centering
const int DEFAULT_FORWARD = 150;  // default forward speed
const int DEADZONE = 10;          // pixels

// Ultrasonic pins
const int trigPin = 6;
const int echoPin = 7;
const int STOP_DISTANCE_CM = 20; // stop if closer than 20cm

// -------------------- Motor state --------------------
int currentLeft  = 0;
int currentRight = 0;
int targetLeft   = 0;
int targetRight  = 0;

unsigned long lastRampTime = 0;
const unsigned long rampInterval = 20; // ms per step

// -------------------- Setup --------------------
void setup() {
  pinMode(leftForward, OUTPUT);
  pinMode(leftReverse, OUTPUT);
  pinMode(rightForward, OUTPUT);
  pinMode(rightReverse, OUTPUT);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  analogWrite(leftForward, 0);
  analogWrite(leftReverse, 0);
  analogWrite(rightForward, 0);
  analogWrite(rightReverse, 0);

  Serial.begin(9600);  // for receiving deltaX from PC
}

// -------------------- Motor update / ramping --------------------
void updateMotors() {
  unsigned long now = millis();
  if(now - lastRampTime >= rampInterval){
    lastRampTime = now;

    if(currentLeft < targetLeft) currentLeft++;
    else if(currentLeft > targetLeft) currentLeft--;

    if(currentRight < targetRight) currentRight++;
    else if(currentRight > targetRight) currentRight--;

    setMotorPWM(leftForward, leftReverse, currentLeft);
    setMotorPWM(rightForward, rightReverse, currentRight);
  }
}

// -------------------- Helper --------------------
void setMotorPWM(int forwardPin, int reversePin, int speed){
  speed = constrain(speed, -MAX_SPEED, MAX_SPEED);
  if(speed >= 0){
    analogWrite(forwardPin, speed);
    analogWrite(reversePin, 0);
  } else {
    analogWrite(forwardPin, 0);
    analogWrite(reversePin, -speed);
  }
}

// -------------------- Ultrasonic --------------------
long readUltrasonicCM() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000); // timeout 30ms
  long distance = duration * 0.034 / 2;          // cm
  return distance;
}

// -------------------- Track function --------------------
void track(int deltaX) {
  // Read ultrasonic distance
  long distance = readUltrasonicCM();
  if(distance > 0 && distance < STOP_DISTANCE_CM){
    // Too close -> stop
    targetLeft = 0;
    targetRight = 0;
    return;
  }

  // Deadzone: person is centered
  if(abs(deltaX) < DEADZONE) {
    targetLeft  = DEFAULT_FORWARD;
    targetRight = DEFAULT_FORWARD;
    return;
  }

  // Adjust motor speed proportionally
  int adjustment = int(kP * deltaX);

  targetLeft  = constrain(DEFAULT_FORWARD - adjustment, -MAX_SPEED, MAX_SPEED);
  targetRight = constrain(DEFAULT_FORWARD + adjustment, -MAX_SPEED, MAX_SPEED);
}

// -------------------- Main loop --------------------
void loop() {
  if(Serial.available() > 0) {
    int deltaX = Serial.parseInt();
    track(deltaX);
  }

  updateMotors();
}
