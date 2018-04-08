function remove(array, element) {
	var index = array.indexOf(element);
	if(index > -1) {
		array.splice(index, 1);
	}
}

function bitprint(u) {
    var s="";
    for (var n=0; u; ++n, u>>=1)
      if (u&1) s+=n+" ";
    return s;
  }
  function bitcount(u) {
    for (var n=0; u; ++n, u=u&(u-1));
    return n;
  }

function comb(c,n) {
    var s=[];
    for (var u=0; u<1<<n; u++)
      if (bitcount(u)==c)
        s.push(bitprint(u));
    return s.sort();
  }
  
function combinations(str) {
      var fn = function(active, rest, a) {
          if (!active && !rest)
              return;
          if (!rest) {
              a.push(active);
          } else {
              fn(active + rest[0], rest.slice(1), a);
              fn(active, rest.slice(1), a);
          }
          return a;
      };
      return fn("", str, []);
  }

var OPERATION = {
	ADDITION : "+",
	SUBTRACTION : "-",
	MULTIPLICATION : "x",
	DIVISION : "/"
};

var STATE = {
	ENABLED : 1,
	DISABLED : 0
};

function NumberElement(value, state) {
	this.value = value;
	this.state = state;
	this.toString = function() {
		return "" + this.value + " : " + this.state;
	};
}

function GameStep(size) {
	this.size = size;
	this.elements = [];
	this.add = function(numberElement) {
		if(this.elements.length <= 5) {
			this.elements.push(numberElement);
		} else {
			alert("Index out of bounds");
		}
	};
	this.alert = function() {
		var text = "";
		for(var i = 0; i < this.elements.length; ++i) {
			text += this.elements[i].toString() + " ";
		}
		alert(text);
	};
	
	this.get = function(i) {
		if(i >= 0 && i < this.elements.length) {
			return this.elements[i]; 
		}
		return null;
	};
}

var birIslem = {
	timeLeft : 120,
	target : 0,
	number1 : 0,
	number2 : 0,
	number3 : 0,
	number4 : 0,
	number5 : 0,
	number6 : 0,
	allowedNumbers : [],
	steps : [],
	clickedLeftOperand : null,
	clickedRightOperand : null,
	currentLeftOperand : null,
	currentOperator : null,
	currentRightOperand : null,
	minimumDifference: 1000,
	bestSolution: []
};

function showQuestion() {
	document.getElementById('target').textContent = birIslem.target;
	document.getElementById('number1').textContent = birIslem.number1;
	document.getElementById('number2').textContent = birIslem.number2;
	document.getElementById('number3').textContent = birIslem.number3;
	document.getElementById('number4').textContent = birIslem.number4;
	document.getElementById('number5').textContent = birIslem.number5;
	document.getElementById('number6').textContent = birIslem.number6;
}

function createGame() {
	birIslem.currentLeftOperand = null;
	birIslem.currentRightOperand = null;
	birIslem.currentOperator = null;
	birIslem.clickedLeftOperand = null;
	birIslem.clickedRightOperand = null;
	
	birIslem.steps = [];
	birIslem.allowedNumbers = [];
	
	var number = Math.random() * 10 + 1;
	birIslem.number1 = Math.floor(number);
	number = Math.random() * 10 + 1;
	birIslem.number2 = Math.floor(number);
	number = Math.random() * 10 + 1;
	birIslem.number3 = Math.floor(number);
	number = Math.random() * 10 + 1;
	birIslem.number4 = Math.floor(number);
	number = Math.random() * 10 + 1;
	birIslem.number5 = Math.floor(number);
	number = Math.floor((Math.random() * 4 + 1)) * 25;
	birIslem.number6 = Math.floor(number);
	
	birIslem.target = Math.floor(Math.random() * 900) + 100;
	
	birIslem.allowedNumbers.push(birIslem.number1);
	birIslem.allowedNumbers.push(birIslem.number2);
	birIslem.allowedNumbers.push(birIslem.number3);
	birIslem.allowedNumbers.push(birIslem.number4);
	birIslem.allowedNumbers.push(birIslem.number5);
	birIslem.allowedNumbers.push(birIslem.number6);
	
    showQuestion();
}

function isFirstOperandSet() {
	var firstOperand = birIslem.currentLeftOperand;
	if (null == firstOperand) {
		return false;
	}
	return true;
}

function isSecondOperandSet() {
	var secondOperand = birIslem.currentRightOperand;
	if (null == secondOperand) {
		return false;
	}
	return true;
}

function isOperationSet() {
	var operation = birIslem.currentOperator;
	if (null == operation) {
		return false;
	}
	return true;
}

function operandClicked(event) {
	var text = this.textContent;
	if (!isOperationSet()) {
		if(birIslem.clickedLeftOperand != null) {
			birIslem.clickedLeftOperand.disabled = false;
			birIslem.clickedLeftOperand.className = "operand";
		}
		birIslem.currentLeftOperand = text;
		birIslem.clickedLeftOperand = this;
		this.disabled = true;
		this.className = "selected-operand";
		enableOperations();
	} else if (isOperationSet() && !isSecondOperandSet() && this != birIslem.clickedLeftOperand) {
		birIslem.currentRightOperand = text;
		birIslem.clickedRightOperand = this;
		disableOperand(this);
		if(calculate()) {
			enableOperations();
			showCurrentStep();
		} else {
			undoCurrentStep();
			enableOperations();
			showCurrentStep();
		}
		
	}
}

function operatorClicked(button) {
	birIslem.operation = button.textContent;
	birIslem.currentOperator = birIslem.operation;
	button.className = "selected-operation";
	disableOperations();
	button.className = "selected-operation";
	showCurrentStep();
}

function disableOperations() {
	var addition = document.getElementById("addition"); 	
	addition.className = "operation";
	addition.disabled = true;
	
	var subtraction = document.getElementById("subtraction");
	subtraction.className = "operation"; 	
	subtraction.disabled = true;
	
	var multiplication = document.getElementById("multiplication");
	multiplication.className = "operation"; 	
	multiplication.disabled = true;
	
	var division = document.getElementById("division"); 	
	division.className = "operation";
	division.disabled = true;
}

function enableOperations() {
	var addition = document.getElementById("addition"); 	
	addition.className = "operation";
	addition.disabled = false;
	
	var subtraction = document.getElementById("subtraction"); 	
	subtraction.className = "operation";
	subtraction.disabled = false;
	
	var multiplication = document.getElementById("multiplication"); 	
	multiplication.className = "operation";
	multiplication.disabled = false;
	
	var division = document.getElementById("division"); 	
	division.className = "operation";
	division.disabled = false;
}

function enableOk() {
	var acceptButton = document.getElementById("acceptButton");
	acceptButton.addEventListener("click", acceptButtonClicked);
}

function disableOk() {
	var acceptButton = document.getElementById("acceptButton");
	acceptButton.removeEventListener("click", acceptButtonClicked);
}

function disableOperands() {
	var number1 = document.getElementById("number1"); 
	number1.disabled = true;
	var number2 = document.getElementById("number2"); 
	number2.disabled = true;
	var number3 = document.getElementById("number3"); 
	number3.disabled = true;
	var number4 = document.getElementById("number4"); 
	number4.disabled = true;
	var number5 = document.getElementById("number5"); 
	number5.disabled = true;
	var number6 = document.getElementById("number6"); 
	number6.disabled = true;
}


function enableOperands() {
	var number1 = document.getElementById("number1"); 
	number1.disabled = false;
	number1.className = "operand";
	var number2 = document.getElementById("number2"); 
	number2.disabled = false;
	number2.className = "operand";
	var number3 = document.getElementById("number3"); 
	number3.disabled = false;
	number3.className = "operand";
	var number4 = document.getElementById("number4"); 
	number4.disabled = false;
	number4.className = "operand";
	var number5 = document.getElementById("number5"); 
	number5.disabled = false;
	number5.className = "operand";
	var number6 = document.getElementById("number6"); 
	number6.disabled = false;
	number6.className = "operand";
}

function updateBestSolution(numberArray, solution) {
	for(var i = 0; i < numberArray.length; ++i) {
		var difference = Math.abs(numberArray[i] - birIslem.target);
		if(difference < birIslem.minimumDifference) {
			birIslem.minimumDifference = difference;
			birIslem.bestSolution = solution.join("<br/>");
		}
	}
}

function solve(numberArray, solution) {
	var combinations = comb(2, numberArray.length);
	var newSolution = solution.slice();
	updateBestSolution(numberArray, solution);
	for(var i = 0; i < combinations.length; ++i) {
		
		var combination = combinations[i].split(" ");
		var leftOperand = numberArray[combination[0]];
		var rightOperand = numberArray[combination[1]];
		var newArray = numberArray.slice();
		remove(newArray, leftOperand);
		remove(newArray, rightOperand);
		var result = leftOperand + rightOperand;
		var solutionStep = leftOperand + " + " + rightOperand + " = " + result;
		
		var copyOfArray = newArray.slice();
		copyOfArray.push(result);
		var copyOfSolution = newSolution.slice();
		copyOfSolution.push(solutionStep);
		solve(copyOfArray, copyOfSolution);
					
		if(leftOperand > rightOperand) {
			result = leftOperand - rightOperand;
			solutionStep = leftOperand + " - " + rightOperand + " = " + result;
		} else {
			result = rightOperand - leftOperand;
			solutionStep = rightOperand + " - " + leftOperand + " = " + result;
		}
		if(result != 0) {
			copyOfArray = newArray.slice();
			copyOfArray.push(result);
			copyOfSolution = newSolution.slice();
			copyOfSolution.push(solutionStep);
			
			solve(copyOfArray, 
				copyOfSolution);
		}
		
		result = leftOperand * rightOperand;
		solutionStep = leftOperand + " * " + rightOperand + " = " + result;
		copyOfArray = newArray.slice();
		copyOfArray.push(result);
		copyOfSolution = newSolution.slice();
		copyOfSolution.push(solutionStep);
		solve(copyOfArray, copyOfSolution);
		
		if(leftOperand % rightOperand == 0) {
			result = leftOperand / rightOperand;
			solutionStep = leftOperand + " / " + rightOperand + " = " + result;
		} else if(rightOperand % leftOperand == 0) {
			result = rightOperand / leftOperand;
			solutionStep = rightOperand + " / " + leftOperand + " = " + result;
		} else {
			result = 0;
		}
		
		if(result != 0) {
			copyOfArray = newArray.slice();
			copyOfArray.push(result);
			copyOfSolution = newSolution.slice();
			copyOfSolution.push(solutionStep);
			solve(copyOfArray,
				copyOfSolution);
		}
	}
}

function acceptButtonClicked() {
	disableOk();
	disableOperands();
	disableOperations();
	var numbers = [];
	var number1 = document.getElementById("number1"); 
	numbers.push(number1.textContent);
	var number2 = document.getElementById("number2"); 
	numbers.push(number2.textContent);
	var number3 = document.getElementById("number3"); 
	numbers.push(number3.textContent);
	var number4 = document.getElementById("number4"); 
	numbers.push(number4.textContent);
	var number5 = document.getElementById("number5"); 
	numbers.push(number5.textContent);
	var number6 = document.getElementById("number6"); 
	numbers.push(number6.textContent);
	for(var i = 0; i < numbers.length; ++i) {
		var calculatedScore = calculateScore(numbers[i]);
		if(calculatedScore > score) {
			score = calculatedScore;
		}
	}
	var total_display = document.getElementById("total-score");
	var oldScore = parseInt(total_display.textContent);
	var newScore = oldScore + score;
	total_display.textContent = newScore;
	var last_display = document.getElementById("last-score");
	last_display.textContent = score;
};

function showSolutionClicked() {
	solve(birIslem.allowedNumbers.slice(), []);
	document.getElementById("solutionArea").innerHTML = birIslem.bestSolution;
};

function newClicked() {
    document.getElementById("solutionArea").textContent = "";
    clearInterval(birIslem.timer);
	initButtons();
	createGame();
	enableOk();
};

function undo() {
	if(isOperationSet()) {
		birIslem.currentOperator = null;
		birIslem.operation = null;
		enableOperations();
	} else {
		if(birIslem.steps.length > 1) {
			birIslem.steps.pop();
		}
		showCurrentStep();
	}
};

function initButtons() {
	var newButton = document.getElementById("new");
	newButton.removeEventListener("click", newClicked);
	newButton.addEventListener("click", newClicked);
	
	var undoButton = document.getElementById("undo");
	undoButton.removeEventListener("click", undo);
	undoButton.addEventListener("click", undo);
	
	var solutionButton = document.getElementById("showSolution");
	solutionButton.removeEventListener("click", showSolutionClicked);
	solutionButton.addEventListener("click", showSolutionClicked);
	
	var acceptButton = document.getElementById("acceptButton");
	acceptButton.removeEventListener("click", acceptButtonClicked);
	acceptButton.addEventListener("click", acceptButtonClicked);
}

window.onload=function(){
	initButtons();
	createGame();
};

