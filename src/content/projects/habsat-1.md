---
title: "HABSat-1"
description: "Leading On-Board Computer system architecture and flight software for HABSat-1, the second UC CubeCats mission."
summary: "Leading On-Board Computer architecture and flight software — the team that owns what the spacecraft does once it is out of reach."
image: "/assets/media/habsat-1-mission-patch.png"
imageAlt: "HABSat-1 mission patch"
imageFit: "contain"
tech:
  - "Embedded C"
  - "Flight software"
  - "Architecture"
  - "OBC lead"
links:
  - label: "Organization"
    href: "https://uccubecats.github.io/"
order: 4
featured: true
status: "In development"
---

<div class="mg-project-header">
<p class="mg-meta"><span><strong>Role</strong> OBC Team Lead</span> <span><strong>UC CubeCats</strong> Jan 2026 &ndash; present</span> <span><strong>University of Cincinnati</strong></span></p>
<ul class="mg-pills"><li>Embedded C</li><li>Flight software</li><li>System architecture</li><li>Team lead</li></ul>
<p class="mg-btn-row"><a class="mg-btn mg-btn--primary" href="https://uccubecats.github.io/" target="_blank" rel="noopener">CubeCats website</a></p>
</div>

<figure>
  <img src="/assets/media/habsat-1-mission-patch.png" alt="HABSat-1 mission patch" loading="lazy" decoding="async">
</figure>

## Overview

HABSat-1 (**H**armful **A**lgae **B**loom **Sat**ellite 1) is the second mission developed by UC CubeCats. The primary objective of the spacecraft is to monitor and capture imagery of harmful algae blooms, with a specific focus on the environmental health of Lake Erie. 

As the Team Lead for the On-Board Computer (OBC) system, I am responsible for the overarching architecture and flight software that acts as the brain of the satellite. The OBC dictates the operations of all other subsystems to ensure the mission's imaging goals are executed reliably in low Earth orbit. 

Specifically, this involves developing the software necessary to manage and orchestrate the payload (camera), the Attitude Determination and Control System (ADCS), and the power subsystems. The flight software must seamlessly handle commanding, telemetry, and fault management across these distinct hardware components. Crucially, the OBC also manages two-way communication with the ground station-packaging and transmitting vital telemetry and image data down to Earth, while receiving, parsing, and executing ground commands to adjust mission operations on the fly.

## Where it stands

**Current Status:** We successfully completed our Subsystems Requirement Review (SRR) in April 2026. 

**What is next:** The OBC team is currently working toward a Preliminary Design Review (PDR) targeted for the end of 2026. Our primary goal is to have our initial flight software implementation by the end of Spring 2027.
