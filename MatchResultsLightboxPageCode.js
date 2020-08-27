import wixUsers from 'wix-users';
import wixData from 'wix-data';
import {session} from 'wix-storage';
import wixWindow from 'wix-window';
import wixLocation from 'wix-location';

let user = wixUsers.currentUser;
let userId = user.id;

function checkMatchingTimes(timesA, timesB){
    if(timesA === "Always" || timesB === "Always"){return true;}
    for(let i = 0; i < timesA.length; i++){
        for(let j = 0; j < timesB.length; j++){
            let dayA = timesA[i].split(' ')[0];
            let dayB = timesB[i].split(' ')[0];
            if(dayA === dayB){
                let minutesA = parseInt(timesA[0].split(' ')[1].split(':')[0], 10) * 60 +  parseInt(timesA[0].split(' ')[1].split(':')[1], 10);
                let minutesB = parseInt(timesB[0].split(' ')[1].split(':')[0], 10) * 60 +  parseInt(timesB[0].split(' ')[1].split(':')[1], 10);
                if (minutesA + 30 >= minutesB || minutesA - 30 <= minutesB){ // if times are within 30 minutes of each other
                    return true;
                }
            }
        }
    }
    return false;
}

$w.onReady(function () {
    let slider1 = 0;let slider2 = 0;let slider3 = 0;let slider4 = 0;let slider5 = 0;let slider6 = 0;let slider7 = 0;let slider8 = 0;let slider9 = 0;
    let bestSubjects = [];let times = [];
    let availableAsTutor = true;let availableAsTutee = true;let availableAsPartner = true;
    let grade = 0;let matchSubject = "";let matchLevel = "";let honors = false;
    let schoolEmailEnding = "";
    let approved = [];
    wixData.query("MemberQuestions").eq('userId', userId).find().then((results) => {
        slider1 = results.items[0]['#slider1'];
        slider2 = results.items[0]['#slider2'];
        slider3 = results.items[0]['#slider3'];
        slider4 = results.items[0]['#slider4'];
        slider5 = results.items[0]['#slider5'];
        slider6 = results.items[0]['#slider6'];
        slider7 = results.items[0]['#slider7'];
        slider8 = results.items[0]['#slider8'];
        slider9 = results.items[0]['#slider9'];
        bestSubjects = results.items[0]['bestSubjects'];
        times = results.items[0]['times'];
        availableAsTutor = results.items[0]['availableAsTutor'];
        availableAsTutee = results.items[0]['availableAsTutee'];
        availableAsPartner = results.items[0]['availableAsPartner'];
        grade = results.items[0]['grade'];
        matchSubject = results.items[0]['matchSubject'];
        matchLevel = results.items[0]['matchLevel'];
        honors = results.items[0]['honors'];
        schoolEmailEnding = results.items[0]['schoolEmailEnding'];
        approved = results.items[0]['approved'];
    if(session.getItem('buttonPressed') === 'Find me a tutor'){
        wixData.query("MemberQuestions").ne('userId', userId).eq('schoolEmailEnding', schoolEmailEnding).eq('availableAsTutor', true).contains('approved', matchSubject).ge('grade', grade).find().then((results2) => {
            let matchIds = {};
            for (let i = 0; i < results2.length; i++){
                if(checkMatchingTimes(results2.items[i].times, times)){
                    var score = 50;

                    //Calculate score
                    let mslider1 = results2.items[i]['#slider1'];
                    let mslider2 = results2.items[i]['#slider2'];
                    let mslider3 = results2.items[i]['#slider3'];
                    let mslider4 = results2.items[i]['#slider4'];
                    let mslider5 = results2.items[i]['#slider5'];
                    let mslider6 = results2.items[i]['#slider6'];
                    let mslider7 = results2.items[i]['#slider7'];
                    let mslider8 = results2.items[i]['#slider8'];
                    let mslider9 = results2.items[i]['#slider9'];
                    let mbestSubjects = results2.items[i]['bestSubjects'];

                    if(mbestSubjects[0] === matchSubject || mbestSubjects[1] === matchSubject || mbestSubjects[2] === matchSubject){score += 20;}
                    score += 10.0 / (Math.abs(mslider1 - slider1) + 1);
                    score += 10.0 / (Math.abs(mslider2 - slider2) + 1);
                    score += 10.0 / (Math.abs(mslider3 - slider3) + 1);
                    score += 10.0 / (Math.abs(mslider4 - slider4) + 1);
                    score += 10.0 / (Math.abs(mslider5 - slider5) + 1);
                    score += 10.0 / (Math.abs(mslider6 - slider6) + 1);
                    score += 10.0 / (Math.abs(mslider7 - slider7) + 1);
                    score += 10.0 / (Math.abs(mslider8 - slider8) + 1);
                    score += 10.0 / (Math.abs(mslider9 - slider9) + 1);

                    //save score
                    matchIds[results2.items[i].userId] = Math.round(score);
                }
            }
            //sort
            var sortedMatches = Object.keys(matchIds).map(function(key) {
                return [key, matchIds[key]];
            });

            //display in table
            let entries = [];
            for (let i = 0; i < sortedMatches.length; i++){
                wixData.query("MembersDataList").eq('id', sortedMatches[i][0]).find().then((usersData) => {
                    let name = usersData.items[0].userEmail.split('@')[0];
                    entries.push({'name' : name, 'matchScore' : sortedMatches[i][1], 'id' : usersData.items[0].id});
                    $w('#table1').rows = entries;

                    let rows = $w('#table1').rows;
                    rows.sort(function(first, second){
                        return second.matchScore - first.matchScore;
                    });
                    $w('#table1').rows = rows;
                });
            }
        });
    } else if (session.getItem('buttonPressed') === "Find me someone to tutor" && approved.indexOf(matchSubject) >= 0 && approved !== null){
        wixData.query("MemberQuestions").ne('userId', userId).eq('schoolEmailEnding', schoolEmailEnding).eq('availableAsTutee', true).le('grade', grade).eq('matchSubject', matchSubject).find().then((results2) => {
            let matchIds = {};
            for (let i = 0; i < results2.length; i++){
                if(checkMatchingTimes(results2.items[i].times, times)){
                    var score = 50;

                    //Calculate score
                    let mslider1 = results2.items[i]['#slider1'];
                    let mslider2 = results2.items[i]['#slider2'];
                    let mslider3 = results2.items[i]['#slider3'];
                    let mslider4 = results2.items[i]['#slider4'];
                    let mslider5 = results2.items[i]['#slider5'];
                    let mslider6 = results2.items[i]['#slider6'];
                    let mslider7 = results2.items[i]['#slider7'];
                    let mslider8 = results2.items[i]['#slider8'];
                    let mslider9 = results2.items[i]['#slider9'];

                    score += 10.0 / (Math.abs(mslider1 - slider1) + 1);
                    score += 10.0 / (Math.abs(mslider2 - slider2) + 1);
                    score += 10.0 / (Math.abs(mslider3 - slider3) + 1);
                    score += 10.0 / (Math.abs(mslider4 - slider4) + 1);
                    score += 10.0 / (Math.abs(mslider5 - slider5) + 1);
                    score += 10.0 / (Math.abs(mslider6 - slider6) + 1);
                    score += 10.0 / (Math.abs(mslider7 - slider7) + 1);
                    score += 10.0 / (Math.abs(mslider8 - slider8) + 1);
                    score += 10.0 / (Math.abs(mslider9 - slider9) + 1);

                    //save score
                    matchIds[results2.items[i].userId] = Math.round(score);
                }
            }
            //sort
            var sortedMatches = Object.keys(matchIds).map(function(key) {
                return [key, matchIds[key]];
            });

            //display in table
            let entries = [];
            for (let i = 0; i < sortedMatches.length; i++){
                wixData.query("MembersDataList").eq('id', sortedMatches[i][0]).find().then((usersData) => {
                    let name = usersData.items[0].userEmail.split('@')[0];
                    entries.push({'name' : name, 'matchScore' : sortedMatches[i][1], 'id' : usersData.items[0].id});
                    $w('#table1').rows = entries;

                    let rows = $w('#table1').rows;
                    rows.sort(function(first, second){
                        return second.matchScore - first.matchScore;
                    });
                    $w('#table1').rows = rows;
                });
            }
        });

    } else if(session.getItem('buttonPressed') === "Find me a study partner") {
        wixData.query("MemberQuestions").ne('userId', userId).eq('schoolEmailEnding', schoolEmailEnding).eq('availableAsPartner', true).eq('grade', grade).eq('matchSubject', matchSubject).find().then((results2) => {
            let matchIds = {};
            for (let i = 0; i < results2.length; i++){
                if(checkMatchingTimes(results2.items[i].times, times)){
                    var score = 50;

                    //Calculate score
                    let mslider1 = results2.items[i]['#slider1'];
                    let mslider2 = results2.items[i]['#slider2'];
                    let mslider3 = results2.items[i]['#slider3'];
                    let mslider4 = results2.items[i]['#slider4'];
                    let mslider5 = results2.items[i]['#slider5'];
                    let mslider6 = results2.items[i]['#slider6'];
                    let mslider7 = results2.items[i]['#slider7'];
                    let mslider8 = results2.items[i]['#slider8'];
                    let mslider9 = results2.items[i]['#slider9'];
                    let mbestSubjects = results2.items[i]['bestSubjects'];

                    if(mbestSubjects[0] === bestSubjects[0] || mbestSubjects[1] === bestSubjects[0] || mbestSubjects[2] === bestSubjects[0] || mbestSubjects[0] === bestSubjects[1] || mbestSubjects[1] === bestSubjects[1] || mbestSubjects[2] === bestSubjects[1] || mbestSubjects[0] === bestSubjects[2] || mbestSubjects[1] === bestSubjects[2] || mbestSubjects[2] === bestSubjects[2]){score += 20;}
                    score += 10.0 / (Math.abs(mslider1 - slider1) + 1);
                    score += 10.0 / (Math.abs(mslider2 - slider2) + 1);
                    score += 10.0 / (Math.abs(mslider3 - slider3) + 1);
                    score += 10.0 / (Math.abs(mslider4 - slider4) + 1);
                    score += 10.0 / (Math.abs(mslider5 - slider5) + 1);
                    score += 10.0 / (Math.abs(mslider6 - slider6) + 1);
                    score += 10.0 / (Math.abs(mslider7 - slider7) + 1);
                    score += 10.0 / (Math.abs(mslider8 - slider8) + 1);
                    score += 10.0 / (Math.abs(mslider9 - slider9) + 1);

                    //save score
                    matchIds[results2.items[i].userId] = Math.round(score);
                }
            }
            //sort
            var sortedMatches = Object.keys(matchIds).map(function(key) {
                return [key, matchIds[key]];
            });

            //display in table
            let entries = [];
            for (let i = 0; i < sortedMatches.length; i++){
                wixData.query("MembersDataList").eq('id', sortedMatches[i][0]).find().then((usersData) => {
                    let name = usersData.items[0].userEmail.split('@')[0];
                    entries.push({'name' : name, 'matchScore' : sortedMatches[i][1], 'id' : usersData.items[0].id});
                    $w('#table1').rows = entries;

                    let rows = $w('#table1').rows;
                    rows.sort(function(first, second){
                        return second.matchScore - first.matchScore;
                    });
                    $w('#table1').rows = rows;
                });
            }
        });
    }
    $w('#table1').onRowSelect((rowEvent) => {
        let id = rowEvent.rowData.id;
        if (id !== undefined){
            wixLocation.to("/profile-1/" + id + "/profile");
        }
    });

    });
});
