---
title: "Ground station software"
description: "Telemetry ingestion, transmission-window prediction, and the database behind UC CubeCats' ground segment."
summary: "The other half of the link: telemetry ingestion, predicting the next transmission window, and the database the downlinked data lands in."
image: "/assets/media/gs_shed.jpeg"
imageAlt: "The UC CubeCats ground station"
tech:
  - "Python"
  - "Telemetry"
  - "Orbit prediction"
  - "Databases"
links:
  - label: "Organization"
    href: "https://uccubecats.github.io/"
order: 6
featured: true
status: "In development"
---

<div class="mg-project-header">
<p class="mg-meta"><span><strong>Role</strong> Ground segment software</span> <span><strong>UC CubeCats</strong> Aug 2024 &ndash; present</span> <span><strong>University of Cincinnati</strong></span></p>
<ul class="mg-pills"><li>Python</li><li>Telemetry</li><li>Orbit prediction</li><li>Databases</li></ul>
<p class="mg-btn-row"><a class="mg-btn mg-btn--primary" href="https://uccubecats.github.io/" target="_blank" rel="noopener">CubeCats website</a></p>
</div>

## Overview

I am building the ground station software that ingests telemetry and determines upcoming
transmission windows, feeding into a database for server-side analysis.

I am building and working on the ground station software that interacts with radio components to communicate with satellites, specifically LEOPARDSat-1. This has involved writing custom drivers in python for different radio modules as well integrating RadioLib, a C++ package into the python code to abstract the driver code. We current use a SDR for recieving the frequencies and demodulate them on our end. 

We use telemetry data from a public API for pass prediction and tracking and adjust for doppler shift which bends the radio waves from the satellites. 

The other part of this is a database server on our side for storing the data for further anaylsis and eventually a GUI of the data for others to also see out findings. This involved design and ERD and a simple FastAPI server to manage the CRUD operations. This is build into a docker image that is hosted on an internal server at UC. 

The goal of this ground station is to be able to communicate with any satellite open for communication. 

<div class="mg-todo" markdown>
Expand. The flight software gets the attention, but the ground segment is the half a
reader can actually picture: a dish on a roof, a satellite overhead for ten minutes, and
one chance to get the data down. Set that scene, then say what you built.
</div>

## Predicting the pass

<div class="mg-todo" markdown>
How transmission windows are computed — the orbital elements you start from, the library
or maths involved, and how far ahead it is accurate. If a pass is only a few minutes
long, say so; it is the fact that makes the rest of this matter.
</div>

## Telemetry and storage

<div class="mg-todo" markdown>
The stack, and how the telemetry database is structured. What does a downlinked packet
look like on arrival, and what does it look like by the time it is queryable?
</div>
