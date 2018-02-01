import {FakeMap} from "../src/jsutils/Map"
import {FakeSet} from "../src/jsutils/Set"

window.FakeMap = FakeMap;
window.m = new FakeMap();
console.log("window.m set to FakeMap");

window.FakeSet = FakeSet;
window.s = new FakeSet();
console.log("window.s set to FakeSet");
