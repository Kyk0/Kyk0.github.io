---
title: Reinforcement learning workshop for the lab
date: "2026-10-15"
kind: workshop
summary: A hands-on workshop for the ATR Lab on teaching a humanoid to move with reinforcement learning, from a naive reward to motion tracking, on the Booster K1.
where: Advanced Telerobotics Research Lab, Kent State University
audience: Lab members
links:
  - { label: all workshops, url: /projects/workshops/ }
---

Eight ways to teach a humanoid to move, each with a policy running live in MuJoCo, most of
them on the Booster K1:

1. naive RL: reward speed and staying alive, and watch the robot find strange movements;
2. reward shaping: hand-written rewards that give a normal walk;
3. a gait clock that schedules the steps;
4. tracking a math-based reference gait;
5. animation-guided RL;
6. adversarial motion priors (AMP), learning a style from motion capture;
7. motion tracking: dances and a cartwheel from one retargeted clip;
8. foundation trackers that follow thousands of motions.

We also tried to break the policies on purpose (wrong observations, weaker motors, lower
friction) to see what sim-to-real has to survive.

Slides will be added later.
