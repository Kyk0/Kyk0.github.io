---
title: "Released: Isaac Lab, end to end on H100"
date: "2026-10-21"
kind: release
summary: "An open guide to training Isaac Lab policies headless on H100 GPUs and watching them without any RTX GPU: what works, which errors to ignore, and a ready Unitree G1 USD."
where: Advanced Telerobotics Research Lab
links:
  - { label: guide, url: "https://kyry.me/isaaclab-h100/" }
  - { label: code, url: "https://github.com/Kyk0/isaaclab-h100" }
  - { label: G1 USD, url: "https://huggingface.co/datasets/Kyry10/unitree-g1-usd" }
media:
  src: /media/isaaclab-h100/g1-walk-h100.mp4
  poster: /media/isaaclab-h100/g1-walk-h100.jpg
  alt: A Unitree G1 walking and turning on a dark grid floor, trained, recorded and drawn on H100 GPUs
  caption: "Unitree G1, trained, recorded and drawn on H100s. No RTX GPU."
---

NVIDIA says Isaac Sim does not support GPUs without RT cores, like the H100. That is about
rendering. Training does not render: the physics runs on CUDA, so headless RL training works
on an H100. And to see what a policy does, you can record the motion on the H100 and watch it
in a browser.

The [guide](https://kyry.me/isaaclab-h100/) is what we run on the lab's shared H100 servers,
for Isaac Lab 2.x and Isaac Sim 5.x:

- **Training works** with `--headless`; the red renderer errors at startup are harmless as
  long as training starts.
- **No rendering at all, not even MuJoCo?** The server probably has the compute-only NVIDIA
  driver, which ships without Vulkan and EGL. The full driver fixes it.
- **Robot from URDF fails to load?** Convert it to USD once on an RTX machine, or use our
  ready [Unitree G1 USD](https://huggingface.co/datasets/Kyry10/unitree-g1-usd).

[SONIC-K1](/projects/sonic-k1/) was trained this way. Scripts are MIT, docs CC BY 4.0, on
[GitHub](https://github.com/Kyk0/isaaclab-h100).
