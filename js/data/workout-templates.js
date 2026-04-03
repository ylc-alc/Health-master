export const workoutTemplates = {
  full_body_foundation: {
    id: 'full_body_foundation',
    title: 'Full Body Foundation',
    focus: 'Full body strength',
    mainDuration: '26 min',
    totalDuration: '31 to 33 min',
    coachingFocus: 'Build repeatable movement quality first. Use slow lowering and smooth breathing rather than chasing speed.',
    progression: [
      'Learn the six-move circuit and keep every rep tidy.',
      'Finish all four rounds before trying to speed up transitions.',
      'Aim to feel steady rather than exhausted by the final round.'
    ],
    easierModeNote: 'Easier mode uses 3 rounds, 35-second work periods, 20-second rests and 75 seconds between rounds.',
    substitutions: {
      energy: [
        'Tempo squat to shorter range',
        'Floor press with both hands on one dumbbell',
        'March instead of fast-feet finish'
      ],
      joint: [
        'Wall sit instead of repeated squat if knees are irritated',
        'Dead bug heel tap instead of full dead bug if lower back feels tired',
        'Wall push-up pattern instead of floor press set-up if shoulder comfort is limited'
      ]
    },
    equipment: 'Mat and one 1.5 kg dumbbell',
    settings: { rounds: 4, work: 45, rest: 15, roundRest: 60, cooldown: 180 },
    warmup: [
      { name: 'March in place', seconds: 40, cue: 'Relax the shoulders and breathe steadily.' },
      { name: 'Arm circles', seconds: 40, cue: 'Move both directions and stay controlled.' },
      { name: 'Bodyweight squat', seconds: 40, cue: 'Sit back and keep the chest lifted.' },
      { name: 'Hip hinge drill', seconds: 40, cue: 'Push the hips back and keep the spine long.' },
      { name: 'Dead bug prep', seconds: 40, cue: 'Brace the core and move slowly.' },
      { name: 'Standing reset', seconds: 40, cue: 'Shake out the body and get ready.' }
    ],
    exercises: [
      { name: 'Bodyweight squat', cue: '3 seconds down, stand tall.' },
      { name: 'Floor press', cue: 'Press smoothly and keep wrists stacked.' },
      { name: 'Bent-over dumbbell row', cue: 'Hips back, elbow toward hip.' },
      { name: 'Glute bridge', cue: 'Drive through heels and squeeze at the top.' },
      { name: 'Dead bug', cue: 'Keep lower back softly pressed to the mat.' },
      { name: 'Fast feet march', cue: 'Quick feet, quiet landing.' }
    ],
    cooldown: [
      'Walk around the room for 30 to 60 seconds.',
      'Child’s pose or long reach: 30 seconds.',
      'Hip flexor stretch: 30 seconds each side.',
      'Chest opener and slow breathing: 30 to 60 seconds.'
    ]
  },

  cardio_core_foundation: {
    id: 'cardio_core_foundation',
    title: 'Cardio and Core Foundation',
    focus: 'Low-impact cardio and core',
    mainDuration: '26 min',
    totalDuration: '31 to 33 min',
    coachingFocus: 'Keep impact low but trunk tension high. The cardio work should stay controlled enough that posture does not collapse.',
    progression: [
      'Build rhythm before intensity.',
      'Keep the core braced during planks and bicycle crunches.',
      'Use round four to hold technique under mild fatigue.'
    ],
    easierModeNote: 'Easier mode uses 3 rounds, 35-second work periods, 20-second rests and 75 seconds between rounds.',
    substitutions: {
      energy: [
        'Step jack instead of wider low-impact jack',
        'March with knee lift instead of fast feet',
        'Forearm plank from knees'
      ],
      joint: [
        'Hands-elevated shoulder tap alternative against a wall if wrists are sensitive',
        'Dead bug instead of bicycle crunch if neck gets tired',
        'Standing core brace hold instead of mountain climber if shoulders are irritated'
      ]
    },
    equipment: 'Mat only',
    settings: { rounds: 4, work: 45, rest: 15, roundRest: 60, cooldown: 180 },
    warmup: [
      { name: 'March in place', seconds: 40, cue: 'Build the heart rate gradually.' },
      { name: 'Torso rotations', seconds: 40, cue: 'Turn gently through the rib cage.' },
      { name: 'Bodyweight good morning', seconds: 40, cue: 'Hands on ribs, hips back.' },
      { name: 'Alternating knee lift', seconds: 40, cue: 'Stay upright and controlled.' },
      { name: 'Plank walkout prep', seconds: 40, cue: 'Move only as far as control allows.' },
      { name: 'Standing reset', seconds: 40, cue: 'Breathe in through nose and out through mouth.' }
    ],
    exercises: [
      { name: 'Low-impact jack', cue: 'Step side to side, reach the arms high.' },
      { name: 'Mountain climber slow drive', cue: 'Drive one knee at a time with control.' },
      { name: 'Bicycle crunch', cue: 'Exhale as the elbow reaches across.' },
      { name: 'Plank shoulder tap', cue: 'Keep hips as still as possible.' },
      { name: 'Fast feet march', cue: 'Quick feet, quiet landing.' },
      { name: 'Forearm plank', cue: 'Long spine, steady breathing.' }
    ],
    cooldown: [
      'Walk around the room for 30 to 60 seconds.',
      'Supine twist: 30 seconds each side.',
      'Kneeling side reach: 30 seconds each side.',
      'Slow nasal breathing for 30 to 60 seconds.'
    ]
  },

  lower_body_foundation: {
    id: 'lower_body_foundation',
    title: 'Lower Body and Glutes Foundation',
    focus: 'Legs and glutes',
    mainDuration: '27 min',
    totalDuration: '32 to 34 min',
    coachingFocus: 'Use tempo and holds to make the legs work since external load is light.',
    progression: [
      'Keep squat depth consistent across all rounds.',
      'Use the glutes at lockout instead of arching the lower back.',
      'Treat the final round as controlled endurance, not sloppy speed.'
    ],
    easierModeNote: 'Easier mode uses 3 rounds, 35-second work periods, 20-second rests and 75 seconds between rounds.',
    substitutions: {
      energy: [
        'Squat to chair-height imaginary target instead of deeper tempo squat',
        'Bridge hold instead of bridge pulse',
        'Calf raise only bodyweight'
      ],
      joint: [
        'Static split squat hold to short range if lunges irritate the knees',
        'Hip hinge wall-tap pattern instead of Romanian deadlift if back feels tired',
        'Seated ankle pumps instead of prolonged wall sit if knees are aggravated'
      ]
    },
    equipment: 'Mat and one 1.5 kg dumbbell',
    settings: { rounds: 4, work: 45, rest: 15, roundRest: 60, cooldown: 180 },
    warmup: [
      { name: 'March in place', seconds: 40, cue: 'Lift the knees and warm the ankles.' },
      { name: 'Hip circles', seconds: 40, cue: 'Open the hips gently.' },
      { name: 'Bodyweight squat', seconds: 40, cue: 'Spread the floor with the feet.' },
      { name: 'Reverse lunge reach', seconds: 40, cue: 'Stay balanced and use a short range.' },
      { name: 'Glute bridge prep', seconds: 40, cue: 'Find full hip extension.' },
      { name: 'Standing reset', seconds: 40, cue: 'Set posture before the main block.' }
    ],
    exercises: [
      { name: 'Tempo squat', cue: '3 seconds down, 1 second hold.' },
      { name: 'Reverse lunge alternating', cue: 'Short step back, front heel grounded.' },
      { name: 'Glute bridge pulse', cue: 'Small pulses at the top.' },
      { name: 'Romanian deadlift with dumbbell', cue: 'Hips back, feel hamstrings load.' },
      { name: 'Wall sit or squat hold', cue: 'Stay tall through the chest.' },
      { name: 'Standing calf raise', cue: 'Rise smoothly and pause at the top.' }
    ],
    cooldown: [
      'Walk around gently for 30 to 60 seconds.',
      'Quad stretch: 30 seconds each side.',
      'Figure-four glute stretch: 30 seconds each side.',
      'Hamstring fold or long-leg reach: 30 to 60 seconds.'
    ]
  },

  upper_body_foundation: {
    id: 'upper_body_foundation',
    title: 'Upper Body and Core Foundation',
    focus: 'Push, pull and trunk control',
    mainDuration: '26 min',
    totalDuration: '31 to 33 min',
    coachingFocus: 'The 1.5 kg dumbbell is too light for pure strength, so use tempo and pauses to increase demand.',
    progression: [
      'Keep ribs down during presses so the trunk does part of the work.',
      'Use clean scapular control on rows and raises.',
      'Finish the fast punch block with posture still tall.'
    ],
    easierModeNote: 'Easier mode uses 3 rounds, 35-second work periods, 20-second rests and 75 seconds between rounds.',
    substitutions: {
      energy: [
        'Wall push-up instead of kneeling push-up',
        'Seated press pattern without load instead of lateral raise on a tired day',
        'Standing march with punches instead of full fast punch block'
      ],
      joint: [
        'Wall-supported bird dog reach if wrists dislike floor loading',
        'Two-arm row instead of longer single-arm emphasis if lower back is sensitive',
        'Smaller range lateral raise if shoulders pinch'
      ]
    },
    equipment: 'Mat and one 1.5 kg dumbbell',
    settings: { rounds: 4, work: 45, rest: 15, roundRest: 60, cooldown: 180 },
    warmup: [
      { name: 'March with arm swing', seconds: 40, cue: 'Stay relaxed and open the chest.' },
      { name: 'Shoulder roll and reach', seconds: 40, cue: 'Move through a comfortable range.' },
      { name: 'Wall push-up prep', seconds: 40, cue: 'Brace the trunk and keep elbows soft.' },
      { name: 'Prone Y raise prep', seconds: 40, cue: 'Lift lightly from upper back.' },
      { name: 'Bird dog prep', seconds: 40, cue: 'Long line from fingertips to heel.' },
      { name: 'Standing reset', seconds: 40, cue: 'Shake out arms and set posture.' }
    ],
    exercises: [
      { name: 'Kneeling push-up or wall push-up', cue: 'Body moves as one unit.' },
      { name: 'Single-arm floor press', cue: 'Keep ribs down and press steadily.' },
      { name: 'Bent-over row', cue: 'Pause briefly at the top.' },
      { name: 'Lateral raise', cue: 'Lift to shoulder height with soft elbows.' },
      { name: 'Bird dog', cue: 'Reach long and resist twisting.' },
      { name: 'Fast punch combo', cue: 'Quick hands, relaxed shoulders.' }
    ],
    cooldown: [
      'Walk around gently for 30 to 60 seconds.',
      'Chest opener: 30 seconds.',
      'Cross-body shoulder stretch: 30 seconds each side.',
      'Thread-the-needle or seated reach: 30 to 60 seconds.'
    ]
  },

  full_body_progression: {
    id: 'full_body_progression',
    title: 'Full Body Progression',
    focus: 'Full body strength and density',
    mainDuration: '28 min',
    totalDuration: '33 to 35 min',
    coachingFocus: 'Density goes up here. Keep the trunk stable while the upper body works for longer bouts.',
    progression: [
      'Accept slower reps to keep shoulder position clean.',
      'Use the pause on rows and presses to compensate for the light load.',
      'Treat week 4 as consolidation rather than a max-effort week.'
    ],
    easierModeNote: 'Easier mode uses 3 rounds, 40-second work periods, 20-second rests and 75 seconds between rounds.',
    substitutions: {
      energy: [
        'Bodyweight squat instead of squat to calf raise',
        'Bridge without press instead of floor press with bridge',
        'March instead of low-impact fast feet'
      ],
      joint: [
        'Split squat to shorter range instead of reverse lunge to knee drive if knees are sensitive',
        'Dead bug heel tap instead of dead bug with reach',
        'Supported hip hinge row stance if back needs more stability'
      ]
    },
    equipment: 'Mat and one 1.5 kg dumbbell',
    settings: { rounds: 4, work: 50, rest: 15, roundRest: 60, cooldown: 180 },
    warmup: [
      { name: 'March in place', seconds: 40, cue: 'Bring the heart rate up gradually.' },
      { name: 'Arm sweep and reach', seconds: 40, cue: 'Reach overhead and pull elbows down.' },
      { name: 'Tempo squat prep', seconds: 40, cue: 'Find depth that keeps balance.' },
      { name: 'Hip hinge drill', seconds: 40, cue: 'Keep neck neutral.' },
      { name: 'Dead bug prep', seconds: 40, cue: 'Slow and controlled.' },
      { name: 'Standing reset', seconds: 40, cue: 'Prepare for a denser main set.' }
    ],
    exercises: [
      { name: 'Squat to calf raise', cue: 'Stand tall and finish on the toes.' },
      { name: 'Floor press with bridge', cue: 'Hold glutes up as you press.' },
      { name: 'Row with 1-second squeeze', cue: 'Squeeze shoulder blade toward spine.' },
      { name: 'Reverse lunge to knee drive', cue: 'Control the balance on the way up.' },
      { name: 'Dead bug with reach', cue: 'Move opposite arm and leg slowly.' },
      { name: 'Low-impact fast feet', cue: 'Quick, light steps and stay upright.' }
    ],
    cooldown: [
      'Walk slowly for 30 to 60 seconds.',
      'Hip flexor stretch: 30 seconds each side.',
      'Glute stretch: 30 seconds each side.',
      'Long exhale breathing for 30 to 60 seconds.'
    ]
  },

  cardio_core_progression: {
    id: 'cardio_core_progression',
    title: 'Cardio and Core Progression',
    focus: 'Conditioning and trunk endurance',
    mainDuration: '28 min',
    totalDuration: '33 to 35 min',
    coachingFocus: 'Progression comes from longer work intervals and better control of anti-extension core work.',
    progression: [
      'Keep breathing calm during the harder plank and hold variations.',
      'Raise intensity with arm speed and knee drive, not impact.',
      'In week 4, keep technique clean in the final 50-second efforts.'
    ],
    easierModeNote: 'Easier mode uses 3 rounds, 40-second work periods, 20-second rests and 75 seconds between rounds.',
    substitutions: {
      energy: [
        'Step jack instead of quicker jacks',
        'Standing knee drive instead of faster floor-based work',
        'Short plank hold from knees'
      ],
      joint: [
        'Dead bug instead of bicycle crunch if neck or hip flexors dominate',
        'Wall shoulder tap instead of floor tap if wrists are sensitive',
        'Slow marching brace hold instead of mountain climber if shoulders are irritable'
      ]
    },
    equipment: 'Mat only',
    settings: { rounds: 4, work: 50, rest: 15, roundRest: 60, cooldown: 180 },
    warmup: [
      { name: 'March in place', seconds: 40, cue: 'Light and rhythmic.' },
      { name: 'Torso rotation with reach', seconds: 40, cue: 'Stay long through the spine.' },
      { name: 'Alternating knee lift', seconds: 40, cue: 'Brace the trunk lightly.' },
      { name: 'Walkout prep', seconds: 40, cue: 'Only go as low as control allows.' },
      { name: 'Plank prep', seconds: 40, cue: 'Push the floor away.' },
      { name: 'Standing reset', seconds: 40, cue: 'Get ready for longer work blocks.' }
    ],
    exercises: [
      { name: 'Step jack with overhead reach', cue: 'Stay tall and move crisply.' },
      { name: 'Mountain climber controlled pace', cue: 'Drive knees under hips without bouncing.' },
      { name: 'Bicycle crunch with pause', cue: 'Pause on each cross-body reach.' },
      { name: 'Plank shoulder tap with hold', cue: 'Pause briefly on each tap to reduce sway.' },
      { name: 'Fast feet with arm drive', cue: 'Arms move fast but shoulders stay relaxed.' },
      { name: 'Forearm plank with slow shift', cue: 'Tiny body shift, ribs tucked.' }
    ],
    cooldown: [
      'Walk slowly for 30 to 60 seconds.',
      'Supine twist: 30 seconds each side.',
      'Kneeling side reach: 30 seconds each side.',
      'Long exhale breathing for 30 to 60 seconds.'
    ]
  },

  lower_body_progression: {
    id: 'lower_body_progression',
    title: 'Lower Body and Glutes Progression',
    focus: 'Leg density and glute strength',
    mainDuration: '29 min',
    totalDuration: '34 to 36 min',
    coachingFocus: 'The lower body progression relies on longer intervals, pulse work and more unilateral control.',
    progression: [
      'Keep stance and foot pressure consistent even as fatigue builds.',
      'Use glutes to finish each rep instead of overusing the lower back.',
      'In week 4, keep the pulse and hold work smooth rather than grinding.'
    ],
    easierModeNote: 'Easier mode uses 3 rounds, 40-second work periods, 20-second rests and 75 seconds between rounds.',
    substitutions: {
      energy: [
        'Tempo squat instead of squat with pulse',
        'Bridge hold instead of bridge march',
        'Supported split squat pattern instead of deeper split stance work'
      ],
      joint: [
        'Short-range split squat instead of deeper split squat hold',
        'Glute bridge hold instead of wall sit if knees are irritated',
        'Hip hinge wall tap instead of Romanian deadlift if back wants more support'
      ]
    },
    equipment: 'Mat and one 1.5 kg dumbbell',
    settings: { rounds: 4, work: 50, rest: 15, roundRest: 60, cooldown: 180 },
    warmup: [
      { name: 'March in place', seconds: 40, cue: 'Warm the ankles and hips.' },
      { name: 'Hip circles', seconds: 40, cue: 'Stay smooth through both directions.' },
      { name: 'Tempo squat prep', seconds: 40, cue: 'Control the lowering phase.' },
      { name: 'Split stance reach', seconds: 40, cue: 'Find balance before range.' },
      { name: 'Bridge prep', seconds: 40, cue: 'Press through heels and brace.' },
      { name: 'Standing reset', seconds: 40, cue: 'Set posture before the harder block.' }
    ],
    exercises: [
      { name: 'Tempo squat with pulse', cue: '3 seconds down, pulse once, stand tall.' },
      { name: 'Split squat alternating', cue: 'Stay balanced and use a controlled range.' },
      { name: 'Bridge march', cue: 'Keep hips high while alternating legs.' },
      { name: 'Romanian deadlift with pause', cue: 'Pause in the hinge before standing.' },
      { name: 'Wall sit', cue: 'Stay tall and keep breathing steady.' },
      { name: 'Standing calf raise with hold', cue: 'Pause at the top of every rep.' }
    ],
    cooldown: [
      'Walk around gently for 30 to 60 seconds.',
      'Quad stretch: 30 seconds each side.',
      'Figure-four glute stretch: 30 seconds each side.',
      'Hamstring reach or fold: 30 to 60 seconds.'
    ]
  },

  upper_body_progression: {
    id: 'upper_body_progression',
    title: 'Upper Body and Core Progression',
    focus: 'Upper-body density and trunk control',
    mainDuration: '28 min',
    totalDuration: '33 to 35 min',
    coachingFocus: 'Longer bouts and slower lowering create the challenge here. Keep posture sharp while the upper body tires.',
    progression: [
      'Use a slower lowering phase to make the load meaningful.',
      'Keep shoulders down and away from ears during raises and punches.',
      'In week 4, maintain control instead of chasing extra speed.'
    ],
    easierModeNote: 'Easier mode uses 3 rounds, 40-second work periods, 20-second rests and 75 seconds between rounds.',
    substitutions: {
      energy: [
        'Wall push-up instead of slower kneeling push-up',
        'Two-hand floor press instead of single-arm stability work',
        'March and punch instead of shuffle punch finish'
      ],
      joint: [
        'Floor press with both hands if one-arm stability feels too awkward',
        'Prone W raise instead of row if lower back wants a break',
        'Dead bug instead of bird dog if wrists are sensitive'
      ]
    },
    equipment: 'Mat and one 1.5 kg dumbbell',
    settings: { rounds: 4, work: 50, rest: 15, roundRest: 60, cooldown: 180 },
    warmup: [
      { name: 'March with arm swing', seconds: 40, cue: 'Loosen the upper body.' },
      { name: 'Shoulder circle and reach', seconds: 40, cue: 'Move with control.' },
      { name: 'Wall push-up prep', seconds: 40, cue: 'Brace the trunk.' },
      { name: 'Prone W raise prep', seconds: 40, cue: 'Squeeze from the upper back.' },
      { name: 'Bird dog prep', seconds: 40, cue: 'Reach long without twisting.' },
      { name: 'Standing reset', seconds: 40, cue: 'Prepare for longer upper-body work.' }
    ],
    exercises: [
      { name: 'Kneeling push-up with slow lower', cue: 'Lower for 3 seconds, press up smoothly.' },
      { name: 'Single-arm floor press with pause', cue: 'Pause at the bottom before pressing.' },
      { name: 'Bent-over row with squeeze', cue: 'Hold the top for 1 second.' },
      { name: 'Lateral raise plus partials', cue: 'Finish with small controlled pulses.' },
      { name: 'Bird dog with pause', cue: 'Pause fully extended for control.' },
      { name: 'Fast punch combo with shuffle', cue: 'Stay light through the feet and keep shoulders relaxed.' }
    ],
    cooldown: [
      'Walk around gently for 30 to 60 seconds.',
      'Chest opener: 30 seconds.',
      'Cross-body shoulder stretch: 30 seconds each side.',
      'Thread-the-needle or long exhale breathing: 30 to 60 seconds.'
    ]
  }
};
