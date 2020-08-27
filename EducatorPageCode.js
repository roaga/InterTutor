import wixData from 'wix-data';
import wixUsers from 'wix-users';
import {session} from 'wix-storage';
import wixWindow from 'wix-window';

let user = wixUsers.currentUser;
let teacherId = user.id
let teacherEmail = ""; 
wixData.query("MembersDataList").eq('id', teacherId).find().then((usersData) => {
	teacherEmail = usersData.items[0].userEmail;
	let emailEnding = teacherEmail.split('@')[1];
	wixData.query("CourseLists").eq('emailEnding', emailEnding).find().then((courseResults) => {
		let courseList = courseResults.items[0]['courses'];
		$w("#dropdown5").options = JSON.parse(courseList);
	});
});

$w.onReady(function () {
	$w('#text93').hide();

});

export function button1_click(event) {
	let email = $w('#input2').value;
	wixData.query("MembersDataList").eq('id', teacherId).find().then((usersData) => {
	teacherEmail = usersData.items[0].userEmail;
	let emailEnding = teacherEmail.split('@')[1];
	wixData.query("CourseLists").eq('emailEnding', emailEnding).find().then((courseResults) => {
		let studentEnding = courseResults.items[0]["emailEnding"];
		if(email.split("@")[1] === studentEnding){ 
			wixData.query("ApprovedTutors")
				.eq("schoolEmail", email)
				.find()
				.then((results) => {
					let subject = "";
					if($w('#switch4').checked){
						subject = $w('#dropdown5').value + '-HONORS';
					} else{
						subject = $w('#dropdown5').value;
					}
					if(results.length === 0){
						let subjects = [];
						subjects.push(subject);
						console.log(subjects)
						wixData.insert("ApprovedTutors", {'schoolEmail': email, 'subjects': subjects})
						updateUsers(email, subjects);
					} else {
						let subjects = results.items[0].subjects;
						let toUpdate = results.items[0];
						subjects.push(subject);
						toUpdate['subjects'] = subjects;
						wixData.update("ApprovedTutors", toUpdate);
						updateUsers(email, subjects);
					}
				});
		}
	});
	});
	$w('#text93').show("FadeIn");
	setTimeout(function() {
		$w("#text93").hide("FadeOut"); 
	}, 2000);
}

export function button2_click(event) {
	let email = $w('#input2').value; 
	wixData.query("MembersDataList").eq('id', teacherId).find().then((usersData) => {
	teacherEmail = usersData.items[0].userEmail;
	let emailEnding = teacherEmail.split('@')[1];
	wixData.query("CourseLists").eq('emailEnding', emailEnding).find().then((courseResults) => {
		let studentEnding = courseResults.items[0]["emailEnding"];
		if(email.split("@")[1] === studentEnding){ 
		wixData.query("ApprovedTutors")
			.eq("schoolEmail", email)
			.find()
			.then((results) => {
				let subjects = results.items[0].subjects;
				let subject = "";
				if($w('#switch4').checked){
					subject = $w('#dropdown5').value + '-HONORS';
				} else{
					subject = $w('#dropdown5').value;
				}
				for(var i = subjects.length - 1; i >= 0; i--) {
					if(subjects[i] === subject) {
						subjects.splice(i, 1);
					}
				}
				let toUpdate = results.items[0];
				toUpdate['subjects'] = subjects;
				wixData.update("ApprovedTutors", toUpdate);
				updateUsers(email, subjects);
			});
		}
	});
	});
	$w('#text93').show("FadeIn");
	setTimeout(function() {
		$w("#text93").hide("FadeOut"); 
	}, 2000);
}

function updateUsers(email, approvedSubjects){
	wixData.query("MemberQuestions")
		.eq("schoolEmail", email)
		.find()
		.then((results) => {
			for(let i = 0; i < results.length; i++){
				let toUpdate = results.items[i]
				toUpdate['approved'] = approvedSubjects;
				wixData.update("MemberQuestions", toUpdate);
			}
		});
}

export function button3_click(event) {
	let subject = "";
	if($w('#switch4').checked){
		subject = $w('#dropdown5').value + '-HONORS';
	} else{
		subject = $w('#dropdown5').value;
	}
	session.setItem("Showing All Tutors", subject);
    wixWindow.openLightbox("Available Tutors");
}
