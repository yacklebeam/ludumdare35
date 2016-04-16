
// GLOBAL
////////////////////////////////////

var MAX_FACTS = 3;
var MAX_PEOPLE = 5;
var TITILE_PROB = .2;
var GENDER_PROB = .5;

////////////////////////////////////

function generate_personality(){
	// TODO get that personality yo

	var person =  {
		title:null, 
		firstname: get_element_and_remove(first_names), 
		lastname: get_element_and_remove(last_names),
		gender: get_gender(),
		primaryfact: get_element_and_remove(primary_facts),
		facts: [],
		lie_score: random_in_range(0,1),
		identities:[],
		identities_index: 0,
		shape_shifter: false,
		killed: false,
	};

	add_title(person);

	for (i = 0; i < MAX_FACTS; i++){
		person.facts.push(get_element_and_remove(all_facts));
	}

	return person;
}

function get_full_name(person){
	var out = person.title != null ? person.title : "";
	out += " " + person.firstname + " " + person.lastname;
	return out;
	// return "{0} {1} {2}".format((person.title != null ? person.title:""), person.firstname, person.lastname)
}

function shapeshift(person){
	if (person.shape_shifter){
		if (person.identities.length > 1){
			var identities_index = Math.floor(random_in_range(0,person.identities.length));
		}
	}
}

function print_person(person){
	var out = person.name;
}

function get_element_and_remove(elemlist){
	var index = Math.floor(random_in_range(0,elemlist.length));
	var elem = elemlist[index];
	if (index > -1) {
    	elemlist = elemlist.splice(index, 1);
	}
	return elem;
}

function get_gender(){
	if (random_in_range(0,1) < GENDER_PROB)
		return "male";
	else
		return "female";
}

function add_title(person){
	if (random_in_range(0,1) < TITILE_PROB){
		// Add a gendered Title
		if (person.gender == "male")
			person.title = get_element_and_remove(male_titles);
		else 
			person.title =  get_element_and_remove(female_titles);
	}
	else{
		// TODO no title for this guy, thats for sure 
		person.title =  null;
	}
}

function get_primary_fact(person){

}

function get_fact(person){

}

function random_decimal(){
	return random_in_range(0,1);
}

function random_in_range (min,max){
    var highlightedNumber = Math.random() * (max - min) + min;
    return highlightedNumber;
}

// FACTS AND STUFF 
var female_titles = ["Mistress","Miss","Duchess","Lady","Mrs.","Queen"];
var male_titles = ["Duke","Lord","Master","Mister","Mr.","King"];
var female_names = [];
var first_names = ["Jerry","Terry","Mary","Gary","Larry","Harry","Barry","Cari","Dairy","Fairy","Kerry","Perry"];
var last_names = ["Mathblaster2000", "Lover","Toronoto Flasher","Troxbox","Trox-money","Tinsel-trox","Crock-trox"];

var primary_facts = [];
var f = {fact: "I like blue", lie: "I hate blue"};
primary_facts.push(f);

var all_facts = [];
var fi = {truth: "I have a hot pocket right now on my person.", lie: "I have never seen a hot pocket."};
all_facts.push(fi);

for (x = 0; x < MAX_PEOPLE; x++){
	var spokie = generate_personality();
	console.log(get_full_name(spokie));
}




