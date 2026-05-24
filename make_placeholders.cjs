const fs = require('fs');

const rivers = [
  "North Branch Potomac River",
  "Potomac River",
  "Wills Creek",
  "Georges Creek",
  "Evitts Creek",
  "Town Creek",
  "Fifteenmile Creek",
  "Sideling Hill Creek",
  "Braddock Run",
  "Jennings Run",
  "Lake Habeeb",
  "Flintstone Creek",
  "Savage River",
  "Warrior Run",
  "Murleys Branch",
  "Laurel Run",
  "Koontz Run",
  "Jackson Run",
  "Neff Run",
  "Mill Run",
  "Elklick Run",
  "Staub Run",
  "Wrights Run",
  "Rock Gully Creek",
  "Collier Run",
  "Deep Run"
];

for(const river of rivers) {
  const path = '/app/applet/public/' + river + '.jpg';
  if(!fs.existsSync(path)) {
    fs.writeFileSync(path, '');
  }
}
