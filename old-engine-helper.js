/**
 * LEGACY MODULE
 * Do not add new features here.
 * It will be removed from flexEngine and flexEngine Modules
 */


// Note: replace it by flexEngineDefaultVaribles
// Variable system
const flexEngineStyleVarible = {
	color: function(colorObj) {
		if (!colorObj || !colorObj.mode) return 'transparent';

		switch (colorObj.mode) {
			case 'hex':
				return colorObj.hex;

			case 'linearGradient':
				// Map the stops array into "color offset, color offset" format
				const gradientStops = colorObj.stops
					.map(stop => `${stop.color} ${stop.offset}`)
					.join(', ');
				return `linear-gradient(${colorObj.angle}, ${gradientStops})`;

			case 'backgroundIMG':
				const repeat = `${colorObj.repeatX ? 'repeat-x' : ''} ${colorObj.repeatY ? 'repeat-y' : ''}`.trim() || 'no-repeat';

				// Mapping 1-3 to CSS position keywords
				const posX = ['left', 'center', 'right'][colorObj.positionX - 1] || 'center';
				const posY = ['top', 'center', 'bottom'][colorObj.positionY - 1] || 'center';
				const attachment = colorObj.attachment ? 'fixed' : 'scroll';

				// If a color overlay is provided, we use a linear-gradient trick 
				// to layer the color over the image.
				if (colorObj.coloroverlay && colorObj.coloroverlay !== 'transparent') {
					return `linear-gradient(${colorObj.coloroverlay}, ${colorObj.coloroverlay}), url("${colorObj.src}") ${posX} ${posY} / auto ${repeat} ${attachment}`;
				}
				return `url("${colorObj.src}") ${posX} ${posY} / auto ${repeat} ${attachment}`;

			case 'variables':
				return `var(--${colorObj.variables})`;

			case 'inherit':
				return 'inherit';

			case 'none':
			default:
				return 'transparent';
		}
	},

	space: function(spaceObj) {
		if (!spaceObj || !spaceObj.mode) return '0px';

		switch (spaceObj.mode) {
			case 'auto':
				return 'auto';

            case 'none':
                return '0px';

			case 'variables':
				return `var(--${BUILDER_CONFIG.classPrefix + spaceObj.variables})`;

				// Handles: px, rem, em, %, vw, vh, vmin, vmax, ch
			default:
				const validUnits = ['px', 'rem', 'em', '%', 'vw', 'vh', 'vmin', 'vmax', 'ch'];
				if (validUnits.includes(spaceObj.mode)) {
					return `${spaceObj.value}${spaceObj.mode}`;
				}

				// Fallback for unexpected modes
				return '0px';
		}
	},

	media: function(mediaObj) {
		if (!mediaObj || !mediaObj.mode) return '';

		switch (mediaObj.mode) {
			case 'internal':
				const prefix = BUILDER_CONFIG.classPrefix;

				// Constructing: prefix/assets/folder/name
				return `/${prefix}assets/${mediaObj.folder}/${mediaObj.name}`;

			case 'external':
				return mediaObj.url;

			default:
				return '';
		}
	},

	// for Head only
	absMedia: function(mediaObj, mainArray, selfSlug) {
		if (!mediaObj || !mediaObj.mode) return '';

		switch (mediaObj.mode) {
			case 'internal':

				const prefix = BUILDER_CONFIG.classPrefix;

				const absoluteDomainEnable = (selfSlug !== null && mainArray.domain !== null && selfSlug !== "" && mainArray.domain !== "");
				const absoluteDomain = (absoluteDomainEnable) ? `https://${mainArray.domain}` : "/";

				// Constructing: prefix/assets/folder/name
				return `${absoluteDomain}/${prefix}assets/${mediaObj.folder}/${mediaObj.name}`;

			case 'external':
				return mediaObj.url;

			default:
				return '';
		}
	},

	curve: function(curveObj) {
		if (!curveObj || !curveObj.mode) return "";

		const mode = curveObj.mode;

		// 1. System default (your design palette)
		if (mode === "system") {
			return "var(--animation-curve)";
		}

		// 2. Built‑in CSS curves
		if (
			mode === "linear" ||
			mode === "ease" ||
			mode === "ease-in" ||
			mode === "ease-out" ||
			mode === "ease-in-out"
		) {
			return mode;
		}

		// 3. Step()
		if (mode === "step") {
			const n = curveObj.stepNumber || 1;
			const end = curveObj.changeAtEnd === true ? "end" : "start";
			return `steps(${n}, ${end})`;
		}

		// 4. Cubic‑bezier()
		if (mode === "cubic-bezier") {
			const x1 = curveObj.x1 ?? 0;
			const y1 = curveObj.y1 ?? 0;
			const x2 = curveObj.x2 ?? 1;
			const y2 = curveObj.y2 ?? 1;
			return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
		}

		// 5. Unknown → fallback
		return "var(--animation-curve)";
	},
};