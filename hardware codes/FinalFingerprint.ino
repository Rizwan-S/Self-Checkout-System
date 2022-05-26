// Credits to techno e-solution

#include <ESP8266WiFi.h>
#include <SoftwareSerial.h>
#include <FirebaseArduino.h>
#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
 
// Set these to run example.
//#define FIREBASE_HOST "fingerprints-db-default-rtdb.firebaseio.com"
//#define FIREBASE_AUTH "d7sLwySguOku6ekfbvmrLsx8IHMhUMHIEX9QGCO4"
#define FIREBASE_HOST "iotprojectbillingstore-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "bnuRlvC7dyuI5l8pwhg1dwp7rYgbH9PaoByMRZTq"
#define WIFI_SSID "Argonath" //provide ssid (wifi name)
#define WIFI_PASSWORD "MilanNotWorking" //wifi password
#include <Adafruit_Fingerprint.h>

// On Leonardo/Micro or others with hardware serial, use those! #0 is green wire, #1 is white
// uncomment this line:
// #define mySerial Serial1

// For UNO and others without hardware serial, we must use software serial...
// pin #2 is IN from sensor (GREEN wire)
// pin #3 is OUT from arduino  (WHITE wire)
// comment these two lines if using hardware seriala
SoftwareSerial mySerial(14, 12);

Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

uint8_t id;

void setup()  
{
  Serial.begin(9600);
  Serial.println("Reached here");
  while (!Serial);  // For Yun/Leo/Micro/Zero/...
  delay(100);
  Serial.println("\n\nAdafruit Fingerprint sensor enrollment");

  // set the data rate for the sensor serial port
  finger.begin(57600);
  
  if (finger.verifyPassword()) {
    Serial.println("Found fingerprint sensor!");
  } else {
    Serial.println("Did not find fingerprint sensor :(");
    while (1) { delay(1); }
  }
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
 Serial.print("connecting");
 while (WiFi.status() != WL_CONNECTED)
 {
 Serial.print(".");
 delay(500);
 }
 Serial.println();
 Serial.print("connected: ");
 Serial.println(WiFi.localIP());
 Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
 if(Firebase.failed())
 {
    Serial.print(Firebase.error());
 }
 else{
 
    Serial.print("Firebase Connected");
 }
}

uint8_t readnumber(void) {
  uint8_t num = 0;
  
  while (num == 0) {
    while (! Serial.available());
    num = Serial.parseInt();
  }
  return num;
}
char ctl = '0';
//int taken_ids[128] = {0};
void loop()                     // run over and over again
{

  ctl = Serial.read();

  if(ctl == '2'){
    int fingerprintID = getFingerprintIDez();
    Serial.print("Finger ID = ");
    Serial.println(fingerprintID);
    if(fingerprintID == -1){
      Serial.println("No Match Found!");
      
    }
    ctl = '0';
  }
  else if(ctl == '1') {
    Serial.println("Ready to enroll a fingerprint!");
    Serial.println("Please type in the ID # (from 1 to 127) you want to save this finger as...");
    id = readnumber();
    if (id == 0 ) {// ID #0 not allowed, try again!
       Serial.println("Invalid Id");
       return;
    }
    Serial.print("Enrolling ID #");
    Serial.println(id);
    int already_pres = finger.loadModel(id);
    if(already_pres == FINGERPRINT_OK){
      Serial.println("Fingerprint has already been registered!");
    }
    else {
  //  taken_ids[id] = 1;
      while (!  getFingerprintEnroll() );
    }
    ctl = '0';
  }
  else if(ctl == '3') {
    
      finger.emptyDatabase();   
      Serial.println("Stored fingerprints have been deleted!");
      ctl = '0'; 
  }
}

uint8_t getFingerprintEnroll() {

  int p = -1;
  Serial.print("Waiting for valid finger to enroll as #"); Serial.println(id);
  while (p != FINGERPRINT_OK) {
    delay(1000);
    p = finger.getImage();
    delay(1000);
    switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.println(".");
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      break;
    default:
      Serial.println("Unknown error");
      break;
    }
  }

  // OK success!

  p = finger.image2Tz(1);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }
  
  Serial.println("Remove finger");
  delay(2000);
  p = 0;
  while (p != FINGERPRINT_NOFINGER) {
    delay(1000);
    p = finger.getImage();
    delay(1000);
  }
  Serial.print("ID "); Serial.println(id);
  p = -1;
  Serial.println("Place same finger again");
  while (p != FINGERPRINT_OK) {
    delay(1000);
    p = finger.getImage();
    delay(1000);
    switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.print(".");
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      break;
    default:
      Serial.println("Unknown error");
      break;
    }
  }

  // OK success!

  p = finger.image2Tz(2);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }
  
  // OK converted!
  Serial.print("Creating model for #");  Serial.println(id);
  
  p = finger.createModel();
  if (p == FINGERPRINT_OK) {
    Serial.println("Prints matched!");
    
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_ENROLLMISMATCH) {
    Serial.println("Fingerprints did not match");
    return p;
  } else {
    Serial.println("Unknown error");
    return p;
  }   
  
  Serial.print("ID "); Serial.println(id);
  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK) {
    Serial.println("Stored!");
    
    Firebase.pushInt("Registered/Id", id);
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_BADLOCATION) {
    Serial.println("Could not store in that location");
    return p;
  } else if (p == FINGERPRINT_FLASHERR) {
    Serial.println("Error writing to flash");
    return p;
  } else {
    Serial.println("Unknown error");
    return p;
  }   
}

int getFingerprintIDez() {
  Serial.println("Scan finger for verification : ");
  int p = 0;
  while (p != FINGERPRINT_NOFINGER && p != FINGERPRINT_OK) {
    p = finger.getImage();
  }
  p = finger.image2Tz();
  p = finger.fingerFastSearch();
  for(int i = 0;i < 5;i++)
  {
    if (p == FINGERPRINT_OK) break;
    delay(1000);
    p = finger.getImage();
    delay(1000);
    p = finger.image2Tz();
    p = finger.fingerFastSearch();
    
  }
  

  if(p !=  FINGERPRINT_OK){
    return -1;
  }
  
  // found a match!
  Serial.print("Found ID #"); 
  Serial.print(finger.fingerID); 
  Serial.print(" with confidence of "); 
  Serial.println(finger.confidence);
  
  Firebase.pushInt("Registered/Id", finger.fingerID);
  return finger.fingerID; 
}
