/**
 * string_math.js
 *
 * Standard math functions using standard arithmetic, for precision beyond normal JavaScript floating point.
 *
 * @package StringMath
 * @subpackage StringMath
 * @author Nicholas Tieman
 */
var StringMath = new function() {
	/**
	 * @var number Default number of decimal places to calculate for operations that accept this parameter.
	 */
	this.defaultPrecision = 40;
	/**
	 * Finds the absolute value of a number.
	 *
	 * @param string number Number.
	 * @return string Absolute value.
	 */
	this.abs = function(number) {
		if(number.charAt(0) === "-1") {
			return number.substr(1);
		} else {
			return number;
		}
	}
	/**
	 * Adds two numbers.
	 *
	 * @param string a First number.
	 * @param string b Second number.
	 * @return string Sum.
	 */
	this.add = function(a, b) {
		var aNegative = (a.charAt(0) === "-");
		var bNegative = (b.charAt(0) === "-"); 
		
		if(aNegative && bNegative) {
			return "-" + StringMath.add(a.substr(1), b.substr(1));
		} else if(aNegative && !bNegative) {
			return StringMath.subtract(b, a.substr(1));
		} else if(!aNegative && bNegative) {
			return StringMath.subtract(a, b.substr(1));
		}
		
		var paddedValues = padEqual(a, b);
		
		a = paddedValues.a;
		b = paddedValues.b;
	
		var sum = "";
		var carry = 0;
		var index = paddedValues.length;
		
		while(index--) {
			if(a.charAt(index) === ".") {
				sum = "." + sum;
				
				continue;
			}
			
			var digit = parseInt(a.charAt(index), 10) + parseInt(b.charAt(index), 10) + carry;
			
			if(digit > 9) {
				digit -= 10;
				carry = 1;
			} else {
				carry = 0;
			}
			
			sum = digit.toString() + sum;
		}
		
		if(carry === 1) {
			sum = carry.toString() + sum;
		}
		
		sum = prettify(sum);
		
		return sum;
	}
	/**
	 * Rounds the number up to the nearest whole.
	 *
	 * @param string number Number to round.
	 * @return string Rounded number.
	 */
	this.ceil = function(number) {
		return StringMath.floor(StringMath.add(number, "1"));
	}
	/**
	 * Formats numbers for use with StringMath.
	 *
	 * @param number|string number Number to format.
	 * @return string Formatted number.
	 */
	this.clean = function(number) {
		if(typeof(number) !== "string") {
			number = number.toString();
		}
		
		number = scientificToLong(number);
		number = prettify(number);
		
		return number;
	}
	/**
	 * Compares two string numbers.
	 *
	 * @param string a First number.
	 * @param string b Second number.
	 * @return number 1 if a > b, 0 if a == b, -1 if a < b.
	 */
	this.compare = function(a, b) {
		a = prettify(a);
		b = prettify(b);
		
		if(a === b) {
			return 0;
		}
		
		var aNegative = (a.charAt(0) === "-");
		var bNegative = (b.charAt(0) === "-");
	
		if(!aNegative && bNegative) {
			return 1;
		} else if(aNegative && !bNegative) {
			return -1;
		} else if(aNegative && bNegative) {
			a = a.substr(1);
			b = b.substr(1);
			
			var sign = -1;
		} else {
			var sign = 1;
		}
	
		var paddedValues = padEqual(a, b);
		
		a = paddedValues.a;
		b = paddedValues.b;
		
		var length = paddedValues.length;
		
		for(var i = 0; i < length; i++) {
			if(a.charAt(i) === ".") {
				continue;
			}
			
			var aDigit = parseInt(a.charAt(i), 10);
			var bDigit = parseInt(b.charAt(i), 10);
			
			if(aDigit > bDigit) {
				return sign;
			} else if(aDigit < bDigit) {
				return sign * -1;
			}
		}
		
		return 0;
	}
	/**
	 * Divides two numbers.
	 *
	 * @param string a First number.
	 * @param string b Second number.
	 * @param number precision Maximum number of decimal places to calculate (optional).
	 * @return string Quotient.
	 */
	this.divide = function(a, b, precision) {
		if(StringMath.equal(a, "0")) {
			return "0";
		} else if(StringMath.equal(b, "0")) {
			return "NaN";
		}
		
		var aNegative = (a.charAt(0) === "-");
		var bNegative = (b.charAt(0) === "-");
		
		if(aNegative && bNegative) {
			return StringMath.divide(a.substr(1), b.substr(1), precision);
		} else if(aNegative && !bNegative) {
			return "-" + StringMath.divide(a.substr(1), b, precision);
		} else if(!aNegative && bNegative) {
			return "-" + StringMath.divide(a, b.substr(1), precision);
		}
		
		if(typeof(precision) === "undefined") {
			precision = StringMath.defaultPrecision;
		}
		
		a = prettify(a);
		b = prettify(b);
		
		while(decimalIndex(b) !== b.length) {
			a = shiftDecimal(a, 1);
			b = shiftDecimal(b, 1);
		}
		
		var subdividend = "";
		var desiredLength = bLength;
		var aLength = a.length;
		var bLength = b.length;
		var aDecimalIndex = decimalIndex(a);
		var quotient = "";
		var index = 0;
		
		do {
			if(index >= aLength && index !== aDecimalIndex && subdividend.charAt(0) !== "0") {
				subdividend += "0";
			} else if(a.charAt(index) !== ".") {
				subdividend += a.charAt(index);
			}

			if(StringMath.greaterOrEqual(subdividend, b)) {
				var times = "1";
				var product = b;
				
				while(StringMath.less(product, subdividend)) {
					times = StringMath.add(times, "1");
					product = StringMath.add(product, b);
				}
				
				if(StringMath.greater(product, subdividend)) {
					times = StringMath.subtract(times, "1");
					product = StringMath.subtract(product, b);
					subdividend = StringMath.subtract(subdividend, product);
				} else {
					subdividend = "";
				}
				
				quotient += times;
			} else if(index === aDecimalIndex || a.charAt(index) === ".") {
				quotient += ".";
			} else {
				quotient += "0";
			}
			
			index++;
		} while((!StringMath.equal(subdividend, "0") || index < aLength) && (index - aDecimalIndex) <= precision);
		
		quotient = prettify(quotient);
		
		return quotient;
	}
	/**
	 * Determines whether or not two string numbers are equal.
	 *
	 * @param string a First number.
	 * @param string b Second number.
	 * @return boolean Whether or not the values are equal.
	 */
	this.equal = function(a, b) {
		return prettify(a) === prettify(b);
	}
	/**
	 * Rounds the number down to the nearest whole.
	 * 
	 * @param string number Number to round.
	 * @return string Rounded number.
	 */
	this.floor = function(number) {
		return prettify(number.substr(0, decimalIndex(number)));
	}
	/**
	 * Determines whether or not the first number is greater than the second.
	 *
	 * @param string a First number.
	 * @param string b Second number.
	 * @return boolean Whether or not the first number is greater than the second.
	 */
	this.greater = function(a, b) {
		return StringMath.compare(a, b) === 1;
	}
	/**
	 * Determines whether or not the first number is greater than or equal to the second.
	 *
	 * @param string a First number.
	 * @param string b Second number.
	 * @return boolean Whether or not the first number is greater than the second.
	 */
	this.greaterOrEqual = function(a, b) {
		return StringMath.compare(a, b) !== -1;
	}
	/**
	 * Determines whether or not the first number is less than the second.
	 *
	 * @param string a First number.
	 * @param string b Second number.
	 * @return boolean Whether or not the first number is less than the second.
	 */
	this.less = function(a, b) {
		return StringMath.compare(a, b) === -1;
	}
	/**
	 * Determines whether or not the first number is less than or equal to the second.
	 *
	 * @param string a First number.
	 * @param string b Second number.
	 * @return boolean Whether or not the first number is less than the second.
	 */
	this.lessOrEqual = function(a, b) {
		return StringMath.compare(a, b) !== 1;
	}
	/**
	 * Returns the input with the lowest value.
	 *
	 * @param string num1, num2, ... Test numbers.
	 * @return string Greatest number.
	 */
	this.min = function() {
		var argumentsLength = arguments.length;
		
		if(argumentsLength === 0) {
			return undefined;
		}
		
		var min = arguments[0];
		
		for(var i = 1; i < argumentsLength; i++) {
			var argument = arguments[i];
			
			if(StringMath.less(argument, max)) {
				min = argument;
			}
		}
		
		return min;
	}
	/**
	 * Returns the input with the greatest value.
	 *
	 * @param string num1, num2, ... Test numbers.
	 * @return string Greatest number.
	 */
	this.max = function() {
		var argumentsLength = arguments.length;
		
		if(argumentsLength === 0) {
			return undefined;
		}
		
		var max = arguments[0];
		
		for(var i = 1; i < argumentsLength; i++) {
			var argument = arguments[i];
			
			if(StringMath.greater(argument, max)) {
				max = argument;
			}
		}
		
		return max;
	}
	/**
	 * Finds the modulo of two numbers.
	 *
	 * @param string a First number.
	 * @param string b Second number.
	 * @return string Modulus.
	 */
	this.modulo = function(a, b) {
		var times = StringMath.divide(a, b, 0);
		var quotient = StringMath.multiply(b, times);
		
		return StringMath.subtract(a, quotient);
	}
	/**
	 * Multiplies two numbers.
	 *
	 * @param string a First number.
	 * @param string b Second number.
	 * @return string Product.
	 */
	this.multiply = function(a, b) {
		var aNegative = (a.charAt(0) === "-");
		var bNegative = (b.charAt(0) === "-");
		
		if(aNegative && bNegative) {
			return StringMath.multiply(a.substr(1), b.substr(1));
		} else if(aNegative && !bNegative) {
			return "-" + StringMath.multiply(a.substr(1), b);
		} else if(!aNegative && bNegative) {
			return "-" + StringMath.multiply(a, b.substr(1));
		}
		
		var aLength = a.length;
		var bLength = b.length;
		
		var aDecimalIndex = decimalIndex(a);
		var bDecimalIndex = decimalIndex(b);
		
		var product = "0";
		
		for(var i = 0; i < aLength; i++) {
			if(a.charAt(i) === ".") {
				continue;
			}
			
			var aDigit = parseInt(a.charAt(i), 10);
			
			if(aDigit === 0) {
				continue;
			}
			
			var aPlace = (aDecimalIndex - 1) - i;
			
			if(aPlace < 0) {
				aPlace++;
			}
			
			for(var j = 0; j < bLength; j++) {
				if(b.charAt(j) === ".") {
					continue;
				}
			
				var bDigit = parseInt(b.charAt(j), 10);
			
				if(bDigit === 0) {
					continue;
				}
			
				var bPlace = (bDecimalIndex - 1) - j;
				
				if(bPlace < 0) {
					bPlace++;
				}
				
				var subProduct = (aDigit * bDigit).toString();
				var subProductPlace = aPlace + bPlace;

				if(subProductPlace > 0) {
					subProduct = subProduct + repeat("0", subProductPlace);
				} else if(subProductPlace === -1 && subProduct.length === 2) {
					subProduct = subProduct.charAt(0) + "." + subProduct.charAt(1);
				} else if(subProductPlace < 0) {
					subProduct = "0." + repeat("0", Math.abs(subProductPlace) - subProduct.length) + subProduct;
				}

				product = StringMath.add(product, subProduct);
			}
		}
		
		product = prettify(product);
		
		return product;
	}
	/**
	 * Calculates an exponent.
	 *
	 * @param string base Base number.
	 * @param string power Power to raise to.
	 * @param number precision Number of decimal points to calculate (optional).
	 */
	this.pow = function(base, power, precision) {
		if(power.charAt(0) === "-") {
			return StringMath.divide("1", StringMath.pow(base, power.substr(1), precision));
		}
		
		var root = "1";
		
		while(!StringMath.equal(power, StringMath.floor(power))) {
			root = shiftDecimal(root, 1);
			power = shiftDecimal(power, 1);
		}
		
		var exponent = "1";
		var times = power;
		
		while(StringMath.greater(times, "0")) {
			exponent = StringMath.multiply(exponent, base);
			times = StringMath.subtract(times, "1");
		}
		
		if(!StringMath.equal(root, "1")) {
			exponent = StringMath.root(exponent, root, precision);
		}
		
		return exponent;
	}
	/**
	 * Finds the given root of a number.
	 *
	 * @param string base Base number.
	 * @param string degree Desired root.
	 * @param number precision Number of digits to calculate (optional).
	 * @return string Calculated root.
	 */
	this.root = function(base, degree, precision) {
		if(base.charAt(0) === "-") {
 			return StringMath.root(base.substr(1), degree, precision) + "i";
		}
		
		if(typeof(precision) === "undefined") {
			precision = StringMath.defaultPrecision;
		}
		
		var root = "-1";
		var product;
		
		do {
			root = StringMath.add(root, "1");
			product = "1";
			
			var times = degree;
			
			while(StringMath.greater(times, "0")) {
				product = StringMath.multiply(product, root);
				times = StringMath.subtract(times, "1");
			}
		} while(StringMath.less(product, base));
		
		if(StringMath.equal(product, base)) {
			return root;
		}
		
		root = StringMath.subtract(root, "1") + ".";
		
		var digits = 0;
		var equal;
		
		do {
			var digit = "-1";
			
			do {
				product = "1";
				digit = StringMath.add(digit, "1");
				
				var testRoot = root + digit;
				var times = degree;
			
				while(StringMath.greater(times, "0")) {
					product = StringMath.multiply(product, testRoot);
					times = StringMath.subtract(times, "1");
				}
			} while(StringMath.less(product, base));
			
			equal = StringMath.equal(product, base);
			
			if(!equal) {
				digit = StringMath.subtract(digit, "1");
				root += digit;
			}
			
			digits++;
		} while(!equal && digits < precision);
		
		return root;
	}
	/**
	 * Rounds a number to the nearest whole.
	 *
	 * @param string number Number to round.
	 * @return string Rounded number.
	 */
	this.round = function(number) {
		var base = StringMath.floor(number) + ".5";
		
		if(StringMath.less(number, base)) {
			return StringMath.ceil(number);
		} else {
			return StringMath.floor(number);
		}
	}
	/**
	 * Finds the square root of a given number.
	 *
	 * @param string base Base number.
	 * @param number precision Number of decimal places to calculate (optional).
	 * @return string Square root.
	 */
	this.sqrt = function(base, precision) {
		return StringMath.root(base, "2", precision);
	}
	/**
	 * Subtracts one number from another.
	 *
	 * @param string a First number.
	 * @param string b Second number.
	 * @return number Difference.
	 */
	this.subtract = function(a, b) {
		var aNegative = (a.charAt(0) === "-");
		var bNegative = (b.charAt(0) === "-");
		
		if(bNegative) {
			return StringMath.add(a, b.substr(1));
		} else if(aNegative) {
			return "-" + StringMath.add(a.substr(1), b);
		} else if(StringMath.compare(a, b) === -1) {
			return "-" + StringMath.subtract(b, a);
		}
		
		var paddedValues = padEqual(a, b);
		
		a = paddedValues.a;
		b = paddedValues.b;
		
		var index = paddedValues.length;
		var carry = 0;
		var difference = "";
		
		while(index--) {
			if(a.charAt(index) === ".") {
				difference = "." + difference;
				
				continue;
			}
			
			var aDigit = parseInt(a.charAt(index), 10);
			var bDigit = parseInt(b.charAt(index), 10);
			var digit = aDigit - bDigit - carry;
			
			if(digit < 0) {
				digit += 10;
				carry = 1;
			} else {
				carry = 0;
			}
			
			difference = digit.toString() + difference;
		}
		
		difference = prettify(difference);
		
		return difference;
	}
	/**
	 * Finds the index of the decimal point in a number string.
	 *
	 * @param string number Number.
	 * @return number Decimal point index.
	 */
	var decimalIndex = function(number) {
		var index = number.indexOf(".");
		
		if(index === -1) {
			return number.length;
		} else {
			return index;
		}
	}
	/**
	 * Changes positive numbers to negative, and negative to positive.
	 *
	 * @param string number Number to flip.
	 * @return string Flipped number.
	 */
	var flipSign = function(number) {
		if(number.charAt(0) === "-") {
			return number.substr(1);
		} else {
			return "-" + number;
		}
	}
	/**
	 * Inserts a string into another string at the given position.
	 *
	 * @param string destination String to modify.
	 * @param string insert String to insert.
	 * @param number position Index at which to insert.
	 */
	var insert = function(destination, insert, position) {
		if(position <= 0) {
			return insert + destination;
		} else {
			return destination.substr(0, position) + insert + destination.substr(position);
		}
	}
	/**
	 * Pads two values with zeroes so that they are the same length and their decimal points are in the same position.
	 *
	 * @param string a First number.
	 * @param string b Second number.
	 * @return object Padded values, a and b.
	 */
	var padEqual = function(a, b) {
		var aDecimalIndex = decimalIndex(a);
		var bDecimalIndex = decimalIndex(b);
		
		if(aDecimalIndex > bDecimalIndex) {
			var maxPlace = aDecimalIndex;
		} else {
			var maxPlace = bDecimalIndex;
		}
		
		var aLength = a.length;
		var bLength = b.length;
		
		var aMinPlace = aDecimalIndex - aLength;
		var bMinPlace = bDecimalIndex - bLength;
		
		if(aMinPlace < bMinPlace) {
			var minPlace = aMinPlace;
		} else {
			var minPlace = bMinPlace;
		}
		
		a = repeat("0", maxPlace - aDecimalIndex) + a + repeat("0", aMinPlace - minPlace);
		b = repeat("0", maxPlace - bDecimalIndex) + b + repeat("0", bMinPlace - minPlace);
		
		a = a.substr(0, maxPlace) + "." + a.substr(maxPlace + 1);
		b = b.substr(0, maxPlace) + "." + b.substr(maxPlace + 1);
		
		return { "a": a, "b": b, "length": a.length };
	}
	/**
	 * Trims leading and trailing zeroes and unnecessary decimal points, and adds leading zero to appropriate decimals.
	 *
	 * @param number Number to format.
	 * @return Formatted number.
	 */
	var prettify = function(number) {
		number = trimZeroes(number);
		number = trimDecimal(number);
		
		if(number.charAt(0) === ".") {
			number = "0" + number;
		}
		
		if(number === "-0") {
			number = "0";
		}
		
		if(number === "") {
			number = "0";
		}
		
		return number;
	}
	/**
	 * Repeats a string a given number of times.
	 *
	 * @param string content String to repeat.
	 * @param number times Number of times to repeat.
	 * @return string Repeated string.
	 */
	var repeat = function(content, times) {
		var repeated = "";
		
		while(times-- > 0) {
			repeated += content;
		}
		
		return repeated;
	}
	/**
	 * Shifts the decimal point by the given amount.
	 *
	 * @param string number Number to alter.
	 * @param number shift Number of places to shift. Negative for left, positive for right.
	 * @return string Shifted number.
	 */
	var shiftDecimal = function(number, shift) {
		var index = decimalIndex(number);
		var goal = index + shift;
		var number = number.replace(".", "");
		
		if(goal === 0) {
			return "0." + number;
		} else if(goal < 0) {
			return "0." + repeat("0", goal * -1) + number;
		} else if(goal > number.length) {
			return number + repeat("0", goal - number.length);
		} else {
			return insert(number, ".", goal);
		}
	}
	/**
	 * Converts JavaScript scientific notation to standard longform notation.
	 *
	 * @param string number Number to format.
	 * @return string Formatted number.
	 */
	var scientificToLong = function(number) {
		var match = /([0-9.]+)e([+|-])(\d+)/.exec(number);
		
		if(match) {
			var base = match[1];
			var sign = match[2];
			var power = parseInt(match[3], 10);
			var baseDecimalIndex = decimalIndex(base);
			
			base = base.replace(".", "");
			
			if(sign === "+") {
				number = base + repeat("0", power);
				baseDecimalIndex += power;
			} else {
				number = repeat("0", power - 1) + base;
				baseDecimalIndex -= power;
			}
			
			number = insert(number, ".", baseDecimalIndex);
			number = prettify(number);
		}
		
		return number;
	}
	/**
	 * Removes unncessary decimal points.
	 *
	 * @param number Number to trim.
	 * @return string Trimmed number.
	 */
	var trimDecimal = function(number) {
		if(number.indexOf(".") === number.length - 1) {
			return number.substr(0, number.length - 1);
		} else {
			return number;
		}
	}
	/**
	 * Trims unnecessary leading and trailing zeroes.
	 *
	 * @param string number Number to trim.
	 * @return string Trimmed number.
	 */
	var trimZeroes = function(number) {
		number = number.replace(/^(-)?(0(?!\.))+/, "$1");
		number = number.replace(/(\.[1-9]*)0+$/, "$1");
		
		return number;
	}
}();