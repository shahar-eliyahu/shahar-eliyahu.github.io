---
title: "Pacman AI: Coins & Escape"
subtitle: Autonomous Game AI & Pathfinding
summary: >-
  An autonomous Pacman simulation built in C++ and OpenGL, featuring
  search-based AI agents navigating a procedurally generated maze. Pacman uses
  BFS for coin navigation and threat detection, combined with a maximin escape
  strategy, while three ghosts use A* pathfinding to pursue him.
type: Classical AI & Search Algorithms Project
categories: [ai-ml]
technologies: [C++, OpenGL, GLUT, A*, BFS, Game AI]

order: 6

links:
  github: https://github.com/shahar-eliyahu/PacMan-CPP

# Explorer gallery. Media: src/assets/projects_media/pacman-ai/
# Both shown whole (`fit: contain`), so the maze edges and status bar are never cropped.
cover:
  src: collecting-coins.png
  alt: "Close-up of the maze: Pacman (blue disc) heads for a coin marked by a blue ring, while three ghosts (red stars) approach along their planned routes, shown as red dots"
  fit: contain
gallery:
  - src: Fleeing_from_a_ghost.png
    alt: "Full 100×100 maze in Fleeing mode: Pacman, highlighted in red, runs from the ghosts close behind him; the status bar shows Fleeing and the coin count"
    fit: contain

# Detail page: /projects/pacman-ai/. All copy is owner-approved and matches the
# repository (classical search-based game AI; no machine learning).
detailPage: true
caseStudy:
  sections:
    - id: overview
      title: Project Overview
      text: |-
        Pacman AI is an autonomous chase simulation developed in C++ using OpenGL and GLUT, demonstrating classical AI techniques for navigation, pursuit, and decision-making.

        Unlike traditional Pacman, the game requires no human player. Pacman and three ghosts operate independently as search-based AI agents, navigating a randomly generated 100×100 maze.

        Pacman's objective is to collect all reachable coins while avoiding the pursuing ghosts.
      media:
        - src: collecting-coins.png
          alt: "Close-up of the maze: Pacman (blue disc) heads for a coin marked by a blue ring, while three ghosts (red stars) approach along their planned routes, shown as red dots"
          caption: Collecting coins

    - id: demo
      title: See Pacman AI in Action
      text: |-
        Watch Pacman navigate a procedurally generated maze, collect coins, detect nearby threats, and switch to escape behavior while three autonomous ghosts continuously pursue him.
      media:
        - video: PacmanCoinsEscape.mp4
          title: "Pacman AI: Coins & Escape demo"
          poster: pacman-video-poster.webp

    - id: how-it-works
      title: How the AI Works
      items:
        - title: "Pacman: Intelligent Navigation & Escape"
          text: |-
            Pacman uses Breadth-First Search (BFS) to locate the nearest reachable coin and determine the next movement toward it.

            Before each move, a depth-limited BFS scans nearby paths for ghosts within a range of 10 steps.

            When no immediate threat is detected, Pacman continues toward the nearest coin while avoiding moves that bring him dangerously close to a ghost.

            When a threat is detected, Pacman switches to an escape strategy based on the maximin principle, selecting the neighboring cell that maximizes its distance from the closest ghost.

            Ties are broken by proximity to the target coin, and Pacman avoids stepping straight back to reduce unnecessary backtracking.
          media:
            - src: Fleeing_from_a_ghost.png
              alt: "Full 100×100 maze in Fleeing mode: Pacman, highlighted in red, runs from the ghosts close behind him; the status bar shows Fleeing and the coin count"
              caption: Fleeing from a ghost
        - title: "Ghosts: A* Pathfinding"
          text: |-
            Each of the three ghosts independently uses the A* search algorithm to calculate a route toward Pacman.

            The algorithm uses Manhattan distance as its heuristic, and each ghost follows the first step of its calculated path.

            The paths are recalculated as Pacman moves, creating continuous pursuit.

            In the simulation, red dots visualize the ghosts' planned routes.
        - title: Procedural Maze Generation
          text: |-
            Every simulation generates a new 100×100 maze with randomized walls and corridors.

            The generation process uses different wall probabilities for alternating rows to create horizontal corridors and random openings.

            Pacman starts in the largest connected region, unreachable coins are removed, and ghosts spawn at least 25 cells away from Pacman whenever possible.

            This ensures that the coin-collection objective is reachable while allowing each simulation to produce a different challenge.

    - id: technologies
      title: Technologies & Algorithms
      tools:
        - name: C++
          use: Core game logic, autonomous behavior, and simulation.
        - name: OpenGL / GLUT
          use: Real-time rendering and visualization.
        - name: A* Search
          use: Pathfinding and pursuit behavior for the ghosts.
        - name: Breadth-First Search (BFS)
          use: Coin navigation and nearby threat detection.
        - name: Maximin Strategy
          use: Escape decisions that prioritize distance from pursuing ghosts.
        - name: Procedural Generation
          use: Randomized maze construction and reachable-area validation.

    - id: background
      title: Project Background
      text: |-
        Pacman AI was developed as a course assignment focused on classical AI, search algorithms, and autonomous game behavior.

        The project demonstrates how different search and decision-making strategies can work together in a dynamic environment, combining goal-oriented navigation, threat awareness, pursuit, and escape behavior.
      links:
        - label: View Source Code on GitHub
          url: https://github.com/shahar-eliyahu/PacMan-CPP

visual:
  id: pacai
  label: GAME AI · C++
  kicker: A* · BFS · MAXIMIN
  headline: Chase & Escape AI
---
