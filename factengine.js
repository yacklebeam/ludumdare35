
// GLOBAL
////////////////////////////////////

var MAX_FACTS = 3;
var MAX_PEOPLE = 5;
var TITILE_PROB = .2;
var GENDER_PROB = .5;

var GENDERS = {
  MALE: 1,
  FEMALE: 2,
  properties: {
    1: {word: "Male"},
    2: {word: "Female"},
  }
};

////////////////////////////////////

function generatePersonality(){
	// TODO get that personality yo
	var person = {
		// PRIVATE VARS
		id: null, // might throw this out just because I want to 
		title:null, 
		firstname: "Jacob", 
		lastname: "Troxel",
		profession: "unemployed",
		gender: assignGender(),
		primaryfact: null,
		facts: [],
		lie_score: randomInRange(0,1),
		shape_shifter: false,
		killed: false,
		/// FUNCTIONS
		init: function(){
			if (this.gender == GENDERS.MALE){
				this.title = addTitle(male_titles);
				this.firstname = getAndRemoveElement(male_names);
			}else{
				this.title = addTitle(female_titles);
				this.firstname = getAndRemoveElement(female_names);
			}
			this.lastname =  getAndRemoveElement(last_names);
			this.profession = getAndRemoveElement(all_professions);
		},
		getFullName: function(){
			return (this.title != null ? this.title : "") + this.firstname + " " + this.lastname;
		},
		getName: function(){
			return this.firstname;
		},
		getPrimeFact: function(){
			return this.primaryfact();
		},
		getFact: function (){
			if (randomInRange(0,1) > this.lie_score){
				// Tell the truth
				// return s
			}else {
				// lie l

			}

		},
		isShapeShifter: function(){
			return this.personality.shapes;
		},
		shapeshift: function(){
			if (person.shape_shifter){
				// if this person is a shape shifter, then shift
				if (person.identities.length > 1){
					// if they have other identities -- chose one 
					// TODO make it so that 
					var identities_index = Math.floor(randomInRange(0,person.identities.length));
				}
			}
		},
		toString: function(){
			var out = this.getFullName() + " | " + GENDERS.properties[this.gender].word + " | " + this.profession + " | ";
			return out;
		},
	};

	person.init();

	for (i = 0; i < MAX_FACTS; i++){
		person.facts.push(getAndRemoveElement(all_facts));
	}

	return person;
}

function getShapeShifter(){
	var shapeman = generatePersonality();
	var shifter = {
		identities:[],
		identity_index: 0,
	};
	shifter.__proto__ = generatePersonality();
}


function getAndRemoveElement(elemlist){
	var index = Math.floor(randomInRange(0,elemlist.length));
	var elem = elemlist[index];
	if (index > -1) {
    	elemlist = elemlist.splice(index, 1);
	}
	return elem;
}

function assignGender(){
	if (randomInRange(0,1) < GENDER_PROB)
		return GENDERS.MALE;
	else
		return GENDERS.FEMALE;
}

function addTitle(titles){
	if (randomInRange(0,1) < TITILE_PROB){
		return getAndRemoveElement(titles);
	}
	return null;
}

function generateNPeople(N){
	var tmp = N;
	var personlist = [];
	if (N > MAX_PEOPLE)
		tmp = MAX_PEOPLE;
	if (N < 0)
		tmp = 0;
	for (x = 0; x < tmp; x++){
		personlist.push(generatePersonality());

	}
	return personlist;
}

function random_decimal(){
	return randomInRange(0,1);
}

function randomInRange (min,max){
    var highlightedNumber = Math.random() * (max - min) + min;
    return highlightedNumber;
}


function weightRand(spec) {
  var i, j, table=[];
  for (i in spec) {
    // The constant 10 below should be computed based on the
    // weights in the spec for a correct and optimal table size.
    // E.g. the spec {0:0.999, 1:0.001} will break this impl.
    for (j=0; j<spec[i]*10; j++) {
      table.push(i);
    }
  }
  return function() {
    return table[Math.floor(Math.random() * table.length)];
  }
}

var weightedRandomNumber = weightRand({0:0.1, 1:0.2, 2:0.4,2:0.1});

// FACTS AND STUFF 
var female_titles = ["Mistress","Miss","Duchess","Lady","Mrs.","Queen","Baroness","Princess","Archduchess","Grand Duchess","Empress"];
var male_titles = ["Duke","Lord","Master","Mister","Mr.","King","Archduke","Prince","Baron","Emperor"];
var female_names = ["Mary","Cari","Kerry","Staci","Megan","Olga","Sophia","Emma","Olivia","Ava","Mia","Isabella","Zoe","Lily"];
var male_names = ["Jerry","Terry","Gary","Larry","Perry","Jack","Oliver","Thomas","Harry","Joshua","Alfie","Charlie","Daniel ","James","William"];
var last_names = ["Mathblaster2000", "Lover","Toronoto Flasher","Troxbox","Trox-money","Tinsel-trox","Crock-trox"];
var all_professions = ["Anesthesiologist","Audiologist","Chiropractor","Optometrist","Pharmacist","Physician","Psychologist","Radiographer","Radiotherapist","Surgeon","Astronomer","Biologist","Botanist","Ecologist","Geneticist","Immunologist","Paleontologist","Virologist","Chemist","Geologist","Meteorologist","Physicist","Surveyor","Accountant","Architect","Accountant","Ambulance Driver","Animal Carer","Architect","Assembler","Bank Clerk","Beauty Therapist","Bricklayer","Butcher","Car Mechanic","Carpenter","Charge Nurse","Child-carer","Climatologist","Cnc Operator","Dental Hygienist","Dietician","Display Designer","Estate Agent","Felt Roofer","Filing Clerk","Financial Clerk","Fire Fighter","Flight Attendant","Floral Arranger","Food Scientist","Hairdresser","Head Groundsman","Hospital Nurse","Hotel Manager","House Painter","Hr Manager","Journalist","Judge","Lawyer","Legal Secretary","Metal Moulder","Meteorologist","Mortgage Clerk","Nursing Aid","Payroll Clerk","Personnel Clerk","Pest Controller","Pipe Fitter","Plumber","Police Inspector","Policy Advisor","Psychologist","Receptionist","Restaurant Cook","Road Paviour","Roofer","Sailor","Seaman","Secretary","Security Guard","Ship Mechanic","Soldier","Speech Therapist","Steel Fixer","Stockman","Surgeon","Tax Inspector","Transport Clerk","Waiting Staff","Web Developer"];

var primary_facts = [];
primary_facts.push({fact: "I like blue", condition: function(person){}});

var all_facts = [];
var fi = {truth: "I have a hot pocket right now on my person.", lie: "I have never seen a hot pocket."};
all_facts.push(fi);

var mahlist = generateNPeople(MAX_PEOPLE);
var shapeshifter = getShapeShifter();
mahlist.push(shapeshifter);
mahlist.forEach(function(person) {
    console.log(person.toString());
});

