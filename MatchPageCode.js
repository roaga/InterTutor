import wixData from 'wix-data';
  import wixUsers from 'wix-users';
  import {local} from 'wix-storage';
  import {session} from 'wix-storage';
  import wixWindow from 'wix-window';

  let id = wixUsers.currentUser.id;
  let questionsQuery = wixData.query("MemberQuestions");
  let times = [];

  $w.onReady(function () {
    $w('#text109').hide();

    questionsQuery.eq("userId", id).find().then((results) => {
        if (results.items.length > 0) {
            let questions = results.items[0];
            for (var i = 1; i < 10; i++) {
                let sliderName = "#slider" + i;
                $w(sliderName).value = questions[sliderName];
            }
                if(questions['times'].length > 0){
                    times = questions['times']
                    $w('#text118').text = times.toString().split(',').join(', ');
                } else{
                    times = []
                    $w('#text118').text = "Always"
                }
                $w('#switch1').checked = questions['availableAsTutee']
                $w('#switch2').checked = questions['availableAsTutor']
                $w('#switch3').checked = questions['availableAsPartner']
                $w('#switch4').checked = questions['honors']
                $w('#dropdown2').value = questions['bestSubjects'].split(', ')[0]
                $w('#dropdown1').value = questions['bestSubjects'].split(', ')[1]
                $w('#dropdown4').value = questions['bestSubjects'].split(', ')[2]
                $w('#dropdown7').value = 'grade' + questions['grade'].toString();
                $w('#dropdown5').value = questions['matchSubject'].split('-')[0];
                // $w('#dropdown6').value = questions['matchLevel'];
            	$w('#input2').value = questions['schoolEmail'];
                let emailEnding = questions['schoolEmailEnding'];
                wixData.query("CourseLists").eq('emailEnding', emailEnding).find().then((courseResults) => {
                    let courseList = courseResults.items[0]['courses'];
                    $w("#dropdown5").options = JSON.parse(courseList);
                });
        }
    })
    $w('#button4').onClick(() => {
        let num = 0;
        questionsQuery.eq("userId", id).find().then((results) => {
            num = results.items.length;
            if (results.items.length > 0) {
                var userQuestions = results.items[0];
                console.log(results);
                for (var i = 1; i < 10; i++) {
                    let sliderName = "#slider" + i;
                    userQuestions[sliderName] = $w(sliderName).value;
                }
                if(times.length === 0){
                    userQuestions['times'] = "Always";
                } else{
                    userQuestions['times'] = times;
                }
                userQuestions['bestSubjects'] = $w('#dropdown2').value + ', ' + $w('#dropdown1').value + ', ' + $w('#dropdown4').value;
                userQuestions['availableAsTutee'] = $w('#switch1').checked;
                userQuestions['availableAsTutor'] = $w('#switch2').checked;
                userQuestions['availableAsPartner'] = $w('#switch3').checked;
                userQuestions['honors'] = $w('#switch4').checked;
                userQuestions['grade'] = parseInt($w('#dropdown7').value.substring(5), 10);
                if($w('#switch4').checked){
					userQuestions['matchSubject'] = $w('#dropdown5').value + '-HONORS';
				} else {
                    userQuestions['matchSubject'] = $w('#dropdown5').value;
                }
                console.log(userQuestions)
                // userQuestions['matchLevel'] = $w('#dropdown6').value;
                // userQuestions['schoolEmail'] = $w('#input2').value;
                // if($w('#input2').value.length === 0){
                //     userQuestions['schoolEmailEnding'] = "";
                // } else{
                //     userQuestions['schoolEmailEnding'] = $w('#input2').value.split('@')[1];
                // }
                wixData.update("MemberQuestions", userQuestions);
            } else if ($w('#input2').valid){
                let toCreate = {"userId" : id,
                    'times' : times,
                    'bestSubjects' : $w('#dropdown2').value + ', ' + $w('#dropdown1').value + ', ' + $w('#dropdown4').value,
                    'availableAsTutee' : $w('#switch1').checked,
                    'availableAsTutor' : $w('#switch2').checked,
                    'availableAsPartner' : $w('#switch3').checked,
                    'honors' : $w('#switch4').checked,
                    'grade' : parseInt($w('#dropdown7').value.substring(5), 10),
                    // 'matchLevel' : $w('#dropdown6').value,
                    'schoolEmail': $w('#input2').value,
                    'schoolEmailEnding': $w('#input2').value.split('@')[1]
                };
                if($w('#input2').value.length === 0){
                    toCreate['schoolEmailEnding'] = "";
                }
                if(times.length === 0){
                    toCreate['times'] = "Always";
                } 
                if($w('#switch4').checked){
					toCreate['matchSubject'] = $w('#dropdown5').value + '-HONORS';
				} else{
                    toCreate['matchSubject'] = $w('#dropdown5').value;
                }

                for (var j = 1; j < 10; j++) {
                    let sliderName = "#slider" + j;
                    toCreate[sliderName] = $w(sliderName).value;
                }
                console.log(toCreate);
                wixData.insert("MemberQuestions", toCreate);

            }
            $w('#text109').show("FadeIn");
            if ($w('#input2').valid){
                $w('#text109').text = "Saved!";
            } else{
                $w('#text109').text = "Invalid school email";
            }
            setTimeout(function() {
                $w("#text109").hide("FadeOut"); 
            }, 2000);
        })

    })
  });

export function button5_click(event) { // add times
    let time = $w('#radioGroup1').value + " " + $w('#timePicker1').value.slice(0, 5)
    if (times.indexOf(time) >= 0) {
        console.log('Already Added');
    } else{
        times.push(time)
        $w('#text118').text = times.toString().split(',').join(', ');
    }
}

export function button6_click(event) { // delete time at end of list
    if(times.length > 0){
        times = times.slice(0, times.length - 1);
        console.log(times);
        $w('#text118').text = times.toString().split(',').join(', ');
        if(times.length === 0){
            $w('#text118').text = "Always";
        }
    }
}

export function button1_click(event) {
    session.setItem("buttonPressed", "Find me a tutor");
    wixWindow.openLightbox("Match Results");
}

export function button2_click(event) {
    session.setItem("buttonPressed", "Find me someone to tutor");
    wixWindow.openLightbox("Match Results");
}

export function button3_click(event) {
    session.setItem("buttonPressed", "Find me a study partner");
    wixWindow.openLightbox("Match Results");
}

export function button7_click(event) {
	let subject = "";
	if($w('#switch4').checked){
		subject = $w('#dropdown5').value + '-HONORS';
	} else{
		subject = $w('#dropdown5').value;
	}
	session.setItem("Showing All Tutors", subject);
    wixWindow.openLightbox("Available Tutors");
}
