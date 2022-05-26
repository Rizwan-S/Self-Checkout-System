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


int price = 0;
char enter = '0';


void setup()
{ 
 
 // Debug console
 Serial.begin(9600);
// connect to wifi.
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
 Firebase.setInt("Current/due", 0);
 }
 enter = '0';
}
void loop()
{  
  if(enter != '0' && enter != '1')
  {
    enter = '0';
  }
  
  if (enter == '0'){
    Serial.println("Press 1 if you wish to enter the bill : ");
    enter = Serial.read();
    
    
    price = 0;
  }
  
  if(enter == '1')
  {
      
      
      //Serial.println("Enter the item code : ");    
      
      char code = Serial.read();
          
          if(code == '1' || code == '2' || code == '3' || code == '4' || code == '0'){ 
            if(code == '1'){
              price += 10;
              Firebase.pushInt("Prod/Ids", 1);
            }
            else if (code == '2'){
              price += 20;
              Firebase.pushInt("Prod/Ids", 2);
            }
            else if (code == '3'){
              price += 30;
              Firebase.pushInt("Prod/Ids", 3);
            }
            else if (code == '4'){
              price += 40;
              Firebase.pushInt("Prod/Ids", 4);
            }
                        
            
            Firebase.setInt("Current/due", price);
            //
            //Serial.println("Total amount = " + Firebase.getInt("Current/due"));
            Serial.print("Price = ");
            Serial.println(price);
            Serial.println("Enter the item code : "); 
            if(code == '0'){
              Serial.println("Thank you for shopping!");
              //Firebase.push("products/arrs", productId);
              
              enter = '0';
              delay(2000);
            }
            yield(); 
            
          
       }
       
       
       
    
  }
  //yield();
  //Serial.println("Reached here");
  //delay(5000);
    
}
