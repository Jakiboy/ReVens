/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

function generateSlug(name) {
	return name.toLowerCase().replace(/\s+/g, '-');
}

export {
    generateSlug
};
