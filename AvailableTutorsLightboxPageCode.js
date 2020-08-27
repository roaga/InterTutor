import wixData from 'wix-data';
import wixUsers from 'wix-users';
import {session} from 'wix-storage';
import wixLocation from 'wix-location';

let user = wixUsers.currentUser;
let teacherId = user.id
let teacherEmail = ""; 
// user.getEmail().then((email) => {
//       teacherEmail = email;     
//  } );
wixData.query("MembersDataList").eq('id', teacherId).find().then((usersData) => {
	teacherEmail = usersData.items[0].userEmail;
	let emailEnding = teacherEmail.split('@')[1];

	let course = session.getItem('Showing All Tutors');
	wixData.query("CourseLists").eq('emailEnding', emailEnding).find().then((courseResults) => {
			let studentEnding = courseResults.items[0]["emailEnding"];
			wixData.query("MemberQuestions").eq("schoolEmailEnding", studentEnding).eq("availableAsTutor", true).contains("approved", course).find().then((results) => {
				let ids = [];
				for(let i = 0; i < results.items.length; i++){
					ids.push(results.items[i].userId);
				}
				let entries = [];
				for (let i = 0; i < ids.length; i++){
					wixData.query("MembersDataList").eq('id', ids[i]).find().then((data) => {
						let name = data.items[0].userEmail.split('@')[0];
						entries.push({'name' : name, 'id' : data.items[0].id});
						$w('#table1').rows = entries;
					});
            }
			});
	});

});

$w.onReady(function () {
	$w('#table1').onRowSelect((rowEvent) => {
	let id = rowEvent.rowData.id;
	if (id !== undefined){
		wixLocation.to("/profile-1/" + id + "/profile");
	}
    });
});
