---
title: "Released: K1 Dances, 1046 AIST++ dances for the Booster K1"
date: "2026-11-14"
kind: release
where: Advanced Telerobotics Research Lab
summary: 1046 dances from the AIST Dance Video Database, retargeted to the Booster K1 and tracked zero-shot by SONIC-K1 in simulation. 10 styles, 3.1 hours, on Hugging Face.
links:
  - { label: website, url: "https://kyry.me/k1-dances/" }
  - { label: 3D viewer, url: "https://kyry.me/k1-dances/viewer/" }
  - { label: dataset, url: "https://huggingface.co/datasets/Kyry10/k1-dances" }
  - { label: G1 Dances, url: /blog/g1-dances-release/ }
media:
  src: /media/k1-dances/hero_web.mp4
  poster: /media/k1-dances/hero_web.jpg
  alt: A Booster K1 dancing with a motion trail, then a grid that grows from one to 128 K1 robots dancing
  caption: From one dancer to 128 different dances. MuJoCo.
---

[K1 Dances](https://kyry.me/k1-dances/) is a set of 1046 dance motions for the Booster K1 humanoid, on
[Hugging Face](https://huggingface.co/datasets/Kyry10/k1-dances). It is the K1 version of [G1 Dances](/blog/g1-dances-release/).

- 1046 dances, 10 styles (House, Break, Waack, Krump, Pop, Lock, LA-style and Middle hip-hop, Street and Ballet jazz), about 3.1 hours;
- from the [AIST Dance Video Database](https://aistdancedb.ongaaccel.jp/) by AIST, via AIST++, retargeted to the 22-DoF K1 with UMR;
- every clip is tracked zero-shot by [SONIC-K1](/blog/sonic-k1-release/) v1.0 in MuJoCo, with per-clip tracking metrics;
- NPZ joint trajectories at 60 fps, ready to play with SONIC-K1 or as targets for motion-imitation training.

It is simulation only so far. If you use it, please cite Tsuchida et al., *AIST Dance Video Database*, ISMIR 2019
(required by AIST); commercial use follows the AIST Dance DB Terms of Use.
