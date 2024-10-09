# Reel Ready Set Designer Front-End

## Description

This is an Ionic project that handles the front-end of the Set Designers application for Reel Ready. 
The application only has one user and is a prototype. Users can find products, add projects, create product placements, and send and receive requests to use products on set.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 
- npm 
- Ionic CLI (to install type: npm install -g @ionic/cli)
- Gradle (For mobile simulation)
- A modern web browser 

## Installation

Follow these steps to install the project:

1. **Clone the repository:**

   ```bash
      git clone <repository-url>
   ```
2. **Navigate to the project directory:**

   ```bash
      cd <project-directory>
   ```
   
3. **Install the project dependencies:**
    ```bash
      npm install
   ```

## Running the Project

1. **Run the API:**
    
   Run the Backend API

2. **Run the application:**
    ```bash
      ionic serve
   ```

3. **Open your web browser and navigate to:**
    ```bash
      http://localhost:8100
   ```

You should see the application running in your browser. The web browser should also appear in the terminal.


## Test on android virtual machine

1. **Ensure Gradle is downloaded**
   Install at https://gradle.org/
2. **Install Android Studio**
   Install at https://developer.android.com/studio?gad_source=1&gclid=Cj0KCQjw05i4BhDiARIsAB_2wfAwqNwYxUMrvpFZ_Rx8yCDefwJydP3zBl90s5n3IHMB7lxlhpR9ssgaAkCPEALw_wcB&gclsrc=aw.ds
3. **Install android capacitor (if not installed)**
   ```bash
      npm install @capacitor/android
   ```
4. **Add the Android platform**
   ```bash
      npx cap add android
   ```
5. **Open in android studio by running**
   ```bash
      npx cap open android
   ```
6. **Run simulation**

   Command:
   ```bash
      npx cap run android
   ```
   Or run in android studio

## Test on ios virtual machine

Must require a mac (I don't have one so don't know if this will work)

1. **Install ios capacitor (if not installed)**
    ```bash
      npm install @capacitor/ios
   ```

2. **Test on ios virtual machine**       
    ```bash                             
      npx cap add ios           
   ```     
                                
3. **Open in Xcode**
    ```bash
      npx cap open ios
   ```     
   or 
   ```bash                          
      open ios/App/App.xcworkspace   
   ```          

4. **Run ios app**
    ```bash                             
      npx cap run ios      
   ```  
 
                        
              