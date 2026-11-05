---
title: "Released: SONIC-K1, an open-weights motion tracker for the Booster K1"
date: "2026-10-22"
kind: release
summary: NVIDIA's SONIC ported to the Booster K1 and trained from scratch with under 1% of the compute. Code, weights and the K1 USD are public.
links:
  - { label: project page, url: "https://kyry.me/sonic-k1/" }
  - { label: code, url: "https://github.com/Kyk0/sonic-k1" }
  - { label: weights, url: "https://huggingface.co/Kyry10/sonic-k1" }
  - { label: K1 USD, url: "https://huggingface.co/datasets/Kyry10/booster-k1-usd" }
media:
  src: /media/sonic-k1/hero_web.mp4
  poster: /media/sonic-k1/hero_web.jpg
  alt: Human motion capture on the left and the Booster K1 policy following it on the right
  caption: Human motion capture (left) and the K1 policy (right), on unseen motions. MuJoCo.
pinned: true
---

SONIC-K1 is out: one policy that makes the Booster K1 follow thousands of human motions,
including ones it never saw in training. It is NVIDIA's SONIC, ported to the K1 and trained
from scratch on about 10,000 mocap clips in about 100 GPU-hours, under 1% of SONIC's compute.

In simulation it tracks 97.4% of 1,985 unseen motions and 93.6% of PHUMA, the external
benchmark from the SONIC paper, with SONIC's own success rule. The ONNX policy runs on a
laptop in MuJoCo, no GPU needed.

Details and results: [SONIC-K1 project](/projects/sonic-k1/) and the
[release page](https://kyry.me/sonic-k1/). Next: the policy on a physical K1.

Training data includes Motion Data by [Bones Studio](https://bones.studio/); use of the
underlying dataset is subject to the BONES Motion Capture Dataset License Agreement.
