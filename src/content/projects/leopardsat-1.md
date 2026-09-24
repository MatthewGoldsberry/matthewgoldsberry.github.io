---
title: "LEOPARDSat-1"
description: "Embedded sensor drivers and test work on the On-Board Computer team for LEOPARDSat-1, Ohio's first student-led satellite."
summary: "Ohio's first student-led satellite, launched on NG24 and now in low Earth orbit. I helped write the embedded software that works with the sensors, and the tests behind it."
image: "/assets/media/projects/leopardsat-1/mission-patch.png"
imageAlt: "LEOPARDSat-1 mission patch"
imageFit: "contain"
tech:
  - "Embedded C"
  - "Sensor drivers"
  - "Testing"
links:
  - label: "Organization"
    href: "https://uccubecats.github.io/"
order: 6
featured: true
status: "In orbit"
---

<div class="mg-project-header">
<p class="mg-meta"><span><strong>Role</strong> On-Board Computer team</span> <span><strong><a href="https://uccubecats.github.io/">UC CubeCats</a></strong></span> <span><strong>Status</strong> Currently in Orbit</span></p>
<ul class="mg-pills"><li>Embedded C</li><li>Sensor drivers</li><li>Flight software</li><li>Testing</li></ul>
<p class="mg-btn-row"><a class="mg-btn mg-btn--primary" href="https://uccubecats.github.io/" target="_blank" rel="noopener">CubeCats website</a></p>
</div>

## Overview

<figure class="mg-figure--aside">
  <img src="/assets/media/projects/leopardsat-1/satellite.jpg" alt="LEOPARDSat-1" loading="lazy" decoding="async">
</figure>

**The first student-led satellite from the state of Ohio.**

Launched on the NG24 resupply mission, [LEOPARDSat-1](https://uccubecats.github.io/LEOPARDSat-1.html) is currently in Low Earth Orbit (LEO). The satellite's primary scientific payload is a radiation experiment designed to collect and compare radiation readings as they pass through various material compositions. 

As a member of the On-Board Computer (OBC) team, I developed the embedded C software required to interface with some of the satellite's sensors. I also wrote and ran testing on satellite hardware or mocks of the hardware. 

## Ground Station & Future Missions

<figure class="mg-figure--aside mg-figure--left">
  <img src="/assets/media/projects/leopardsat-1/mission-patch.png" alt="LEOPARDSat-1 mission patch" loading="lazy" decoding="async">
</figure>

In addition to my work on the flight software, I am the primary developer for the ground station responsible for communicating with LEOPARDSat-1. You can read more about that architecture on my [Ground Station](/projects/ground-station/) page.

Currently, I am taking the technical and procedural lessons learned from implementing LEOPARDSat-1 and applying them as the new OBC Team Lead for our next mission, [HABSat-1](/projects/habsat-1/). My focus is on improving our development experience, standardizing our testing pipelines, and ensuring our next software architecture is even more robust.
