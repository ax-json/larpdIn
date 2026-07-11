========================================================================
LARPedIn — project assets bundle
========================================================================

Everything created so far, ready to drop into the project.

------------------------------------------------------------------------
CONTENTS
------------------------------------------------------------------------

PLAN.txt
  The full project plan — concept, mechanics, the 4-axis rubric, the
  3-judge panel (Recruiter / VC / Intern), all cons + solutions, and the
  Claude Code build sequence (Section 11). This is the source of truth to
  keep in the repo so Claude Code has full context.

LARP_EXAMPLES.txt
  The "what is a good LARP" doc + 5 worked good/bad examples across
  difficulty tiers. Doubles as few-shot calibration material for the
  judge prompt (build Step 2).

icons/
  Icons.jsx          Drop-in React components (the form you'll actually
                     use). Nav/action icons use currentColor.
  svg/               The same icons as individual .svg files.
  icons-preview.html Open in a browser to see the whole set.
  preview.png        Screenshot of the set.

  Icon list: logo, home, network, jobs, me, like, comment, repost, send,
  search, clipboard (Assignment Desk), gavel (The Court), trophy (Rank).

mascot/
  mascot-founder.png  The chosen mascot — black-turtleneck founder at the
                      window, empty "Startup Idea Final Final V7" doc in
                      the reflection. Flat LinkedIn-blue theme. 1024x1024.
                      NOTE: still has its background. If you want it cut
                      out (transparent) or cropped for a slot, that's a
                      quick follow-up.

------------------------------------------------------------------------
SUGGESTED PLACEMENT IN A VITE/REACT PROJECT
------------------------------------------------------------------------
  src/components/Icons.jsx        <- from icons/Icons.jsx
  public/mascot-founder.png       <- from mascot/
  (svg/ files are optional if you use the JSX components)

  PLAN.txt and LARP_EXAMPLES.txt -> keep at repo root or in /docs so
  Claude Code can read them as context.
========================================================================
