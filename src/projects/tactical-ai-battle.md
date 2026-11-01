---
title: Tactical AI Battle
subtitle: Autonomous Multi-Agent Combat Simulation
summary: >-
  A real-time combat simulation built with C++ and OpenGL, featuring two
  autonomous AI teams competing on a procedurally generated battlefield.
  Commanders coordinate strategy, warriors engage enemies, medics heal
  teammates, and providers deliver supplies. Each unit follows role-specific
  decision-making logic supported by pathfinding, threat awareness, and finite
  state machines (FSM).
type: Classical AI & Multi-Agent Systems Project
categories: [ai-ml]
technologies: [C++, OpenGL, GLUT, A*, BFS, Finite State Machines (FSM), Game AI]

order: 7

links:
  github: https://github.com/shahar-eliyahu/Tactical-AI-Battle

# Explorer gallery. Media: src/assets/projects_media/tactical-ai-battle/
# All shown whole (`fit: contain`), so the side panel and map edges are never cropped.
cover:
  src: battle.png
  alt: "Battlefield view: blue and orange units among rocks, trees and water, with a grenade blast and its blast-radius rings near the center; the side panel lists each unit's health and current state, such as Taking cover and Low ammo"
  fit: contain
gallery:
  - src: visibility.png
    alt: "Visibility view: blue and orange shading shows the areas each team can see from its units' positions and viewing directions, with rocks and trees blocking the view cones"
    fit: contain
  - src: danger_map.png
    alt: "Danger map view: a red area marks a recent threat near the center of the battlefield, with a fainter, older area below it; the side panel names the view Danger map (safety)"
    fit: contain

# Detail page: /projects/tactical-ai-battle/. All copy is owner-approved and was
# checked against the Tactical-AI-Battle C++ source (classical rule-based and
# search-based game AI; no machine learning).
detailPage: true
caseStudy:
  sections:
    - id: overview
      title: Project Overview
      text: |-
        Tactical AI Battle is a real-time combat simulation developed in C++ using OpenGL and GLUT, demonstrating classical AI techniques for autonomous decision-making, navigation, and team coordination.

        Two AI-controlled teams compete on a randomly generated 100×100 battlefield, with no human-controlled units.

        Each team consists of five autonomous agents with specialized roles, combining independent behavior with coordinated tactical decisions.
      media:
        - src: battle.png
          alt: "Battlefield view: blue and orange units among rocks, trees and water, with a grenade blast and its blast-radius rings near the center; the side panel lists each unit's health and current state, such as Taking cover and Low ammo"

    - id: demo
      title: See Tactical AI Battle in Action
      text: |-
        Watch two autonomous teams navigate the battlefield, coordinate their movements, engage opponents, seek cover, and support teammates through healing and ammunition delivery.
      media:
        - video: Demo.mp4
          title: Tactical AI Battle demo
          poster: tactical-video-poster.webp

    - id: agents
      title: Role-Based Autonomous Agents
      text: |-
        Each team contains five autonomous units with specialized responsibilities. Every unit follows a finite state machine (FSM) that determines its behavior according to its role and the current battlefield conditions.
      items:
        - title: "Commander: Team Strategy & Coordination"
          text: |-
            The commander merges what every team member can see into one team view and receives their reports of spotted enemies, wounds, and low ammunition. It assigns the medic to wounded teammates and the provider to warriors who need resupply.

            Based on the battlefield situation, the commander switches between offensive and defensive strategies, issues orders to warriors, and moves between cover positions.
        - title: "Warriors: Combat & Tactical Movement"
          text: |-
            Each team has two warriors responsible for engaging enemy units.

            Warriors patrol, advance, attack, and seek cover depending on the tactical situation.

            They use firearms when enemies are within their line of fire and can throw grenades at enemy groups or targets behind cover.

            Warriors also report when they are wounded or running low on ammunition.
        - title: "Medic: Autonomous Healing"
          text: |-
            The medic collects medical supplies from the team's medical depot and moves toward wounded teammates to heal them.

            The medic can continue operating independently if the commander is eliminated.
        - title: "Provider: Ammunition & Supply Management"
          text: |-
            The provider retrieves ammunition and grenades from the team's supply depot and delivers them to warriors who are running low on resources.

            This creates a logistics component that directly affects the team's ability to continue fighting.

    - id: pathfinding
      title: Tactical Pathfinding & Threat Awareness
      text: |-
        Units navigate the battlefield using A* pathfinding, with movement costs influenced by a dynamic danger map.

        The danger map reflects recent gunfire, grenade explosions, and simulated threats. Danger values decay over time, allowing units to adapt their routes as battlefield conditions change.

        Instead of simply choosing the shortest path, units can prioritize safer routes that reduce exposure to dangerous areas.

        Breadth-First Search (BFS) is also used to locate the nearest cover position that known enemies cannot see and whose danger level is acceptable.
      media:
        - src: danger_map.png
          alt: "Danger map view: a red area marks a recent threat near the center of the battlefield, with a fainter, older area below it; the side panel names the view Danger map (safety)"
          caption: "Dynamic Danger Map: recent battlefield threats that influence danger-aware pathfinding and tactical movement."

    - id: visibility
      title: Visibility & Team Coordination
      text: |-
        Each unit has a limited, cone-shaped field of view, and rocks and trees block both visibility and gunfire.

        The simulation uses Bresenham's line algorithm to calculate line of sight and line of fire.

        The commander merges the field-of-view cones of all team members into one team view and receives teammates' reports of spotted enemies to coordinate tactical decisions.

        This allows the simulation to demonstrate how individual autonomous agents contribute to coordinated team behavior.
      media:
        - src: visibility.png
          alt: "Visibility view: blue and orange shading shows the areas each team can see from its units' positions and viewing directions, with rocks and trees blocking the view cones"
          caption: "Team Visibility: the areas visible to each team based on unit positions, viewing directions, and battlefield obstacles."

    - id: technologies
      title: Technologies & Algorithms
      tools:
        - name: C++
          use: Core simulation logic, combat systems, autonomous agent behavior, and team coordination.
        - name: OpenGL / GLUT
          use: Real-time battlefield rendering and visualization.
        - name: A* Search
          use: Danger-aware pathfinding and tactical navigation.
        - name: Breadth-First Search (BFS)
          use: Searching for nearby cover positions.
        - name: Finite State Machines (FSM)
          use: Role-specific behavior and state transitions.
        - name: Bresenham's Algorithm
          use: Line-of-sight and line-of-fire calculations.
        - name: Dynamic Danger Map
          use: Representing battlefield threats and influencing movement costs.
        - name: Multi-Agent Coordination
          use: Information sharing, team strategy, and role-based cooperation.

    - id: background
      title: Project Background
      text: |-
        Tactical AI Battle demonstrates how classical AI techniques can be combined to create coordinated behavior among multiple autonomous agents in a dynamic environment.

        The project integrates pathfinding, finite state machines, tactical visibility, resource management, and team-level decision-making into a real-time simulation.
      links:
        - label: View Source Code on GitHub
          url: https://github.com/shahar-eliyahu/Tactical-AI-Battle

visual:
  id: battle
  label: MULTI-AGENT AI · C++
  kicker: A* · FSM · DANGER MAP
  headline: Team Battle AI
---
