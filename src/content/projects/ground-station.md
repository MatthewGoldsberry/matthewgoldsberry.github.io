---
title: "Ground station software"
description: "Radio drivers, pass prediction and tracking, and the database behind UC CubeCats' ground station."
summary: "The other half of the link: driving the radios, predicting and tracking each pass, and the database the downlinked data lands in."
image: "/assets/media/projects/ground-station/shed.jpeg"
imageAlt: "The UC CubeCats ground station"
tech:
  - "Radio Drivers"
  - "Telemetry"
  - "Orbit prediction"
  - "Database Design/Implementation"
  - "Python"
links:
  - label: "Organization"
    href: "https://uccubecats.github.io/"
order: 2
featured: true
status: "Live"
---

<div class="mg-project-header">
<p class="mg-meta"><span><strong>Role</strong> Ground segment software</span> <span><strong>UC CubeCats</strong> Aug 2024 &ndash; present</span> <span><strong>University of Cincinnati</strong></span></p>
<ul class="mg-pills"><li>Radio Drivers</li><li>Telemetry</li><li>Orbit prediction</li><li>Database Design/Implementation</li><li>Python</li></ul>
<p class="mg-btn-row"><a class="mg-btn mg-btn--primary" href="https://uccubecats.github.io/" target="_blank" rel="noopener">CubeCats website</a></p>
</div>

## Overview

<figure class="mg-figure--aside">
  <img src="/assets/media/projects/ground-station/shed.jpeg" alt="The UC CubeCats ground station" loading="lazy" decoding="async">
</figure>

I develop the software for UC CubeCats' ground station, starting with communication with [LEOPARDSat-1](/projects/leopardsat-1/). The station drives the radio hardware, predicts when each satellite will pass overhead, tracks it across the sky, and stores whatever comes down in a database for later analysis.

The long-term goal is a station that can talk to any satellite that is open for communication, not just our own. Nearer term, it needs to be ready to receive data from [HABSat-1](/projects/habsat-1/) once it launches.

## Radio

For the radio drivers, I first experimented with writing custom Python drivers. What is in place now instead integrates RadioLib, a C++ radio library, into the Python code. On the receive side, a software-defined radio (SDR) picks up the downlink and we demodulate the signal ourselves.

## Pass prediction and tracking

<figure class="mg-figure--aside mg-figure--left">
  <img src="/assets/media/projects/ground-station/iss-tracking.jpg" alt="The station's antenna array pointed at the ISS, a bright dot in the evening sky" loading="lazy" decoding="async">
</figure>

Pass prediction and tracking use orbital data from a public API. During a pass, the satellite's motion relative to the ground shifts its signal's frequency (Doppler shift), so the station corrects for that shift as the satellite crosses the sky.

## Data

Downlinked data goes to a database server on our side. I designed the schema, starting from an ERD, and helped write a simple FastAPI service for the CRUD operations. It runs as a Docker image on an internal UC server. The next step is a GUI, so people outside the team can explore what we collect.

