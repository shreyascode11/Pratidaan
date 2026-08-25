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
 *
 * Structure per variant (silhouette only — still faceless/abstract):
 *  - neutral: symmetric, moderate taper — the default before a choice is made
 *  - male:    broad shoulders, minimal waist taper — a blockier, grounded build
 *  - female:  narrow waist, pronounced flare — a tall, curved hourglass build
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

          {/* ambient glow behind the figure — pulses gently on its own; sized
              to clear the widest (male) and tallest (female) variants */}
          <ellipse
            className="mascot-glow"
            cx="110"
            cy="152"
            rx="132"
            ry="142"
            fill="url(#mascotGlow)"
          />

          {/* soft contact shadow, grounds the float */}
          <ellipse
            className="mascot-shadow"
            cx="110"
            cy="282"
            rx="60"
            ry="11"
            fill="#000"
            opacity="0.3"
          />

          {/* ---- neutral (default): symmetric, moderate taper ---- */}
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
            <circle cx="110" cy="146" r="10.5" fill="#dcf5e7" fillOpacity="0.92" />
            <circle
              cx="110"
              cy="146"
              r="14.5"
              fill="none"
              stroke="#5ec792"
              strokeOpacity="0.55"
              strokeWidth="1.5"
            />
          </g>

          {/* ---- male: broad shoulders, square-ish torso, minimal waist
                 taper — a blocky, grounded silhouette ---- */}
          <g className="mascot-variant mascot-variant-male">
            <path
              className="mascot-arm"
              d="M50,114 C25,119 10,148 17,182 C21,201 39,211 58,203 C68,163 63,131 50,114 Z"
              fill="url(#mascotBodyMale)"
            />
            <path
              className="mascot-arm"
              d="M170,114 C195,119 210,148 203,182 C199,201 181,211 162,203 C152,163 157,131 170,114 Z"
              fill="url(#mascotBodyMale)"
            />
            <path
              className="mascot-body"
              d="M110,34 C148,34 178,56 180,86 C182,108 168,118 168,140 C168,166 180,182 178,206 C175,236 148,258 110,258 C72,258 45,236 42,206 C40,182 52,166 52,140 C52,118 38,108 40,86 C42,56 72,34 110,34 Z"
              fill="url(#mascotBodyMale)"
            />
            <ellipse
              className="mascot-highlight"
              cx="78"
              cy="80"
              rx="32"
              ry="36"
              fill="url(#mascotHighlight)"
            />
            <path
              d="M110,132 L128,150 L110,168 L92,150 Z"
              fill="#d7f3f4"
              fillOpacity="0.92"
            />
            <path
              d="M110,126 L134,150 L110,174 L86,150 Z"
              fill="none"
              stroke="#7fd0e6"
              strokeOpacity="0.5"
              strokeWidth="1.5"
            />
          </g>

          {/* ---- female: narrow waist, pronounced flare, taller
                 curve — a tall hourglass silhouette ---- */}
          <g className="mascot-variant mascot-variant-female">
            <path
              className="mascot-arm"
              d="M74,108 C55,116 45,142 49,172 C52,191 63,200 73,193 C78,157 76,128 74,108 Z"
              fill="url(#mascotBodyFemale)"
            />
            <path
              className="mascot-arm"
              d="M146,108 C165,116 175,142 171,172 C168,191 157,200 147,193 C142,157 144,128 146,108 Z"
              fill="url(#mascotBodyFemale)"
            />
            <path
              className="mascot-body"
              d="M110,20 C134,20 152,44 152,76 C152,102 134,116 134,148 C134,180 162,196 158,224 C154,252 133,268 110,268 C87,268 66,252 62,224 C58,196 86,180 86,148 C86,116 68,102 68,76 C68,44 86,20 110,20 Z"
              fill="url(#mascotBodyFemale)"
            />
            <ellipse
              className="mascot-highlight"
              cx="86"
              cy="68"
              rx="24"
              ry="38"
              fill="url(#mascotHighlight)"
            />
            <circle cx="103" cy="152" r="7" fill="#f5f9d8" fillOpacity="0.92" />
            <circle cx="117" cy="152" r="7" fill="#eaf7c9" fillOpacity="0.75" />
          </g>
        </svg>
      </div>
    </div>
  )
}
