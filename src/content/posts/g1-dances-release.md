---
title: "Released: G1 Dances, 893 AIST++ dances for the Unitree G1"
date: "2026-11-12"
kind: release
where: Advanced Telerobotics Research Lab
summary: 893 dances from the AIST Dance Video Database, retargeted to the Unitree G1 and tracked zero-shot by NVIDIA SONIC in simulation. 10 styles, 2.8 hours, free on Hugging Face.
links:
  - { label: website, url: "https://kyry.me/g1-dances/" }
  - { label: 3D viewer, url: "https://kyry.me/g1-dances/viewer/" }
  - { label: dataset, url: "https://huggingface.co/datasets/Kyry10/g1-dances" }
  - { label: SONIC-K1, url: /blog/sonic-k1-release/ }
media:
  src: /media/g1-dances/hero_web.mp4
  poster: /media/g1-dances/hero_web.jpg
  alt: A Unitree G1 dancing with a motion trail, then a grid that grows from one to 128 G1 robots dancing
  caption: From one dancer to 128 different dances. MuJoCo.
---

[G1 Dances](https://kyry.me/g1-dances/) is a set of 893 dance motions for the Unitree G1 humanoid, free on
[Hugging Face](https://huggingface.co/datasets/Kyry10/g1-dances) with no login.

- 893 dances, 10 styles (House, Break, Waack, Krump, Pop, Lock, LA-style and Middle hip-hop, Street and Ballet jazz), about 2.8 hours;
- from the [AIST Dance Video Database](https://aistdancedb.ongaaccel.jp/) by AIST, via AIST++, retargeted to the 29-DoF G1 with PhySINK (PHUMA);
- every clip is tracked zero-shot by NVIDIA's released SONIC controller in MuJoCo, with per-clip tracking metrics;
- NPZ joint trajectories at 60 fps, ready as targets for motion-imitation training;
- all 893 play in 3D in the browser: [viewer](https://kyry.me/g1-dances/viewer/).

It is simulation only so far. If you use it, please cite Tsuchida et al., *AIST Dance Video Database*, ISMIR 2019
(required by AIST); commercial use follows the AIST Dance DB Terms of Use.
