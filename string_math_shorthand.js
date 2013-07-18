/**
 * Creates shortcuts for StringMath methods in the String prototype.
 *
 * @package StringMath
 * @subpackage StringMathShortHand
 * author Nicholas Tieman
 */
String.prototype.abs = function() {
	return StringMath.abs(this);
}

String.prototype.add = function(b) {
	return StringMath.add(this, b);
}

String.prototype.ceil = function() {
	return StringMath.ceil(this);
}

String.prototype.clean = function() {
	return StringMath.clean(this);
}

String.prototype.compare = function(b) {
	return StringMath.compare(this, b);
}

String.prototype.divide = function(b) {
	return StringMath.divide(this, b);
}

String.prototype.equal = function(b) {
	return StringMath.equal(this, b);
}

String.prototype.floor = function() {
	return StringMath.floor(this);
}

String.prototype.greater = function(b) {
	return StringMath.greater(this, b);
}

String.prototype.greaterOrEqual = function(b) {
	return StringMath.greaterOrEqual(this, b);
}

String.prototype.less = function(b) {
	return StringMath.less(this, b);
}

String.prototype.lessOrEqual = function(b) {
	return StringMath.lessOrEqual(this, b);
}

String.prototype.modulo = function(b) {
	return StringMath.modulo(this, b);
}

String.prototype.multiply = function(b) {
	return StringMath.multiply(this, b);
}

String.prototype.pow = function(power, precision) {
	return StringMath.pow(this, power, precision);
}

String.prototype.root = function(degree, precision) {
	return StringMath.root(this, degree, precision);
}

String.prototype.round = function() {
	return StringMath.round(this);
}

String.prototype.sqrt = function(precision) {
	return StringMath.sqrt(this, precision);
}

String.prototype.subtract = function(b) {
	return StringMath.subtract(this, b);
}