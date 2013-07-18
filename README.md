StringMath.js
=============

String-based math for high precision calculation.

I created this primarily to help me out with Project Euler (projecteuler.net). There are lots of problems that require
calculations with very long numbers, and JavaScript floating point completely screws it up. Using this library I don't
have to spend so much time figuring out how to preserve precision on simple arithmetic every time this issue comes up.

Similarly with the fraction section. I'm aiming for natural-feeling fraction arithmetic so I can concentrate on solving
the actual problem instead of the basic math.

The algorithms aren't terribly efficient--most simply mirror the methods I would use if solving the problem with pencil
and paper.

Include string_math_shorthand to attach the StringMath methods directly to strings. This allows shorthand operations:

* "1".add("1") === "2"
* "3".subtract("2") === "1"
* "16".sqrt() === "4"

In general, I tried to replicate the functionality of the JavaScript Math object. If the function has a counterpart in
Math (e.g. pow, ceil) I used the same function name for StringMath. If no corresponding function existed
(e.g. addition, subtraction) I used the long form English name for the operation.
