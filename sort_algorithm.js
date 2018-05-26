var outdiv;
var current_size = 30;
var current_sort = "x";
var current_speed = 10;

// First function to be executed. Will create the first bars and shuffle them.
function onLoadFunction() {
	output("Welcome!");
	//resize(current_size);
	setPreDefined();
	//shuffle();
}

function setAlgorithm(algorithm) {
	current_sort = algorithm;
}

function setPreDefined() {
	resize(10);
	var data = [10, 4, 6, 8, 2, 5, 3, 9, 7, 1];
	for (var i = 0; i < 10; i++) {
		setBarValue(i, data[i]);
	}
}

// Changes the amount of vertical bars (elements)
function resize(size) {
	output("Resizing to: " + size + " elements.");
	current_size = size;
	// clear the existing bars
	var div = document.getElementById("root");
	div.innerHTML = "";
	//create new bars
	var bar = Array();
	for (var i = 0; i < size; i++) {
		bar[i] = document.createElement("div");
		bar[i].id = "bar" + i;
		bar[i].className = "bar";
		bar[i].style.width = (100.0 / size) + "%";
		div.appendChild(bar[i]);
		setBarValue(i, i + 1);
	}
}

// Will read the value written inside the vertical bar and return as a number
function getBarValue(bar_number) {
	var bar = document.getElementById("bar" + bar_number);
	return parseInt(bar.innerHTML);
}

// Will set the bar value, text and will adjust the height properly
function setBarValue(bar_number, value) {
	var bar = document.getElementById("bar" + bar_number);
	bar.style.height = 0.8 * ((value) * 100) / current_size + "%";
	bar.innerHTML = "" + value;
}

function setBarType(bar_number, type) {
	var bar = document.getElementById("bar" + bar_number);
	if (type != "bar") {
		bar.className = "bar " + type;
	} else {
		bar.className = "bar";
	}
}

// Will swap two bars values and sizes.
function swap(i, j) {
	var temp = getBarValue(i);
	setBarValue(i, getBarValue(j));
	setBarValue(j, temp);
}

// Will mix the bars randomly to make the sorting algorithm work.
function shuffle() {
	output("Shuffle");
	for (var i = current_size - 1; i >= 0; i--) {
		setBarType(i, "bar");
		var random_index = Math.floor(Math.random() * i);
		swap(i, random_index);
	}
}

// Just prints something inside the output panel.
function output(string) {
	document.getElementById("output").innerHTML += string + "\n";
}

// Clear the output panel
function outputClear() {
	document.getElementById("output").innerHTML = "";
}

var sortInterval;
var step_list = Array();
var step_it = 0;
var step_count = 0;

function playSorting() {
	var wait = false;
	if (step_it < step_list.length) {
		switch(step_list[step_it][0]) {
			case "class":
				setBarType(step_list[step_it][1], step_list[step_it][2]);
				break;
			case "multclass":
				for (var i = step_list[step_it][1]; i < step_list[step_it][2]; i++) {
					setBarType(i, step_list[step_it][3]);
				}
				break;
			case "set":
				//output("Setting " + step_list[step_it][1] + " with " + getBarValue(step_list[step_it][2]) + ".");
				//step_count++;
				//wait = true;
				setBarValue(step_list[step_it][1], step_list[step_it][2]);
				break;
			case "swap":
				//step_count++;
				//wait = true;
				//if (step_list[step_it][2] - step_list[step_it][1] >= 2) {
				//output("Swapping " + getBarValue(step_list[step_it][1]) + " with " + getBarValue(step_list[step_it][2]) + ".");
				swap(step_list[step_it][1], step_list[step_it][2]);
				//}
				break;
			case "shift":
				//step_count++;
				//wait = true;
				var temp = getBarValue(step_list[step_it][2]);
				for (var i = step_list[step_it][2]; i > step_list[step_it][1]; i--) {
					setBarValue(i, getBarValue(i - 1));
				}
				setBarValue(step_list[step_it][1], temp);
				break;
			case "clear":
				for (var i = step_list[step_it][1]; i < step_list[step_it][2]; i++) {
					setBarType(i, "bar");
				}
				break;
			case "debug":
			case "output":
				output(step_list[step_it][1]);
				break;
			case "stepCount":
				step_count++;
				output("Step " + step_count + ": " + step_list[step_it][1] + ".");
				wait = true;
				break;
			case "wait":
				wait = true;
				break;
			default:
				break;
		}
		document.getElementById("stepCount").value = step_count;
		step_it++;
	} else {
		wait = true;
		step_it = 0;
		clearInterval(sortInterval);
		document.getElementById("go").disabled = false;
		document.getElementById("selectAlgorithm").disabled = false;
		document.getElementById("shuffle").disabled = false;
		document.getElementById("selectSize").disabled = false;
		//document.getElementById("clear").disabled = false;
		output("Finished Sorting");
	}
	if (!wait) {
		playSorting();
	}
}

function startSort() {
	step_list.length = 0;
	step_it = 0;
	step_count = 0;
	document.getElementById("stepCount").value = step_count;
	output("Start Sorting");
	document.getElementById("go").disabled = true;
	document.getElementById("selectAlgorithm").disabled = true;
	document.getElementById("shuffle").disabled = true;
	document.getElementById("selectSize").disabled = true;
	//document.getElementById("clear").disabled = true;
	switch(current_sort) {
		case "merge":
			output("Merge Sort");
			mergeSort();
			break;
		case "quick":
			output("Quick Sort");
			quickSort();
			break;
		case "selection":
		default:
			output("Selection Sort");
			selectionSort();
			break;
	}

	sortInterval = setInterval(function() {
		playSorting();
	}, 1000 / current_speed);
}

/*
*		SORTING ALGORITHMS
*/

// SELECTION SORT

function selectionSort() {
	// Will set data array with the bar values on their current position.
	var data = Array();
	for (var i = 0; i < current_size; i++) {
		data[i] = getBarValue(i);
	}

	// Each element will be a pivot once. This means it's being decided if it will stay there or will be swapped with another element that's smaller than it.
	for (var i = 0; i < data.length; i++) {
		step_list.push(["class", i, "verified"]);

		var min_val = i;
		// The "pivot" will be compared with the other elements after it
		for (var j = i + 1; j < data.length; j++) {
			step_list.push(["stepCount", "Comparing " + data[j] + " with " + data[min_val] + "."]);
			step_list.push(["class", j, "selected"]);
			if (data[j] < data[min_val]) {
				if (min_val != i) {
					step_list.push(["class", min_val, "selected"]);
				}
				step_list.push(["class", j, "pivot"]);
				min_val = j;
			}
		}
		// If another element is smaller than the pivot, it will be swapped
		if (j != i) {
			step_list.push(["output", "Swapping " + data[i] + " with " + data[min_val] + "."]);
			step_list.push(["swap", min_val, i]);
			step_list.push(["wait"]);
			var aux = data[min_val];
			data[min_val] = data[i];
			data[i] = aux;
		}
		step_list.push(["clear", i + 1, data.length])
		step_list.push(["class", i, "bar"]);
	}
}

// MERGE SORT

function mergeSort() {
	var data = Array();
	for (var i = 0; i < current_size; i++) {
		data[i] = getBarValue(i);
	}

	mergeSortRec(data, 0, data.length);
}

function mergeSortRec(data, start, end) {
	var mid = start + Math.floor((end - start) / 2);
	if ((end - start) >= 2) {

		mergeSortRec(data, start, mid);
		mergeSortRec(data, mid, end);

		//step_list.push(["clear", 0, current_size]);
		step_list.push(["class", start, "pivot"]);
		step_list.push(["class", end - 1, "pivot"]);

		// var a = Array();
		// for (var i = start; i < mid; i++) {
		// a.push(i);
		// }
		// output("mergesortrec" + start + " " + end);
		// output("a:" + data.slice(start, mid).toString());
		// var b = Array();
		// for (var i = mid; i <= end; i++) {
		// b.push(i);
		// }
		// output("b:" + data.slice(mid, end).toString());

		var c = merge(data, start, mid, end);

		step_list.push(["clear", 0, current_size]);
		// output("c:" + data.slice(start, end).toString());
	}
}

function merge(data, start, mid, end) {
	// will merge [start,mid-1] and [mid,end-1]
	// output("merging [" + start + "," + (mid - 1) + "] with [" + mid + "," + (end - 1) + "]");
	// output("a:" + data.slice(start, mid).toString());
	// output("b:" + data.slice(mid, end).toString());

	step_list.push(["multclass", start, mid, "selected"]);
	step_list.push(["multclass", mid, end, "pivot"]);
	if (((mid - 1) - start) < 0 || ((end - 1) - mid) < 0) {
		// output("one side is empty" + start + " " + mid + " " + end + " data:" + data.slice(start, end));
	} else {
		step_list.push(["stepCount", "Comparing " + data[mid] + " with " + data[start] + "."]);
		step_list.push(["class", start, "verified"]);
		if (data[mid] <= data[start]) {
			// output("" + data[mid] + "<=" + data[start]);
			var temp = data[mid];
			for (var i = mid; i > start; i--) {
				data[i] = data[i - 1];
			}
			data[start] = temp;
			step_list.push(["shift", start, mid]);
			step_list.push(["wait"]);
			// output("data after:" + data.toString());
			merge(data, start + 1, mid + 1, end);
		} else {
			// output("" + data[mid] + ">" + data[start]);
			// output("data after:" + data.toString());
			merge(data, start + 1, mid, end);
		}

	}
}

// QUICK SORT

function quickSort() {
	var data = Array();
	for (var i = 0; i < current_size; i++) {
		data[i] = getBarValue(i);
	}

	//output("before quick sort:" + data.toString());
	quickSortRec(data, 0, data.length);
	step_list.push(["clear", 0, current_size]);
	//output("after quick sort:" + data.toString());
}

function quickSortRec(data, start, end) {
	// output("qsort rec: start:"+start+" end: "+end);
	// output("qsort rec: a: ["+data.slice(start,end).toString()+"]");
	step_list.push(["clear", 0, current_size]);
	step_list.push(["multclass", start, end, "selected"]);
	step_list.push(["wait"]);
	if ((end - start) >= 2) {
		var mid = Math.floor((start + end) / 2);
		var pivot = data[mid];
		step_list.push(["class", mid, "pivot"]);
		step_list.push(["wait"]);
		// output("pivot:" + pivot);
		// output("data:" + data[mid]+ " " +data[end - 1]);
		data[mid] = data[end - 1];
		data[end - 1] = pivot;
		step_list.push(["class", end - 1, "pivot"]);
		step_list.push(["class", mid, "selected"]);
		step_list.push(["swap", end - 1, mid]);
		step_list.push(["wait"]);
		var i = start;
		var j = end - 2;
		// output("qsort rec: b: ["+data.slice(start,end).toString()+"]");
		while (i <= j) {
			while (data[i] < pivot) {
				// output( ""+data[i]+" < "+pivot);
				step_list.push(["stepCount", "Comparing " + data[i] + " with " + pivot + "."]);
				step_list.push(["class", i, "selected2"]);
				step_list.push(["wait"]);
				i++;
			}
			// output( ""+data[i]+" >= "+pivot);
			while (data[j] > pivot) {
				// output( ""+data[j]+" > "+pivot);
				step_list.push(["stepCount", "Comparing " + data[j] + " with " + pivot + "."]);
				step_list.push(["class", j, "selected2"]);
				step_list.push(["wait"]);
				j--;
			}
			// output( ""+data[j]+" <= "+pivot);
			// output("ij: " + i + " " + j);
			if (i < j) {
				step_list.push(["class", i, "verified"]);
				step_list.push(["class", j, "verified"]);
				step_list.push(["wait"]);
				step_list.push(["swap", i, j]);
				step_list.push(["wait"]);
				step_list.push(["class", i, "selected2"]);
				step_list.push(["class", j, "selected2"]);
				var aux = data[i];
				data[i] = data[j];
				data[j] = aux;
				i++;
				j--;
			}
		}
		// output("qsort rec: c: ["+data.slice(start,end).toString()+"]");
		data[end - 1] = data[i];
		data[i] = pivot;
		step_list.push(["class", i, "pivot"]);
		step_list.push(["class", end-1, "selected"]);
		step_list.push(["swap", end - 1, i]);
		step_list.push(["wait"]);
		// output("qsort rec: d: ["+data.slice(start,end).toString()+"]");

		// output("se: " + start + " " + end);
		// output("ij: " + i + " " + j);
		if (j > start) {
			quickSortRec(data, start, j + 1);
		}
		if (i + 1 < end) {
			quickSortRec(data, i + 1, end);
		}
	}
	// output("qsort rec:" + data.slice(start,end).toString());
	
	step_list.push(["wait"]);
}
