/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

function generateSlug(name) {
	return name.toLowerCase().replace(/\s+/g, '-');
}

export {
    generateSlug
};
