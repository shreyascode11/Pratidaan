/**
 * Abstract, faceless mascot — a single soft blob silhouette (no head/face
 * split, per design brief) built from hand-authored SVG paths.
 *
 * Each `gender` state ('neutral' | 'male' | 'female') is its own fully-drawn
 * variant (body + arms + accessory), stacked in the same coordinate space and
 * cross-faded with plain CSS (opacity + transform). Swapping which variant is
 * visible is far more reliable across browsers than trying to CSS-transition
 * between two different path `d` strings, which doesn't interpolate at all.
 * The idle float/glow keeps running underneath, independent of that swap.
 */
export default function Mascot({ gender = 'neutral', className = '' }) {
  return (
    <div className={`mascot ${className}`} data-gender={gender} aria-hidden="true">
      <div className="mascot-float">
        <svg
          viewBox="0 0 220 300"
          className="mascot-svg block w-full overflow-visible"
        >
          <defs>
            <linearGradient id="mascotBodyNeutral" x1="15%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#a9edc9" />
              <stop offset="48%" stopColor="#3bb078" />
              <stop offset="100%" stopColor="#182420" />
            </linearGradient>
            <linearGradient id="mascotBodyMale" x1="15%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#bfe9ea" />
              <stop offset="46%" stopColor="#2f8f93" />
              <stop offset="100%" stopColor="#12181a" />
            </linearGradient>
            <linearGradient id="mascotBodyFemale" x1="15%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#eaf7c9" />
              <stop offset="48%" stopColor="#6cc79a" />
              <stop offset="100%" stopColor="#241f1a" />
            </linearGradient>

            <linearGradient id="mascotHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="mascotGlow" cx="50%" cy="42%" r="60%">
              <stop offset="0%" stopColor="#5ec792" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#5ec792" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ambient glow behind the figure — pulses gently on its own */}
          <ellipse
            className="mascot-glow"
            cx="110"
            cy="150"
            rx="118"
            ry="130"
            fill="url(#mascotGlow)"
          />

          {/* soft contact shadow, grounds the float */}
          <ellipse
            className="mascot-shadow"
            cx="110"
            cy="278"
            rx="56"
            ry="11"
            fill="#000"
            opacity="0.3"
          />

          {/* ---- neutral (default) ---- */}
          <g className="mascot-variant mascot-variant-neutral">
            <path
              className="mascot-arm"
              d="M63,116 C42,121 31,146 36,175 C39,193 53,202 67,196 C74,161 71,133 63,116 Z"
              fill="url(#mascotBodyNeutral)"
            />
            <path
              className="mascot-arm"
              d="M157,116 C178,121 189,146 184,175 C181,193 167,202 153,196 C146,161 149,133 157,116 Z"
              fill="url(#mascotBodyNeutral)"
            />
            <path
              className="mascot-body"
              d="M110,30 C140,30 162,54 163,86 C164,110 153,122 153,144 C153,170 169,188 166,214 C163,242 139,262 110,262 C81,262 57,242 54,214 C51,188 67,170 67,144 C67,122 56,110 57,86 C58,54 80,30 110,30 Z"
              fill="url(#mascotBodyNeutral)"
            />
            <ellipse
              className="mascot-highlight"
              cx="82"
              cy="76"
              rx="28"
              ry="38"
              fill="url(#mascotHighlight)"
            />
            <circle cx="110" cy="152" r="10.5" fill="#dcf5e7" fillOpacity="0.92" />
            <circle
              cx="110"
              cy="152"
              r="14.5"
              fill="none"
              stroke="#5ec792"
              strokeOpacity="0.55"
              strokeWidth="1.5"
            />
          </g>

          {/* ---- male: broader shoulders, squarer taper, faceted accent ---- */}
          <g className="mascot-variant mascot-variant-male">
            <path
              className="mascot-arm"
              d="M58,116 C36,120 24,146 30,177 C33,196 49,205 65,198 C74,161 70,132 58,116 Z"
              fill="url(#mascotBodyMale)"
            />
            <path
              className="mascot-arm"
              d="M162,116 C184,120 196,146 190,177 C187,196 171,205 155,198 C146,161 150,132 162,116 Z"
              fill="url(#mascotBodyMale)"
            />
            <path
              className="mascot-body"
              d="M110,32 C144,32 168,54 169,84 C170,106 157,118 157,142 C157,168 172,184 169,210 C165,240 141,260 110,260 C79,260 55,240 51,210 C48,184 63,168 63,142 C63,118 50,106 51,84 C52,54 76,32 110,32 Z"
              fill="url(#mascotBodyMale)"
            />
            <ellipse
              className="mascot-highlight"
              cx="80"
              cy="76"
              rx="28"
              ry="38"
              fill="url(#mascotHighlight)"
            />
            <path
              d="M110,136 L126,152 L110,168 L94,152 Z"
              fill="#d7f3f4"
              fillOpacity="0.92"
            />
            <path
              d="M110,131 L131,152 L110,173 L89,152 Z"
              fill="none"
              stroke="#7fd0e6"
              strokeOpacity="0.5"
              strokeWidth="1.5"
            />
          </g>

          {/* ---- female: narrower waist, taller curve, soft twin accent ---- */}
          <g className="mascot-variant mascot-variant-female">
            <path
              className="mascot-arm"
              d="M68,112 C48,118 39,143 43,171 C46,189 58,198 69,192 C75,158 73,130 68,112 Z"
              fill="url(#mascotBodyFemale)"
            />
            <path
              className="mascot-arm"
              d="M152,112 C172,118 181,143 177,171 C174,189 162,198 151,192 C145,158 147,130 152,112 Z"
              fill="url(#mascotBodyFemale)"
            />
            <path
              className="mascot-body"
              d="M110,24 C136,24 155,48 155,80 C155,106 141,120 141,146 C141,174 160,190 156,218 C152,248 133,264 110,264 C87,264 68,248 64,218 C60,190 79,174 79,146 C79,120 65,106 65,80 C65,48 84,24 110,24 Z"
              fill="url(#mascotBodyFemale)"
            />
            <ellipse
              className="mascot-highlight"
              cx="84"
              cy="70"
              rx="26"
              ry="36"
              fill="url(#mascotHighlight)"
            />
            <circle cx="102" cy="150" r="7.5" fill="#f5f9d8" fillOpacity="0.92" />
            <circle cx="118" cy="150" r="7.5" fill="#eaf7c9" fillOpacity="0.75" />
          </g>
        </svg>
      </div>
    </div>
  )
}
