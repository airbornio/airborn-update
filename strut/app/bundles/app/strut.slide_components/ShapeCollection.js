define([],
function() {

	/**
	 * @constructor
	 * @param {string} name
	 * @param {string} src
	 * @param {number} aspect
	 * @returns {PlatonicShape}
	 */
	function PlatonicShape(name, src, markup, aspect) {
		if (!(this instanceof PlatonicShape))
			return new PlatonicShape(name, src, markup, aspect);

		this.name = name;
		var loc = window.location.href;
		var hashIdx = loc.indexOf('#');
		var finalIdx;
		if (hashIdx != -1) {
			loc = loc.substring(0, hashIdx);
		}
		finalIdx = loc.lastIndexOf('/');

		if (finalIdx != -1)
			loc = loc.substring(0, finalIdx);

		this.src = loc
			+ '/preview_export/shapes/' + src;
		this.markup = markup;
		this.aspect = aspect;
	}

	/**
	 * Standard collection of shapes.
	 *
	 * @constructor
	 */
	function ShapeCollection() {
		this.title = 'shapes';
		// TODO: insertion of markup should be done by the build process
		this.shapes = [
			PlatonicShape('square', 'square.svg', '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 50 50" preserveAspectRatio="none"><rect width="50" height="50"/></svg>', 1),
			PlatonicShape('triangle', 'triangle.svg', '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 50 50" preserveAspectRatio="none"><polygon points="25,0 50,50 0,50"/></svg>', 1),
			PlatonicShape('circle', 'circle.svg', '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="none" viewBox="0 0 80 80"><circle cx="40" cy="40" r="40" /></svg>', 1),
			PlatonicShape('hexagon', 'hexagon.svg', '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 726 726" preserveAspectRatio="none"><polygon points="723,314 543,625.769145 183,625.769145 3,314 183,2.230855 543,2.230855 723,314"/></svg>', 1),
			PlatonicShape('pentagon', 'pentagon.svg', '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="none"><polygon points="156.427384220077,186.832815729997 43.5726157799226,186.832815729997 8.69857443566525,79.5015528100076 100,13.1671842700025 191.301425564335,79.5015528100076" /></svg>', 1),
			PlatonicShape('star', 'star.svg', '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 180 180" preserveAspectRatio="none"><polygon points="90,0 30,170 180,50 0,50 150,170"/></svg>', 1),
			PlatonicShape('pacman', 'pacman.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 571.11 571.11" preserveAspectRatio="none"><path d="M535.441,412.339A280.868,280.868 0 1,1 536.186,161.733L284.493,286.29Z"/></svg>', 1),
			PlatonicShape('heart', 'heart.svg', '<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 645 585" preserveAspectRatio="none"><defs id="defs4" /><g id="layer1"><path d="M 297.29747,550.86823 C 283.52243,535.43191 249.1268,505.33855 220.86277,483.99412 C 137.11867,420.75228 125.72108,411.5999 91.719238,380.29088 C 29.03471,322.57071 2.413622,264.58086 2.5048478,185.95124 C 2.5493594,147.56739 5.1656152,132.77929 15.914734,110.15398 C 34.151433,71.768267 61.014996,43.244667 95.360052,25.799457 C 119.68545,13.443675 131.6827,7.9542046 172.30448,7.7296236 C 214.79777,7.4947896 223.74311,12.449347 248.73919,26.181459 C 279.1637,42.895777 310.47909,78.617167 316.95242,103.99205 L 320.95052,119.66445 L 330.81015,98.079942 C 386.52632,-23.892986 564.40851,-22.06811 626.31244,101.11153 C 645.95011,140.18758 648.10608,223.6247 630.69256,270.6244 C 607.97729,331.93377 565.31255,378.67493 466.68622,450.30098 C 402.0054,497.27462 328.80148,568.34684 323.70555,578.32901 C 317.79007,589.91654 323.42339,580.14491 297.29747,550.86823 z" id="path2417"/><g transform="translate(129.28571,-64.285714)" id="g2221"/></g></svg>', 1),
			PlatonicShape('infinity', 'infinity.svg', '<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><g><path stroke-width="1px" d="m349.597595,238.17981c15.849091,14.657486 34.60968,25.733734 56.281982,33.228851c21.671265,7.495331 46.092407,11.24292 73.263641,11.242828c32.668762,0.000092 59.354279,-5.579712 80.056244,-16.739349c20.700806,-11.325974 31.051331,-25.733459 31.052124,-43.222443c-0.000793,-16.822479 -9.542786,-30.813492 -28.62616,-41.973221c-19.084778,-11.159363 -43.020752,-16.73912 -71.808075,-16.739334c-26.5242,0.000214 -50.622009,5.663269 -72.293213,16.989166c-21.348907,11.159744 -43.991089,30.230896 -67.926544,57.213501m-59.193085,-26.732941c-15.849976,-14.657166 -34.61055,-25.650101 -56.282013,-32.978958c-21.348709,-7.328445 -45.769836,-10.992783 -73.263657,-10.992981c-32.993088,0.000198 -59.84024,5.496704 -80.541473,16.489441c-20.378067,10.993195 -30.567028,25.317368 -30.566898,42.97261c-0.00013,16.822723 9.541882,30.813782 28.626179,41.973267c19.083969,11.159607 43.019958,16.739441 71.80806,16.739319c26.523346,0.000122 50.62114,-5.662964 72.293213,-16.989166c21.671478,-11.325958 44.313583,-30.397125 67.92659,-57.213531m34.448425,45.720856c-22.642609,22.485779 -46.740234,39.058563 -72.293289,49.718323c-25.230194,10.493347 -53.047653,15.740021 -83.45253,15.73996c-43.990807,0.000061 -81.026909,-9.244049 -111.108456,-27.73233c-30.081831,-18.654663 -45.122731,-41.806549 -45.122602,-69.455734c-0.00013,-29.147934 13.423501,-52.716156 40.270741,-70.70491c27.170368,-17.988297 62.427532,-26.982544 105.77132,-26.982796c30.728348,0.000252 58.384155,5.246895 82.967438,15.739967c24.905945,10.493515 49.003754,27.232849 72.293213,50.217957c21.994659,-22.985107 45.768982,-39.890991 71.322876,-50.717636c25.552734,-10.992752 54.017242,-16.489243 85.393311,-16.489471c43.343018,0.000229 80.217407,9.410889 110.62323,28.231979c30.404541,18.654984 45.606995,41.890076 45.607788,69.705536c-0.000793,29.148254 -13.585999,52.633209 -40.755859,70.455109c-26.8479,17.822021 -61.943237,26.733032 -105.286163,26.732941c-30.405701,0.000092 -57.738037,-4.913483 -81.99704,-14.74057c-23.936401,-9.993561 -48.681091,-26.566345 -74.233978,-49.718323" id="text1306"/></g></svg>', 1),
			PlatonicShape('yin yang', 'yinyang.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 466 466" preserveAspectRatio="none"><circle cx="233" cy="233" r="231"/><path d="M 233,459 a 226 226 0 0 1 0,-452 a 113 113 0 0 1 0,226 z" fill="#fff"/><circle cx="233" cy="346" r="113"/><circle cx="233" cy="120" r="30"/><circle cx="233" cy="346" r="30" fill="#fff"/></svg>', 1)
			// PlatonicShape('glasses', 'glasses.svg', 1)
		];
	}

	ShapeCollection.prototype = {
		on: function() {}
	};

	return ShapeCollection;
});