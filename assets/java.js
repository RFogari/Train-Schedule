/* HTML
Grid for displaying train schedule.
Grid for entering new train data.
Updating the train schedule based on the user entry.
linking train database to firebase for live updates.
Train time schedules
*/

var timeNow = moment().format('MMMM Do YYYY, h:mm:ss a');


//function for generating current time in header - mainly for show.
function currentTime(){

    var timeNow = moment().format('MMMM Do YYYY, h:mm:ss a');
    
    $(".currentTime").append("<p>");

    $(".currentTime").text("Current Time: " + timeNow);
    

};


//refresh clock at the top of the HTML
setInterval(currentTime, 1000);



//console to record first time the webpage is loaded.
console.log("The current time now is: "+ timeNow);

//load the clock at the page load

currentTime();




  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDgVujVWQZkVjOevX-Ck7z3sMfMKrlCxMs",
    authDomain: "trainschedule-ee86a.firebaseapp.com",
    databaseURL: "https://trainschedule-ee86a.firebaseio.com",
    projectId: "trainschedule-ee86a",
    storageBucket: "trainschedule-ee86a.appspot.com",
    messagingSenderId: "1046253199065"
  };
  firebase.initializeApp(config);

  var database = firebase.database();



  var name = "";
  var destination = "";
  var frequency = "";
  var time = "";

  //adding train to schedule

  $("#submitNewTrain").on("click", function(event) {

    //prevent page refresh
    event.preventDefault();


  
    name = $("#trainName").val().trim();
    destination = $("#trainDestination").val().trim();
    frequency = $("#trainFrequency").val().trim();
    time = $("#trainTime").val().trim();

    
    //Firebase push taking the user entered data and pushing it to firebase for tracking

    database.ref().push({

        Train_Name: name,
        Train_Destination: destination,
        Train_First_Time: time,
        Train_Frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP


    });

    //console log for new trains added
    console.log("Train Name: " + name);
    console.log("Train Destination" + destination);
    console.log("Train Frequency: " + frequency);
    console.log("First Train Time: " + time);

    //reset the new train form fields after the submit button has been clicked.
    $("#trainName").val("");
    $("#trainDestination").val("");
    $("#trainFrequency").val("");
    $("#trainTime").val("");

  })

  database.ref().on("child_added", function(childSnapshot, prevChildKey){

        tableTrainName = childSnapshot.val().Train_Name;
        tableTrainDestination = childSnapshot.val().Train_Destination;
        tableTrainFrequency = childSnapshot.val().Train_Frequency;
        tableTrainTime = childSnapshot.val().Train_First_Time;

        
        console.log("__________________"+
          "Firebase Train Name: " + tableTrainName + "____________________");
        console.log("Firebase Train Destination: " + tableTrainDestination);
        
        
        //converting the user entered new train first train time - setting it back one year
        var firstTimeConverted = moment(tableTrainTime, "hh:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        //difference between first train time and the current time
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("the difference in time is: " + moment(diffTime).format("hh:mm"));

      //time appart
      var tRemainder = diffTime % tableTrainFrequency;
      console.log(tRemainder);

      //minutes until next train
      var minutesTillNext = tableTrainFrequency - tRemainder;
      console.log("Minutes until the next train: " + minutesTillNext);


      //the next train will be in () minutes
      var nextTrain = moment().add(minutesTillNext, "minutes").format("hh:mm a");
      console.log("The next train arriving at: " + moment(nextTrain).format("hh:mm a"));

        $("#trainScheduleList > tbody").append("<tr><td>"+ tableTrainName + "</td><td>" + tableTrainDestination + "</td><td>" + tableTrainFrequency + "</td><td>" + nextTrain  + "</td><td>" + minutesTillNext+"</td></tr>");
       

  })