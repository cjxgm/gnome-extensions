
function make(ripple)
{
	let $ = {};

	$.enable = function() {
		ripple();
	}

	$.disable = function() {
		ripple();
	}

	return $;
}

