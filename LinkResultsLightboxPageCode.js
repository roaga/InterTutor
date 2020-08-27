// For full API documentation, including code examples, visit https://wix.to/94BuAAs
import wixData from 'wix-data';
import {session} from 'wix-storage';
import wixLocation from 'wix-location';

$w.onReady(function () {
	const currentColumns = $w("#table1").columns;
	const calculatedColumns = [
		{
		"id": "link",
		"dataPath": "link",
		"label": "Link",
		"type": "RichText",
		},
		{
		"id": "tags",
		"dataPath": "tags",
		"label": "Tags",
		"type": "RichText",
		}
	];

	let searchTerms = session.getItem("SearchTerms");
	if(searchTerms.length > 0){
		var finalLinks = [];
		var finalTags = [];
		searchTerms = searchTerms.split(' ');
		wixData.query("Links").hasAll('tags', searchTerms).find().then((resultsHigh) => {
			let veryRelatedLinks = [];
			let veryRelatedTags = [];
			for(let i = 0; i < resultsHigh.length; i += 1){
				veryRelatedLinks.push(resultsHigh.items[i].link);
				veryRelatedTags.push(resultsHigh.items[i].tags);
			}
			wixData.query("Links").hasSome('tags', searchTerms).find().then((resultsLow) => {
				let relatedLinks = [];
				let relatedTags = [];
				for(let i = 0; i < resultsHigh.length; i += 1){
					if(veryRelatedLinks.indexOf(resultsLow.items[i].link) < 0){
						relatedLinks.push(resultsLow.items[i].link);
						relatedTags.push(resultsLow.items[i].tags);
					}
				}

				finalLinks = veryRelatedLinks.concat(relatedLinks);
				finalTags = veryRelatedTags.concat(relatedTags);
				console.log(finalTags);
				if(finalLinks.length === 0){
					const data = [{"link" : "No Results"}, {'tags' : ''}];
					$w('#table1').rows = data;
				} else{
					let data = []
					for(let i = 0; i < finalLinks.length; i++){
						let item = {'link' : finalLinks[i], 'tags' : finalTags[i].slice(0, 3).toString().replace(/,/g, ', ')};
						data.push(item);
					}
					$w('#table1').rows = data;
				}
			})
		})

	} else {
		wixData.query("Links").hasAll('tags', searchTerms).find().then((res) => {
			let allLinks = [];
			let allTags = [];
			for(let i = 0; i < res.length; i += 1){
				allLinks.push(res.items[i].link);
				allTags.push(res.items[i].tags);
			}
			let data = []
			for(let i = 0; i < allLinks.length; i++){
				let item = {'link' : allLinks[i], 'tags' : allTags[i].slice(0, 3).toString().replace(/,/g, ', ')};
				data.push(item);
			}
			$w('#table1').rows = data;
		})
	}

});

export function table1_rowSelect(event) {
	let url = event.rowData['link'];
	wixLocation.to(url);
}
