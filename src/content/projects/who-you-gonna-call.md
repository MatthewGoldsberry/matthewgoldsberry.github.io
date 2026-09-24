---
title: "Who You Gonna Call? 3-1-1!"
description: "Cincinnati's 2025 311 service requests, narrowed from 381 service types to the six that mean visual disorder."
summary: "381 kinds of Cincinnati 311 request, narrowed to the six that represent visual disorder, on a map and a timeline that filter each other — so one neighborhood's problem stops being averaged away by the city's."
image: "/assets/media/projects/who-you-gonna-call/app.png"
imageAlt: "Visual Disorder in Cincinnati dashboard"
imageFit: "contain"
tech:
  - "D3.js"
  - "Leaflet"
  - "JavaScript"
  - "Python"
  - "Pandas"
links:
  - label: "Live demo"
    href: "https://visual-disorder-in-cincinnati.vercel.app/"
  - label: "Source"
    href: "https://github.com/MatthewGoldsberry/Who-you-gonna-call"
order: 4
featured: true
status: "Live"
---

<div class="mg-project-header">
<p class="mg-meta"><span><span><strong>Completed With </strong><a href="https://github.com/isaac-dowdy">Isaac Dowdy</a></span> <span><strong>Course project</strong></span></p>
<ul class="mg-pills"><li>D3.js</li><li>Leaflet</li><li>JavaScript</li><li>Python</li><li>Pandas</li><li>Data Visualization</li><li>Web Design</li></ul>
<p class="mg-btn-row"><a class="mg-btn mg-btn--primary" href="https://visual-disorder-in-cincinnati.vercel.app/" target="_blank" rel="noopener">Live application</a> <a class="mg-btn" href="https://github.com/MatthewGoldsberry/Who-you-gonna-call" target="_blank" rel="noopener">Source</a> <a class="mg-btn" href="#video-demonstration">Demo video</a></p>
</div>

## Project Overview & Motivations

This project is an interactive data visualization designed to help users explore and understand patterns in 311 service requests made to the City of Cincinnati in 2025, with a focus on issues related to visual disorder.

* **The Problem:** The data for this project was presented in one large CSV file with many attributes and data points, an accurate example of how data looks in the world. Data like this cannot be easily visualized through tables or in a static report, and, without effective visualizations and linked views of the data, it can be challenging to identify trends and draw comparisons from the data.
* **The Goal:** This application allows users to explore Cincinnati's 311 service request data through a synchronized dashboard containing a map and different charts. By interacting with the linked views, users can isolate specific neighborhoods, time periods, or request types and observe how patterns and trends change across the city. This application would not only be helpful in gaining information on visual disorder in Cincinnati, but also in coming up with creative ways to approach and solve these problems.

## Video Demonstration

<figure>
  <video controls loop muted playsinline>
    <source src="https://github.com/MatthewGoldsberry/portfolio/releases/download/v0.0.2/WhoYouGonnaCall_VideoDemo.mp4" type="video/mp4"> 
    Your browser does not support the video tag.
  </video>
</figure>

## The Data

The datasource of this project is the [Cincinnati 311 Non-Emergency Service Requests dataset](https://data.cincinnati-oh.gov/efficient-service-delivery/Cincinnati-311-Non-Emergency-Service-Requests/gcej-gmiw/about_data), sourced directly from the City of Cincinnati's Open Data Portal.

The 3-1-1 system handles every non-emergency request in the city, meaning the raw dataset was massive and broad in scope. It contained over 381 distinct service request types (`SR_TYPE`) spanning 17 different departments. To align with the focus of our project, **Visual Disorder**, this data needed to be filtered and cleaned into a focused subset.

### Filtering for Visual Disorder

Visual disorder can be more broadly defined as instances of visual blight and environment disorder. This required narrowing down those 381 different service types into 6 core, human-readable categories: **Dumping, Graffiti, Littering, Tires, Trash, and Vacant Properties**.

To achieve this, we aggregated several related raw service codes into consolidated categories:

* **Graffiti:** Combined `GRFITI`, `GRFITI-H`, `GRAFPARK`, and `GRFTRPRV`.
* **Littering:** Combined `LTTR-BLD`, `LTTR-CDV`, `LTTR-PRK`, `LTTR-REC`, and `LTTRRST`.
* **Trash:** Combined `TRASH-E`, `TRASH-I`, `TRASH-L`, and `TRASH-RE`.
* **Dumping:** Mapped from `DUMP-PVS`.
* *(Tires and Vacant properties were mapped directly from their respective individual codes).*

### Data Processing & Subsetting

To extract these insights and generate our final dataset used in the application, we develop two basic Python scripts.

1. **Data Exploration** ([`data/data_exploration.py`](https://github.com/MatthewGoldsberry/Who-you-gonna-call/blob/main/data/data_exploration.py)): Because the dataset was so large to start with, we wrote a basic script using Python's native `csv` library to parse the file and extract sets of values for priorities, departments, neighborhoods, and service types. This allowed us to see exactly what we were working with in those specific categories.
2. **Subsetting & Normalization** ([`data/subset_creation.py`](https://github.com/MatthewGoldsberry/Who-you-gonna-call/blob/main/data/subset_creation.py)): Once we identified the target codes, we leveraged the `pandas` library to clean and filter the data. Specifically, we filtered down the original dataset to only include the service types we wanted to target. Then we normalizes the service types in consolidated groups with human-readable labels.

## Design Process & Early Sketches

At the start of the project, we established a requirement ourselves: the application must function as a single view with no scrolling. This constraint helps ensure that when a user interacts with a component, the filtering effects across all other visualizations are immediately visible to the user, without losing context.

### Initial Concept

The geographical interaction is the obvious driver of this data exploration, so the Leaflet map must be the centerpiece of the application. The secondary challenge to the layout was there were a lot of visualizations to add outside of just the Leaflet map, with 5 other bar charts and a timeline needing to be included. When designing the layout and estimating the sizing of the SVGs we had a strict mental requirement to ensure that all datapoints remained legible and easily intractable, making sure that no elements were to small to click or hover.

### Sketches

With these constraints in mind, we developed two early sketches to layout potential spatial arrangements. From this two primary layouts emerged:

#### Approach 1: Dual Chart Columns

![Approach 1 Sketch](/assets/media/projects/who-you-gonna-call/sketch_1.png)

This approach surrounds the central Leaflet map with visualizations, dividing the bar charts across both the left and right margins. While this approach maximizes the total screen area dedicated to the charts, it crows the center and constrains the map's overall width.

#### Approach 2: Single Chart Column

![Approach 2 Sketch](/assets/media/projects/who-you-gonna-call/sketch_2.png)

This approach consolidates all 5 bar charts into a single column on the right. This dedicates a much larger block of space for the Leaflet map and a little larger space for the timeline tool at the bottom. *(Note: This sketch also includes an early annotation exploring the possibility of utilizing the bottom-left quadrant for chart overflow).*

#### Decision and Validation

After evaluating both options, we went with **Approach 2**. The reasoning behind this was surrounding optimizing the spatial geometry:

* **More Ideal Aspect Ratios:** Combining the bar charts into a single column provided a more rectangular bounding box that better suited the horizontal nature of bar charts.
* **Map Size:** The Leaflet map required as much space as we could comfortably give it because of the known additions to come with specific controls that would take up some of its space. Approach 2 offered the largest amount of space to the map.

This was validated during implementation as once the map controls were added, they consumed significant screen real space, proving to some degree that the dual column support would have been too cramped.

We also noted during this sketching phase that the bar charts in the right column would be relatively small. To solve this in the final build, we introduced a chart-swapping feature that lets users move any bar chart into the large central map space for enhanced viewing.

### Color Design Architecture

Designing the color architecture of this project required considering several core color theory principles to ensure that the visualizations remained analytically useful and easy. Due to the nature of the dataset and their being multiple distinct variables simultaneously, the color mapping had to be intentionally constructed which is laid out in detail here.

But first let's highlight the two main environmental challenges that shaped the architecture:

1. **Base Map Saturation:** The default map background contains a significant amount of color, meaning our overlaid data marks required high contrast and saturation to remain visible on this.
2. **High Cardinality:** Representing 50 unique neighborhoods required creating a color palette that extends beyond the standard 6-8 colors typically recommended.

To resolve the second issue without sacrificing the distinguishability, we edited a pretty well documented and accessible 20-color palette (originally designed by [Sasha Trubetshoy](https://sashamaps.net/docs/resources/20-colors/)). There were some colors in this palette that did not fit our needs, for example, white and black, we manually refined the 20 colors down to 17 distinct colors to serve as our foundational categorical palette.

The timeline chart and bar charts representing the data types not select are set to the standard steelblue to not specifically place the color focus on the datatype selected and prevent potential confusion from the same colors meaning different things in the different bar charts.

Now lets look at the color encoding strategy for each data variable:

* **Service Type**
    * **Data Type:** Nominal; Categorical
    * **Color Scheme:** Categorical
    * **Justification:** The service types represent discrete, unordered categories so we applied a hand-selected subset of our 17-color palette. The specific colors were chose for maximum visual contrast against the map and each other to help users to differentiate between service types at a glance

* **Neighborhood**
    * **Data Type:** Nominal; Spatial
    * **Color Scheme:** Categorical
    * **Justification:** Neighborhoods are distinct, unordered geographic regions. For this we utilize the full 17-color custom palette to differentiate them. To ensure clarity in the visualization, we manually checked and ensured that no neighboring neighborhoods shared colors, helping to create distinct cluster boundaries.

* **Public Agency**
    * **Data Type:** Nominal; Categorical
    * **Color Scheme:** Categorical
    * **Justification:** These are similar to service types, in the aspect that they are discrete and unordered. We utilized a custom categorical subset of contrasting colors to differentiate the agencies.

* **Priority Level**
    * **Data Type:** Ordinal
    * **Color Scheme:** Sequential; Semantic
    * **Justification:** Priority levels represent ordered categories to a hierarchy of severity. To visualize this we used a semantic, multi-colored sequential scale: Gray (Standard) --> Yellow (Priority) --> Orange (Hazardous) --> Red (Emergency). The goal of this color chose was to be consistent with associations to danger, helping the user grasp severity just but looking at a point.

* **Time to Update**
    * **Data Type:** Quantitative
    * **Color Scheme:** Sequential
    * **Justification:** To represent the continuous numeric values of time to resolve, we implemented a sequential scale mapped to an inverted Red-Yellow-Green interpolator. We map this scale sequentially from zero to our 95th percentile cap allows us to leverage the strong semantic associations of the colors (green for rapid resolutions, transitioning smoothly to red for severe delays) while treating the increase in time as a strictly linear progression.

## Visual Components & Interactions

![Full Dashboard](/assets/media/projects/who-you-gonna-call/app.png)

The dashboard application contains seven different visualizations: the map view, five bar graphs, and a timeline. The map shows the City of Cincinnati with the service requests geographically visualized. The five bar graphs show number of service requests by neighborhood, request submission methods (Internet, 311 Call, etc.), number of service requests by public agency, service requests by priority level, and requests by service type (Trash, Tires, Graffiti, Dumping, Littering, and Vacant). View an image of the full dashboard application above.

### The Leaflet Map

![The Leaflet Map](/assets/media/projects/who-you-gonna-call/map.png)

**What this shows:** Map of the City of Cincinnati with the service requests geographically visualized.

**Interactions:** Users can hover over a point on the map for a tooltip that shows the request type, description, agency, and timing information as well as highlight that data in the other visualizations (as seen in first image below). Clicking on one of these points will persist the selection and highlight the other visualizations even as the user's cursor moves away from that point. The map includes various options to change the color of the nodes, the map background, which service types are shown and their colors (as seen in second image below), a heatmap mode, and a brush mode. The brush allows the user to select a subset of nodes, with the other visualizations updating to show the selected data. The Heatmap shows the same data visualized on the map in a different way, so it also works with the brushing and the linked interactions from the other graphs. (as seen in the last two images below)

![Tooltip on Hover](/assets/media/projects/who-you-gonna-call/leaflet-node-tooltip.png)
![Service Type Color/Selection Edits](/assets/media/projects/who-you-gonna-call/service-type-editing.png)
![Brushing on Map](/assets/media/projects/who-you-gonna-call/map-brushing.png)
![Brushing on Heatmap](/assets/media/projects/who-you-gonna-call/heatmap-brushed.png)

### Bar Charts

![Bar Charts](/assets/media/projects/who-you-gonna-call/barcharts.png)

**What it shows:** The distribution of number of service requests by neighborhood, request submission methods (Internet, 311 Call, etc.), number of service requests by public agency, service requests by priority level, and requests by service type (Trash, Tires, Graffiti, Dumping, Littering, and Vacant).

**Interactions:** Users can hover over a bin to show a tooltip and temporarily highlight all data contained in that bin in all seven visualizations (shown in the first picture below). Clicking a bin persists this focus, allowing users to isolate specific range groups. Similarly, you can also deselect specific bins to refine the focus. The second image below shows an example of this, filtering down to all the Trash and Dumping requests made by 311 call in Price Hill. Each bar graph also has a drop down menu allowing the user to select how the y axis is distributed (linear, log, square root). The bar graphs also have a button in the top left of their windows that switches their view to the map's default position to allow the user to see a bigger picture (as seen in the last image).

![Selecting a Bin from the Bar Chart](/assets/media/projects/who-you-gonna-call/interactions.png)
![Selecting Multiple Bins](/assets/media/projects/who-you-gonna-call/bar-chart-interactions.png)
![Enlarged Bar Chart](/assets/media/projects/who-you-gonna-call/enlarged-bar-chart.png)

### Timeline

![Timeline](/assets/media/projects/who-you-gonna-call/timeline.png)

**What it shows:** A timeline of service requests binned by week.

**Interactions:** Supports hovering to show a tooltip and click-to-select different weeks (shown in the first picture), highlighting this data in the other visualizations. The timeline also includes a brush (shown in the second picture), using the same scale as the timeline but referencing the non-binned data to allow users to brush over days rather than weeks. On a brush, the other visualizations highlight the selected data and a helpful tooltip appears beneath the timeline to show the range of dates selected.

![Timeline Interactions](/assets/media/projects/who-you-gonna-call/timeline-interactions.png)
![Timeline Brush](/assets/media/projects/who-you-gonna-call/july-graffiti.png)

### The Reset Selection Button

On any selection, a button appears at the top of the screen, allowing the user to clear any selection they have made. The same functionality is tied to the ESC key.

## Key Discoveries & Findings

The following case studies demonstrate how the dashboard’s interactive features can be leveraged to uncover trends, draw comparisons, and find outliers.

### Finding 1: Graffiti

By selecting the Graffiti bar chart, there are a couple of neighborhoods that can be seen that struggle with consistent grafitti: Northside, CUF, the West End, the East End, and Over-the-Rhine. The graffiti nodes are very densely packed in these areas and sparse everywhere else. Understandably, brushing over the timeline during the warmer months vs the colder months shows us that the vast majority of graffiti service requests come during May-October. This information would give the City of Cincinnati times and locations to focus on.

![Summer Graffiti Hotspots](/assets/media/projects/who-you-gonna-call/graffiti-hotspots.png)

### Finding 2: Modern Technology

Now more than ever, modern technology is giving us new ways to approach and solve problems. A quick glance at the request submission methods bar graph shows that the vast majority of request submissions come from the internet (I assume this means a website) rather than the traditional 311 call, which sits in a distant second place.

Looking at how these are distrubuted on the map, more urban areas specifically, like downtown, are relying more on the internet, with almost no 311 calls coming from this part of Cincinnati. More people, especially in the city, are relying more on the internet to submit requests, and the Cincinnati government website seems very user-friendly, easy to understand, and well built. They even have a mobile app! I think they should advertise this more, and continue leaning into the use of technology like this, especially because this is the first I've heard of online 311 submissions.

![Modern Technology](/assets/media/projects/who-you-gonna-call/service-call-methods.png)

### Finding 3: The Trash Problem in CUF

There are a lot of requests on the map, and things get quite tightly packed, especially just south-west of the University of Cincinnati in CUF. In fact, there is a very large clump of light blue, trash service requests, in the residential areas where a lot of UC upperclassmen live. Most of these are improper trash set-out requests. The timeline shows that these requests are super concentrated in July and August, right around the time that move-in and move-out happens for the new academic year. I think these might be related, and could be helpful information for the City of Cincinnati to know to find ways to deal with this end of summer trash problem.

![CUF Trash](/assets/media/projects/who-you-gonna-call/CUF-trash.png)

### Finding 4: Looking at the Red

The heatmap view is very helpful for drawing conclusions based on the density of service requests, especially because it can be hard to see how many requests there are on the map when viewing them all at once - they sit on top of each other and the map becomes a mess of colored nodes. But the heatmap shows color based on the density of requests. Glancing at the heatmap, I see the darker red/orange areas in CUF (already discussed above), Price Hill, Over-the-Rhine, Bond Hill, and Avondale. Most of these areas are known for being poorly taken care of in parts, and could benefit from increased focus from the city.

![Concentrations on the Heatmap](/assets/media/projects/who-you-gonna-call/heatmap.png)

## Technical Implementation

### Tech Stack

#### Python (Data Exploration)

**Tools & Packages:** [`Pandas`](https://pandas.pydata.org/docs/)

Python was used for the data pipeline primarily due to `Pandas`' ability to easily read and edit CSV data.

#### JavaScript, HTML, CSS (Frontend)

**Packages:** [`D3.js`](https://d3js.org/), [`Leaflet`](https://leafletjs.com/)

`D3.js` was selected for its powerful capabilities in creating data visualizations. Using the basic frontend setup with D3 offered parity with what was taught in class and provided examples and allowed for granular control over the visualizations.

`Leaflet` was used to provide the foundation for our interactive map. We used the in-class example on Leaflet maps to start building our own, adding in the different options, views, and interactions throughout the project.

### Architecture

#### `data/` (Data Files and Exploration)

Contains the CSV files, some Python scripts used to manipulate the data and pick out the unique neighborhoods, departments, priority levels, and service types, as well as the output of those scripts.

#### `js/` (JavaScript)

Contains class-based visualizations modules (`LeafletMap`, `BarChart`, and `Timeline`). Also contains common functions and event handlers used to allow interactions (hovering, clicking, and brushing) and synchronization of those interactions between visualizations.

#### `css/` (CSS)

Contains the style sheet files for styling our application.

### Running Locally

To run this locally:

1. Clone the repository and navigate to the directory

    ```bash
    git clone https://github.com/MatthewGoldsberry/Who-you-gonna-call.git
    cd Who-you-gonna-call
    ```

2. Launch a local web server (We used Python to do this)

    ```bash
    python -m http.server
    ```

3. Access the application at [`http://localhost:8000`](http://localhost:8000)

## Challenges & Future Work

### Challenges

One new challenge presented by this project compared to the Our World in Data project was the group component. While working on a team was super helpful in managing the full workload of the project, it added the new element of collaboration. We had to work together on coding conventions, project organization, and workflows. We also had to put forth effort to make high-level decisions and stay communicative.

A challenge we faced was in the development of the brush functionality for both the Leaflet map and the Timeline. Not only did the d3 brush present a lot of bugs that needed to be ironed out, but it also introduced lots of performance issues. These performance issues arose because every time a brush was made, it checked the bounds against every other point on the map to see what data fell inside or outside the brush. From there, it highlighted all the selections and dimmed everything that wasn't selected on the map. Especially with a large subset of the data, the performance hit was too large. We had to change some of the logic surrounding dimming points so that we weren't redrawing every single point on a selection event as well as find a smaller subset of data to not overwhelm the application with too many points.

Additionally, when used at the same time, the timeline brush and the map brush caused similar performance troubles. We were unfortunately unable to quickly fix this and chose to only allow the user to use one brush at a time.

We also encountered unexpected performance problems early in development caused by rendering transitions. After spending time profiling and optimizing the codebase, we discovered that applying transitions to a large volume of Leaflet map points was severely hindering browser rendering. Removing these specific transition effects immediately resolved the latency and restored smooth interactivity.

Implementing the view-swapping mechanism also presented technical challenge. This feature relied on DOM manipulation, pretty much isolated form the D3 ecosystem, requiring the construction of a custom event handler at the document level. On top of that the layout state also had to be managed effectively to ensure that charts when back to their original homes after swapping. This proved to be an interesting problem that provided good learning opportunities.

### Future Work

* **Tooltip Problem Resolution:** There are still some lingering minor edge cases were rapid user interactions can cause tooltips to hit what seem to be race conditions where they persist longer than intended.
* **High-Volume Data Rendering:** This is a future work direction that I think would be a great learning experience. This would entail some level of exploration of advanced rendering techniques to be able to support the full, unreduced dataset without compromising performance. This is future work that is labeled with more priority due to the valuable lessons it can teach us.
* **Concurrent Brushing Optimization:** As mentioned in the challenges, we ran into a problem with the performance of using both the timeline and map brush at the same time. Bad enough that we had to completely disable being able to do both at the same time to maintain effective usability. To fix this would likely require some level of re-architecting the filtering logic to support simultaneous brushing.
* **Temporal Animation:** Another cool feature that we ran out of time to get a implementation in for was an animation control system to play and progress data across the timeline. While the users can still mimic this behavior with the brushing this is something that would be a nice quality of life feature for the user.

## Acknowledgements & AI Usage

We would like to extend our appreciation to Dr. Aurisano for providing valuable feedback and guidance on some visualization best-practice questions we had.

### Matthew Goldsberry

During this project, I utilized Claude Code as a development tool to help streamline my workflow. I mainly leveraged this for targeted debugging and helping resolve specific implementation details when I would get stuck. Through leveraging this tool I was able to more effectively overcome roadblocks I encountered and maintain momentum in the development. I did not receive any non-AI help from outside this team during the project.

### Isaac Dowdy

I did use AI throughout the course of this project. I used GitHub copilot through Visual Studio Code to give line edit suggestions and AI autocomplete to speed up the coding process. This feature was very good at guessing what I wanted to type next based on what I had already typed and saved a lot of time. I also used copilot's chat feature to diagnose some of the bugs I faced, get suggestions on performance improvements, and find syntax errors. I did not receive any non-AI help from outside this team during the project.

## Team Contributions

### Matthew Goldsberry

* Developed the Python data cleaning pipeline to process the data subset
* Implemented the Leaflet map and custom controls (service type filtering, color by attribute, and map backgrounds)
* Created the bar charts and the dynamic chart-swapping UI layout
* Handled state management for cross-component linked interactions and selection removal

### Isaac Dowdy

* Created the interactive timeline visualization
* Implemented the geospatial heatmap layer
* Developed the brushing interactions for both the timeline and the Leaflet map

### Joint Efforts

* Initial project planning and conceptualization
* UI/UX design and dashboard layout decisions
* Documentation
