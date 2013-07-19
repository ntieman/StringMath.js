/**
 * String-base fractions.
 *
 * @author Nicholas Tieman
 * @package StringMath
 * @subpackage StringFraction
 */
/**
 * String fraction object.
 *
 * @param string numerator Numerator.
 * @param string denominator Denominator.
 */
function StringFraction(newNumerator, newDenominator) {
	/**
	 * @var string Numerator.
	 */
	this.numerator = newNumerator;
	/**
	 * @var string Denominator.
	 */
	this.denominator = newDenominator;
}
/**
 * Adds one fraction to another.
 *
 * @param StringFraction b Second fraction.
 * @return StringFraction Sum.
 */
StringFraction.prototype.add = function(b) {
	if(StringMath.equal(b.numerator, "0")) {
		return this;
	}
	
	if(StringMath.equal(this.numerator, "0")) {
		return b;
	}
	
	var oldDenominator = this.denominator;
	
	this.numerator = StringMath.multiply(this.numerator, b.denominator);
	this.denominator = StringMath.multiply(this.denominator, b.denominator);
	
	b.numerator = StringMath.multiply(b.numerator, oldDenominator);
	b.denominator = StringMath.multiply(b.denominator, oldDenominator);
	
	return new StringFraction(StringMath.add(this.numerator, b.numerator), this.denominator).reduce();
}
/**
 * Divides one fraction by another.
 *
 * @param StringFraction b Second fraction.
 * @return StringFraction Quotient.
 */
StringFraction.prototype.divide = function(b) {
	return new StringFraction(
		StringMath.multiply(this.numerator, b.denominator),
		StringMath.multiply(this.denominator, b.numerator)
	).reduce();
}
/**
 * Multiplies one fraction by another.
 *
 * @param StringFraction b Second fraction.
 * @return StringFraction Product.
 */
StringFraction.prototype.multiply = function(b) {
	return new StringFraction(
		StringMath.multiply(this.numerator, b.numerator),
		StringMath.multiply(this.denominator, b.denominator)
	).reduce();
}
/**
 * Subtracts one fraction from another.
 *
 * @param StringFraction b Second fraction.
 * @return StringFraction Difference.
 */
StringFraction.prototype.subtract = function(b) {
	if(StringMath.equal(b.numerator, "0")) {
		return this;
	}
	
	if(StringMath.equal(this.numerator, "0")) {
		if(b.numerator.charAt(0) === "-") {
			return new StringFraction(b.numerator.substr(1), b.denominator);
		} else {
			return new StringFraction("-" + b.numerator, b.denominator);
		}
	}
	
	var oldDenominator = this.denominator;
	
	this.numerator = StringMath.multiply(this.numerator, b.denominator);
	this.denominator = StringMath.multiply(this.denominator, b.denominator);
	
	b.numerator = StringMath.multiply(b.numerator, oldDenominator);
	b.denominator = StringMath.multiply(b.denominator, oldDenominator);
	
	return new StringFraction(StringMath.subtract(this.numerator, b.numerator), this.denominator).reduce();
}
/**
 * Reduces an integer fraction to its simplest terms.
 *
 * @return StringFraction Returns a self-reference for chainable operations.
 */
StringFraction.prototype.reduce = function() {
	if(
		!StringMath.equal(this.numerator, StringMath.floor(this.numerator)) || 
		!StringMath.equal(this.denominator, StringMath.floor(this.denominator))
	) {
		return this;
	}
	
	if(StringMath.greater(this.numerator, this.denominator)) {
		var a = this.numerator;
		var b = this.denominator;
	} else {
		var a = this.denominator;
		var b = this.numerator;
	}
	
	var remainder = StringMath.modulo(a, b);
	
	while(!StringMath.equal(remainder, "0")) {
		a = b;
		b = remainder;	
		remainder = StringMath.modulo(a, b);
	}
	
	this.numerator = StringMath.divide(this.numerator, b);
	this.denominator = StringMath.divide(this.denominator, b);
	
	return this;
}
/**
 * Generates a decimal representation of the fraction.
 *
 * @param number precision Number of decimal points to calculate (optional).
 * @return string Decimal string.
 */
StringFraction.prototype.toDecimal = function(precision) {
	return StringMath.divide(this.numerator, this.denominator, precision);
}
/**
 * Generates a string representation of the fraction.
 *
 * @return string String.
 */
StringFraction.prototype.toString = function() {
	return this.numerator + " / " + this.denominator;
}