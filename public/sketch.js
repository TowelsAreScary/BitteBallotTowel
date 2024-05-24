let database;

let currentLunch;
let score = 0;
let likeButton, dislikeButton;

let buttonColor = [229, 200, 247];

let scrapedText;

let fetchedScore = 0; 
let newScore; 

// let lunchArray= []
let lunchDisplayData = [];


function preload() {
    scrapedText = loadStrings('lunchMenu.txt');
}

function setup() {
    createCanvas(800, 600);

    database = firebase.database();
    currentLunch = scrapedText.join(' ')
    print(currentLunch)
  
    uploadTodaysLunch(currentLunch)
    getTodaysLunchScore(); 
  
    setupButtons();
    
  
}

function draw() {
    background(255); // Clear the background each frame or remove if you want static text
  
    textSize(16)
    text(currentLunch, 10, 10, 500);
  
  displayAllLunchEntries()
  
 for (let i = 0; i < 4; i++) {
    text(lunchDisplayData[i], 10, 200 + i * 60, 500); // Adjust x, y positions and width as needed
}

}


function displayAllLunchEntries() {
    const lunchesRef = firebase.database().ref('lunches');
    lunchesRef.once('value', (snapshot) => {
        if (snapshot.exists()) {
            const lunches = snapshot.val();
            const lunchArray = [];
            
            Object.keys(lunches).forEach(date => {
                const lunch = lunches[date];
                lunchArray.push(`${lunch.summary || "No summary provided"} - Score: ${lunch.score || 0}`);
            });

            lunchArray.sort((a, b) => {
                const scoreA = parseInt(a.split(" - Score: ")[1], 10);
                const scoreB = parseInt(b.split(" - Score: ")[1], 10);
                return scoreB - scoreA;
            });

            // Store the sorted data for display
            lunchDisplayData = lunchArray;
        } else {
            lunchDisplayData = ["No lunch entries found."];
        }
    }, (error) => {
        console.error('Error retrieving lunches:', error);
    });
}



function getTodaysLunchScore() {
  // Create a reference to the 'lunches' node in your Firebase database
  const lunchesRef = firebase.database().ref('lunches');

  // Get today's date in 'YYYY-MM-DD' format
  const today = new Date().toISOString().split('T')[0];
        
        

  // Retrieve the score for today's lunch
  lunchesRef.child(today).once('value', (snapshot) => {
    if (snapshot.exists() && snapshot.val().score !== undefined) {
      // Score exists, log it
      console.log('Today\'s lunch score:', snapshot.val().score);
      fetchedScore = snapshot.val().score;
      console.log("fetchedScore = "+fetchedScore)
    } else {
      // Score does not exist, set it to zero
      lunchesRef.child(today).update({
        score: 0
      }).then(() => {
        console.log('Score set to zero as it did not exist.');
  
      }).catch((error) => {
        console.error('Error updating score:', error);
      });
    }
  }, (error) => {
    console.error('Error retrieving lunch score:', error);
  });
}


function uploadTodaysLunch(todaysLunch) {
  // Create a reference to the 'lunches' node in your Firebase database
  const lunchesRef = firebase.database().ref('lunches');

  // Get today's date in 'YYYY-MM-DD' format
  const today = new Date().toISOString().split('T')[0];

  // Check if there is already an entry for today
  lunchesRef.child(today).once('value', (snapshot) => {
    if (snapshot.exists()) {
      console.log('Entry for today already exists.');
    } else {
      // No entry for today, let's create one
      lunchesRef.child(today).set({
        summary: todaysLunch
      }).then(() => {
        console.log('New lunch entry added.');
      }).catch((error) => {
        console.error('Error adding new lunch entry:', error);
      });
    }
  }, (error) => {
    console.error('Error checking the database:', error);
  });
}



function setupButtons() {
    likeButton = createButton('↑');
    setupButtonStyle(likeButton, 525, 12);

    dislikeButton = createButton('↓');
    setupButtonStyle(dislikeButton, 525, 44);

    likeButton.mousePressed(() => modifyScore(1));
    dislikeButton.mousePressed(() => modifyScore(-1));
}

function setupButtonStyle(button, x, y) {
    strokeWeight(2);
    button.position(x, y);
    button.style('border', '2px solid rgb(140, 57, 179)');
    button.style('background-color', `rgb(${buttonColor.join(',')})`);
    button.style('border-radius', '5px');
    button.style('font-size', '22px');
}



function modifyScore(change) {
    newScore = fetchedScore + change;  // Calculate the new score based on fetchedScore and the change
    console.log(newScore);                   // Log the new score
    removeButtons();                         // Assuming this function is defined elsewhere to manage UI updates

    // Create a reference to the 'lunches' node in your Firebase database
    const lunchesRef = firebase.database().ref('lunches');

    // Get today's date in 'YYYY-MM-DD' format
    const today = new Date().toISOString().split('T')[0];

    // Update the score for today's lunch in the database
    lunchesRef.child(today).update({
        score: newScore
    }).then(() => {
        console.log('Score updated in database to:', newScore);
    }).catch((error) => {
        console.error('Error updating score:', error);
    });
}


function removeButtons() {
    likeButton.remove();
    dislikeButton.remove();
    fill(0);
    textSize(16);
    text(newScore, 525, 28);
}


