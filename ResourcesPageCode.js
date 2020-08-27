// For full API documentation, including code examples, visit http://wix.to/94BuAAs
import wixUsers from 'wix-users';
import wixData from 'wix-data';
import {session} from 'wix-storage';
import wixWindow from 'wix-window'; 

let user = wixUsers.currentUser;
let userId = user.id;

let whitelistWords = ['.org', '.edu', '.gov']

$w.onReady(function () {
	$w("#wixChat1").show();
	$w("#text93").hide();
});

export function button1_click(event) { // submit link
	let link = $w('#input1').value;
	let tags = $w('#input3').value.replace(/,/g, '').split(' ');
	let extraTags = (link.split('/').join(',').split('.').join(',').split('_').join(',').split('-').join(',').split('_').join(',').split(','));
	tags = tags.concat(extraTags);
	for(let i = 0; i < tags.length; i+=1){
		tags[i] = tags[i].toLowerCase();
	}
	link = $w('#input1').value;
	wixData.query("Links")
		.eq("link", link)
		.find()
		.then((results) => {
			for(let i = 0; i < whitelistWords.length; i = i + 1){
				if(link.indexOf(whitelistWords[i]) >= 0 && results.length === 0 && tags.length > 0 && link.length > 0){
					console.log('check pt');
					wixData.insert("Links", {'link': link, 'tags' : tags})
					break;
				} else if (results.length > 0 && tags.length > 0 && link.length > 0){
					console.log("updating existing link");
					let oldTags = results.items[0].tags;
					let newTags = oldTags.concat(tags);
					console.log(newTags);
					wixData.update("Links", {'link' : link, 'tags' : newTags, '_id' : results.items[0]._id});
					break;
				}
			}
		})
	$w('#text93').show("FadeIn");
			setTimeout(function() {
				$w("#text93").hide("FadeOut"); 
			}, 2000);

}

export function button2_click(event) {
	session.setItem("SearchTerms", $w('#input2').value.toLowerCase());
	console.log('item set');
	wixWindow.openLightbox("Link Results");
}
